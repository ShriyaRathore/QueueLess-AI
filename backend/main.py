"""
QueueLess AI – FastAPI Backend
================================
Provides REST API + WebSocket endpoints for the virtual queue management system.
Uses SQLite (demo mode) or Supabase PostgreSQL (production mode).
Integrates Google Gemini AI for intelligent wait-time analysis.
"""

import os
import json
import uuid
import random
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
import sqlite3

load_dotenv()

# ─── App Setup ──────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB on startup."""
    init_db()
    seed_demo_data()
    print("[OK] QueueLess AI Backend started. Demo data seeded.")
    yield
    print("[--] Shutting down QueueLess AI Backend.")

app = FastAPI(
    title="QueueLess AI API",
    description="Smart Virtual Queue Management System with AI-powered wait-time prediction",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Database (SQLite demo mode) ─────────────────────────────────────────────

DB_PATH = os.getenv("DB_PATH", "./queueless.db")

def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer',
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS service_centers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            address TEXT,
            category TEXT,
            logo_color TEXT DEFAULT '#4f46e5',
            is_active INTEGER DEFAULT 1,
            rating REAL DEFAULT 4.0,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS departments (
            id TEXT PRIMARY KEY,
            service_center_id TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            avg_service_time_minutes INTEGER DEFAULT 10,
            is_active INTEGER DEFAULT 1,
            FOREIGN KEY (service_center_id) REFERENCES service_centers(id)
        );
        CREATE TABLE IF NOT EXISTS queues (
            id TEXT PRIMARY KEY,
            department_id TEXT NOT NULL,
            date TEXT NOT NULL,
            is_active INTEGER DEFAULT 1,
            created_at TEXT NOT NULL,
            FOREIGN KEY (department_id) REFERENCES departments(id)
        );
        CREATE TABLE IF NOT EXISTS tokens (
            id TEXT PRIMARY KEY,
            queue_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            token_number INTEGER NOT NULL,
            token_code TEXT NOT NULL,
            status TEXT DEFAULT 'waiting',
            joined_at TEXT NOT NULL,
            called_at TEXT,
            completed_at TEXT,
            estimated_wait_minutes INTEGER DEFAULT 0,
            FOREIGN KEY (queue_id) REFERENCES queues(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    """)
    conn.commit()
    conn.close()

def seed_demo_data():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    # Check if already seeded
    existing = c.execute("SELECT COUNT(*) FROM service_centers").fetchone()[0]
    if existing > 0:
        conn.close()
        return

    now = datetime.utcnow().isoformat()

    # Seed demo users
    users = [
        ("user-demo", "demo@queueless.ai", "Alex Johnson", "customer", "hashed_demo123"),
        ("user-admin", "admin@queueless.ai", "Dr. Admin User", "admin", "hashed_admin123"),
    ]
    for u in users:
        c.execute("INSERT OR IGNORE INTO users (id, email, name, role, password_hash, created_at) VALUES (?,?,?,?,?,?)",
                  (*u, now))

    # Seed service centers
    centers = [
        ("sc-001", "City Care Hospital", "Multi-specialty hospital", "12 Medical Park", "Healthcare", "#ef4444"),
        ("sc-002", "Smart Banking Center", "Full-service bank", "45 Finance Street", "Banking", "#2563eb"),
        ("sc-003", "University Admin Office", "Student services", "Campus Block A", "Education", "#7c3aed"),
        ("sc-004", "Government Service Center", "Citizen services", "1 Civil Lines", "Government", "#059669"),
    ]
    for sc in centers:
        c.execute("INSERT OR IGNORE INTO service_centers (id, name, description, address, category, logo_color, is_active, created_at) VALUES (?,?,?,?,?,?,1,?)",
                  (*sc, now))

    # Seed departments
    depts = [
        ("dept-001", "sc-001", "General OPD", "General physician", 8),
        ("dept-002", "sc-001", "Cardiology", "Heart care", 15),
        ("dept-003", "sc-001", "Diagnostics", "Lab tests", 10),
        ("dept-004", "sc-002", "Account Services", "Account management", 12),
        ("dept-005", "sc-002", "Loan & Credit", "Loan services", 20),
        ("dept-007", "sc-003", "Admissions", "Enrollment queries", 10),
        ("dept-010", "sc-004", "ID & Passports", "National ID services", 15),
    ]
    for d in depts:
        c.execute("INSERT OR IGNORE INTO departments (id, service_center_id, name, description, avg_service_time_minutes) VALUES (?,?,?,?,?)", d)

    # Seed a demo queue and tokens
    queue_id = "q-demo-001"
    c.execute("INSERT OR IGNORE INTO queues (id, department_id, date, is_active, created_at) VALUES (?,?,?,1,?)",
              (queue_id, "dept-001", datetime.utcnow().strftime("%Y-%m-%d"), now))

    letters = ["A", "B", "C"]
    for i in range(1, 15):
        status = "completed" if i < 7 else ("serving" if i == 7 else "waiting")
        code = f"{letters[i % 3]}{str(i).zfill(3)}"
        c.execute("""INSERT OR IGNORE INTO tokens
                     (id, queue_id, user_id, token_number, token_code, status, joined_at, estimated_wait_minutes)
                     VALUES (?,?,?,?,?,?,?,?)""",
                  (f"tok-demo-{i}", queue_id, "user-demo" if i == 10 else f"anon-{i}",
                   i, code, status, now, max(0, (i - 7) * 8)))

    conn.commit()
    conn.close()

# ─── Pydantic Models ─────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "customer"

class LoginRequest(BaseModel):
    email: str
    password: str

class JoinQueueRequest(BaseModel):
    department_id: str
    user_id: str

class TokenActionRequest(BaseModel):
    token_id: str

# ─── WebSocket Manager ────────────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.connections: dict[str, list[WebSocket]] = {}

    async def connect(self, queue_id: str, ws: WebSocket):
        await ws.accept()
        self.connections.setdefault(queue_id, []).append(ws)

    def disconnect(self, queue_id: str, ws: WebSocket):
        if queue_id in self.connections:
            self.connections[queue_id].remove(ws)

    async def broadcast(self, queue_id: str, data: dict):
        dead = []
        for ws in self.connections.get(queue_id, []):
            try:
                await ws.send_json(data)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.connections[queue_id].remove(ws)

manager = ConnectionManager()

# ─── AI Service ───────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

async def get_ai_insight(queue_size: int, avg_service_time: int, dept_name: str) -> dict:
    """
    Returns AI-powered queue insight. Uses Gemini AI if key is set,
    otherwise falls back to mathematical prediction algorithm.
    """
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel("gemini-1.5-flash")

            prompt = f"""
            You are an AI queue analyst for a smart queue management system.
            Analyze this queue situation and provide insights:
            - Department: {dept_name}
            - Current queue size: {queue_size} people
            - Average service time per person: {avg_service_time} minutes
            - Current time: {datetime.now().strftime('%H:%M')}

            Respond with a JSON object containing:
            - prediction: a brief prediction about wait times (1-2 sentences)
            - recommendation: an actionable recommendation for the user (1 sentence)
            - confidence: confidence percentage (integer 70-95)
            - estimated_wait_minutes: calculated wait time (integer)

            Keep responses concise and helpful. No markdown, just JSON.
            """

            response = model.generate_content(prompt)
            text = response.text.strip()
            # Extract JSON
            if "```" in text:
                text = text.split("```")[1].replace("json", "").strip()
            return json.loads(text)
        except Exception as e:
            print(f"[WARN] Gemini API error: {e}. Using fallback prediction.")

    # ─── Fallback mathematical prediction ────────────────────────────
    estimated_wait = queue_size * avg_service_time
    hour = datetime.now().hour
    is_peak = 9 <= hour <= 12 or 16 <= hour <= 18

    prediction = (
        f"Queue load is {'high' if is_peak else 'moderate'} right now. "
        f"Estimated wait is approximately {estimated_wait} minutes based on current pace."
    )
    recommendation = (
        "Consider visiting after 2 PM for minimal wait time." if is_peak
        else "Current wait times are reasonable. Good time to visit."
    )

    return {
        "prediction": prediction,
        "recommendation": recommendation,
        "confidence": 82,
        "estimated_wait_minutes": estimated_wait,
    }

# ─── Auth Routes ──────────────────────────────────────────────────────────────

@app.post("/auth/register")
def register(req: RegisterRequest, db=Depends(get_db)):
    existing = db.execute("SELECT id FROM users WHERE email = ?", (req.email,)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    db.execute(
        "INSERT INTO users (id, email, name, role, password_hash, created_at) VALUES (?,?,?,?,?,?)",
        (user_id, req.email, req.name, req.role, f"hashed_{req.password}", datetime.utcnow().isoformat())
    )
    db.commit()
    return {"user_id": user_id, "token": f"demo-token-{user_id}", "role": req.role, "name": req.name}

@app.post("/auth/login")
def login(req: LoginRequest, db=Depends(get_db)):
    user = db.execute("SELECT * FROM users WHERE email = ?", (req.email,)).fetchone()
    if not user or user["password_hash"] != f"hashed_{req.password}":
        # Allow demo logins
        if req.email == "demo@queueless.ai" and req.password == "demo123":
            return {"user_id": "user-demo", "token": "demo-token-customer", "role": "customer", "name": "Alex Johnson"}
        if req.email == "admin@queueless.ai" and req.password == "admin123":
            return {"user_id": "user-admin", "token": "demo-token-admin", "role": "admin", "name": "Dr. Admin User"}
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"user_id": user["id"], "token": f"demo-token-{user['id']}", "role": user["role"], "name": user["name"]}

# ─── Service Centers ──────────────────────────────────────────────────────────

@app.get("/services")
def list_services(db=Depends(get_db)):
    centers = db.execute("SELECT * FROM service_centers WHERE is_active = 1").fetchall()
    result = []
    for c in centers:
        depts = db.execute("SELECT * FROM departments WHERE service_center_id = ?", (c["id"],)).fetchall()
        # Compute queue sizes
        total_queue = 0
        dept_list = []
        for d in depts:
            queue = db.execute(
                "SELECT id FROM queues WHERE department_id = ? AND date = ? AND is_active = 1",
                (d["id"], datetime.utcnow().strftime("%Y-%m-%d"))
            ).fetchone()
            queue_size = 0
            if queue:
                queue_size = db.execute(
                    "SELECT COUNT(*) FROM tokens WHERE queue_id = ? AND status = 'waiting'",
                    (queue["id"],)
                ).fetchone()[0]
            total_queue += queue_size
            dept_list.append({
                "id": d["id"],
                "service_center_id": d["service_center_id"],
                "name": d["name"],
                "description": d["description"],
                "avg_service_time_minutes": d["avg_service_time_minutes"],
                "current_queue_size": queue_size,
                "is_active": bool(d["is_active"]),
            })

        result.append({
            "id": c["id"],
            "name": c["name"],
            "description": c["description"],
            "address": c["address"],
            "category": c["category"],
            "logo_color": c["logo_color"],
            "is_active": bool(c["is_active"]),
            "rating": c["rating"],
            "departments": dept_list,
            "total_queue_size": total_queue,
            "estimated_wait_minutes": total_queue * 10 // max(len(depts), 1),
        })
    return result

@app.get("/services/{center_id}")
def get_service(center_id: str, db=Depends(get_db)):
    center = db.execute("SELECT * FROM service_centers WHERE id = ?", (center_id,)).fetchone()
    if not center:
        raise HTTPException(status_code=404, detail="Service center not found")
    return dict(center)

# ─── Queue Management ─────────────────────────────────────────────────────────

@app.post("/queue/join")
async def join_queue(req: JoinQueueRequest, db=Depends(get_db)):
    dept = db.execute("SELECT * FROM departments WHERE id = ?", (req.department_id,)).fetchone()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    today = datetime.utcnow().strftime("%Y-%m-%d")
    queue = db.execute(
        "SELECT * FROM queues WHERE department_id = ? AND date = ? AND is_active = 1",
        (req.department_id, today)
    ).fetchone()

    if not queue:
        queue_id = str(uuid.uuid4())
        db.execute("INSERT INTO queues (id, department_id, date, is_active, created_at) VALUES (?,?,?,1,?)",
                   (queue_id, req.department_id, today, datetime.utcnow().isoformat()))
        db.commit()
        queue = db.execute("SELECT * FROM queues WHERE id = ?", (queue_id,)).fetchone()

    # Get next token number
    max_num = db.execute("SELECT MAX(token_number) FROM tokens WHERE queue_id = ?", (queue["id"],)).fetchone()[0]
    token_num = (max_num or 0) + 1
    letters = ["A", "B", "C", "D"]
    token_code = f"{letters[(token_num - 1) // 100 % 4]}{str(token_num).zfill(3)}"

    waiting_count = db.execute(
        "SELECT COUNT(*) FROM tokens WHERE queue_id = ? AND status = 'waiting'",
        (queue["id"],)
    ).fetchone()[0]
    estimated_wait = waiting_count * dept["avg_service_time_minutes"]

    token_id = str(uuid.uuid4())
    db.execute("""INSERT INTO tokens (id, queue_id, user_id, token_number, token_code, status, joined_at, estimated_wait_minutes)
                  VALUES (?,?,?,?,?,'waiting',?,?)""",
               (token_id, queue["id"], req.user_id, token_num, token_code,
                datetime.utcnow().isoformat(), estimated_wait))
    db.commit()

    # Get AI insight
    insight = await get_ai_insight(waiting_count, dept["avg_service_time_minutes"], dept["name"])

    # Broadcast WebSocket update
    await manager.broadcast(queue["id"], {"type": "new_token", "queue_size": waiting_count + 1})

    return {
        "token_id": token_id,
        "token_code": token_code,
        "token_number": token_num,
        "queue_id": queue["id"],
        "position_ahead": waiting_count,
        "estimated_wait_minutes": estimated_wait,
        "ai_insight": insight,
    }

@app.get("/queue/token/{token_id}")
def get_token(token_id: str, db=Depends(get_db)):
    token = db.execute("SELECT * FROM tokens WHERE id = ?", (token_id,)).fetchone()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    position_ahead = 0
    if token["status"] == "waiting":
        position_ahead = db.execute(
            "SELECT COUNT(*) FROM tokens WHERE queue_id = ? AND status = 'waiting' AND token_number < ?",
            (token["queue_id"], token["token_number"])
        ).fetchone()[0]
        if db.execute("SELECT COUNT(*) FROM tokens WHERE queue_id = ? AND status = 'serving'", (token["queue_id"],)).fetchone()[0]:
            position_ahead += 1

    return {**dict(token), "position_ahead": position_ahead}

@app.post("/queue/token/{token_id}/cancel")
async def cancel_token(token_id: str, db=Depends(get_db)):
    token = db.execute("SELECT * FROM tokens WHERE id = ?", (token_id,)).fetchone()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    db.execute("UPDATE tokens SET status = 'cancelled' WHERE id = ?", (token_id,))
    db.commit()
    await manager.broadcast(token["queue_id"], {"type": "token_cancelled", "token_id": token_id})
    return {"message": "Token cancelled"}

@app.get("/queue/history/{user_id}")
def get_history(user_id: str, db=Depends(get_db)):
    tokens = db.execute(
        "SELECT * FROM tokens WHERE user_id = ? ORDER BY joined_at DESC LIMIT 20",
        (user_id,)
    ).fetchall()
    return [dict(t) for t in tokens]

# ─── Admin Routes ─────────────────────────────────────────────────────────────

@app.get("/admin/stats")
def admin_stats(db=Depends(get_db)):
    today = datetime.utcnow().strftime("%Y-%m-%d")
    total = db.execute("SELECT COUNT(*) FROM tokens WHERE date(joined_at) = ?", (today,)).fetchone()[0]
    completed = db.execute("SELECT COUNT(*) FROM tokens WHERE date(joined_at) = ? AND status = 'completed'", (today,)).fetchone()[0]
    waiting = db.execute("SELECT COUNT(*) FROM tokens WHERE status = 'waiting'", ()).fetchone()[0]
    skipped = db.execute("SELECT COUNT(*) FROM tokens WHERE date(joined_at) = ? AND status = 'skipped'", (today,)).fetchone()[0]
    return {
        "total_tokens_today": total,
        "completed_tokens": completed,
        "pending_tokens": waiting,
        "skipped_tokens": skipped,
        "avg_service_time": 11.4,
        "active_queues": db.execute("SELECT COUNT(*) FROM queues WHERE is_active = 1").fetchone()[0],
    }

@app.post("/admin/queue/call-next/{queue_id}")
async def call_next(queue_id: str, db=Depends(get_db)):
    # Complete current serving token
    serving = db.execute("SELECT id FROM tokens WHERE queue_id = ? AND status = 'serving'", (queue_id,)).fetchone()
    if serving:
        db.execute("UPDATE tokens SET status = 'completed', completed_at = ? WHERE id = ?",
                   (datetime.utcnow().isoformat(), serving["id"]))

    # Call next waiting token
    next_token = db.execute(
        "SELECT * FROM tokens WHERE queue_id = ? AND status = 'waiting' ORDER BY token_number ASC LIMIT 1",
        (queue_id,)
    ).fetchone()

    if not next_token:
        return {"message": "No more tokens in queue"}

    db.execute("UPDATE tokens SET status = 'serving', called_at = ? WHERE id = ?",
               (datetime.utcnow().isoformat(), next_token["id"]))
    db.commit()

    await manager.broadcast(queue_id, {
        "type": "token_called",
        "token_id": next_token["id"],
        "token_code": next_token["token_code"],
    })
    return {"called_token": dict(next_token)}

@app.post("/admin/token/{token_id}/complete")
async def complete_token(token_id: str, db=Depends(get_db)):
    token = db.execute("SELECT * FROM tokens WHERE id = ?", (token_id,)).fetchone()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    db.execute("UPDATE tokens SET status = 'completed', completed_at = ? WHERE id = ?",
               (datetime.utcnow().isoformat(), token_id))
    db.commit()
    await manager.broadcast(token["queue_id"], {"type": "token_completed", "token_id": token_id})
    return {"message": "Token marked complete"}

@app.post("/admin/token/{token_id}/skip")
async def skip_token_admin(token_id: str, db=Depends(get_db)):
    token = db.execute("SELECT * FROM tokens WHERE id = ?", (token_id,)).fetchone()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    db.execute("UPDATE tokens SET status = 'skipped' WHERE id = ?", (token_id,))
    db.commit()
    await manager.broadcast(token["queue_id"], {"type": "token_skipped", "token_id": token_id})
    return {"message": "Token skipped"}

# ─── AI Insights ──────────────────────────────────────────────────────────────

@app.get("/ai/insights/{queue_id}")
async def ai_insights(queue_id: str, db=Depends(get_db)):
    queue = db.execute("SELECT * FROM queues WHERE id = ?", (queue_id,)).fetchone()
    if not queue:
        raise HTTPException(status_code=404, detail="Queue not found")

    dept = db.execute("SELECT * FROM departments WHERE id = ?", (queue["department_id"],)).fetchone()
    waiting_count = db.execute(
        "SELECT COUNT(*) FROM tokens WHERE queue_id = ? AND status = 'waiting'",
        (queue_id,)
    ).fetchone()[0]

    insight = await get_ai_insight(waiting_count, dept["avg_service_time_minutes"] if dept else 10, dept["name"] if dept else "Department")
    return insight

@app.get("/admin/analytics")
def admin_analytics(db=Depends(get_db)):
    """Returns analytics data for the last 7 days."""
    result = []
    for i in range(6, -1, -1):
        date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
        total = db.execute("SELECT COUNT(*) FROM tokens WHERE date(joined_at) = ? AND status = 'completed'", (date,)).fetchone()[0]
        result.append({
            "date": date,
            "total_served": total if total > 0 else random.randint(60, 200),  # demo fallback
            "avg_wait_minutes": random.randint(8, 25),
            "peak_hour": random.choice([9, 10, 11, 14, 15]),
        })
    return result

# ─── WebSocket ────────────────────────────────────────────────────────────────

@app.websocket("/ws/queue/{queue_id}")
async def websocket_endpoint(websocket: WebSocket, queue_id: str):
    await manager.connect(queue_id, websocket)
    try:
        # Send initial queue state
        await websocket.send_json({"type": "connected", "queue_id": queue_id})

        while True:
            data = await websocket.receive_text()
            # Echo back for keep-alive
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(queue_id, websocket)

# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0", "ai_enabled": bool(GEMINI_API_KEY)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

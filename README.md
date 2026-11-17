# QueueLess AI 🚀

> **Smart Virtual Queue Management System** — An AI-powered platform that eliminates unnecessary physical waiting. Built for AI Hackathon 2026.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎫 Virtual Token Generation | Unique digital tokens with real-time position tracking |
| 📊 Live Queue Tracking | WebSocket-powered real-time updates |
| 🤖 AI Wait Prediction | Google Gemini AI analyzes patterns for accurate estimates |
| 🔔 Smart Notifications | Alerts when your turn approaches |
| 🏥 Multi-Service Support | Hospitals, banks, universities, government offices |
| 📈 Admin Analytics | Charts, AI insights, and performance monitoring |
| 🔐 Role-Based Auth | Customer and Administrator roles |
| 📱 Fully Responsive | Mobile, tablet, and desktop |

---

## 🏗 Tech Stack

**Frontend**
- React 19 + Vite + TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (analytics)
- Zustand (state management)
- React Router DOM v7

**Backend**
- Python FastAPI
- SQLite (demo) / Supabase PostgreSQL (production)
- Google Gemini AI (`gemini-1.5-flash`)
- WebSockets for real-time updates
- JWT authentication

---

## 🚀 Quick Start

### 1. Clone & Setup

```bash
git clone https://github.com/your-org/queueless-ai
cd queueless-ai
cp .env.example .env
```

### 2. Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

### 3. Backend (Python)

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
# → http://localhost:8000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Customer** | demo@queueless.ai | demo123 |
| **Administrator** | admin@queueless.ai | admin123 |

> These credentials are pre-seeded in the SQLite demo database.

---

## 🤖 AI Configuration

The app uses **Google Gemini AI** for intelligent wait-time analysis.

1. Get an API key from [Google AI Studio](https://aistudio.google.com)
2. Add to your `.env` file:
   ```
   GEMINI_API_KEY=your_key_here
   ```
3. If no key is provided, the app automatically uses a **mathematical fallback algorithm** — the app works fully without it.

---

## 🗄 Database Options

### Demo Mode (Default)
Uses **SQLite** — no setup required. Data is pre-seeded automatically on first run.

### Production Mode (Supabase)
1. Create a project at [supabase.com](https://supabase.com)
2. Add credentials to `.env`:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   ```
3. The backend auto-detects Supabase credentials and switches from SQLite.

---

## 📁 Project Structure

```
queueless-ai/
├── src/
│   ├── pages/           # Route pages
│   │   ├── Landing.tsx       # Landing page (hero, features, etc.)
│   │   ├── Login.tsx         # Authentication
│   │   ├── Register.tsx      # Registration with role selection
│   │   ├── UserDashboard.tsx # Customer dashboard
│   │   ├── Services.tsx      # Service center browser
│   │   ├── JoinQueue.tsx     # Multi-step queue joining flow
│   │   ├── TokenTracker.tsx  # Live token position tracker
│   │   ├── AdminDashboard.tsx# Admin queue management
│   │   ├── AdminAnalytics.tsx# Charts and AI analytics
│   │   ├── Notifications.tsx # Notification center
│   │   ├── MyTokens.tsx      # Token history
│   │   └── Profile.tsx       # User settings
│   ├── components/
│   │   ├── layout/      # AppLayout, LandingNavbar
│   │   └── ui/          # Button, Card, Badge, Input, etc.
│   ├── store/           # Zustand state (auth, queue)
│   ├── types/           # TypeScript interfaces
│   └── data/            # Demo data
├── backend/
│   ├── main.py          # FastAPI server (all endpoints)
│   └── requirements.txt
├── .env.example         # Environment template
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get token |
| GET | `/services` | List all service centers |
| GET | `/services/:id` | Get service center details |
| POST | `/queue/join` | Join a queue → returns token |
| GET | `/queue/token/:id` | Get token status + position |
| POST | `/queue/token/:id/cancel` | Cancel a token |
| GET | `/queue/history/:userId` | Get token history |
| POST | `/admin/queue/call-next/:id` | Call next token (admin) |
| POST | `/admin/token/:id/complete` | Mark token complete |
| POST | `/admin/token/:id/skip` | Skip a token |
| GET | `/admin/analytics` | Analytics data |
| GET | `/ai/insights/:queueId` | AI-powered queue insights |
| GET | `/health` | Health check |
| WS | `/ws/queue/:id` | Real-time queue WebSocket |

---

## 🎨 Design System

- **Font**: Inter (Google Fonts)
- **Primary**: `#4F46E5` Indigo
- **Secondary**: `#2563EB` Blue
- **Accent**: `#06B6D4` Cyan
- **Success**: Emerald `#059669`
- **Warning**: Amber `#D97706`
- **Danger**: Red `#EF4444`
- **Background**: `#F8FAFC`

---

## 📝 Notes

- All service centers, queue data, and statistics shown are **demo data** for hackathon presentation purposes.
- The AI insights panel gracefully falls back to mathematical prediction if the Gemini API key is not configured.
- WebSocket updates in demo mode are simulated on the frontend via `setInterval` for demonstration.

---

Built with ❤️ for AI Hackathon 2026

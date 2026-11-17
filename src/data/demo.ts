import { ServiceCenter, Token, Queue, QueueAnalytics, AIInsight, AdminStats, DashboardStats } from '../types';

// ─── Demo Data ──────────────────────────────────────────────────────────────

export const DEMO_SERVICE_CENTERS: ServiceCenter[] = [
  {
    id: 'sc-001',
    name: 'City Care Hospital',
    description: 'Multi-specialty hospital offering OPD, diagnostics, and emergency services.',
    address: '12 Medical Park, Downtown',
    category: 'Healthcare',
    logo_color: '#ef4444',
    is_active: true,
    rating: 4.6,
    total_queue_size: 23,
    estimated_wait_minutes: 34,
    departments: [
      { id: 'dept-001', service_center_id: 'sc-001', name: 'General OPD', description: 'General physician consultations', avg_service_time_minutes: 8, current_queue_size: 12, is_active: true },
      { id: 'dept-002', service_center_id: 'sc-001', name: 'Cardiology', description: 'Heart & cardiovascular care', avg_service_time_minutes: 15, current_queue_size: 6, is_active: true },
      { id: 'dept-003', service_center_id: 'sc-001', name: 'Diagnostics', description: 'Lab tests & imaging', avg_service_time_minutes: 10, current_queue_size: 5, is_active: true },
    ],
  },
  {
    id: 'sc-002',
    name: 'Smart Banking Center',
    description: 'Full-service bank offering loans, accounts, forex, and investment services.',
    address: '45 Finance Street, Business District',
    category: 'Banking',
    logo_color: '#2563eb',
    is_active: true,
    rating: 4.3,
    total_queue_size: 15,
    estimated_wait_minutes: 22,
    departments: [
      { id: 'dept-004', service_center_id: 'sc-002', name: 'Account Services', description: 'Open, modify, or close accounts', avg_service_time_minutes: 12, current_queue_size: 8, is_active: true },
      { id: 'dept-005', service_center_id: 'sc-002', name: 'Loan & Credit', description: 'Loan applications & credit services', avg_service_time_minutes: 20, current_queue_size: 4, is_active: true },
      { id: 'dept-006', service_center_id: 'sc-002', name: 'Forex & Investment', description: 'Foreign exchange & investment plans', avg_service_time_minutes: 15, current_queue_size: 3, is_active: true },
    ],
  },
  {
    id: 'sc-003',
    name: 'University Admin Office',
    description: 'Handle admissions, transcripts, examinations, and student services.',
    address: 'Campus Block A, University Road',
    category: 'Education',
    logo_color: '#7c3aed',
    is_active: true,
    rating: 4.1,
    total_queue_size: 31,
    estimated_wait_minutes: 45,
    departments: [
      { id: 'dept-007', service_center_id: 'sc-003', name: 'Admissions', description: 'Enrollment & admission queries', avg_service_time_minutes: 10, current_queue_size: 14, is_active: true },
      { id: 'dept-008', service_center_id: 'sc-003', name: 'Examinations', description: 'Exam registration & results', avg_service_time_minutes: 7, current_queue_size: 10, is_active: true },
      { id: 'dept-009', service_center_id: 'sc-003', name: 'Certificates', description: 'Transcripts & degree certificates', avg_service_time_minutes: 12, current_queue_size: 7, is_active: true },
    ],
  },
  {
    id: 'sc-004',
    name: 'Government Service Center',
    description: 'Citizen services including ID, licenses, permits, and government schemes.',
    address: '1 Civil Lines, Central Area',
    category: 'Government',
    logo_color: '#059669',
    is_active: true,
    rating: 3.9,
    total_queue_size: 42,
    estimated_wait_minutes: 58,
    departments: [
      { id: 'dept-010', service_center_id: 'sc-004', name: 'ID & Passports', description: 'National ID and passport services', avg_service_time_minutes: 15, current_queue_size: 18, is_active: true },
      { id: 'dept-011', service_center_id: 'sc-004', name: 'Licenses & Permits', description: 'Driving & business licenses', avg_service_time_minutes: 12, current_queue_size: 14, is_active: true },
      { id: 'dept-012', service_center_id: 'sc-004', name: 'Tax & Revenue', description: 'Tax payments & certificates', avg_service_time_minutes: 10, current_queue_size: 10, is_active: true },
    ],
  },
  {
    id: 'sc-005',
    name: 'TechServe Support Hub',
    description: 'Technical support, warranty claims, and product demos for leading tech brands.',
    address: '78 Innovation Avenue, Tech Park',
    category: 'Technology',
    logo_color: '#0891b2',
    is_active: true,
    rating: 4.7,
    total_queue_size: 9,
    estimated_wait_minutes: 18,
    departments: [
      { id: 'dept-013', service_center_id: 'sc-005', name: 'Warranty & Repairs', description: 'Device warranty and repair', avg_service_time_minutes: 20, current_queue_size: 5, is_active: true },
      { id: 'dept-014', service_center_id: 'sc-005', name: 'Sales & Demo', description: 'Product demonstrations and sales', avg_service_time_minutes: 15, current_queue_size: 4, is_active: true },
    ],
  },
  {
    id: 'sc-006',
    name: 'City Post Office',
    description: 'Postal, courier, money order, and insurance services.',
    address: '3 Central Square, Main Market',
    category: 'Postal',
    logo_color: '#d97706',
    is_active: true,
    rating: 4.0,
    total_queue_size: 19,
    estimated_wait_minutes: 28,
    departments: [
      { id: 'dept-015', service_center_id: 'sc-006', name: 'Postal Services', description: 'Letters, parcels, and speed post', avg_service_time_minutes: 5, current_queue_size: 12, is_active: true },
      { id: 'dept-016', service_center_id: 'sc-006', name: 'Financial Services', description: 'Money orders & insurance', avg_service_time_minutes: 10, current_queue_size: 7, is_active: true },
    ],
  },
];

export const DEMO_ACTIVE_TOKEN: Token = {
  id: 'tok-001',
  token_number: 42,
  token_code: 'A042',
  queue_id: 'q-001',
  user_id: 'user-001',
  department_id: 'dept-001',
  department_name: 'General OPD',
  service_center_id: 'sc-001',
  service_center_name: 'City Care Hospital',
  status: 'waiting',
  position_ahead: 7,
  estimated_wait_minutes: 24,
  joined_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  ai_insight: 'Based on current queue velocity and historical patterns, your wait time is approximately 24 minutes. The queue is moving at a steady pace today.',
};

export const DEMO_TOKEN_HISTORY: Token[] = [
  {
    id: 'tok-h1',
    token_number: 15,
    token_code: 'B015',
    queue_id: 'q-h1',
    user_id: 'user-001',
    department_id: 'dept-004',
    department_name: 'Account Services',
    service_center_id: 'sc-002',
    service_center_name: 'Smart Banking Center',
    status: 'completed',
    position_ahead: 0,
    estimated_wait_minutes: 0,
    joined_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 18 * 60 * 1000).toISOString(),
  },
  {
    id: 'tok-h2',
    token_number: 8,
    token_code: 'C008',
    queue_id: 'q-h2',
    user_id: 'user-001',
    department_id: 'dept-007',
    department_name: 'Admissions',
    service_center_id: 'sc-003',
    service_center_name: 'University Admin Office',
    status: 'completed',
    position_ahead: 0,
    estimated_wait_minutes: 0,
    joined_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 22 * 60 * 1000).toISOString(),
  },
  {
    id: 'tok-h3',
    token_number: 31,
    token_code: 'A031',
    queue_id: 'q-h3',
    user_id: 'user-001',
    department_id: 'dept-010',
    department_name: 'ID & Passports',
    service_center_id: 'sc-004',
    service_center_name: 'Government Service Center',
    status: 'cancelled',
    position_ahead: 0,
    estimated_wait_minutes: 0,
    joined_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const DEMO_ANALYTICS_DATA: QueueAnalytics[] = [
  { date: '2026-11-11', total_served: 142, avg_wait_minutes: 18, peak_hour: 10, satisfaction_score: 4.2 },
  { date: '2026-11-12', total_served: 168, avg_wait_minutes: 22, peak_hour: 11, satisfaction_score: 4.1 },
  { date: '2026-11-13', total_served: 195, avg_wait_minutes: 15, peak_hour: 10, satisfaction_score: 4.5 },
  { date: '2026-11-14', total_served: 110, avg_wait_minutes: 12, peak_hour: 14, satisfaction_score: 4.6 },
  { date: '2026-11-15', total_served: 88, avg_wait_minutes: 9, peak_hour: 15, satisfaction_score: 4.8 },
  { date: '2026-11-16', total_served: 61, avg_wait_minutes: 8, peak_hour: 11, satisfaction_score: 4.7 },
  { date: '2026-11-17', total_served: 203, avg_wait_minutes: 20, peak_hour: 10, satisfaction_score: 4.3 },
];

export const DEMO_HOURLY_DATA = Array.from({ length: 12 }, (_, i) => ({
  hour: `${i + 8}:00`,
  tokens: Math.floor(10 + Math.random() * 30),
  avg_wait: Math.floor(8 + Math.random() * 20),
}));

export const DEMO_AI_INSIGHT: AIInsight = {
  prediction: 'Queue load is moderately high today. Expect slightly longer wait times between 10 AM – 12 PM.',
  confidence: 87,
  recommendation: 'Consider visiting after 2 PM for minimal wait time. Tuesday afternoons are historically the least busy.',
  estimated_wait_minutes: 24,
  peak_hours: [10, 11, 17],
  analysis: 'Based on 30-day historical patterns, today\'s queue velocity is 12% slower than average, likely due to higher-than-usual footfall. The AI model predicts queue clearance in approximately 2.5 hours at current pace.',
};

export const DEMO_ADMIN_STATS: AdminStats = {
  active_queues: 12,
  total_tokens_today: 203,
  avg_service_time: 11.4,
  pending_tokens: 34,
  completed_tokens: 165,
  skipped_tokens: 4,
};

export const LANDING_STATS: DashboardStats = {
  total_served: 128450,
  avg_wait_saved: 34,
  active_centers: 240,
  completed_today: 2810,
};

export const DEMO_ADMIN_QUEUE: Token[] = [
  { id: 'tq1', token_number: 36, token_code: 'A036', queue_id: 'q-001', user_id: 'u1', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'serving', position_ahead: 0, estimated_wait_minutes: 0, joined_at: new Date(Date.now() - 40 * 60000).toISOString(), called_at: new Date(Date.now() - 2 * 60000).toISOString() },
  { id: 'tq2', token_number: 37, token_code: 'A037', queue_id: 'q-001', user_id: 'u2', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 1, estimated_wait_minutes: 8, joined_at: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'tq3', token_number: 38, token_code: 'A038', queue_id: 'q-001', user_id: 'u3', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 2, estimated_wait_minutes: 16, joined_at: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'tq4', token_number: 39, token_code: 'A039', queue_id: 'q-001', user_id: 'u4', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 3, estimated_wait_minutes: 24, joined_at: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'tq5', token_number: 40, token_code: 'A040', queue_id: 'q-001', user_id: 'u5', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 4, estimated_wait_minutes: 32, joined_at: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'tq6', token_number: 41, token_code: 'A041', queue_id: 'q-001', user_id: 'u6', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 5, estimated_wait_minutes: 40, joined_at: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'tq7', token_number: 42, token_code: 'A042', queue_id: 'q-001', user_id: 'user-001', department_id: 'dept-001', department_name: 'General OPD', service_center_id: 'sc-001', service_center_name: 'City Care Hospital', status: 'waiting', position_ahead: 6, estimated_wait_minutes: 48, joined_at: new Date(Date.now() - 5 * 60000).toISOString() },
];

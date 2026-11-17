// Core types for QueueLess AI

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
}

export interface ServiceCenter {
  id: string;
  name: string;
  description: string;
  address: string;
  category: string;
  logo_color: string;
  is_active: boolean;
  departments: Department[];
  total_queue_size: number;
  estimated_wait_minutes: number;
  rating: number;
}

export interface Department {
  id: string;
  service_center_id: string;
  name: string;
  description: string;
  avg_service_time_minutes: number;
  current_queue_size: number;
  is_active: boolean;
}

export type TokenStatus = 'waiting' | 'called' | 'serving' | 'completed' | 'skipped' | 'cancelled';

export interface Token {
  id: string;
  token_number: number;
  token_code: string; // e.g., "A042"
  queue_id: string;
  user_id: string;
  department_id: string;
  department_name: string;
  service_center_id: string;
  service_center_name: string;
  status: TokenStatus;
  position_ahead: number;
  estimated_wait_minutes: number;
  joined_at: string;
  called_at?: string;
  completed_at?: string;
  ai_insight?: string;
}

export interface Queue {
  id: string;
  department_id: string;
  department_name: string;
  service_center_id: string;
  service_center_name: string;
  date: string;
  is_active: boolean;
  total_tokens: number;
  served_tokens: number;
  current_token?: Token;
  tokens: Token[];
}

export interface QueueAnalytics {
  date: string;
  total_served: number;
  avg_wait_minutes: number;
  peak_hour: number;
  satisfaction_score: number;
}

export interface AIInsight {
  prediction: string;
  confidence: number;
  recommendation: string;
  estimated_wait_minutes: number;
  peak_hours: number[];
  analysis: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_served: number;
  avg_wait_saved: number;
  active_centers: number;
  completed_today: number;
}

export interface AdminStats {
  active_queues: number;
  total_tokens_today: number;
  avg_service_time: number;
  pending_tokens: number;
  completed_tokens: number;
  skipped_tokens: number;
}

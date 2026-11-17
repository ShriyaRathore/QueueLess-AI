import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Token, Notification } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface QueueState {
  activeToken: Token | null;
  notifications: Notification[];
  setActiveToken: (token: Token | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: 'queueless-auth' }
  )
);

export const useQueueStore = create<QueueState>()((set) => ({
  activeToken: null,
  notifications: [],
  setActiveToken: (token) => set({ activeToken: token }),
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: `notif-${Date.now()}`,
          created_at: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

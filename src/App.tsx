import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

// Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import ServicesPage from './pages/Services';
import JoinQueuePage from './pages/JoinQueue';
import TokenTrackerPage from './pages/TokenTracker';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminQueue from './pages/AdminQueue';
import AdminServicesPage from './pages/AdminServices';
import AdminSettingsPage from './pages/AdminSettings';
import NotificationsPage from './pages/Notifications';
import ProfilePage from './pages/Profile';
import MyTokensPage from './pages/MyTokens';
import NotFoundPage from './pages/NotFound';

// Protected route wrapper
function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'customer' | 'admin' }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: {
            style: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#14532d' },
            iconTheme: { primary: '#22c55e', secondary: '#f0fdf4' },
          },
          error: {
            style: { background: '#fef2f2', border: '1px solid #fecaca', color: '#7f1d1d' },
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

        {/* Customer routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
        <Route path="/services/:id/join" element={<ProtectedRoute><JoinQueuePage /></ProtectedRoute>} />
        <Route path="/token/:id" element={<ProtectedRoute><TokenTrackerPage /></ProtectedRoute>} />
        <Route path="/tokens" element={<ProtectedRoute><MyTokensPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/queue" element={<ProtectedRoute role="admin"><AdminQueue /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute role="admin"><AdminServicesPage /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettingsPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

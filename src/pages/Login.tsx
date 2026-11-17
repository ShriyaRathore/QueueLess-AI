import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store';
import { User } from '../types';
import { apiRequest } from '../api/api';
const DEMO_USERS = [
  { email: 'demo@queueless.ai', password: 'demo123', role: 'customer' as const, name: 'Alex Johnson' },
  { email: 'admin@queueless.ai', password: 'admin123', role: 'admin' as const, name: 'Dr. Admin User' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    });

    const user: User = {
      id: data.user_id,
      email: email.trim(),
      name: data.name,
      role: data.role,
      created_at: new Date().toISOString(),
    };

    login(user, data.token);

    navigate(data.role === 'admin' ? '/admin' : '/dashboard');

  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Login failed. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};


  const demoLogin = (type: 'customer' | 'admin') => {
    const creds = DEMO_USERS.find((u) => u.role === type)!;
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-xl">
              QueueLess <span className="text-indigo-400">AI</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Demo login shortcuts */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => demoLogin('customer')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              👤 Demo Customer
            </button>
            <button
              onClick={() => demoLogin('admin')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              🛡 Demo Admin
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Demo credentials info */}
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
          <p className="text-white/60 text-xs">
            <strong className="text-white/80">Demo Credentials</strong><br />
            Customer: demo@queueless.ai / demo123<br />
            Admin: admin@queueless.ai / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}

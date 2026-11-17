import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket, Clock, MapPin, TrendingUp, Plus, ChevronRight,
  CheckCircle, XCircle, Bell, Brain, Users, Calendar, Activity
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { useAuthStore, useQueueStore } from '../store';
import { DEMO_ACTIVE_TOKEN, DEMO_TOKEN_HISTORY } from '../data/demo';
import { Token } from '../types';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  waiting: { label: 'Waiting', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  called: { label: 'Called', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200', dot: 'bg-cyan-500' },
  serving: { label: 'Now Serving', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  skipped: { label: 'Skipped', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', dot: 'bg-red-500' },
};

function ActiveTokenCard({ token }: { token: Token }) {
  const [timeLeft, setTimeLeft] = useState(token.estimated_wait_minutes * 60);
  const cfg = statusConfig[token.status];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = Math.max(0, 100 - (timeLeft / (token.estimated_wait_minutes * 60)) * 100);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-2', cfg.bg, cfg.color, `border ${cfg.border}`)}>
              <span className={clsx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
              {cfg.label}
            </div>
            <p className="text-indigo-200 text-xs">{token.service_center_name}</p>
            <p className="text-white font-semibold text-sm">{token.department_name}</p>
          </div>
          <div className="p-2.5 bg-white/10 rounded-2xl">
            <Ticket size={22} />
          </div>
        </div>

        <div className="text-center py-4">
          <p className="text-indigo-200 text-sm mb-1">Your Token</p>
          <div className="text-6xl font-black tracking-tight mb-1 token-pulse">
            {token.token_code}
          </div>
          <p className="text-indigo-300 text-xs">Joined {formatDistanceToNow(new Date(token.joined_at), { addSuffix: true })}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-indigo-200 mb-1.5">
            <span>Queue Progress</span>
            <span>{Math.round(progress)}% ahead</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <Users size={14} className="mx-auto text-indigo-200 mb-1" />
            <p className="text-white font-bold text-lg">{token.position_ahead}</p>
            <p className="text-indigo-300 text-xs">Ahead</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <Clock size={14} className="mx-auto text-indigo-200 mb-1" />
            <p className="text-white font-bold text-lg">{mins}:{secs.toString().padStart(2, '0')}</p>
            <p className="text-indigo-300 text-xs">Est. Wait</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 text-center">
            <Activity size={14} className="mx-auto text-indigo-200 mb-1" />
            <p className="text-white font-bold text-lg">{token.token_number}</p>
            <p className="text-indigo-300 text-xs">Token #</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ token }: { token: Token }) {
  const cfg = statusConfig[token.status];
  const StatusIcon = token.status === 'completed' ? CheckCircle : XCircle;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className={clsx('p-2 rounded-xl flex-shrink-0', cfg.bg)}>
        <StatusIcon size={16} className={cfg.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">
          {token.department_name} · {token.service_center_name}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className={clsx('text-xs font-medium flex items-center gap-1', cfg.color)}>
            <span className={clsx('h-1.5 w-1.5 rounded-full', cfg.dot)} />
            {cfg.label}
          </span>
          <span className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(token.joined_at), { addSuffix: true })}
          </span>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-slate-700">{token.token_code}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { addNotification } = useQueueStore();
  const [activeToken] = useState<Token | null>(DEMO_ACTIVE_TOKEN);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    // Simulate an approaching notification
    const timer = setTimeout(() => {
      addNotification({
        type: 'warning',
        title: '3 people ahead of you!',
        message: 'Your turn at General OPD is approaching. Please make your way to the center.',
        read: false,
      });
    }, 5000);
    return () => clearTimeout(timer);
  }, [addNotification]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">{greeting}</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {greeting}, {user?.name?.split(' ')[0]}! 👋
              </h1>
            </div>
            <Link
              to="/services"
              id="join-queue-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={16} /> Join Queue
            </Link>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Queues Joined', value: '12', icon: Ticket, color: '#4f46e5' },
            { label: 'Time Saved', value: '4.2h', icon: Clock, color: '#059669' },
            { label: 'Centers Used', value: '5', icon: MapPin, color: '#2563eb' },
            { label: 'This Month', value: '3', icon: Calendar, color: '#d97706' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className="p-2 rounded-xl w-fit mb-2" style={{ backgroundColor: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Active Token */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            {activeToken ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-slate-900">Active Token</h2>
                  <Link to={`/token/${activeToken.id}`} className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                    Full View <ChevronRight size={14} />
                  </Link>
                </div>
                <ActiveTokenCard token={activeToken} />

                {/* AI Insight */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4">
                  <button
                    onClick={() => setShowAI(!showAI)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <Brain size={14} className="text-indigo-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">AI Insight</span>
                    <ChevronRight size={14} className={clsx('ml-auto text-slate-400 transition-transform', showAI && 'rotate-90')} />
                  </button>
                  {showAI && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-slate-100"
                    >
                      <p className="text-sm text-slate-600 leading-relaxed">{activeToken.ai_insight}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[87%] bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                        </div>
                        <span className="text-xs text-slate-400 font-medium">87% confident</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center h-full flex flex-col items-center justify-center">
                <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                  <Ticket size={32} className="text-slate-300" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">No active token</p>
                <p className="text-sm text-slate-400 mb-5">Join a queue to get your digital token</p>
                <Link to="/services" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                  Browse Services
                </Link>
              </div>
            )}
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Quick services */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Quick Access</h2>
                <Link to="/services" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  All Services <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Hospital', emoji: '🏥', href: '/services?cat=Healthcare' },
                  { label: 'Bank', emoji: '🏦', href: '/services?cat=Banking' },
                  { label: 'University', emoji: '🎓', href: '/services?cat=Education' },
                  { label: 'Government', emoji: '🏛️', href: '/services?cat=Government' },
                ].map(({ label, emoji, href }) => (
                  <Link
                    key={label}
                    to={href}
                    className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 border border-transparent transition-all"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-medium text-slate-600">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Queue history */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-900">Recent History</h2>
                <Link to="/tokens" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                  View All <ChevronRight size={14} />
                </Link>
              </div>
              {DEMO_TOKEN_HISTORY.length > 0 ? (
                <div>
                  {DEMO_TOKEN_HISTORY.map((token) => (
                    <HistoryItem key={token.id} token={token} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp size={32} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-400 text-sm">No queue history yet</p>
                </div>
              )}
            </div>

            {/* Notifications panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={16} className="text-slate-600" />
                <h2 className="font-bold text-slate-900">Notifications</h2>
                <span className="ml-auto px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">1</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <div className="relative flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 bg-amber-500 rounded-full" />
                  <div className="absolute inset-0 h-2 w-2 bg-amber-500 rounded-full ping-dot" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900">3 people ahead of you!</p>
                  <p className="text-xs text-amber-600 mt-0.5">Please make your way to City Care Hospital.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

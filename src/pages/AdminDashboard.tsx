import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Ticket, Users, Clock, CheckCircle, ChevronRight, TrendingUp,
  Activity, Brain, AlertTriangle, Building2, SkipForward, XCircle, Bell
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_ADMIN_STATS, DEMO_ADMIN_QUEUE, DEMO_AI_INSIGHT, DEMO_SERVICE_CENTERS } from '../data/demo';
import { Token } from '../types';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const statusColors: Record<string, string> = {
  serving: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  waiting: 'bg-amber-50 text-amber-700 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  skipped: 'bg-slate-100 text-slate-500 border-slate-200',
  called: 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(DEMO_ADMIN_STATS);
  const [queue, setQueue] = useState<Token[]>([...DEMO_ADMIN_QUEUE]);
  const [loading, setLoading] = useState(false);

  const callNext = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    setQueue((prev) => {
      const updated = [...prev];
      // Mark current 'serving' as completed
      const servingIdx = updated.findIndex((t) => t.status === 'serving');
      if (servingIdx >= 0) {
        updated[servingIdx] = { ...updated[servingIdx], status: 'completed' };
        setStats((s) => ({ ...s, completed_tokens: s.completed_tokens + 1, pending_tokens: s.pending_tokens - 1 }));
      }
      // Mark first 'waiting' as serving
      const waitingIdx = updated.findIndex((t) => t.status === 'waiting');
      if (waitingIdx >= 0) {
        updated[waitingIdx] = { ...updated[waitingIdx], status: 'serving' };
      }
      return updated;
    });

    toast.success('Next token called!', { icon: '📢' });
    setLoading(false);
  };

  const skipToken = (tokenId: string) => {
    setQueue((prev) => prev.map((t) => t.id === tokenId ? { ...t, status: 'skipped' } : t));
    setStats((s) => ({ ...s, skipped_tokens: s.skipped_tokens + 1 }));
    toast('Token skipped', { icon: '⏭️' });
  };

  const completeToken = (tokenId: string) => {
    setQueue((prev) => prev.map((t) => t.id === tokenId ? { ...t, status: 'completed' } : t));
    setStats((s) => ({ ...s, completed_tokens: s.completed_tokens + 1, pending_tokens: s.pending_tokens - 1 }));
    toast.success('Token marked complete');
  };

  const servingToken = queue.find((t) => t.status === 'serving');
  const waitingTokens = queue.filter((t) => t.status === 'waiting');

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 text-sm mt-0.5">Monitor and manage all queues in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/analytics"
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                <TrendingUp size={16} /> Analytics
              </Link>
              <button
                id="call-next-btn"
                onClick={callNext}
                disabled={loading || waitingTokens.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Activity size={16} />
                )}
                Call Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
        >
          {[
            { label: 'Active Queues', value: stats.active_queues, icon: Activity, color: '#4f46e5' },
            { label: 'Today\'s Tokens', value: stats.total_tokens_today, icon: Ticket, color: '#2563eb' },
            { label: 'Avg. Svc Time', value: `${stats.avg_service_time}m`, icon: Clock, color: '#059669' },
            { label: 'Pending', value: stats.pending_tokens, icon: Users, color: '#d97706' },
            { label: 'Completed', value: stats.completed_tokens, icon: CheckCircle, color: '#059669' },
            { label: 'Skipped', value: stats.skipped_tokens, icon: SkipForward, color: '#6366f1' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm col-span-1">
              <div className="p-2 rounded-xl w-fit mb-2" style={{ backgroundColor: `${color}18` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 leading-tight">{label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Now Serving */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-fit">
              <div className="p-5 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Now Serving</h2>
              </div>
              <div className="p-5">
                {servingToken ? (
                  <div>
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo-50 border-4 border-indigo-100 mx-auto mb-3">
                        <span className="text-3xl font-black text-indigo-600">{servingToken.token_code}</span>
                      </div>
                      <p className="font-semibold text-slate-900">{servingToken.department_name}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">At Counter</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => completeToken(servingToken.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
                      >
                        <CheckCircle size={14} /> Complete
                      </button>
                      <button
                        onClick={() => skipToken(servingToken.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <SkipForward size={14} /> Skip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-4 bg-slate-50 rounded-2xl w-fit mx-auto mb-3">
                      <Ticket size={28} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm">No token being served</p>
                    <button
                      onClick={callNext}
                      disabled={loading || waitingTokens.length === 0}
                      className="mt-4 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Call First Token
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insight Card */}
            <div className="mt-5 bg-gradient-to-br from-indigo-50 to-cyan-50 rounded-2xl border border-indigo-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-100 rounded-lg">
                  <Brain size={14} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Queue Insight</h3>
                <span className="ml-auto text-xs bg-white text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100 font-medium">
                  {DEMO_AI_INSIGHT.confidence}%
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{DEMO_AI_INSIGHT.prediction}</p>
              <div className="p-2.5 bg-white/80 rounded-xl border border-indigo-100">
                <p className="text-xs text-slate-500 font-medium flex items-start gap-1.5">
                  <AlertTriangle size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  {DEMO_AI_INSIGHT.recommendation}
                </p>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                Peak hours: {DEMO_AI_INSIGHT.peak_hours.map((h) => `${h}:00`).join(', ')}
              </div>
            </div>
          </motion.div>

          {/* Queue List */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">Queue List</h2>
                  <p className="text-xs text-slate-400 mt-0.5">General OPD · City Care Hospital</p>
                </div>
                <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full border border-amber-100">
                  {waitingTokens.length} waiting
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {queue.map((t, i) => (
                  <motion.div
                    key={t.id}
                    layout
                    className={clsx('flex items-center gap-4 px-5 py-3.5', t.status === 'completed' && 'opacity-50')}
                  >
                    <span className={clsx(
                      'h-10 w-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 border',
                      statusColors[t.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                    )}>
                      {t.token_code}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={clsx('text-xs font-semibold px-2 py-0.5 rounded-full border', statusColors[t.status])}>
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </span>
                        {t.id === 'tq7' && (
                          <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full border border-indigo-100">
                            👤 Demo User
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {t.estimated_wait_minutes > 0 ? `~${t.estimated_wait_minutes}m wait` : 'No wait'}
                        </span>
                        <span className="text-xs text-slate-400">Position #{i + 1}</span>
                      </div>
                    </div>

                    {(t.status === 'waiting' || t.status === 'serving') && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {t.status === 'serving' && (
                          <button
                            onClick={() => completeToken(t.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Mark Complete"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => skipToken(t.id)}
                          className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
                          title="Skip"
                        >
                          <SkipForward size={15} />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="p-5 border-t border-slate-100">
                <Link
                  to="/admin/queue"
                  className="flex items-center justify-center gap-2 py-2.5 w-full border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Full Queue Manager <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Service Centers Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Service Centers Overview</h2>
              <Link to="/admin/services" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
                Manage <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DEMO_SERVICE_CENTERS.slice(0, 3).map((center) => (
                <div key={center.id} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: center.logo_color }}
                  >
                    {center.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{center.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users size={10} /> {center.total_queue_size}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> ~{center.estimated_wait_minutes}m
                      </span>
                    </div>
                  </div>
                  <span className={clsx('h-2 w-2 rounded-full flex-shrink-0', center.is_active ? 'bg-emerald-500' : 'bg-slate-300')} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

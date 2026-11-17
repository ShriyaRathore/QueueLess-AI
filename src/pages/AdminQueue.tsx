import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Users, Clock, CheckCircle, SkipForward, ChevronDown,
  Activity, Search, Filter, Building2, Zap
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_ADMIN_QUEUE, DEMO_SERVICE_CENTERS } from '../data/demo';
import { Token } from '../types';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const statusStyles: Record<string, string> = {
  serving:   'bg-indigo-50 text-indigo-700 border-indigo-200',
  waiting:   'bg-amber-50 text-amber-700 border-amber-100',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  skipped:   'bg-slate-100 text-slate-500 border-slate-200',
  called:    'bg-cyan-50 text-cyan-700 border-cyan-100',
  cancelled: 'bg-red-50 text-red-600 border-red-100',
};

export default function AdminQueuePage() {
  const [selectedCenter, setSelectedCenter] = useState(DEMO_SERVICE_CENTERS[0].id);
  const [selectedDept, setSelectedDept] = useState('dept-001');
  const [queue, setQueue] = useState<Token[]>([...DEMO_ADMIN_QUEUE]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'waiting' | 'serving' | 'completed'>('all');
  const [loading, setLoading] = useState(false);

  const center = DEMO_SERVICE_CENTERS.find(c => c.id === selectedCenter)!;

  const callNext = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setQueue(prev => {
      const updated = [...prev];
      const servingIdx = updated.findIndex(t => t.status === 'serving');
      if (servingIdx >= 0) updated[servingIdx] = { ...updated[servingIdx], status: 'completed' };
      const waitingIdx = updated.findIndex(t => t.status === 'waiting');
      if (waitingIdx >= 0) {
        updated[waitingIdx] = { ...updated[waitingIdx], status: 'serving', called_at: new Date().toISOString() };
        toast.success(`Called token ${updated[waitingIdx].token_code}`, { icon: '📢' });
      } else {
        toast('No more tokens in queue', { icon: 'ℹ️' });
      }
      return updated;
    });
    setLoading(false);
  };

  const markComplete = (id: string) => {
    setQueue(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', completed_at: new Date().toISOString() } : t));
    toast.success('Token completed');
  };

  const skipToken = (id: string) => {
    setQueue(prev => prev.map(t => t.id === id ? { ...t, status: 'skipped' } : t));
    toast('Token skipped', { icon: '⏭️' });
  };

  const filtered = queue.filter(t => {
    const matchSearch = !search || t.token_code.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    waiting: queue.filter(t => t.status === 'waiting').length,
    serving: queue.filter(t => t.status === 'serving').length,
    completed: queue.filter(t => t.status === 'completed').length,
    skipped: queue.filter(t => t.status === 'skipped').length,
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Queue Manager</h1>
              <p className="text-slate-500 text-sm mt-0.5">Call tokens, mark complete, skip — manage live queues</p>
            </div>
            <button
              id="call-next-queue-btn"
              onClick={callNext}
              disabled={loading || counts.waiting === 0}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200 disabled:opacity-50"
            >
              {loading
                ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Zap size={16} />}
              Call Next Token
            </button>
          </div>
        </motion.div>

        {/* Center + Dept selector */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Center</label>
              <div className="relative">
                <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedCenter}
                  onChange={e => setSelectedCenter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 appearance-none"
                >
                  {DEMO_SERVICE_CENTERS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Department</label>
              <div className="relative">
                <Ticket size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 appearance-none"
                >
                  {center.departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status pills */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-4 gap-3 mb-6">
          {([
            { key: 'all', label: 'All', count: queue.length, color: '#4f46e5' },
            { key: 'waiting', label: 'Waiting', count: counts.waiting, color: '#d97706' },
            { key: 'serving', label: 'Serving', count: counts.serving, color: '#4f46e5' },
            { key: 'completed', label: 'Done', count: counts.completed, color: '#059669' },
          ] as const).map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={clsx(
                'p-3 rounded-2xl border text-left transition-all',
                filter === key
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-slate-100 bg-white hover:bg-slate-50'
              )}
            >
              <p className="text-xl font-black" style={{ color }}>{count}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </button>
          ))}
        </motion.div>

        {/* Search bar */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by token code (e.g. A036)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>

        {/* Queue table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <Activity size={15} className="text-indigo-500" />
            <h2 className="font-bold text-slate-900 text-sm">Live Queue — {center.name}</h2>
            <span className="ml-auto text-xs bg-amber-50 text-amber-700 font-semibold px-3 py-1 rounded-full border border-amber-100">
              {counts.waiting} waiting
            </span>
          </div>

          <div className="divide-y divide-slate-50">
            <AnimatePresence>
              {filtered.map((token, idx) => (
                <motion.div
                  key={token.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: idx * 0.03 }}
                  className={clsx(
                    'flex items-center gap-4 px-5 py-4',
                    token.status === 'completed' || token.status === 'skipped' ? 'opacity-50' : ''
                  )}
                >
                  {/* Position */}
                  <span className="text-xs text-slate-300 font-mono w-6 text-center flex-shrink-0">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Token code badge */}
                  <span className={clsx(
                    'h-11 w-14 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 border',
                    statusStyles[token.status] || 'bg-slate-100 text-slate-600 border-slate-200'
                  )}>
                    {token.token_code}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={clsx(
                        'text-xs font-semibold px-2 py-0.5 rounded-full border',
                        statusStyles[token.status]
                      )}>
                        {token.status.charAt(0).toUpperCase() + token.status.slice(1)}
                      </span>
                      {token.id === 'tq7' && (
                        <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2 py-0.5 rounded-full border border-purple-100">
                          Demo User
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {token.estimated_wait_minutes > 0 ? `~${token.estimated_wait_minutes}m wait` : 'No wait'}
                      </span>
                      {token.called_at && (
                        <span className="text-cyan-600">
                          Called {new Date(token.called_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                      {token.completed_at && (
                        <span className="text-emerald-600">
                          Done {new Date(token.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {(token.status === 'waiting' || token.status === 'serving') && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {token.status === 'serving' && (
                        <button
                          onClick={() => markComplete(token.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle size={12} /> Complete
                        </button>
                      )}
                      <button
                        onClick={() => skipToken(token.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-500 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <SkipForward size={12} /> Skip
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Ticket size={36} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No tokens match your filter</p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}

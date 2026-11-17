import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Clock, Users, Bell, Brain, CheckCircle, XCircle,
  ArrowLeft, Wifi, WifiOff, ChevronRight, Activity, MapPin
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_ACTIVE_TOKEN, DEMO_ADMIN_QUEUE, DEMO_AI_INSIGHT } from '../data/demo';
import { Token } from '../types';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export default function TokenTrackerPage() {
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<Token>({ ...DEMO_ACTIVE_TOKEN });
  const [connected, setConnected] = useState(true);
  const [queue, setQueue] = useState([...DEMO_ADMIN_QUEUE]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showAI, setShowAI] = useState(true);
  const [cancelled, setCancelled] = useState(false);

  // Simulate WebSocket updates — queue moves every 15s
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((t) => t + 1);

      setToken((prev) => {
        if (prev.status !== 'waiting' || prev.position_ahead === 0) return prev;
        const newPos = Math.max(0, prev.position_ahead - 1);
        const newWait = newPos * 8; // 8 min avg per person
        if (newPos <= 2 && prev.position_ahead > 2) {
          toast('⚡ Your turn is approaching!', {
            icon: '🔔',
            style: { background: '#fffbeb', color: '#92400e' },
          });
        }
        if (newPos === 0) {
          toast.success('🎉 It\'s your turn! Please proceed to the counter.', { duration: 5000 });
          return { ...prev, position_ahead: 0, estimated_wait_minutes: 0, status: 'called' };
        }
        return { ...prev, position_ahead: newPos, estimated_wait_minutes: newWait };
      });
    }, 8000); // moves every 8 seconds for demo

    return () => clearInterval(timer);
  }, []);

  // Simulate connection fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setConnected((c) => !c);
      setTimeout(() => setConnected(true), 1200);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  // Elapsed time counter
  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCancel = () => {
    setCancelled(true);
    setToken((t) => ({ ...t, status: 'cancelled' }));
    toast.error('Token cancelled. We hope to see you again!');
  };

  const queueProgress = Math.max(0, 100 - (token.position_ahead / DEMO_ACTIVE_TOKEN.position_ahead) * 100);

  if (cancelled || token.status === 'cancelled') {
    return (
      <AppLayout>
        <div className="p-6 max-w-lg mx-auto text-center py-20">
          <div className="p-5 bg-red-50 rounded-full w-fit mx-auto mb-5">
            <XCircle size={40} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Token Cancelled</h2>
          <p className="text-slate-500 mb-6">Your token has been cancelled. You can join a new queue anytime.</p>
          <div className="flex flex-col gap-3">
            <Link to="/services" className="py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
              Browse Services
            </Link>
            <Link to="/dashboard" className="py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        {/* Back */}
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 group w-fit">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Connection status */}
        <div className="flex items-center gap-2 mb-5">
          <div className={clsx('flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full', connected ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? 'Live — Updating in real-time' : 'Reconnecting...'}
            {connected && <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full ml-0.5 ping-dot" />}
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Token card — left */}
          <div className="lg:col-span-3 space-y-5">
            {/* Main token display */}
            <motion.div
              className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-7 text-white relative overflow-hidden"
              animate={token.status === 'called' ? { scale: [1, 1.02, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-indigo-200 text-xs">{token.service_center_name}</p>
                    <p className="text-white font-semibold text-sm">{token.department_name}</p>
                  </div>
                  <div className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
                    token.status === 'called'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse'
                      : 'bg-white/10 text-white border-white/20'
                  )}>
                    {token.status === 'called' ? '🎉 CALLED!' : (
                      <>
                        <Activity size={12} />
                        Active
                      </>
                    )}
                  </div>
                </div>

                <div className="text-center py-5">
                  <p className="text-indigo-200 text-sm mb-2">Your Token</p>
                  <div className={clsx('text-8xl font-black tracking-tight', token.status !== 'called' && 'token-pulse')}>
                    {token.token_code}
                  </div>
                  {token.status === 'called' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 px-4 py-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-semibold"
                    >
                      🎉 Please proceed to the counter!
                    </motion.div>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-indigo-200 mb-2">
                    <span>Queue Progress</span>
                    <span>{Math.round(queueProgress)}% complete</span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: `${100 - queueProgress}%` }}
                      animate={{ width: `${queueProgress}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 rounded-2xl p-3 text-center">
                    <Users size={14} className="mx-auto text-indigo-200 mb-1.5" />
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={token.position_ahead}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white font-black text-2xl"
                      >
                        {token.position_ahead}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-indigo-200 text-xs mt-0.5">Ahead</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center">
                    <Clock size={14} className="mx-auto text-indigo-200 mb-1.5" />
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={token.estimated_wait_minutes}
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white font-black text-2xl"
                      >
                        {token.estimated_wait_minutes}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-indigo-200 text-xs mt-0.5">Min. Wait</p>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-3 text-center">
                    <Ticket size={14} className="mx-auto text-indigo-200 mb-1.5" />
                    <p className="text-white font-black text-2xl">{token.token_number}</p>
                    <p className="text-indigo-200 text-xs mt-0.5">Token #</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cancel button */}
            {token.status === 'waiting' && (
              <button
                id="cancel-token-btn"
                onClick={handleCancel}
                className="w-full py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors"
              >
                Cancel Token
              </button>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Queue visual */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                <Users size={15} className="text-indigo-500" />
                Live Queue
              </h3>
              <div className="space-y-2">
                {queue.slice(0, 7).map((t, i) => {
                  const isYou = t.token_code === token.token_code;
                  const isCurrent = t.status === 'serving' || t.status === 'called';
                  return (
                    <div
                      key={t.id}
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2 rounded-xl transition-all',
                        isYou ? 'bg-indigo-50 border border-indigo-200' : isCurrent ? 'bg-emerald-50' : 'bg-slate-50'
                      )}
                    >
                      <span className={clsx(
                        'text-xs font-bold w-8 h-8 rounded-lg flex items-center justify-center',
                        isYou ? 'bg-indigo-600 text-white' : isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                      )}>
                        {t.token_code}
                      </span>
                      <div className="flex-1">
                        <p className={clsx('text-xs font-semibold', isYou ? 'text-indigo-700' : 'text-slate-600')}>
                          {isYou ? 'YOU' : `Person ${i + 1}`}
                        </p>
                        <p className="text-[10px] text-slate-400">{isCurrent ? '🟢 At counter' : 'Waiting'}</p>
                      </div>
                      {isYou && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">You</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <Brain size={14} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Analysis</h3>
                <span className="ml-auto text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  {DEMO_AI_INSIGHT.confidence}% conf.
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">{DEMO_AI_INSIGHT.prediction}</p>
              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-xs text-amber-700 font-medium">💡 {DEMO_AI_INSIGHT.recommendation}</p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={14} className="text-slate-600" />
                <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              </div>
              <div className="space-y-2">
                {token.position_ahead <= 3 && (
                  <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2">
                    <span className="text-amber-500 text-sm">🔔</span>
                    <p className="text-xs text-amber-700">Your turn is approaching! Please head to the service center.</p>
                  </div>
                )}
                <div className="p-2.5 bg-slate-50 rounded-xl flex items-start gap-2">
                  <CheckCircle size={13} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-slate-600">Token {token.token_code} issued and queue position confirmed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

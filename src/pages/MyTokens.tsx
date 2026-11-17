import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/layout';
import { DEMO_TOKEN_HISTORY, DEMO_ACTIVE_TOKEN } from '../data/demo';
import { Token } from '../types';
import { clsx } from 'clsx';
import { formatDistanceToNow, format } from 'date-fns';
import { Ticket, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const statusConfig = {
  waiting: { label: 'Waiting', color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
  called: { label: 'Called', color: 'text-cyan-600', bg: 'bg-cyan-50', icon: Ticket },
  serving: { label: 'Now Serving', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Ticket },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
  skipped: { label: 'Skipped', color: 'text-slate-600', bg: 'bg-slate-50', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
};

function TokenCard({ token }: { token: Token }) {
  const cfg = statusConfig[token.status];
  const StatusIcon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className={clsx('p-2.5 rounded-xl flex-shrink-0', cfg.bg)}>
          <StatusIcon size={18} className={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900">{token.token_code}</h3>
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', cfg.bg, cfg.color)}>
              {cfg.label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{token.department_name} · {token.service_center_name}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            <span>Joined {formatDistanceToNow(new Date(token.joined_at), { addSuffix: true })}</span>
            {token.completed_at && (
              <span className="text-emerald-600 font-medium">
                ✓ Completed at {format(new Date(token.completed_at), 'h:mm a')}
              </span>
            )}
          </div>
        </div>
        {token.status === 'waiting' && (
          <Link
            to={`/token/${token.id}`}
            className="flex-shrink-0 flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:underline"
          >
            Track <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function MyTokensPage() {
  const allTokens = [DEMO_ACTIVE_TOKEN, ...DEMO_TOKEN_HISTORY];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">My Tokens</h1>
          <p className="text-slate-500 text-sm">All your virtual queue tokens</p>
        </motion.div>

        {/* Active section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Active</p>
          <TokenCard token={DEMO_ACTIVE_TOKEN} />
        </div>

        {/* History */}
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">History</p>
          <div className="space-y-3">
            {DEMO_TOKEN_HISTORY.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

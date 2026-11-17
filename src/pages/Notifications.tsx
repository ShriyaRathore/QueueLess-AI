import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Trash2, CheckCheck } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { useQueueStore } from '../store';
import { Notification } from '../types';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
};

function NotifItem({ notification, onRead }: { notification: Notification; onRead: () => void }) {
  const { icon: Icon, color, bg } = iconMap[notification.type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={clsx('flex items-start gap-4 p-4 rounded-2xl border transition-all', notification.read ? 'bg-white border-slate-100' : 'bg-indigo-50/40 border-indigo-100')}
    >
      <div className={clsx('p-2 rounded-xl flex-shrink-0', bg)}>
        <Icon size={16} className={color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
          {!notification.read && <span className="h-2 w-2 bg-indigo-500 rounded-full" />}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{notification.message}</p>
        <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}</p>
      </div>
      {!notification.read && (
        <button onClick={onRead} className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0" title="Mark as read">
          <CheckCircle size={14} />
        </button>
      )}
    </motion.div>
  );
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, clearNotifications } = useQueueStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
              <p className="text-slate-500 text-sm mt-0.5">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
            </div>
            {notifications.length > 0 && (
              <button onClick={clearNotifications} className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-500 transition-colors">
                <Trash2 size={14} /> Clear all
              </button>
            )}
          </div>
        </motion.div>

        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <NotifItem key={n.id} notification={n} onRead={() => markNotificationRead(n.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="p-5 bg-slate-50 rounded-2xl w-fit mx-auto mb-4">
              <Bell size={36} className="text-slate-200" />
            </div>
            <h3 className="font-semibold text-slate-700 mb-1">All caught up!</h3>
            <p className="text-slate-400 text-sm">No notifications yet. Join a queue to get started.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

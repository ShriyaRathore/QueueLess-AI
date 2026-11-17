import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Users, Clock, CheckCircle, ToggleLeft, ToggleRight,
  Edit2, Plus, Search, MoreHorizontal, Trash2, Star
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_SERVICE_CENTERS } from '../data/demo';
import { ServiceCenter } from '../types';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const categoryColors: Record<string, string> = {
  Healthcare: '#ef4444', Banking: '#2563eb', Education: '#7c3aed',
  Government: '#059669', Technology: '#0891b2', Postal: '#d97706',
};

function CenterRow({ center }: { center: ServiceCenter }) {
  const [active, setActive] = useState(center.is_active);

  return (
    <motion.div
      layout
      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Logo */}
      <div
        className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0"
        style={{ backgroundColor: center.logo_color }}
      >
        {center.name.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-slate-900 text-sm">{center.name}</h3>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${center.logo_color}18`, color: center.logo_color }}
          >
            {center.category}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={11} fill="currentColor" />
            <span className="text-xs text-slate-500">{center.rating}</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">{center.address}</p>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Building2 size={10} /> {center.departments.length} depts
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Users size={10} /> {center.total_queue_size} in queue
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={10} /> ~{center.estimated_wait_minutes}m avg
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Toggle active */}
        <button
          onClick={() => {
            setActive(a => !a);
            toast(active ? 'Center deactivated' : 'Center activated', { icon: active ? '🔴' : '🟢' });
          }}
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border',
            active
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          )}
        >
          {active ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
          {active ? 'Active' : 'Inactive'}
        </button>
        <button
          onClick={() => toast('Edit coming soon in production build', { icon: '✏️' })}
          className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={() => toast.error('Delete disabled in demo mode')}
          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminServicesPage() {
  const [search, setSearch] = useState('');

  const filtered = DEMO_SERVICE_CENTERS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Service Centers</h1>
              <p className="text-slate-500 text-sm mt-0.5">Manage and configure all service center locations</p>
            </div>
            <button
              onClick={() => toast('Add center form coming soon in production build', { icon: '➕' })}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus size={16} /> Add Center
            </button>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: 'Total Centers', value: DEMO_SERVICE_CENTERS.length, icon: Building2, color: '#4f46e5' },
            { label: 'Active Centers', value: DEMO_SERVICE_CENTERS.filter(c => c.is_active).length, icon: CheckCircle, color: '#059669' },
            { label: 'Total Depts', value: DEMO_SERVICE_CENTERS.reduce((acc, c) => acc + c.departments.length, 0), icon: Users, color: '#2563eb' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="p-2 rounded-xl w-fit mb-2" style={{ backgroundColor: `${color}18` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search service centers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 shadow-sm"
          />
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.map((center, i) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CenterRow center={center} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <Building2 size={40} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400">No service centers match your search</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-600 text-center">
          📌 <strong>Demo Mode:</strong> Edit and delete actions are disabled. Connect Supabase to enable full CRUD management.
        </div>
      </div>
    </AppLayout>
  );
}

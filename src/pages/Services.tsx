import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Clock, Users, Star, ChevronRight, Building2 } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_SERVICE_CENTERS } from '../data/demo';
import { ServiceCenter } from '../types';
import { clsx } from 'clsx';

const CATEGORIES = ['All', 'Healthcare', 'Banking', 'Education', 'Government', 'Technology', 'Postal'];

const categoryIcons: Record<string, string> = {
  Healthcare: '🏥', Banking: '🏦', Education: '🎓',
  Government: '🏛️', Technology: '💻', Postal: '📮', All: '🔍',
};

function ServiceCenterCard({ center }: { center: ServiceCenter }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
            style={{ backgroundColor: center.logo_color }}
          >
            {categoryIcons[center.category]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">{center.name}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${center.logo_color}18`, color: center.logo_color }}
                  >
                    {center.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={11} fill="currentColor" />
                    <span className="text-xs font-medium text-slate-600">{center.rating}</span>
                  </div>
                </div>
              </div>
              <span className={clsx(
                'flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full',
                center.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
              )}>
                {center.is_active ? '● Open' : '○ Closed'}
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-2">{center.description}</p>

            <div className="flex items-center gap-1 mt-2 text-slate-400">
              <MapPin size={12} />
              <span className="text-xs">{center.address}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users size={12} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-900">{center.total_queue_size}</p>
            <p className="text-xs text-slate-400">In Queue</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={12} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-900">~{center.estimated_wait_minutes}m</p>
            <p className="text-xs text-slate-400">Est. Wait</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Building2 size={12} className="text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-900">{center.departments.length}</p>
            <p className="text-xs text-slate-400">Departments</p>
          </div>
        </div>

        {/* Departments toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 mt-4 font-medium"
        >
          <ChevronRight size={15} className={clsx('transition-transform', expanded && 'rotate-90')} />
          {expanded ? 'Hide' : 'View'} departments
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-2"
          >
            {center.departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{dept.name}</p>
                  <p className="text-xs text-slate-400 truncate">{dept.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-700">{dept.current_queue_size} in queue</p>
                    <p className="text-xs text-slate-400">~{dept.avg_service_time_minutes}m/person</p>
                  </div>
                  <Link
                    to={`/services/${center.id}/join?dept=${dept.id}`}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    Join
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 sm:px-6 pb-5">
        <Link
          to={`/services/${center.id}/join`}
          id={`join-${center.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Join Queue <ChevronRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = DEMO_SERVICE_CENTERS.filter((c) => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.category === category;
    return matchSearch && matchCat;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Service Centers</h1>
          <p className="text-slate-500 text-sm">Discover and join virtual queues at nearby service centers</p>
        </motion.div>

        {/* Search & filter */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="service-search"
              type="text"
              placeholder="Search hospitals, banks, universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-all shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium">
                Clear
              </button>
            )}
          </div>

          {/* Category filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border',
                  category === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                )}
              >
                <span>{categoryIcons[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-5">
          <Filter size={14} className="text-slate-400" />
          <span className="text-sm text-slate-500">
            Showing <strong className="text-slate-700">{filtered.length}</strong> service center{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((center, i) => (
            <motion.div
              key={center.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ServiceCenterCard center={center} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No services found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Demo notice */}
        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <p className="text-xs text-indigo-600 text-center">
            📌 <strong>Demo Mode:</strong> These are illustrative service centers for hackathon demonstration. Queue sizes and wait times are simulated.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

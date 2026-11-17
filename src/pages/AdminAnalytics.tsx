import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Brain, TrendingUp, Clock, Users, Download, Calendar } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_ANALYTICS_DATA, DEMO_HOURLY_DATA, DEMO_AI_INSIGHT } from '../data/demo';

const COLORS = ['#4f46e5', '#06b6d4', '#059669', '#d97706', '#ef4444'];

const pieData = [
  { name: 'Completed', value: 165 },
  { name: 'Waiting', value: 34 },
  { name: 'Skipped', value: 4 },
];

export default function AdminAnalytics() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
              <p className="text-slate-500 text-sm mt-0.5">AI-powered queue performance analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600">
                <Calendar size={14} />
                Last 7 days
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                <Download size={14} /> Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Served (7d)', value: '967', trend: '+12%', up: true, icon: Users, color: '#4f46e5' },
            { label: 'Avg. Wait Time', value: '14.9m', trend: '-18%', up: false, icon: Clock, color: '#059669' },
            { label: 'Peak Day', value: 'Mon', trend: '203 tokens', up: true, icon: TrendingUp, color: '#2563eb' },
            { label: 'Avg. Satisfaction', value: '4.4/5', trend: '+0.2', up: true, icon: Brain, color: '#d97706' },
          ].map(({ label, value, trend, up, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}18` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                  {trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Daily served chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-slate-900">Daily Queue Volume</h3>
                <p className="text-xs text-slate-400 mt-0.5">Tokens served per day</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={DEMO_ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="colorServed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                  labelFormatter={(v) => `Date: ${v}`}
                />
                <Area type="monotone" dataKey="total_served" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorServed)" name="Served" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="font-bold text-slate-900 mb-1">Token Status</h3>
            <p className="text-xs text-slate-400 mb-4">Today's distribution</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {pieData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-slate-600">{entry.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Hourly heatmap / bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="font-bold text-slate-900 mb-1">Hourly Token Volume</h3>
            <p className="text-xs text-slate-400 mb-5">Today's hour-by-hour breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DEMO_HOURLY_DATA} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="tokens" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Tokens" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Avg wait time trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="font-bold text-slate-900 mb-1">Average Wait Time</h3>
            <p className="text-xs text-slate-400 mb-5">Minutes per day (last 7 days)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DEMO_ANALYTICS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} unit="m" />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                  formatter={(v) => [`${v} min`, 'Avg Wait']}
                />
                <Line
                  type="monotone"
                  dataKey="avg_wait_minutes"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ fill: '#06b6d4', r: 4 }}
                  name="Avg Wait"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* AI Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-3xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">AI Deep Analysis</h3>
                <p className="text-indigo-200 text-sm">Powered by Google Gemini AI · {DEMO_AI_INSIGHT.confidence}% confidence</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white/10 rounded-2xl p-4">
                <p className="text-indigo-200 text-xs mb-2 font-medium">PATTERN ANALYSIS</p>
                <p className="text-white text-sm leading-relaxed">{DEMO_AI_INSIGHT.analysis}</p>
              </div>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-indigo-200 text-xs mb-1 font-medium">PREDICTION</p>
                  <p className="text-white text-sm">{DEMO_AI_INSIGHT.prediction}</p>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-400/30 rounded-2xl p-4">
                  <p className="text-emerald-200 text-xs mb-1 font-medium">RECOMMENDATION</p>
                  <p className="text-emerald-100 text-sm">{DEMO_AI_INSIGHT.recommendation}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-indigo-300">
                📌 <strong className="text-white">AI Disclaimer:</strong> This analysis is generated by Google Gemini AI based on demo data patterns. For production use, connect to live Supabase data for accurate predictions.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

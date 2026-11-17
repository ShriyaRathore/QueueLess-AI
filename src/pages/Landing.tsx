import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap, ArrowRight, Clock, Users, Building2, CheckCircle,
  Smartphone, Bell, Brain, BarChart3, Shield, Globe,
  Star, ChevronRight, Ticket, MapPin, TrendingUp
} from 'lucide-react';
import { LandingNavbar } from '../components/layout';
import { LANDING_STATS } from '../data/demo';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const formatted = target >= 1000
    ? `${(target / 1000).toFixed(0)}K+`
    : `${target}${suffix}`;
  return <span>{formatted}</span>;
}

const features = [
  {
    icon: Ticket,
    title: 'Virtual Token Generation',
    description: 'Get a unique digital token instantly. No physical queues, no standing in line.',
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Queue Tracking',
    description: 'Watch your position update live. Know exactly where you are at all times.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: Brain,
    title: 'AI Wait-Time Prediction',
    description: 'Powered by Google Gemini AI for intelligent, accurate estimated wait times.',
    color: '#06b6d4',
    bg: '#ecfeff',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get alerted when your turn is approaching. Never miss your slot again.',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: Building2,
    title: 'Multi-Service Support',
    description: 'Hospitals, banks, universities, government offices — all in one platform.',
    color: '#059669',
    bg: '#ecfdf5',
  },
  {
    icon: BarChart3,
    title: 'Admin Analytics',
    description: 'Real-time dashboards and AI-powered insights for service administrators.',
    color: '#d97706',
    bg: '#fffbeb',
  },
];

const steps = [
  {
    step: '01',
    title: 'Select a Service',
    description: 'Browse nearby service centers and choose the department you need.',
    icon: MapPin,
  },
  {
    step: '02',
    title: 'Generate Your Token',
    description: 'Get a unique digital token with your queue position instantly.',
    icon: Ticket,
  },
  {
    step: '03',
    title: 'Track Your Position',
    description: 'Watch your position update in real-time from anywhere.',
    icon: TrendingUp,
  },
  {
    step: '04',
    title: 'Get Notified',
    description: 'Receive alerts when your turn is approaching. Walk in just in time.',
    icon: Bell,
  },
];

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Hospital Administrator',
    org: 'City Care Hospital',
    avatar: 'P',
    color: '#ef4444',
    text: 'QueueLess AI reduced our OPD wait times by 40%. Patients no longer crowd the waiting room, and our staff workflow has improved dramatically.',
    stars: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Bank Customer',
    org: 'Smart Banking Center',
    avatar: 'R',
    color: '#2563eb',
    text: 'I joined the queue while having my morning coffee. By the time I arrived at the bank, I was next! This app is a game-changer.',
    stars: 5,
  },
  {
    name: 'Ananya Singh',
    role: 'Student',
    org: 'State University',
    avatar: 'A',
    color: '#7c3aed',
    text: 'No more wasting 2 hours at the admin office. I book my slot remotely, track it on my phone, and show up only when it\'s my turn.',
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-50 to-transparent rounded-full blur-3xl -z-10 opacity-70" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl -z-10 opacity-60" />
        <div className="absolute top-40 left-0 w-56 h-56 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-center lg:text-left"
            >
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full border border-indigo-100 mb-6">
                  <Zap size={14} className="text-indigo-500" />
                  AI-Powered Queue Management
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6"
              >
                Your Time Matters.{' '}
                <span className="gradient-text">Skip the Queue.</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-slate-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                Book your virtual spot, track your turn live, and spend less time waiting.
                AI-powered predictions ensure you arrive at exactly the right moment.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Join a Queue <ArrowRight size={18} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Explore How It Works
                </a>
              </motion.div>

              {/* Trust badges */}
              <motion.div variants={fadeUp} className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['bg-indigo-400', 'bg-cyan-400', 'bg-purple-400', 'bg-emerald-400'].map((c, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-amber-400 mb-0.5">
                    {Array(5).fill(0).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                  <p className="text-xs text-slate-500">Trusted by <strong className="text-slate-700">50,000+</strong> users</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              {/* Main token card */}
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 shadow-2xl shadow-indigo-300/40">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-indigo-200 text-xs font-medium mb-0.5">Digital Token</p>
                      <p className="text-white font-bold text-sm">City Care Hospital · OPD</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded-xl">
                      <Ticket className="text-white" size={20} />
                    </div>
                  </div>

                  <div className="text-center py-6">
                    <div className="inline-block relative">
                      <div className="text-7xl font-black text-white tracking-tight">A042</div>
                      <div className="absolute -right-3 -top-3 h-4 w-4 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>
                    <p className="text-indigo-200 text-sm mt-2">Your Queue Number</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { label: 'Position', value: '#7', icon: Users },
                      { label: 'Est. Wait', value: '24m', icon: Clock },
                      { label: 'Status', value: 'Active', icon: CheckCircle },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="bg-white/10 rounded-2xl p-3 text-center">
                        <Icon size={14} className="text-indigo-200 mx-auto mb-1" />
                        <p className="text-white font-bold text-sm">{value}</p>
                        <p className="text-indigo-300 text-xs">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating notification card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3"
                >
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Bell size={16} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Your turn soon!</p>
                    <p className="text-xs text-slate-400">3 people ahead of you</p>
                  </div>
                </motion.div>

                {/* AI insight badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <Brain size={12} className="text-indigo-600" />
                    </div>
                    <span className="text-xs font-semibold text-indigo-600">AI Prediction</span>
                  </div>
                  <p className="text-xs text-slate-500">Queue moves fast today</p>
                  <p className="text-xs font-bold text-emerald-600">Save 34 min ✓</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { label: 'People Served', value: LANDING_STATS.total_served, suffix: '+', icon: Users, color: '#818cf8' },
              { label: 'Minutes Saved on Avg.', value: LANDING_STATS.avg_wait_saved, suffix: 'min', icon: Clock, color: '#34d399' },
              { label: 'Active Service Centers', value: LANDING_STATS.active_centers, suffix: '+', icon: Building2, color: '#60a5fa' },
              { label: 'Queues Today', value: LANDING_STATS.completed_today, suffix: '+', icon: CheckCircle, color: '#f59e0b' },
            ].map(({ label, value, suffix, icon: Icon, color }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={value} suffix={suffix} />
                </div>
                <p className="text-slate-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 font-semibold text-sm mb-3">
              PLATFORM FEATURES
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Everything you need to{' '}
              <span className="gradient-text">eliminate waiting</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 max-w-2xl mx-auto">
              A complete virtual queue platform built with modern AI, real-time updates,
              and a seamless experience for both users and administrators.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className="p-3 rounded-xl w-fit mb-4"
                  style={{ backgroundColor: feature.bg }}
                >
                  <feature.icon size={22} style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 font-semibold text-sm mb-3">
              HOW IT WORKS
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Join a queue in <span className="gradient-text">4 simple steps</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            {/* connector line */}
            <div className="hidden lg:block absolute top-14 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />

            {steps.map((step, i) => (
              <motion.div key={step.step} variants={fadeUp} className="text-center relative">
                <div className="relative inline-flex items-center justify-center mb-5">
                  <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                    <step.icon size={26} className="text-indigo-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-7 w-7 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Get Started Free <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Highlight Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white text-sm font-semibold rounded-full mb-6 border border-white/20">
                <Brain size={14} />
                Powered by Google Gemini AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">
                Intelligent wait-time prediction that actually works
              </h2>
              <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
                Our AI analyzes historical queue patterns, current load, service times,
                and peak hours to give you highly accurate predictions — not guesswork.
              </p>
              <ul className="space-y-3">
                {[
                  'Analyzes 30-day historical patterns',
                  'Adapts to real-time queue velocity',
                  'Natural language queue insights',
                  'Fallback algorithm when AI is offline',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-indigo-100">
                    <div className="h-5 w-5 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={12} className="text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Brain size={18} className="text-cyan-300" />
                </div>
                <div>
                  <p className="text-white font-semibold">AI Queue Analysis</p>
                  <p className="text-indigo-300 text-xs">City Care Hospital · OPD</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30">
                    87% confident
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4">
                  <p className="text-indigo-200 text-xs mb-1">AI Insight</p>
                  <p className="text-white text-sm leading-relaxed">
                    "Queue load is moderately high today. Expect slightly longer wait times
                    between 10 AM – 12 PM. Queue is moving at steady pace."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-indigo-300 text-xs mb-1">Predicted Wait</p>
                    <p className="text-white text-xl font-bold">24 min</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-indigo-300 text-xs mb-1">Recommendation</p>
                    <p className="text-emerald-300 text-sm font-semibold">Visit after 2 PM</p>
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-indigo-300 text-xs mb-2">Peak Hours Today</p>
                  <div className="flex gap-1.5">
                    {['8', '9', '10', '11', '12', '1', '2', '3', '4', '5'].map((h, i) => (
                      <div key={h} className="flex-1">
                        <div
                          className={`rounded-sm mb-1 ${[2, 3, 4].includes(i) ? 'bg-amber-400' : 'bg-white/20'}`}
                          style={{ height: [2, 3, 4].includes(i) ? '32px' : `${8 + Math.random() * 16}px` }}
                        />
                        <p className="text-indigo-400 text-[9px] text-center">{h}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="about" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-indigo-600 font-semibold text-sm mb-3">
              TESTIMONIALS
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              What people are saying
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-400 text-sm">
              * These are illustrative demo testimonials for hackathon presentation purposes.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="flex text-amber-400 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role} · {t.org}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-5">
              Ready to skip the queue?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of people who have already said goodbye to waiting in line.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-0.5"
              >
                Get Started — It's Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all"
              >
                <Smartphone size={18} />
                Demo Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-indigo-600 rounded-lg">
                  <Zap size={16} className="text-white" />
                </div>
                <span className="font-bold text-white">QueueLess AI</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Intelligent virtual queue management system. Skip the line, save time, stay informed.
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs">
                <Globe size={12} />
                <span>Built for AI Hackathon 2026 · Demo Application</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-white text-sm mb-3">Quick Links</p>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p>© 2026 QueueLess AI · All rights reserved.</p>
            <p>Powered by <span className="text-indigo-400">Google Gemini AI</span> · Built with <span className="text-cyan-400">React + FastAPI</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

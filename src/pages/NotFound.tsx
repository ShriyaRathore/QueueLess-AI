import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight, Zap } from 'lucide-react';
import { LandingNavbar } from '../components/layout';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      <LandingNavbar />
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          {/* Giant 404 */}
          <div className="relative mb-8 inline-block">
            <span className="text-[9rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 text-[9rem] font-black text-indigo-500/10 blur-2xl leading-none select-none">
              404
            </div>
          </div>

          <div className="p-3 bg-indigo-500/10 rounded-2xl w-fit mx-auto mb-6 border border-indigo-500/20">
            <Zap size={32} className="text-indigo-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
          <p className="text-slate-400 text-base leading-relaxed mb-8">
            Looks like this queue doesn't exist. The page you're looking for has either moved or never existed.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-900/50"
            >
              <Home size={16} /> Back to Home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-slate-300 font-semibold rounded-xl hover:bg-white/5 transition-colors"
            >
              Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl"><Zap size={20} className="text-white" /></div>
            <span className="font-bold text-white text-xl">QueueLess <span className="text-indigo-400">AI</span></span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Reset password</h1>
                <p className="text-slate-500 text-sm">Enter your email and we'll send reset instructions.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 hover:border-slate-300 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {loading
                    ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Send Reset Link</span><ArrowRight size={16} /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="p-4 bg-emerald-50 rounded-2xl w-fit mx-auto mb-5">
                <CheckCircle size={36} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your email</h2>
              <p className="text-slate-500 text-sm mb-6">
                If <strong>{email}</strong> is registered, we've sent a password reset link. Check your inbox.
              </p>
              <div className="p-3 bg-indigo-50 rounded-xl mb-5">
                <p className="text-xs text-indigo-600">
                  <strong>Demo mode:</strong> No real email is sent. Use demo@queueless.ai / demo123 to login.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-5">
            <Link to="/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

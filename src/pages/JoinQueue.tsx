import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, ChevronRight, Clock, Users, Brain, CheckCircle,
  ArrowLeft, AlertCircle, Zap, MapPin
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { DEMO_SERVICE_CENTERS, DEMO_AI_INSIGHT, DEMO_ACTIVE_TOKEN } from '../data/demo';
import { useQueueStore, useAuthStore } from '../store';
import { Department, Token } from '../types';
import toast from 'react-hot-toast';

type Step = 'select-dept' | 'confirm' | 'generating' | 'success';

export default function JoinQueuePage() {
  const { id: centerId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setActiveToken, addNotification } = useQueueStore();

  const center = DEMO_SERVICE_CENTERS.find((c) => c.id === centerId) || DEMO_SERVICE_CENTERS[0];
  const preSelectedDept = searchParams.get('dept');

  const [step, setStep] = useState<Step>(preSelectedDept ? 'confirm' : 'select-dept');
  const [selectedDept, setSelectedDept] = useState<Department | null>(
    preSelectedDept ? center.departments.find((d) => d.id === preSelectedDept) || null : null
  );
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSelectDept = (dept: Department) => {
    setSelectedDept(dept);
    setStep('confirm');
  };

  const handleJoinQueue = async () => {
    if (!selectedDept || !user) return;
    setStep('generating');

    // Simulate token generation + AI analysis
    await new Promise((r) => setTimeout(r, 1200));

    setAiLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setAiLoading(false);

    const tokenNum = Math.floor(40 + Math.random() * 20);
    const letters = ['A', 'B', 'C', 'D'];
    const tokenCode = `${letters[Math.floor(Math.random() * letters.length)]}${String(tokenNum).padStart(3, '0')}`;
    const posAhead = Math.floor(5 + Math.random() * 10);

    const token: Token = {
      id: `tok-${Date.now()}`,
      token_number: tokenNum,
      token_code: tokenCode,
      queue_id: `q-${Date.now()}`,
      user_id: user.id,
      department_id: selectedDept.id,
      department_name: selectedDept.name,
      service_center_id: center.id,
      service_center_name: center.name,
      status: 'waiting',
      position_ahead: posAhead,
      estimated_wait_minutes: posAhead * selectedDept.avg_service_time_minutes,
      joined_at: new Date().toISOString(),
      ai_insight: DEMO_AI_INSIGHT.analysis,
    };

    setGeneratedToken(token);
    setActiveToken(token);
    setStep('success');

    addNotification({
      type: 'success',
      title: `Token ${tokenCode} Generated!`,
      message: `You are #${posAhead + 1} in the queue at ${center.name}.`,
      read: false,
    });

    toast.success(`Token ${tokenCode} issued!`, { icon: '🎫' });
  };

  const handleCancel = () => {
    if (step === 'confirm') {
      setStep('select-dept');
      setSelectedDept(null);
    } else {
      navigate(-1);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-6 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Services
        </button>

        {/* Center header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${center.logo_color}18` }}
          >
            🏥
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{center.name}</h1>
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              <MapPin size={12} />
              <span>{center.address}</span>
            </div>
          </div>
        </div>

        {/* Step: Select Department */}
        <AnimatePresence mode="wait">
          {step === 'select-dept' && (
            <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <h2 className="font-bold text-slate-900 mb-1">Select a Department</h2>
              <p className="text-slate-500 text-sm mb-5">Choose the department you need service from</p>
              <div className="space-y-3">
                {center.departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => handleSelectDept(dept)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group text-left"
                  >
                    <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                      <Ticket size={18} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{dept.name}</p>
                      <p className="text-sm text-slate-500">{dept.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users size={11} /> {dept.current_queue_size} in queue
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={11} /> ~{dept.avg_service_time_minutes}m avg.
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && selectedDept && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-bold text-slate-900 mb-1">Confirm Your Queue</h2>
              <p className="text-slate-500 text-sm mb-6">Review the details before joining</p>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Service Center</span>
                  <span className="text-sm font-semibold text-slate-900">{center.name}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Department</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedDept.name}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Current Queue</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedDept.current_queue_size} people</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Estimated Wait</span>
                  <span className="text-sm font-bold text-indigo-600">~{selectedDept.current_queue_size * selectedDept.avg_service_time_minutes} minutes</span>
                </div>
              </div>

              {/* AI Preview */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={15} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">AI Recommendation</span>
                  <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">87% confident</span>
                </div>
                <p className="text-sm text-indigo-600 leading-relaxed">{DEMO_AI_INSIGHT.recommendation}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  id="confirm-join-btn"
                  onClick={handleJoinQueue}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
                >
                  <Zap size={16} /> Confirm & Join Queue
                </button>
              </div>

              <p className="text-xs text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
                <AlertCircle size={11} />
                You can cancel your token anytime before being called
              </p>
            </motion.div>
          )}

          {/* Step: Generating */}
          {step === 'generating' && (
            <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="h-20 w-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mx-auto" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={24} className="text-indigo-600" />
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                {aiLoading ? 'AI is analyzing your queue...' : 'Generating your token...'}
              </h3>
              <p className="text-slate-400 text-sm">
                {aiLoading ? 'Processing historical patterns and current load' : 'Securing your place in the virtual queue'}
              </p>
            </motion.div>
          )}

          {/* Step: Success */}
          {step === 'success' && generatedToken && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-4 border border-emerald-100">
                  <CheckCircle size={16} /> Token Issued Successfully
                </div>
                <h2 className="text-2xl font-bold text-slate-900">You're in the queue!</h2>
              </div>

              {/* Token card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-7 text-white text-center mb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <p className="text-indigo-200 text-sm mb-1">Your Token Number</p>
                  <div className="text-8xl font-black tracking-tight my-4 token-pulse">
                    {generatedToken.token_code}
                  </div>
                  <p className="text-indigo-200 text-sm">{generatedToken.department_name} · {generatedToken.service_center_name}</p>
                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="bg-white/10 rounded-2xl p-3">
                      <p className="text-white font-bold text-lg">{generatedToken.position_ahead}</p>
                      <p className="text-indigo-200 text-xs">Ahead of you</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3">
                      <p className="text-white font-bold text-lg">~{generatedToken.estimated_wait_minutes}m</p>
                      <p className="text-indigo-200 text-xs">Wait time</p>
                    </div>
                    <div className="bg-white/10 rounded-2xl p-3">
                      <p className="text-white font-bold text-lg">Active</p>
                      <p className="text-indigo-200 text-xs">Status</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} className="text-indigo-600" />
                  <span className="text-sm font-semibold text-indigo-700">AI Analysis</span>
                </div>
                <p className="text-sm text-indigo-600 leading-relaxed">{DEMO_AI_INSIGHT.analysis}</p>
              </div>

              <div className="flex flex-col gap-3">
                <Link
                  to={`/token/${generatedToken.id}`}
                  id="view-token-btn"
                  className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Track Live Position <ChevronRight size={16} />
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

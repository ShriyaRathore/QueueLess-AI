import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Save, Key } from 'lucide-react';
import { AppLayout } from '../components/layout';
import { useAuthStore } from '../store';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name: form.name, email: form.email });
    toast.success('Profile updated!');
    setSaving(false);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500 text-sm">Manage your account information</p>
        </motion.div>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-black">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 p-1.5 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors">
                <Camera size={12} />
              </button>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <span className={`inline-block mt-1.5 px-3 py-0.5 text-xs font-semibold rounded-full ${user?.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-indigo-50 text-indigo-700'}`}>
                {user?.role === 'admin' ? '🛡 Administrator' : '👤 Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><User size={16} /> Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Shield size={16} /> Security</h3>
          <div className="p-4 bg-slate-50 rounded-xl flex items-center gap-3">
            <Key size={16} className="text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">Password</p>
              <p className="text-xs text-slate-400">Last changed: Never (Demo mode)</p>
            </div>
            <button className="ml-auto text-sm text-indigo-600 font-semibold hover:underline">Change</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

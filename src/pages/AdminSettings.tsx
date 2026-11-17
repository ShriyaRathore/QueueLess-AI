import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Database, Palette, Globe, Save, Zap, CheckCircle } from 'lucide-react';
import { AppLayout } from '../components/layout';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

type Section = 'notifications' | 'security' | 'database' | 'display' | 'general';

const sections: { key: Section; label: string; icon: typeof Bell }[] = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'display', label: 'Display', icon: Palette },
];

function SettingRow({
  label, description, children,
}: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-slate-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ defaultOn = false, onLabel = 'Enabled', offLabel = 'Disabled' }: { defaultOn?: boolean; onLabel?: string; offLabel?: string }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => { setOn(o => !o); toast(on ? offLabel : onLabel, { icon: on ? '🔴' : '🟢' }); }}
      className={clsx('relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none', on ? 'bg-indigo-600' : 'bg-slate-200')}
    >
      <span className={clsx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200', on ? 'translate-x-5' : 'translate-x-0.5')} />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('general');
  const [geminiKey, setGeminiKey] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600));
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure system-wide settings for QueueLess AI</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
              {sections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 last:mb-0',
                    activeSection === key
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <Icon size={16} className={activeSection === key ? 'text-indigo-500' : 'text-slate-400'} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* General */}
              {activeSection === 'general' && (
                <div>
                  <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Globe size={16} /> General Settings</h2>
                  <SettingRow label="System Name" description="Display name for the platform">
                    <input defaultValue="QueueLess AI" className="w-44 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </SettingRow>
                  <SettingRow label="Default Language" description="Language for user-facing text">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Timezone" description="All timestamps shown in this timezone">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                      <option>IST (UTC+5:30)</option>
                      <option>UTC</option>
                      <option>EST (UTC-5)</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Demo Mode" description="Show demo banners and use seeded data">
                    <Toggle defaultOn />
                  </SettingRow>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <div>
                  <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Bell size={16} /> Notification Settings</h2>
                  <SettingRow label="Turn Approaching Alert" description="Notify user when N people are ahead">
                    <input type="number" defaultValue={3} className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-center focus:outline-none focus:border-indigo-500" />
                  </SettingRow>
                  <SettingRow label="Email Notifications" description="Send token status updates via email">
                    <Toggle />
                  </SettingRow>
                  <SettingRow label="Browser Push Notifications" description="Push notifications in supported browsers">
                    <Toggle defaultOn />
                  </SettingRow>
                  <SettingRow label="Admin Alerts" description="Notify admin when queue exceeds threshold">
                    <Toggle defaultOn />
                  </SettingRow>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Shield size={16} /> Security Settings</h2>
                  <SettingRow label="JWT Token Expiry" description="Authentication token lifetime">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                      <option>24 hours</option>
                      <option>7 days</option>
                      <option>30 days</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Two-Factor Auth" description="Require 2FA for admin logins">
                    <Toggle />
                  </SettingRow>
                  <SettingRow label="IP Rate Limiting" description="Limit API requests per IP per minute">
                    <Toggle defaultOn />
                  </SettingRow>
                  <SettingRow label="CORS Whitelist" description="Allowed frontend origins">
                    <input defaultValue="localhost:5173" className="w-44 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
                  </SettingRow>
                </div>
              )}

              {/* Database */}
              {activeSection === 'database' && (
                <div>
                  <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Database size={16} /> Database & AI Configuration</h2>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-5 text-sm text-amber-700">
                    ⚠️ Demo mode is using <strong>SQLite</strong>. Add Supabase credentials below to switch to PostgreSQL for production.
                  </div>
                  <SettingRow label="Supabase URL" description="Your Supabase project URL">
                    <input
                      type="text"
                      value={supabaseUrl}
                      onChange={e => setSupabaseUrl(e.target.value)}
                      placeholder="https://abc.supabase.co"
                      className="w-56 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-300"
                    />
                  </SettingRow>
                  <SettingRow label="Gemini API Key" description="Google Gemini AI for queue insights">
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value={geminiKey}
                        onChange={e => setGeminiKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-44 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-300"
                      />
                      {geminiKey && <Zap size={14} className="text-indigo-500" />}
                    </div>
                  </SettingRow>
                  <SettingRow label="AI Fallback" description="Use math prediction when AI is unavailable">
                    <Toggle defaultOn />
                  </SettingRow>
                </div>
              )}

              {/* Display */}
              {activeSection === 'display' && (
                <div>
                  <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2"><Palette size={16} /> Display Settings</h2>
                  <SettingRow label="Dark Mode" description="Dark theme for the admin interface">
                    <Toggle />
                  </SettingRow>
                  <SettingRow label="Compact View" description="Reduce padding for denser layouts">
                    <Toggle />
                  </SettingRow>
                  <SettingRow label="Animations" description="Enable page transitions and micro-animations">
                    <Toggle defaultOn />
                  </SettingRow>
                  <SettingRow label="Items Per Page" description="Rows shown in queue tables">
                    <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </SettingRow>
                </div>
              )}

              {/* Save button */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
                </button>
                <p className="text-xs text-slate-400">Settings are saved to .env in production</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

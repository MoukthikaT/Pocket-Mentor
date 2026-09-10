import React, { useState } from 'react';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Settings as SettingsIcon, Bell, Moon, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEffects: true,
    emailNotifications: true,
    dailyReminders: true,
    streakAlerts: true,
    publicProfile: false,
    aiPersonalization: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="teal" icon={SettingsIcon}>Preferences</Badge>}
          title="App Settings"
          description="Configure your appearance preferences, notification alerts, study reminders, and privacy controls."
        />

        <div className="max-w-3xl space-y-6">
          {/* Appearance Section */}
          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Moon size={18} className="text-[#218DAE]" /> Appearance & Audio
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-slate-800">Gamification Sound Effects</span>
                  <p className="text-xs text-slate-500">Play audio triggers for XP gains, boss damage, and victory screens.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('soundEffects')}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${settings.soundEffects ? 'bg-[#218DAE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.soundEffects ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>

          {/* Notifications & Reminders */}
          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Bell size={18} className="text-[#2BBBD7]" /> Study Reminders & Alerts
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-slate-800">Daily Study Reminders</span>
                  <p className="text-xs text-slate-500">Receive notifications at your preferred study time.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('dailyReminders')}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${settings.dailyReminders ? 'bg-[#218DAE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.dailyReminders ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-sm text-slate-800">Streak Protection Alerts</span>
                  <p className="text-xs text-slate-500">Get notified before your streak expires at midnight.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('streakAlerts')}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${settings.streakAlerts ? 'bg-[#218DAE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.streakAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>

          {/* Privacy & AI */}
          <Card hoverEffect={false}>
            <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Shield size={18} className="text-emerald-600" /> Privacy & AI Personalization
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-slate-800">AI Personalization Engine</span>
                  <p className="text-xs text-slate-500">Allow AI Mentor to analyze past quiz mistakes to refine your weak topic missions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle('aiPersonalization')}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${settings.aiPersonalization ? 'bg-[#218DAE]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.aiPersonalization ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </Card>

          {saved && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 size={16} /> Settings saved!
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} icon={Sparkles}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../hooks/useAuth';
import { saveProfile } from '../services/learningApi';
import {
  User,
  GraduationCap,
  Calendar,
  Sliders,
  Trophy,
  Lock,
  Download,
  Trash2,
  LogOut,
  Sparkles,
  CheckCircle2,
  Mail,
  Zap,
  Flame,
  Swords,
  Users
} from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Johnson',
    email: user?.email || 'student@university.edu',
    username: '',
    college: '',
    year: '',
    course: '',
    examType: user?.profile?.examType || '',
    examDate: user?.profile?.examDate ? new Date(user?.profile?.examDate).toISOString().split('T')[0] : '2026-10-15',
    targetScore: '',
    studyGoal: user?.profile?.studyGoal || '',
    preferredStyle: '',
    difficulty: '',
    dailyGoalMinutes: '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile({
        subjects: user?.profile?.subjects || [],
        examType: formData.examType,
        examDate: formData.examDate,
        studyGoal: formData.studyGoal,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'academic', label: 'Academic & Exam', icon: GraduationCap },
    { id: 'preferences', label: 'Learning Preferences', icon: Sliders },
    { id: 'progress', label: 'Progress Stats', icon: Trophy },
    { id: 'account', label: 'Account & Security', icon: Lock },
    { id: 'danger', label: 'Data & Danger Zone', icon: Trash2 },
  ];

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="teal" icon={User}>Account Management</Badge>}
          title="Student Account & Settings"
          description="Manage your student profile, academic targets, learning preferences, progress statistics, and security."
        />

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-[#218DAE] text-white shadow-md shadow-[#218DAE]/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Cards */}
        <Card hoverEffect={false} className="p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Tab 1: Profile */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2BBBD7] to-[#218DAE] flex items-center justify-center text-white font-display font-extrabold text-2xl shadow-md">
                    {(formData.name || 'S').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-slate-900">{formData.name}</h3>
                    <p className="text-xs text-slate-500">{formData.email}</p>
                    <Badge variant="cyan" className="mt-1">Level 1 Master Student</Badge>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Username</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      className="input-field bg-slate-50"
                      disabled
                      value={formData.email}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Academic & Exam */}
            {activeTab === 'academic' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b pb-3 border-slate-100">
                  Academic Profile & Exam Target
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">University / College</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Current Year / Grade</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Degree / Course</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Exam Type</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.examType}
                      onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Exam Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.examDate}
                      onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="label">Target Study Goal</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.studyGoal}
                      onChange={(e) => setFormData({ ...formData, studyGoal: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Learning Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b pb-3 border-slate-100">
                  Learning Preferences
                </h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Preferred Study Style</label>
                    <select
                      className="input-field"
                      value={formData.preferredStyle}
                      onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                    >
                      <option value="Feynman Method & Practice Problems">Roleplay Teaching (Feynman Method)</option>
                      <option value="Gamified Boss Battles">Gamified Boss Battles</option>
                      <option value="Flashcards & Summaries">Flashcards & Rapid Summaries</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Daily Revision Target (Minutes)</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.dailyGoalMinutes}
                      onChange={(e) => setFormData({ ...formData, dailyGoalMinutes: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Progress Stats */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b pb-3 border-slate-100">
                  Lifetime Progress & Statistics
                </h3>

                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F0F9FC] border border-[#2BBBD7]/20 text-center">
                    <Zap size={24} className="mx-auto text-[#218DAE] mb-1" />
                    <span className="font-display font-extrabold text-2xl text-slate-900 block">120</span>
                    <span className="text-xs text-slate-500 font-bold">Total XP</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFD758]/20 border border-[#FFD758]/40 text-center">
                    <Flame size={24} className="mx-auto text-[#8A6700] mb-1" />
                    <span className="font-display font-extrabold text-2xl text-slate-900 block">3 Days</span>
                    <span className="text-xs text-slate-500 font-bold">Active Streak</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                    <Swords size={24} className="mx-auto text-rose-600 mb-1" />
                    <span className="font-display font-extrabold text-2xl text-slate-900 block">2</span>
                    <span className="text-xs text-slate-500 font-bold">Bosses Defeated</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <Users size={24} className="mx-auto text-emerald-600 mb-1" />
                    <span className="font-display font-extrabold text-2xl text-slate-900 block">5</span>
                    <span className="text-xs text-slate-500 font-bold">Teaching Sessions</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Account & Security */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-slate-900 border-b pb-3 border-slate-100">
                  Security & Password
                </h3>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="label">Current Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                  <div>
                    <label className="label">New Password</label>
                    <input type="password" placeholder="••••••••" className="input-field" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Danger Zone */}
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <h3 className="font-display font-bold text-lg text-rose-600 border-b pb-3 border-slate-100">
                  Data & Account Actions
                </h3>

                <div className="space-y-4 max-w-md">
                  <Button variant="secondary" icon={Download} type="button" className="w-full">
                    Download My Revision Data (JSON)
                  </Button>
                  <Button variant="danger" icon={LogOut} onClick={logout} type="button" className="w-full">
                    Log Out of Pocket Mentor
                  </Button>
                </div>
              </div>
            )}

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                <CheckCircle2 size={16} /> Changes saved successfully!
              </div>
            )}

            {activeTab !== 'progress' && activeTab !== 'danger' && (
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button type="submit" loading={saving} icon={Sparkles}>
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
    </AppShell>
  );
}

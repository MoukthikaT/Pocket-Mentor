import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Sparkles,
  Brain,
  Users,
  Swords,
  Zap,
  Target,
  Trophy,
  User,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Flame,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../context/ThemeContext';

export default function AppShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/subjects', label: 'My Subjects', icon: BookOpen },
        { to: '/notes', label: 'My Notes', icon: FileText },
        { to: '/create-study', label: 'AI Revision', icon: Sparkles },
      ],
    },
    {
      title: 'AI LEARNING',
      items: [
        { to: '/challenge', label: 'AI Challenge', icon: Brain, badge: 'AI' },
        { to: '/teach', label: 'Teach a Friend', icon: Users, accent: 'cyan' },
        { to: '/boss-battle', label: 'Boss Battle', icon: Swords, accent: 'yellow' },
        { to: '/rescue', label: '5-Minute Rescue', icon: Flame, accent: 'rose' },
      ],
    },
    {
      title: 'PROGRESS',
      items: [
        { to: '/readiness', label: 'Exam Readiness', icon: ShieldCheck },
        { to: '/graveyard', label: 'Mistake Graveyard', icon: Target },
        { to: '/achievements', label: 'Achievements', icon: Trophy, accent: 'yellow' },
      ],
    },
  ];

  const bottomItems = [
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-body">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#0F172A] text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out
          ${collapsed ? 'w-[72px]' : 'w-[260px]'}
          ${mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
            onClick={() => { navigate('/dashboard'); closeMobile(); }}
          >
            <div className="brand-mark">P</div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-logo block text-white text-base leading-tight">
                  POCKET MENTOR
                </span>
                <span className="block text-[10px] font-semibold text-[#2BBBD7] tracking-widest uppercase">
                  AI Revision Assistant
                </span>
              </div>
            )}
          </div>

          <ThemeToggle compact />

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Stats Card (if not collapsed) */}
        {!collapsed && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800/90 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="avatar-ring">{firstName.charAt(0).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm text-white truncate">{user?.name || 'Student'}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1 text-[#FFD758] font-bold">
                    <Zap size={12} className="fill-[#FFD758]" /> Level 1
                  </span>
                  <span>•</span>
                  <span className="text-[#2BBBD7] font-semibold">120 XP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map(({ to, label, icon: Icon, badge, accent }) => {
                  const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeMobile}
                      title={collapsed ? label : undefined}
                      className={`
                        group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200
                        ${isActive
                          ? 'bg-[#218DAE] text-white shadow-md shadow-[#218DAE]/30'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        className={`
                          shrink-0 transition-colors
                          ${isActive ? 'text-white' : accent === 'cyan' ? 'text-[#2BBBD7]' : accent === 'yellow' ? 'text-[#FFD758]' : accent === 'rose' ? 'text-rose-400' : 'text-slate-400 group-hover:text-slate-200'}
                        `}
                      />
                      {!collapsed && <span className="truncate">{label}</span>}
                      {!collapsed && badge && (
                        <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#2BBBD7]/20 text-[#2BBBD7] border border-[#2BBBD7]/30">
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Profile & Settings */}
        <div className="p-3 border-t border-slate-800/80 space-y-1">
          {bottomItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <NavLink
                key={to}
                to={to}
                onClick={closeMobile}
                title={collapsed ? label : undefined}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition
                  ${isActive ? 'bg-[#218DAE] text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}
                `}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );
          })}

          <button
            onClick={logout}
            title={collapsed ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition text-left"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Shell */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
        {/* Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open Navigation"
            >
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/60">
              <span className="w-2 h-2 rounded-full bg-[#2BBBD7] animate-pulse"></span>
              <span>AI Mentor Online & Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick XP & Streak Display */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className="flex items-center gap-1 text-[#FFD758] drop-shadow-sm">
                <Flame size={15} className="fill-[#FFD758] text-[#FFD758]" /> 3 Day Streak
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-[#218DAE]">
                <Zap size={14} className="fill-[#2BBBD7] text-[#2BBBD7]" /> 120 XP
              </span>
            </div>

            {/* Profile Avatar */}
            <button
              onClick={() => navigate('/profile')}
              className="avatar-ring focus:outline-none focus:ring-2 focus:ring-[#2BBBD7]"
              title="View Profile"
            >
              {firstName.charAt(0).toUpperCase()}
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Layers,
  ChevronDown,
  Building2,
  Cpu,
  Search,
  MessageSquare,
  Scale,
  Settings,
  Kanban,
} from 'lucide-react';
import { CommodityMarketTicker } from './CommodityMarketTicker';

interface NavbarProps {
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSettings }) => {
  const {
    userRole,
    setUserRole,
    activeView,
    setActiveView,
    projects,
    activeProject,
    switchProject,
    openAiDrawer,
    comparisonManufacturerIds,
    messages,
    systemStatus,
    currentUser,
    loginWithGoogle,
    logout,
  } = useApp();

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <>
      <header className="sticky top-0 z-30 h-14 border-b border-white/[0.08] bg-[#090A0F]/90 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between">
      {/* Brand & Project Switcher */}
      <div className="flex items-center gap-4 lg:gap-6">
        <button
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 group text-left transition"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5533] to-[#C9381A] flex items-center justify-center shadow-lg shadow-[#FF5533]/20 group-hover:scale-105 transition-transform">
            <span className="font-mono font-bold text-white text-sm">B</span>
          </div>
          <span className="font-extrabold text-base tracking-tight text-white font-mono group-hover:text-white/90">
            bizovist
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            v2.4 • LIVE
          </span>
        </button>

        {/* Project Selector (when in founder mode) */}
        {userRole !== 'manufacturer' && projects.length > 0 && activeView !== 'landing' && (
          <div className="relative group">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs transition cursor-pointer">
              <Layers className="w-3.5 h-3.5 text-[#FF5533]" />
              <span className="font-medium text-white/90 max-w-[140px] truncate">
                {activeProject?.title || 'Select Project'}
              </span>
              <ChevronDown className="w-3 h-3 text-white/40" />
            </div>

            {/* Dropdown menu */}
            <div className="absolute left-0 top-full mt-1.5 w-64 p-1.5 rounded-lg bg-[#12141D] border border-white/[0.1] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-white/40 font-semibold">
                Active Projects ({projects.length})
              </div>
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    switchProject(proj.id);
                    setActiveView('projects');
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded text-xs transition flex items-center justify-between ${
                    proj.id === activeProject?.id
                      ? 'bg-[#FF5533]/15 text-[#FF5533] font-medium'
                      : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <span className="truncate">{proj.title}</span>
                  <span className="text-[10px] font-mono text-white/30 capitalize ml-2">
                    {proj.status.replace('_', ' ')}
                  </span>
                </button>
              ))}
              <div className="border-t border-white/[0.06] my-1" />
              <button
                onClick={() => setActiveView('home')}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-[#FF5533] hover:bg-[#FF5533]/10 font-medium transition flex items-center gap-1.5"
              >
                <span>+ Define New Manufacturing Journey</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Center status: AI Engine indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/40 font-mono text-[11px]">AI ENGINE:</span>
        <span className="text-white/90 font-mono text-[11px] font-semibold">
          {systemStatus?.geminiConfigured ? 'GEMINI 3.8 FLASH' : 'MANUFACTURING INTELLIGENCE'}
        </span>
      </div>

      {/* Right controls: Role switcher, AI Co-Founder CTA, Compare, Messages, Settings */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Production Pipeline Indicator */}
        {userRole === 'founder' && activeView !== 'landing' && (
          <button
            onClick={() => setActiveView('pipeline')}
            className={`btn-tactile flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition ${
              activeView === 'pipeline'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08]'
            }`}
            title="Golden Sample T1/T2 Milestone Pipeline"
          >
            <Kanban className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline text-xs font-mono">Pipeline</span>
          </button>
        )}

        {/* Comparison Indicator */}
        {comparisonManufacturerIds.length > 0 && activeView !== 'landing' && (
          <button
            onClick={() => setActiveView('comparison')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] transition"
            title="Compare manufacturers"
          >
            <Scale className="w-3.5 h-3.5 text-[#FF5533]" />
            <span className="font-mono text-xs">{comparisonManufacturerIds.length}</span>
            <span className="hidden sm:inline text-xs text-white/60">Compare</span>
          </button>
        )}

        {/* Role Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <button
            onClick={() => {
              setUserRole('founder');
              if (activeView === 'mfg-dashboard') setActiveView('home');
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              userRole === 'founder'
                ? 'bg-[#FF5533] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Founder
          </button>
          <button
            onClick={() => {
              setUserRole('manufacturer');
              setActiveView('mfg-dashboard');
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1 ${
              userRole === 'manufacturer'
                ? 'bg-[#FF5533] text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span className="hidden sm:inline">Manufacturer</span>
            <span className="sm:hidden">Mfg</span>
          </button>
        </div>

        {/* AI Co-Founder Trigger Button */}
        <button
          onClick={() => openAiDrawer()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ask Co-Founder</span>
          <span className="sm:hidden">AI</span>
        </button>

        {/* Firebase Google Auth button */}
        {currentUser ? (
          <div className="flex items-center gap-2 pl-1 border-l border-white/[0.08]">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'User'}
                className="w-7 h-7 rounded-full border border-white/20"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center border border-emerald-500/30">
                {currentUser.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <button
              onClick={() => logout()}
              className="text-[11px] text-white/40 hover:text-white font-mono transition hidden sm:inline"
              title="Sign out of Firebase"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => loginWithGoogle()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.08] transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Login</span>
          </button>
        )}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/[0.06] transition"
          title="System & API Status"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
    {activeView !== 'landing' && <CommodityMarketTicker />}
    </>
  );
};


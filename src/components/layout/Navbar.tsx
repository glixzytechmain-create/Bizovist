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
} from 'lucide-react';

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
  } = useApp();

  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-white/[0.08] bg-[#090A0F]/80 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between">
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
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider bg-white/[0.06] text-white/50 border border-white/[0.06]">
            v1.0
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
  );
};

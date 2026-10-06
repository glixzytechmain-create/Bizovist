import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Home,
  FolderKanban,
  Search,
  Scale,
  MessageSquare,
  Sparkles,
  Building2,
  Globe,
  SlidersHorizontal,
  BookmarkCheck,
  TrendingUp,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    userRole,
    activeView,
    setActiveView,
    comparisonManufacturerIds,
    shortlistedManufacturerIds,
    messages,
    openAiDrawer,
  } = useApp();

  const unreadMessages = messages.filter((m) => m.unread).length;

  const founderNavItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Workspace', icon: <Home className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover Facilities', icon: <Search className="w-4 h-4" /> },
    {
      id: 'comparison',
      label: 'Compare',
      icon: <Scale className="w-4 h-4" />,
      badge: comparisonManufacturerIds.length > 0 ? comparisonManufacturerIds.length : undefined,
    },
    {
      id: 'messages',
      label: 'Messages & RFQs',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: 'ai-workspace', label: 'AI Co-Founder', icon: <Sparkles className="w-4 h-4 text-[#FF5533]" /> },
  ];

  const mfgNavItems: { id: AppView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'mfg-dashboard', label: 'Buyer Demand Feed', icon: <TrendingUp className="w-4 h-4 text-emerald-400" /> },
    { id: 'mfg-site-preview', label: 'Business Presence', icon: <Globe className="w-4 h-4 text-cyan-400" /> },
    { id: 'discover', label: 'Market Intelligence', icon: <Search className="w-4 h-4" /> },
    {
      id: 'messages',
      label: 'Buyer Inquiries',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: 'ai-workspace', label: 'AI Commercial Advisor', icon: <Sparkles className="w-4 h-4 text-[#FF5533]" /> },
  ];

  const items = userRole === 'manufacturer' ? mfgNavItems : founderNavItems;

  return (
    <aside className="hidden lg:flex w-60 flex-col justify-between border-r border-white/[0.08] bg-[#0C0E15]/60 backdrop-blur-xl p-3 select-none">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-white/30 font-semibold">
            {userRole === 'manufacturer' ? 'Manufacturer Portal' : 'Founder Navigation'}
          </div>
          {items.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#FF5533]/15 text-[#FF5533] border border-[#FF5533]/30 shadow-sm'
                    : 'text-white/70 hover:bg-white/[0.04] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-[#FF5533]' : 'text-white/60'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isActive ? 'bg-[#FF5533] text-white' : 'bg-white/[0.1] text-white/80'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Shortlist panel for founders */}
        {userRole !== 'manufacturer' && (
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span className="flex items-center gap-1.5 font-mono">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#FF5533]" />
                SAVED FACILITIES
              </span>
              <span className="font-mono text-white/40">{shortlistedManufacturerIds.length}</span>
            </div>
            {shortlistedManufacturerIds.length === 0 ? (
              <p className="text-[11px] text-white/40 italic">No facilities saved yet.</p>
            ) : (
              <button
                onClick={() => setActiveView('discover')}
                className="text-[11px] text-[#FF5533] hover:underline font-medium block text-left"
              >
                View {shortlistedManufacturerIds.length} shortlisted candidate{shortlistedManufacturerIds.length > 1 ? 's' : ''} →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Contextual AI Callout */}
      <div className="pt-3 border-t border-white/[0.06]">
        <button
          onClick={() => openAiDrawer({ type: 'global' })}
          className="w-full p-3 rounded-lg bg-gradient-to-br from-[#171926] to-[#12141F] border border-white/[0.08] hover:border-[#FF5533]/40 transition text-left group"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-white group-hover:text-[#FF5533] transition">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5533]" />
            <span>AI Manufacturing Co-Founder</span>
          </div>
          <p className="text-[11px] text-white/50 mt-1 leading-relaxed">
            Instant guidance on tooling, unit economics, MOQs, and supplier vetting.
          </p>
        </button>
      </div>
    </aside>
  );
};

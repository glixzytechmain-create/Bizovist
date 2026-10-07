import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  FolderKanban,
  Search,
  Scale,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Kanban,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { userRole, activeView, setActiveView, comparisonManufacturerIds, messages, openAiDrawer } = useApp();

  const unreadMessages = messages.filter((m) => m.unread).length;

  if (activeView === 'landing') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090A0F]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => setActiveView(userRole === 'manufacturer' ? 'mfg-dashboard' : 'home')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded text-[10px] font-medium transition ${
          activeView === 'home' || activeView === 'mfg-dashboard'
            ? 'text-[#FF5533]'
            : 'text-white/60 hover:text-white'
        }`}
      >
        {userRole === 'manufacturer' ? <TrendingUp className="w-4 h-4" /> : <Home className="w-4 h-4" />}
        <span>{userRole === 'manufacturer' ? 'Demand' : 'Home'}</span>
      </button>

      {userRole === 'founder' && (
        <button
          onClick={() => setActiveView('pipeline')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded text-[10px] font-medium transition ${
            activeView === 'pipeline' ? 'text-amber-400 font-bold' : 'text-white/60 hover:text-white'
          }`}
        >
          <Kanban className="w-4 h-4 text-amber-400" />
          <span>Pipeline</span>
        </button>
      )}

      <button
        onClick={() => setActiveView('discover')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded text-[10px] font-medium transition ${
          activeView === 'discover' ? 'text-[#FF5533]' : 'text-white/60 hover:text-white'
        }`}
      >
        <Search className="w-4 h-4" />
        <span>Discover</span>
      </button>

      {/* Center AI action */}
      <button
        onClick={() => openAiDrawer()}
        className="flex flex-col items-center gap-0.5 -mt-4 bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white p-2.5 rounded-full shadow-lg shadow-[#FF5533]/30 active:scale-95 transition"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-[9px] font-bold">AI</span>
      </button>

      <button
        onClick={() => setActiveView('projects')}
        className={`flex flex-col items-center gap-1 p-1.5 rounded text-[10px] font-medium transition ${
          activeView === 'projects' || activeView === 'ai-understand'
            ? 'text-[#FF5533]'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <FolderKanban className="w-4 h-4" />
        <span>Projects</span>
      </button>

      <button
        onClick={() => setActiveView('messages')}
        className={`relative flex flex-col items-center gap-1 p-1.5 rounded text-[10px] font-medium transition ${
          activeView === 'messages' ? 'text-[#FF5533]' : 'text-white/60 hover:text-white'
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        <span>Messages</span>
        {unreadMessages > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#FF5533]" />
        )}
      </button>
    </nav>
  );
};

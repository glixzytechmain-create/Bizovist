import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { LandingPage } from './components/landing/LandingPage';
import { RoleSelectionModal } from './components/onboarding/RoleSelectionModal';
import { FounderHome } from './components/founder/FounderHome';
import { AiBomStudio } from './components/founder/AiBomStudio';
import { ProjectView } from './components/projects/ProjectView';
import { ManufacturerDiscovery } from './components/discovery/ManufacturerDiscovery';
import { ManufacturerComparison } from './components/comparison/ManufacturerComparison';
import { MessagesView } from './components/messages/MessagesView';
import { AiWorkspaceView } from './components/ai/AiWorkspaceView';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { ManufacturerSitePreview } from './components/manufacturer/ManufacturerSitePreview';
import { ManufacturerDetailModal } from './components/discovery/ManufacturerDetailModal';
import { AiCoFounderDrawer } from './components/ai/AiCoFounderDrawer';
import { ProfileSettingsModal } from './components/profile/ProfileSettingsModal';

function AppContent() {
  const { activeView } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans selection:bg-[#FF5533]/25 selection:text-[#FF7A59]">
      {/* Navbar (hidden on pure landing unless user navigates) */}
      <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main layout container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar for desktop when not on landing screen */}
        {activeView !== 'landing' && <Sidebar />}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          {activeView === 'landing' && <LandingPage />}
          {activeView === 'role-selection' && <RoleSelectionModal />}
          {activeView === 'home' && <FounderHome />}
          {activeView === 'ai-understand' && <AiBomStudio />}
          {activeView === 'projects' && <ProjectView />}
          {activeView === 'discover' && <ManufacturerDiscovery />}
          {activeView === 'comparison' && <ManufacturerComparison />}
          {activeView === 'messages' && <MessagesView />}
          {activeView === 'ai-workspace' && <AiWorkspaceView />}
          {activeView === 'mfg-dashboard' && <ManufacturerDashboard />}
          {activeView === 'mfg-site-preview' && <ManufacturerSitePreview />}
        </main>
      </div>

      {/* Mobile Navigation bar */}
      <MobileNav />

      {/* Global Modals & Persistent Contextual Drawer */}
      <ManufacturerDetailModal />
      <AiCoFounderDrawer />
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

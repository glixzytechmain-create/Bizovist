import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Info,
  Server,
  Layers,
} from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { systemStatus, refreshSystemStatus, userRole, setUserRole } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#07080C]/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#11131E] border border-white/[0.1] shadow-2xl space-y-5 text-left">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#FF5533]/20 text-[#FF5533]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System & AI Engine Intelligence</h3>
              <p className="text-xs text-white/50">Bizovist Production Infrastructure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-white/40 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Connected Infrastructure Panel */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-white/50 uppercase text-[10px]">Infrastructure Status:</span>
            <span className="inline-flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE & ACTIVE
            </span>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04] space-y-1.5 font-mono text-[11px] text-white/70">
            <div className="flex justify-between items-center">
              <span className="text-white/40">AI Engine:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Gemini 3.8 Flash (Active)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Database & Auth:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Firebase Firestore (gen-lang-client-0953455656)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Maps & Logistics:</span>
              <span className="text-cyan-300 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                Google Maps Platform API
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Spreadsheets & Export:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Google Sheets & Drive Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40">Architecture:</span>
              <span className="text-white">Server-side proxy (/api/*) + Cloud Firestore</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Production APIs & Firestore configured. User authentication, realtime RFQs, project BOMs, and Gemini AI queries are securely executed.
            </span>
          </div>
        </div>

        {/* Role Preference */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-white/40 font-semibold">
            Active Mode
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setUserRole('founder')}
              className={`p-3 rounded-xl border text-left font-medium transition ${
                userRole === 'founder'
                  ? 'border-[#FF5533] bg-[#FF5533]/15 text-[#FF5533]'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white'
              }`}
            >
              Founder Mode
            </button>
            <button
              onClick={() => setUserRole('manufacturer')}
              className={`p-3 rounded-xl border text-left font-medium transition ${
                userRole === 'manufacturer'
                  ? 'border-[#FF5533] bg-[#FF5533]/15 text-[#FF5533]'
                  : 'border-white/[0.08] bg-white/[0.02] text-white/60 hover:text-white'
              }`}
            >
              Manufacturer Mode
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <button
            onClick={() => refreshSystemStatus()}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recheck API Health</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

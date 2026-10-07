import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Plus,
  FolderKanban,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  Kanban,
  FileCheck2,
  Wrench,
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { LegalRfqModal } from '../rfq/LegalRfqModal';

export const FounderHome: React.FC = () => {
  const {
    projects,
    activeProject,
    setActiveProject,
    setActiveView,
    manufacturers,
    openManufacturerDetail,
    analyzeIdea,
    isInterpreting,
    openAiDrawer,
  } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isInterpreting) return;
    try {
      await analyzeIdea(promptInput);
    } catch {
      setActiveView('ai-understand');
    }
  };

  const recommendedMfg = manufacturers.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Welcome header & Large AI Input */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>FOUNDER WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Good morning, Founder
            </h1>
          </div>
          <div className="text-xs text-white/50 font-mono">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Large AI Workspace Input */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#131522] to-[#0E1019] border border-white/[0.1] shadow-2xl p-4 sm:p-6 transition-all focus-within:border-[#FF5533]/50 focus-within:ring-2 focus-within:ring-[#FF5533]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#FF5533] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              What are you building?
            </span>
            <span className="text-[11px] text-white/40 font-mono">
              Natural Language Intent Engine
            </span>
          </div>

          <form onSubmit={handleStartAnalysis}>
            <textarea
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Describe what you want to manufacture, materials, volume targets, or geometry... (e.g., 'Organic functional beverage in 250ml sleek cans with green tea caffeine, 20,000 units in India' or '5-axis CNC machined 6061 aluminium drone gimbal housing with Type III hard anodize, 1,000 units')"
              rows={3}
              className="w-full bg-transparent border-0 text-white placeholder-white/30 text-sm sm:text-base focus:ring-0 focus:outline-none resize-none leading-relaxed"
            />

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
                <span className="font-mono text-[10px] uppercase text-white/40">Try:</span>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'I want to launch an organic sparkling functional energy drink brand in 250ml sleek cans with green tea caffeine and adaptogens, initial trial run 20,000 cans in India.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] transition text-xs font-mono"
                >
                  RTD Beverage Canning
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Custom 5-axis CNC machined 6061-T6 aluminium drone gimbal cage with Type III hard anodizing and sub-10 micron bearing bores, MOQ 1,000 units.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] transition text-xs font-mono"
                >
                  5-Axis CNC Gimbal
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Class 10,000 cleanroom injection molded medical polypropylene fluidic diagnostics cartridge with ultrasonic welding, MOQ 15,000 units.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] transition text-xs font-mono"
                >
                  Medical Molding
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Thermoformed molded sugarcane bagasse outer protective clamshell with PFAS-free moisture barrier and debossed logo, MOQ 10,000 units.'
                    )
                  }
                  className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] transition text-xs font-mono"
                >
                  Bio-Pulp Packaging
                </button>
              </div>

              <button
                type="submit"
                disabled={isInterpreting || !promptInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 disabled:opacity-40 transition shrink-0"
              >
                {isInterpreting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Auditing Specifications...</span>
                  </>
                ) : (
                  <>
                    <span>Deconstruct & Match</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Precision Core Operations Quick-Launch Trays */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#FF5533]" />
            <span>Core Hardware Operations & Workflows</span>
          </span>
          <span className="text-[11px] font-mono text-white/40">
            Dedicated Engineering Tooling
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Production Pipeline */}
          <div
            onClick={() => setActiveView('pipeline')}
            className="panel-card-hover p-4 sm:p-5 rounded-2xl bg-[#0F121C] border border-white/[0.08] hover:border-amber-400/50 cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-amber-400">
                <Kanban className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                T1/T2 KANBAN
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition tracking-tight">
                Golden Sample Pipeline
              </h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Track physical progress from CAD Freeze to T1 tooling trial, CMM metrology, and SOP.
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>Phase: T1 Trial First Shot</span>
              <span className="text-amber-400 group-hover:underline">Open Pipeline →</span>
            </div>
          </div>

          {/* Card 2: Legal RFQ Packet */}
          <div
            onClick={() => setIsRfqModalOpen(true)}
            className="panel-card-hover p-4 sm:p-5 rounded-2xl bg-[#0F121C] border border-white/[0.08] hover:border-emerald-500/50 cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                MSA CONTRACT
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition tracking-tight">
                Official Legal RFQ Spec
              </h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Printable procurement packet with Tooling Ownership retention and &lt;1.8% defect caps.
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>Rev 1.0 Ready to Execute</span>
              <span className="text-emerald-400 group-hover:underline">Generate Packet →</span>
            </div>
          </div>

          {/* Card 3: AI Co-Founder BOM Studio */}
          <div
            onClick={() => setActiveView('ai-understand')}
            className="panel-card-hover p-4 sm:p-5 rounded-2xl bg-[#0F121C] border border-white/[0.08] hover:border-[#FF5533]/50 cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#FF5533]/15 border border-[#FF5533]/25 flex items-center justify-center text-[#FF5533]">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/20">
                GEMINI 2.5 FLASH
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white group-hover:text-[#FF5533] transition tracking-tight">
                AI Co-Founder BOM Studio
              </h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Deconstruct products into full bills of materials, tooling NRE, and tolerance requirements.
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-white/40">
              <span>Audio Briefing & Sheets</span>
              <span className="text-[#FF5533] group-hover:underline">Launch Studio →</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Recent Projects & Recommended Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#FF5533]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Recent Manufacturing Journeys
              </h3>
            </div>
            <button
              onClick={() => setActiveView('projects')}
              className="text-xs text-[#FF5533] hover:underline font-medium"
            >
              View all ({projects.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  setActiveView('projects');
                }}
                className="p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-[#FF5533]/40 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FF5533] transition">
                        {proj.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.06] text-white/60 border border-white/[0.06]">
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1 line-clamp-2 leading-relaxed">
                      {proj.summary}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition shrink-0 mt-1" />
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs text-white/40 font-mono">
                  <div className="flex items-center gap-4">
                    <span>
                      MOQ: <strong className="text-white/80">{proj.targetMOQ.toLocaleString()} {proj.moqUnit}</strong>
                    </span>
                    <span>
                      Target Cost: <strong className="text-white/80">{proj.targetUnitCost}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-400 font-medium">
                      {proj.requirements.filter((r) => r.status === 'confirmed').length} Confirmed
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">
                      {proj.requirements.filter((r) => r.status === 'needs_confirmation').length} Unconfirmed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recommended Facilities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Matched Facilities
              </h3>
            </div>
            <button
              onClick={() => setActiveView('discover')}
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Search all →
            </button>
          </div>

          <div className="space-y-3">
            {recommendedMfg.map((mfg) => (
              <div
                key={mfg.id}
                onClick={() => openManufacturerDetail(mfg)}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-cyan-500/40 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-cyan-400 transition">
                      {mfg.name}
                    </h5>
                    <p className="text-[11px] text-white/40 mt-0.5 truncate max-w-[200px]">
                      {mfg.location}
                    </p>
                  </div>
                  <MatchScoreBadge score={88} size="sm" />
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {mfg.processes.slice(0, 2).map((proc, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/60 border border-white/[0.06]"
                    >
                      {proc}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-white/40 font-mono">
                  <span>MOQ: {mfg.moq.toLocaleString()} {mfg.moqUnit}</span>
                  <span className="text-[#FF5533] group-hover:underline">Inspect Dossier →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal RFQ Spec Document Modal */}
      <LegalRfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        project={activeProject}
      />
    </div>
  );
};

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
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';

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
              placeholder="Describe your manufacturing idea, materials, volume target, or geometry... (e.g., 'I want to make an insulated matte-black stainless steel shaker bottle for fitness influencers. Double-wall vacuum, silicone gaskets, powder-coat finish, 10,000 units')"
              rows={3}
              className="w-full bg-transparent border-0 text-white placeholder-white/30 text-sm sm:text-base focus:ring-0 focus:outline-none resize-none leading-relaxed"
            />

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                <span>Quick prompts:</span>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'I want to make an insulated matte-black stainless steel shaker bottle for fitness influencers. Double-wall vacuum, silicone gaskets, powder-coat finish, 10,000 units.'
                    )
                  }
                  className="text-xs text-white/70 hover:text-white underline decoration-white/20"
                >
                  Insulated Shaker Bottle
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Custom 5-axis CNC machined 6061 aluminium drone gimbal housing with Type III hard anodizing, MOQ 1,500 units.'
                    )
                  }
                  className="text-xs text-white/70 hover:text-white underline decoration-white/20"
                >
                  Drone Gimbal
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() =>
                    setPromptInput(
                      'Find manufacturers in India who can make custom monobloc aluminium bottles with 360 printing and an MOQ around 20,000.'
                    )
                  }
                  className="text-xs text-white/70 hover:text-white underline decoration-white/20"
                >
                  Aluminium Bottle Run
                </button>
              </div>

              <button
                type="submit"
                disabled={isInterpreting || !promptInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 disabled:opacity-40 transition"
              >
                {isInterpreting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Decomposing Requirements...</span>
                  </>
                ) : (
                  <>
                    <span>Decompose & Match</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* AI Contextual Suggestions Banner */}
      <section className="p-4 rounded-xl bg-gradient-to-r from-[#FF5533]/10 via-[#1E1924] to-[#121420] border border-[#FF5533]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FF5533]/20 text-[#FF5533] shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              AI Sourcing Advisory Alert
            </h4>
            <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
              In your active project <span className="text-white font-medium">"{activeProject?.title}"</span>: 1 shortlisted facility hasn't confirmed nitrogen barrier OTR testing protocols yet.
            </p>
          </div>
        </div>
        <button
          onClick={() =>
            openAiDrawer({
              type: 'project',
              data: activeProject,
            })
          }
          className="self-start sm:self-auto shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition border border-white/[0.1]"
        >
          Review with AI Co-Founder →
        </button>
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
    </div>
  );
};

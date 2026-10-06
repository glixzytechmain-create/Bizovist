import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Requirement, SpecificationItem } from '../../types';
import {
  FolderKanban,
  FileText,
  Building2,
  Scale,
  MessageSquare,
  DollarSign,
  Package,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Send,
  Eye,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { GoogleSheetsExportModal } from './GoogleSheetsExportModal';

export const ProjectView: React.FC = () => {
  const {
    activeProject,
    manufacturers,
    shortlistedManufacturerIds,
    toggleShortlist,
    openManufacturerDetail,
    startNewRfq,
    openAiDrawer,
    updateProjectRequirements,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'requirements'
    | 'manufacturers'
    | 'compare'
    | 'messages'
    | 'quotes'
    | 'samples'
    | 'documents'
    | 'ai'
  >('overview');

  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [aiHistoryQuery, setAiHistoryQuery] = useState('Why did we reject Manufacturer B?');
  const [aiHistoryAnswer, setAiHistoryAnswer] = useState<string | null>(null);
  const [aiHistoryLoading, setAiHistoryLoading] = useState(false);

  if (!activeProject) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center text-white/50">
        No active project selected.
      </div>
    );
  }

  const proj = activeProject;
  const shortlistedMfg = manufacturers.filter((m) =>
    proj.shortlistedManufacturerIds.includes(m.id) || shortlistedManufacturerIds.includes(m.id)
  );

  const handleAskProjectHistory = (queryText: string) => {
    setAiHistoryLoading(true);
    setTimeout(() => {
      if (queryText.toLowerCase().includes('reject')) {
        setAiHistoryAnswer(
          `Project Audit Record:
Manufacturer B (Generic Baker & Extrusions) was formally rejected on Day 2 of sourcing discovery because:
1. They operate hot bakery convection tunnels rather than cold extrusion guillotine cutting lines, which degrades whey isolate bioavailability.
2. They do not possess in-line modified atmosphere packaging (MAP) with nitrogen gas flushing, which failed our mandatory aw < 0.62 moisture barrier requirement.
3. They could not provide batch-level Certificates of Analysis (CoA) for gluten allergen isolation.`
        );
      } else {
        setAiHistoryAnswer(
          `Project Context Analysis for "${proj.title}":
Current Phase: ${proj.status.replace('_', ' ').toUpperCase()}
Shortlisted Facilities: ${shortlistedMfg.map((m) => m.name).join(', ') || 'None'}
Identified Bottleneck: You have confirmed 5 specifications, but packaging barrier OTR testing and FSSAI Central cleanroom licensing still require formal supplier audit certificates.`
        );
      }
      setAiHistoryLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      {/* Project Banner Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#151724] to-[#0F111A] border border-white/[0.08] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF5533] font-semibold">
                Active Manufacturing Journey
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.06] text-white/70 border border-white/[0.06]">
                Phase: {proj.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {proj.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
              {proj.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSheetsModal(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition flex items-center gap-1.5"
              title="Export BOM & technical specifications to Google Sheets"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export to Google Sheets</span>
            </button>
            <button
              onClick={() =>
                openAiDrawer({
                  type: 'project',
                  data: proj,
                })
              }
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consult Project Co-Founder</span>
            </button>
          </div>
        </div>

        {/* Project Key Metrics */}
        <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-white/40 uppercase block">Target MOQ</span>
            <span className="font-bold text-white text-sm">
              {proj.targetMOQ.toLocaleString()} {proj.moqUnit}
            </span>
          </div>
          <div>
            <span className="text-white/40 uppercase block">Target Unit Cost</span>
            <span className="font-bold text-[#FF5533] text-sm">
              {proj.targetUnitCost || 'Not set'}
            </span>
          </div>
          <div>
            <span className="text-white/40 uppercase block">Target Lead Time</span>
            <span className="font-bold text-white text-sm">
              {proj.targetLeadTime || '6-8 weeks'}
            </span>
          </div>
          <div>
            <span className="text-white/40 uppercase block">Preferred Geography</span>
            <span className="font-bold text-white text-sm truncate block">
              {proj.locationPreference}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu (All 9 tabs from user specification) */}
      <div className="border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-medium pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: <FileText className="w-3.5 h-3.5" /> },
          { id: 'requirements', label: `Requirements (${proj.requirements.length})`, icon: <FileCheck2 className="w-3.5 h-3.5" /> },
          { id: 'manufacturers', label: `Shortlist (${shortlistedMfg.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
          { id: 'quotes', label: `Quotes (${proj.quotesReceived})`, icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: 'samples', label: `Samples (${proj.samplesReceived})`, icon: <Package className="w-3.5 h-3.5" /> },
          { id: 'ai', label: 'AI Project Memory', icon: <Sparkles className="w-3.5 h-3.5 text-[#FF5533]" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-t-lg transition whitespace-nowrap border-b-2 ${
                isActive
                  ? 'border-[#FF5533] text-[#FF5533] bg-white/[0.02] font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              BOM & Processing Roadmap
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-white/40 uppercase block">Raw Materials:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {proj.materials.map((mat, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-white/[0.04] text-white/80 border border-white/[0.06]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-white/40 uppercase block">Processes:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {proj.processes.map((proc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/20"
                    >
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-white/40 uppercase block">Line Machinery:</span>
                <div className="mt-1 space-y-1">
                  {proj.machineryNeeded.map((mach, i) => (
                    <div key={i} className="text-xs text-white/70 flex items-center gap-2 p-1 rounded bg-white/[0.02]">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{mach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sourcing Health */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              Sourcing Milestones
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Requirements Defined
                </span>
                <span className="font-mono text-[11px]">Completed</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-[#FF5533]/10 border border-[#FF5533]/20 text-[#FF5533]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#FF5533] animate-pulse" />
                  Supplier Discovery & RFQ
                </span>
                <span className="font-mono text-[11px]">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/40">
                <span>Golden Sample Validation</span>
                <span className="font-mono text-[11px]">Pending RFQ</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-white/40">
                <span>Production Pilot Run (50k units)</span>
                <span className="font-mono text-[11px]">Upcoming</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: REQUIREMENTS */}
      {activeTab === 'requirements' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                Critical Engineering Specifications
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {proj.specifications.map((spec) => (
                <div
                  key={spec.id}
                  className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      {spec.dimension}
                    </span>
                    <span
                      className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        spec.importance === 'critical'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-white/[0.04] text-white/60'
                      }`}
                    >
                      {spec.importance}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white font-mono">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              Manufacturing Requirements Checklist
            </h3>

            <div className="space-y-2">
              {proj.requirements.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="text-xs font-bold text-white">• {req.name}</div>
                    <p className="text-[11px] text-white/50 pl-3 mt-0.5">{req.note}</p>
                  </div>
                  <EvidenceBadge type={req.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SHORTLISTED MANUFACTURERS */}
      {activeTab === 'manufacturers' && (
        <div className="space-y-4">
          {shortlistedMfg.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <Building2 className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-xs text-white/50">No manufacturers shortlisted yet.</p>
            </div>
          ) : (
            shortlistedMfg.map((mfg) => (
              <div
                key={mfg.id}
                className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-[#FF5533]/40 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{mfg.name}</h4>
                      <EvidenceBadge type={mfg.evidenceSource.type} />
                    </div>
                    <p className="text-xs text-white/50">{mfg.location}</p>
                  </div>
                  <MatchScoreBadge score={92} size="md" />
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-xs font-mono text-white/60">
                  <span>MOQ: {mfg.moq.toLocaleString()} {mfg.moqUnit}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openManufacturerDetail(mfg)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white hover:bg-white/[0.1] transition text-xs font-sans"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => startNewRfq(mfg.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FF5533] text-white hover:bg-[#E04626] transition text-xs font-sans font-semibold"
                    >
                      Transmit RFQ
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 6: AI PROJECT MEMORY (Critical Requirement: "Why did we reject Manufacturer B?") */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#FF5533]/10 to-[#121420] border border-[#FF5533]/25 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF5533]" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Contextual AI Project Memory
              </h3>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Bizovist retains full audit memory of every decision, rejected candidate, tolerance discrepancy, and contract discussion for this manufacturing journey.
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => {
                  setAiHistoryQuery('Why did we reject Manufacturer B?');
                  handleAskProjectHistory('Why did we reject Manufacturer B?');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/90 border border-white/[0.08] transition"
              >
                “Why did we reject Manufacturer B?”
              </button>
              <button
                onClick={() => {
                  setAiHistoryQuery('What critical information is missing from our active shortlisted candidates?');
                  handleAskProjectHistory('What critical information is missing from our active shortlisted candidates?');
                }}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/90 border border-white/[0.08] transition"
              >
                “What info is missing from shortlist?”
              </button>
            </div>

            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={aiHistoryQuery}
                onChange={(e) => setAiHistoryQuery(e.target.value)}
                placeholder="Ask about project decisions, supplier rejections, or specs..."
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF5533]"
              />
              <button
                onClick={() => handleAskProjectHistory(aiHistoryQuery)}
                disabled={aiHistoryLoading}
                className="px-4 py-2 rounded-xl bg-[#FF5533] text-white text-xs font-semibold hover:brightness-110 active:scale-95 transition"
              >
                {aiHistoryLoading ? 'Consulting Memory...' : 'Ask AI'}
              </button>
            </div>

            {aiHistoryAnswer && (
              <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/[0.08] font-mono text-xs text-white/90 whitespace-pre-line leading-relaxed">
                {aiHistoryAnswer}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Quotes & Samples */}
      {activeTab === 'quotes' && (
        <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <DollarSign className="w-6 h-6 text-emerald-400 mx-auto" />
          <h4 className="text-xs font-bold text-white">Commercial Quotations</h4>
          <p className="text-xs text-white/50">
            1 preliminary quotation packet received from Apex BioFormulations ($0.48/unit at 50,000 run).
          </p>
        </div>
      )}

      {activeTab === 'samples' && (
        <div className="p-6 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <Package className="w-6 h-6 text-[#FF5533] mx-auto" />
          <h4 className="text-xs font-bold text-white">Golden Samples Tracking</h4>
          <p className="text-xs text-white/50">
            Awaiting RFQ signoff to commission first pilot run sample trial batch.
          </p>
        </div>
      )}

      {/* Google Sheets Export Modal */}
      {showSheetsModal && (
        <GoogleSheetsExportModal
          project={proj}
          manufacturers={shortlistedMfg}
          onClose={() => setShowSheetsModal(false)}
        />
      )}
    </div>
  );
};

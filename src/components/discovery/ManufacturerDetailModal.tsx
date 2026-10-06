import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Manufacturer } from '../../types';
import {
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
  Calendar,
  Building2,
  Cpu,
  ShieldCheck,
  Send,
  Bookmark,
  BookmarkCheck,
  Scale,
  ExternalLink,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { aiService } from '../../services/aiService';

export const ManufacturerDetailModal: React.FC = () => {
  const {
    activeManufacturerDetail,
    closeManufacturerDetail,
    shortlistedManufacturerIds,
    toggleShortlist,
    comparisonManufacturerIds,
    toggleComparison,
    startNewRfq,
    openAiDrawer,
    activeProject,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'machinery' | 'audit' | 'materials'>('overview');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>(null);

  if (!activeManufacturerDetail) return null;
  const mfg = activeManufacturerDetail;
  const isShortlisted = shortlistedManufacturerIds.includes(mfg.id);
  const isCompared = comparisonManufacturerIds.includes(mfg.id);

  const handleRunAiAudit = async () => {
    setAuditLoading(true);
    try {
      const result = await aiService.auditManufacturer(mfg, activeProject?.title);
      setAuditData(result);
      setActiveTab('audit');
    } catch (e) {
      console.error(e);
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#10121C] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left my-auto">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-gradient-to-r from-[#171926] to-[#10121C]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF5533] font-semibold">
                Facility Intelligence Dossier
              </span>
              <EvidenceBadge type={mfg.evidenceSource.type} />
              {mfg.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Verified Physical Plant
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {mfg.name}
            </h2>
            <p className="text-xs sm:text-sm text-white/60">{mfg.tagline}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-mono pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF5533]" />
                {mfg.location}
              </span>
              <span>•</span>
              <span>Est. {mfg.establishedYear}</span>
              <span>•</span>
              <span>{mfg.facilitySizeSqFt.toLocaleString()} sq.ft</span>
              <span>•</span>
              <span>{mfg.workforceCount} workforce</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleShortlist(mfg.id)}
              className={`p-2 rounded-lg border transition ${
                isShortlisted
                  ? 'border-[#FF5533] bg-[#FF5533]/15 text-[#FF5533]'
                  : 'border-white/[0.1] text-white/50 hover:text-white'
              }`}
              title="Save facility"
            >
              {isShortlisted ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={closeManufacturerDetail}
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-6 text-xs font-medium">
          {[
            { id: 'overview', label: 'Capability Overview' },
            { id: 'machinery', label: `Machinery & Line Audit (${mfg.machinery.length})` },
            { id: 'materials', label: 'Materials & Tolerances' },
            { id: 'audit', label: 'AI Technical Risk Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#FF5533] text-[#FF5533] font-semibold'
                  : 'border-transparent text-white/50 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Prominent Ask Bizovist About this Manufacturer section (Critical Spec Requirement 10) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF5533]/10 to-[#1F1722] border border-[#FF5533]/25 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5533]" />
                    <span>Ask Bizovist About This Manufacturer</span>
                  </div>
                  <span className="text-[11px] font-mono text-white/40">Contextual Co-Founder</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Is this manufacturer suitable for my project?',
                    'What should I ask them during technical RFQ?',
                    'What critical information is still missing from their profile?',
                    'Compare this company with my active shortlist.',
                  ].map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        closeManufacturerDetail();
                        openAiDrawer({
                          type: 'manufacturer',
                          data: { manufacturer: mfg, query: promptText },
                        });
                      }}
                      className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.06] text-left text-xs transition flex items-center justify-between group"
                    >
                      <span className="truncate">"{promptText}"</span>
                      <ArrowRight className="w-3 h-3 text-[#FF5533] opacity-0 group-hover:opacity-100 transition shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Commercial Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 uppercase block">Standard MOQ</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {mfg.moq.toLocaleString()} {mfg.moqUnit}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 uppercase block">Annual Capacity</span>
                  <span className="font-bold text-white text-sm mt-0.5 block truncate">
                    {mfg.annualCapacity}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 uppercase block">Average Lead Time</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">
                    {mfg.leadTimeAvgWeeks} Weeks
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] text-white/40 uppercase block">Customization</span>
                  <span className="font-bold text-[#FF5533] text-sm mt-0.5 block">
                    {mfg.customizationRating}
                  </span>
                </div>
              </div>

              {/* Supply Chain & Logistics Corridor (Google Maps Integration) */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 via-[#131624] to-[#10121C] border border-cyan-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF5533]" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Industrial Corridor & Logistics Hub
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Google Maps Grounded
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-white/40 font-mono text-[10px] uppercase block">Freight Corridor</span>
                    <span className="text-white font-medium">{mfg.logisticsCorridor || 'Industrial Manufacturing Hub'}</span>
                  </div>
                  <div>
                    <span className="text-white/40 font-mono text-[10px] uppercase block">Nearest Ocean / Air Port</span>
                    <span className="text-cyan-300 font-mono">{mfg.nearestPort || 'Regional Container Terminal'}</span>
                  </div>
                </div>
              </div>

              {/* Capabilities & Certifications */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold mb-2">
                    Verified Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {mfg.capabilities.map((cap, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs bg-white/[0.04] text-white/90 border border-white/[0.08]"
                      >
                        ✓ {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold mb-2">
                    Quality & Regulatory Certifications
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {mfg.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence Source & Provenance */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Evidence Source & Provenance
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {mfg.evidenceSource.details}
                  </p>
                  {mfg.evidenceSource.lastAuditedDate && (
                    <span className="text-[11px] font-mono text-white/40 block">
                      Last physical audit date: {mfg.evidenceSource.lastAuditedDate}
                    </span>
                  )}
                </div>

                {/* Sample Policy */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                    Golden Sample Policy
                  </span>
                  <p className="text-xs text-white/70 leading-relaxed">{mfg.samplePolicy}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MACHINERY */}
          {activeTab === 'machinery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-white/40 uppercase">
                  Installed Precision Machinery Inventory
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  Logs Verified by Facility Inspector
                </span>
              </div>

              <div className="space-y-3">
                {mfg.machinery.map((mach, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white">{mach.name}</h4>
                        <p className="text-xs text-white/50 font-mono mt-0.5">
                          {mach.brand} {mach.model ? `• Model: ${mach.model}` : ''}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/20 font-bold shrink-0">
                        {mach.count} Active Units
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-[11px] font-mono text-white/60">
                      {mach.tonnageOrPower && (
                        <div>
                          <span className="text-white/30 uppercase block">Rating / Power</span>
                          <span className="text-white">{mach.tonnageOrPower}</span>
                        </div>
                      )}
                      {mach.precisionTolerance && (
                        <div>
                          <span className="text-white/30 uppercase block">Verified Tolerance</span>
                          <span className="text-emerald-400 font-bold">{mach.precisionTolerance}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATERIALS & TOLERANCES */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                  Qualified Raw Materials & Grades
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mfg.materials.map((mat, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-medium text-white/80 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF5533]" />
                      <span>{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                  Qualified Processes & Surface Treatments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mfg.processes.map((proc, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-medium text-white/80 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{proc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {!auditData ? (
                <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <Sparkles className="w-8 h-8 text-[#FF5533] mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Generate Technical Sourcing Audit</h4>
                    <p className="text-xs text-white/50 max-w-md mx-auto mt-1">
                      Our Gemini AI engine cross-references this plant's machinery specifications against your BOM tolerances to identify hidden bottlenecks and generate sample testing checklists.
                    </p>
                  </div>
                  <button
                    onClick={handleRunAiAudit}
                    disabled={auditLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 disabled:opacity-50 transition"
                  >
                    {auditLoading ? 'Auditing Line Tolerances...' : 'Run Technical Risk Audit'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <span className="font-mono text-xs font-bold uppercase">Production Readiness</span>
                    <span className="font-bold text-xs">{auditData.productionReadiness}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                      Machinery Sufficiency Review:
                    </span>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {auditData.machinerySufficiency}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Audit Checklist Before Paying Deposit:
                    </span>
                    <ul className="space-y-1.5 text-xs text-white/80">
                      {auditData.auditChecklist?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">□</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                      Risk Flags & Oversight Recommendations:
                    </span>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {auditData.redFlagsToWatch?.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">!</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold">
                      Sample Evaluation Strategy:
                    </span>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {auditData.sampleEvaluationStrategy}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0E1018] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleComparison(mfg.id)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                isCompared ? 'bg-cyan-500 text-black' : 'bg-white/[0.06] hover:bg-white/[0.1] text-white/80'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'Remove from Compare' : 'Add to Compare'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeManufacturerDetail();
                startNewRfq(mfg.id);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit RFQ Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

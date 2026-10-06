import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIAnalysisResult, RequirementStatus } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronRight,
  Edit2,
  Check,
  Plus,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';

export const AiProductUnderstanding: React.FC = () => {
  const {
    latestAnalysis,
    createProjectFromAnalysis,
    setActiveView,
    activeProject,
  } = useApp();

  // If no analysis is loaded yet, provide the default high-fidelity analyzed state
  const analysis: AIAnalysisResult = latestAnalysis || {
    projectName: 'Premium Protein Bar Line',
    summary:
      'Turnkey cold-extruded functional protein bar with chocolate enrobing, individual nitrogen-flushed high-barrier foil flow wrapping, and 12-pack counter display cartons.',
    industry: 'Food & Nutrition / Functional Confectionery',
    productCategory: 'Cold-Extruded Protein Bars',
    materials: [
      'Grass-fed Whey & Plant Isolate Blend',
      'Prebiotic Soluble Fiber Syrup',
      'BOPP/EVOH Metallized High-Barrier Foil',
      'FSC Recycled Display Paperboard',
    ],
    processes: [
      'High-Shear Sigma Mixing',
      'Cold Continuous Extrusion',
      'Guillotine Servo Cutting',
      'Bottom Chocolate Enrobing',
      'Modified Atmosphere Packaging (MAP)',
    ],
    machineryNeeded: [
      'Continuous Cold Bar Extruder (e.g. Bühler BCTC)',
      'Multi-Zone Cooling Tunnel',
      'Horizontal Flow Wrapper with N2 Flush',
      'In-line X-Ray & Dynamic Checkweigher',
    ],
    targetMOQ: 50000,
    moqUnit: 'units',
    targetUnitCostEstimate: '$0.45 - $0.68 / unit',
    targetLeadTime: '6-8 weeks',
    locationPreference: 'India (Bangalore, Pune, or Gujarat clusters)',
    requirements: [
      {
        name: 'Product formulation & sensory trial',
        status: 'confirmed',
        note: 'Recipe optimization for 12-month ambient texture retention without hardening',
      },
      {
        name: 'Cold extrusion portioning (+/- 1.5g)',
        status: 'confirmed',
        note: 'Strict weight distribution per 60g bar unit',
      },
      {
        name: 'Individual barrier nitrogen flow-wrapping',
        status: 'confirmed',
        note: 'High barrier foil with residual O2 < 1.0%',
      },
      {
        name: 'Shelf-life & water activity (aw < 0.62)',
        status: 'likely',
        note: 'Standard industry requirement to inhibit microbial mold growth without synthetic preservatives',
      },
      {
        name: 'Private label 12-pack retail counter display',
        status: 'confirmed',
        note: 'Perforated tear-strip counter caddy',
      },
      {
        name: 'FSSAI Central manufacturing license',
        status: 'needs_confirmation',
        note: 'Requires third-party audited ISO 22000 / HACCP certified facility for retail distribution',
      },
      {
        name: 'Temperature-controlled cold-chain shipping',
        status: 'needs_confirmation',
        note: 'Needed if retail distribution spans peak summer months (chocolate melt threshold > 28°C)',
      },
    ],
    specifications: [
      { dimension: 'Water Activity (aw)', value: '< 0.62 at 25°C', importance: 'critical' },
      { dimension: 'Protein Density', value: '20.0g per 60g bar', importance: 'critical' },
      { dimension: 'Packaging Oxygen Transmission Rate', value: '< 1.0 cc/m²/day', importance: 'high' },
      { dimension: 'Unit Weight Consistency', value: '60g +/- 2.5%', importance: 'medium' },
    ],
    regulatoryConsiderations: [
      'FSSAI Schedule IV Sanitary & Hygiene Compliance',
      'Nutritional Panel & Allergen Declaration (Gluten, Dairy, Soy)',
      'FSSAI Central License for Proprietary Nutritional Foods',
      'Weights & Measures Legal Metrology Act declaration',
    ],
    clarifyingQuestions: [
      'Do you require turnkey raw material isolate sourcing, or will you supply proprietary pre-mixed premixes?',
      'Will you provide custom-printed packaging film reels or require factory stock films with custom stickers?',
    ],
  };

  const [reqsState, setReqsState] = useState(analysis.requirements);

  const toggleReqStatus = (idx: number) => {
    setReqsState((prev) =>
      prev.map((r, i) => {
        if (i !== idx) return r;
        const nextStatus: RequirementStatus =
          r.status === 'confirmed'
            ? 'likely'
            : r.status === 'likely'
            ? 'needs_confirmation'
            : 'confirmed';
        return { ...r, status: nextStatus };
      })
    );
  };

  const handleProceedToDiscovery = () => {
    createProjectFromAnalysis({
      ...analysis,
      requirements: reqsState,
    });
    setActiveView('discover');
  };

  const confirmedCount = reqsState.filter((r) => r.status === 'confirmed').length;
  const likelyCount = reqsState.filter((r) => r.status === 'likely').length;
  const needsConfCount = reqsState.filter((r) => r.status === 'needs_confirmation').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      {/* Top Banner: Bizovist understood your project */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171A27] via-[#121420] to-[#0D0F18] border border-white/[0.1] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bizovist understood your project</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {analysis.projectName}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1.5 max-w-2xl leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <button
            onClick={handleProceedToDiscovery}
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-xl shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition"
          >
            <span>Match Verified Facilities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Requirements Status Ticker */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white/60">CONFIRMED:</span>
            <span className="text-emerald-400 font-bold">{confirmedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-white/60">LIKELY (INFERRED):</span>
            <span className="text-purple-400 font-bold">{likelyCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-white/60">NEEDS CONFIRMATION:</span>
            <span className="text-amber-400 font-bold">{needsConfCount}</span>
          </div>
          <div className="ml-auto text-[11px] text-white/40 italic">
            *Click any badge below to toggle or verify assumptions
          </div>
        </div>
      </div>

      {/* Taxonomical Deconstruction Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Understood Requirements Breakdown */}
        <div className="space-y-6">
          {/* Understood Requirements Card */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5533]" />
                Understood Baseline Parameters
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Industry</span>
                <p className="font-semibold text-white mt-0.5">{analysis.industry}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Target Initial MOQ</span>
                <p className="font-semibold text-white mt-0.5">
                  {analysis.targetMOQ.toLocaleString()} {analysis.moqUnit}
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Target Unit Cost</span>
                <p className="font-semibold text-[#FF5533] mt-0.5">{analysis.targetUnitCostEstimate}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Location Preference</span>
                <p className="font-semibold text-white mt-0.5">{analysis.locationPreference}</p>
              </div>
            </div>
          </div>

          {/* Materials & Processes */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Detected Materials & Tooling
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-mono text-white/50 uppercase">Bill of Materials:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {analysis.materials.map((mat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs font-medium bg-white/[0.04] text-white/80 border border-white/[0.08]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-white/50 uppercase">Required Manufacturing Processes:</span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {analysis.processes.map((proc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded text-xs font-medium bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/20"
                    >
                      {proc}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono text-white/50 uppercase">Line Machinery Audited:</span>
                <div className="mt-1.5 space-y-1">
                  {analysis.machineryNeeded.map((mach, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-white/70 flex items-center gap-2 p-1.5 rounded bg-white/[0.02]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{mach}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Manufacturing Requirements Detected with Evidence Badges */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                Manufacturing Requirements Detected
              </h3>
              <span className="text-[10px] text-white/40 font-mono">
                Click status to toggle
              </span>
            </div>

            <div className="space-y-2.5">
              {reqsState.map((req, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-white/90">
                      • {req.name}
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed pl-3">
                      {req.note}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleReqStatus(idx)}
                    title="Click to cycle status"
                    className="shrink-0 transition-transform active:scale-95"
                  >
                    <EvidenceBadge type={req.status} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory & Questions */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Regulatory & Verification Checklist
            </h3>

            <ul className="space-y-2 text-xs text-white/70">
              {analysis.regulatoryConsiderations.map((reg, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0">§</span>
                  <span>{reg}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 border-t border-white/[0.06]">
              <span className="text-[11px] font-mono text-white/40 uppercase block mb-1.5">
                Critical Questions For Candidates:
              </span>
              <ul className="space-y-1.5 text-xs text-white/60 italic">
                {analysis.clarifyingQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF5533]">?</span>
                    <span>"{q}"</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
        <span className="text-xs text-white/60">
          Ready to discover factories meeting these exact requirements?
        </span>
        <button
          onClick={handleProceedToDiscovery}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/30 hover:brightness-110 active:scale-95 transition"
        >
          <span>Find Manufacturers That Fit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

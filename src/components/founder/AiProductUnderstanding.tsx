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
  // If no analysis is loaded yet, provide the default high-fidelity analyzed state
  const analysis: AIAnalysisResult = latestAnalysis || {
    projectName: 'Insulated Matte-Black Stainless Steel Shaker Bottle',
    summary:
      'Double-wall vacuum insulated 24oz stainless steel shaker bottle with leakproof twist-lock spout lid, silent agitator, and durable matte powder-coat finish for fitness brands.',
    industry: 'Consumer Goods & Fitness Hardware',
    productCategory: 'Drinkware & Insulated Containers',
    materials: [
      '304 Stainless Steel (Body)',
      '316 Surgical Stainless (Agitator)',
      'BPA-Free Polypropylene (Lid)',
      'Food-grade Liquid Silicone (Seals)',
    ],
    processes: [
      'Deep Drawing & Hydroforming',
      'Vacuum Brazing / Sealing',
      'Powder Coating & Laser Engraving',
      'Multi-Cavity Injection Molding',
    ],
    machineryNeeded: [
      'Hydraulic Deep Drawing Press (500T)',
      'Rotary Laser Welding System',
      'High-Vacuum Degassing Furnace',
      'Electrostatic Powder Spray Line',
    ],
    targetMOQ: 10000,
    moqUnit: 'units',
    targetUnitCostEstimate: '$3.40 - $4.85 / unit',
    targetLeadTime: '6-8 weeks',
    locationPreference: 'India (Pune / Gujarat precision clusters)',
    requirements: [
      {
        name: 'Double-Wall Vacuum Thermal Insulation',
        status: 'confirmed',
        note: '24-hour cold retention / 12-hour hot retention with copper vacuum lining',
      },
      {
        name: 'Zero-Leak Hermetic Seal at 1.5 Bar',
        status: 'confirmed',
        note: 'Dual food-grade silicone seals with twist-lock latch tested to 1.5 bar internal pressure',
      },
      {
        name: 'Ultra-Durable Matte Black Powder Coating',
        status: 'confirmed',
        note: 'Cross-hatch adhesion ASTM D3359 Class 5B and 100-cycle dishwasher safe',
      },
      {
        name: 'Electropolished 304/316 Odor-Free Interior',
        status: 'likely',
        note: 'Electropolishing eliminates micro-crevices preventing protein shake residue odor buildup',
      },
      {
        name: 'BPA-Free / FDA 21 CFR / LFGB Certification',
        status: 'needs_confirmation',
        note: 'Requires third-party SGS/TÜV food-contact migration test certificate',
      },
    ],
    specifications: [
      { dimension: 'Thermal Insulation Retention', value: '< 10°C cold at 24 hours (tested at 22°C ambient)', importance: 'critical' },
      { dimension: 'Internal Capacity', value: '750 ml (24 oz) +/- 15 ml', importance: 'critical' },
      { dimension: 'Powder Coat Thickness', value: '65 µm +/- 10 µm (scratch resistance > 3H pencil)', importance: 'high' },
      { dimension: 'Drop Shock Resistance', value: '1.2m drop test onto concrete without vacuum loss', importance: 'critical' },
    ],
    regulatoryConsiderations: [
      'FDA 21 CFR 175.300 & LFGB Food Contact Safety',
      'California Proposition 65 Heavy Metal Compliance (Lead/Cadmium Free)',
      'ISO 9001:2015 Quality Management System at Production Facility',
      'BPA/BPS-Free Certification on all Polypropylene & Silicone components',
    ],
    clarifyingQuestions: [
      'Do you require automated in-line vacuum testing machines (thermal sensor drop check) for 100% of units?',
      'What is your standard tooling lead time for custom PP lid mold sampling (T1 samples)?',
      'Can you provide automated rotary laser etching for individual founder logos in-house?',
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

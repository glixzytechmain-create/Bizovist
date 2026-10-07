import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Manufacturer, ManufacturerComparisonResult } from '../../types';
import { aiService } from '../../services/aiService';
import { LogisticsSatelliteRadar } from './LogisticsSatelliteRadar';
import { ComparativeRadarChart } from './ComparativeRadarChart';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  X,
  HelpCircle,
  Building2,
  Plus,
  Send,
  Eye,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Wrench,
  DollarSign,
  Clock,
  Truck,
  Anchor,
  Layers,
  Award,
  RefreshCw,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';

export const ManufacturerComparison: React.FC = () => {
  const {
    manufacturers,
    comparisonManufacturerIds,
    toggleComparison,
    clearComparison,
    openManufacturerDetail,
    startNewRfq,
    activeProject,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'grid' | 'radar'>('grid');
  const [comparisonResult, setComparisonResult] =
    useState<ManufacturerComparisonResult | null>(null);
  const [loadingVerdict, setLoadingVerdict] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const comparedList = manufacturers.filter((m) =>
    comparisonManufacturerIds.includes(m.id)
  );

  const availableToAdd = manufacturers.filter(
    (m) => !comparisonManufacturerIds.includes(m.id)
  );

  // Auto-generate comparative intelligence when comparedList changes if not yet loaded
  const handleGenerateAiVerdict = async () => {
    if (comparedList.length === 0) return;
    setLoadingVerdict(true);
    try {
      const result = await aiService.compareManufacturers(
        comparedList,
        activeProject
      );
      setComparisonResult(result);
    } catch (err: any) {
      console.warn('Live Gemini comparison error, using fallback:', err);
    } finally {
      setLoadingVerdict(false);
    }
  };

  useEffect(() => {
    if (comparedList.length >= 2 && !comparisonResult) {
      handleGenerateAiVerdict();
    }
  }, [comparisonManufacturerIds]);

  if (comparedList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center space-y-5 text-left">
        <div className="w-16 h-16 rounded-2xl bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/25 flex items-center justify-center mx-auto shadow-xl">
          <Scale className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 text-center">
          <h3 className="text-xl font-bold text-white">No facilities selected for comparison</h3>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Select 2 to 4 candidate manufacturing plants to compare side-by-side across machinery precision tolerances, optical CMM metrology, tooling NRE, and sea port drayage logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {manufacturers.slice(0, 3).map((m) => (
            <button
              key={m.id}
              onClick={() => toggleComparison(m.id)}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-mono text-white transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF5533]" />
              <span>Add {m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>HEAD-TO-HEAD FACILITY BENCHMARK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Manufacturing Comparison Matrix
          </h1>
          <p className="text-xs text-white/50 mt-0.5">
            Evaluating {comparedList.length} verified facilities for{' '}
            <span className="text-white font-medium">
              {activeProject?.title || 'Active Project'}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Grid vs Satellite Radar Switcher */}
          <div className="p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl flex items-center gap-1">
            <button
              onClick={() => setActiveTab('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                activeTab === 'grid'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Comparison Grid</span>
            </button>
            <button
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                activeTab === 'radar'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics Satellite Radar</span>
            </button>
          </div>

          {/* Add Another Facility Dropdown */}
          {availableToAdd.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                className="px-3 py-2 rounded-xl text-xs font-mono bg-white/[0.05] hover:bg-white/[0.09] text-white border border-white/[0.08] transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF5533]" />
                <span>Add Facility</span>
                <ChevronDown className="w-3 h-3 text-white/40" />
              </button>

              {showAddDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#141624] border border-white/[0.1] shadow-2xl py-1.5 z-30">
                  <div className="px-3 py-1 text-[10px] font-mono text-white/40 uppercase">
                    Select candidate plant:
                  </div>
                  {availableToAdd.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        toggleComparison(m.id);
                        setShowAddDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-white/[0.05] text-xs text-white flex items-center justify-between"
                    >
                      <span className="truncate">{m.name}</span>
                      <span className="text-[10px] text-white/40 font-mono">
                        MOQ {m.moq.toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Re-generate Gemini Verdict */}
          <button
            onClick={handleGenerateAiVerdict}
            disabled={loadingVerdict}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-cyan-300 border border-cyan-500/30 shadow-lg hover:border-cyan-500/50 active:scale-95 transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {loadingVerdict ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{loadingVerdict ? 'Analyzing Fit...' : 'Run Gemini 2.5 Verdict'}</span>
          </button>

          <button
            onClick={clearComparison}
            className="px-3 py-2 rounded-xl text-xs text-white/40 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition font-mono"
          >
            Clear
          </button>
        </div>
      </div>

      {/* GEMINI AI HEAD-TO-HEAD COMPARATIVE VERDICT CARD */}
      {comparisonResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171A27] via-[#121420] to-[#0E1018] border border-[#FF5533]/30 shadow-2xl space-y-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#FF5533]/20 border border-[#FF5533]/40 flex items-center justify-center text-[#FF5533]">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Gemini 2.5 Flash Head-to-Head Comparative Verdict
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              VP OF SOURCING VERDICT ONLINE
            </span>
          </div>

          {/* Executive Recommendation */}
          <p className="text-xs sm:text-sm font-mono text-white/90 leading-relaxed relative z-10 border-l-2 border-[#FF5533] pl-3 py-0.5">
            {comparisonResult.executiveRecommendation}
          </p>

          {/* 3 Winning Category Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 relative z-10">
            {/* Winner for Low NRE */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-emerald-500/25 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                Winner: Lowest Tooling NRE
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                {comparisonResult.winnerForLowNre?.manufacturerName}
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {comparisonResult.winnerForLowNre?.reason}
              </p>
            </div>

            {/* Winner for High Precision */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-purple-500/25 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Winner: Highest Precision (&lt;0.02mm)
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                {comparisonResult.winnerForHighPrecision?.manufacturerName}
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {comparisonResult.winnerForHighPrecision?.reason}
              </p>
            </div>

            {/* Winner for Volume & Speed */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-cyan-500/25 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Winner: Mass Volume & Throughput
              </span>
              <h4 className="text-xs font-bold text-white truncate">
                {comparisonResult.winnerForVolumeAndSpeed?.manufacturerName}
              </h4>
              <p className="text-[11px] text-white/60 leading-relaxed">
                {comparisonResult.winnerForVolumeAndSpeed?.reason}
              </p>
            </div>
          </div>

          {/* Negotiation Leverage Tactics Accordion / Grid */}
          <div className="pt-3 border-t border-white/[0.06] relative z-10 space-y-2">
            <span className="text-[11px] font-mono uppercase text-white/40 block font-semibold">
              Tactical Supplier Negotiation Leverage Points:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {comparisonResult.negotiationTactics?.map((nt, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                  <span className="font-bold text-[#FF5533] font-mono text-[11px]">
                    • {nt.manufacturerName}:
                  </span>
                  <ul className="space-y-1 text-white/70 pl-2">
                    {nt.tactics.map((tac, tIdx) => (
                      <li key={tIdx} className="text-[11px] list-disc list-inside">
                        {tac}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Multi-Vector Capability Radar Chart */}
      <ComparativeRadarChart
        manufacturers={comparedList}
        comparisonResult={comparisonResult}
      />

      {/* CONDITIONAL TAB: SATELLITE RADAR VIEW */}
      {activeTab === 'radar' ? (
        <LogisticsSatelliteRadar manufacturers={comparedList} />
      ) : (
        /* CONDITIONAL TAB: DEEP 3-WAY COMPARISON GRID */
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0E1019] shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="p-4 w-48 font-mono text-white/40 uppercase text-[11px] sticky left-0 bg-[#0E1019] z-10">
                  Engineering Parameter
                </th>
                {comparedList.map((mfg) => (
                  <th key={mfg.id} className="p-4 min-w-[280px] align-top border-l border-white/[0.06]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{mfg.name}</h4>
                        <p className="text-[11px] text-white/50 font-mono mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF5533]" />
                          {mfg.location}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleComparison(mfg.id)}
                        className="text-white/40 hover:text-white p-1 rounded hover:bg-white/[0.06] transition"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <MatchScoreBadge score={89} size="sm" />
                      <EvidenceBadge type={mfg.evidenceSource.type} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {/* Row 1: Core Manufacturing Processes */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Primary Processes
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/80">
                    <div className="flex flex-wrap gap-1">
                      {mfg.processes.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/80 border border-white/[0.06]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 2: Installed Machinery & Brands */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Machine Tool Brands
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/80 space-y-1.5">
                    {mfg.machinery.map((mach, i) => (
                      <div key={i} className="text-[11px] font-mono text-white/80 flex items-center justify-between gap-1 p-1 rounded bg-white/[0.01]">
                        <span>• {mach.name}</span>
                        <span className="text-[10px] text-cyan-400 shrink-0 font-semibold">{mach.count} units</span>
                      </div>
                    ))}
                  </td>
                ))}
              </tr>

              {/* Row 3: Precision Tolerances */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Precision Tolerances
                </td>
                {comparedList.map((mfg) => {
                  const tol = mfg.machinery.find((m) => m.precisionTolerance)?.precisionTolerance || 'Standard ISO 2768';
                  const isUltra = tol.includes('0.00') || tol.includes('micron');
                  return (
                    <td key={mfg.id} className="p-4 border-l border-white/[0.06]">
                      <span className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        isUltra
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {tol}
                      </span>
                    </td>
                  );
                })}
              </tr>

              {/* Row 4: Optical CMM & Metrology */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  CMM & Metrology QA
                </td>
                {comparedList.map((mfg) => {
                  const cmm = mfg.machinery.find((m) => m.name.toLowerCase().includes('cmm') || m.name.toLowerCase().includes('optical') || m.name.toLowerCase().includes('ray'));
                  return (
                    <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/80 font-mono text-[11px]">
                      {cmm ? (
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span>{cmm.name} ({cmm.brand || 'Verified'})</span>
                        </div>
                      ) : (
                        <span className="text-white/40 italic">Manual micrometer & bench QA</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row 5: Standard MOQ & Flexibility */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Standard MOQ
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06] font-mono font-bold text-white text-xs">
                    {mfg.moq.toLocaleString()} {mfg.moqUnit}
                  </td>
                ))}
              </tr>

              {/* Row 6: Nearest Sea Port & Logistics */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Maritime Port Proximity
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-xs font-mono">
                    <div className="font-bold text-white flex items-center gap-1">
                      <Anchor className="w-3.5 h-3.5 text-[#FF5533]" />
                      <span>{mfg.nearestPort || 'Regional Hub'}</span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5 truncate">
                      {mfg.logisticsCorridor}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 7: Certifications */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Quality Certifications
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06]">
                    <div className="flex flex-wrap gap-1">
                      {mfg.certifications.map((c, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 8: Sample Turnaround Policy */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Sample Policy & T1 Lead Time
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/70 text-xs">
                    {mfg.samplePolicy}
                  </td>
                ))}
              </tr>

              {/* Sourcing Actions */}
              <tr>
                <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                  Direct Actions
                </td>
                {comparedList.map((mfg) => (
                  <td key={mfg.id} className="p-4 border-l border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openManufacturerDetail(mfg)}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-mono transition"
                      >
                        Full Dossier
                      </button>
                      <button
                        onClick={() => startNewRfq(mfg.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white text-xs font-semibold shadow-md shadow-[#FF5533]/20 hover:brightness-110 active:scale-95 transition"
                      >
                        Transmit RFQ
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

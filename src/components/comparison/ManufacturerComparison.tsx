import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
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
    openAiDrawer,
    activeProject,
  } = useApp();

  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [loadingVerdict, setLoadingVerdict] = useState(false);

  const comparedList = manufacturers.filter((m) =>
    comparisonManufacturerIds.includes(m.id)
  );

  const handleGenerateAiVerdict = () => {
    setLoadingVerdict(true);
    setTimeout(() => {
      setAiVerdict(
        `BIZOVIST COMPARATIVE EVALUATION MATRIX:

1. Apex BioFormulations vs. Hind Monobloc:
- Process Specificity: Apex is 100% focused on food/nutrition cold extrusion with continuous Bühler lines and Class 100k cleanroom packaging. Hind Monobloc excels in impact extrusion of aluminium cans/bottles. If your primary product is the edible bar, Apex is the sole direct contender. If you are developing an aluminium shaker bottle accessory, Hind Monobloc is your partner.
- Commercial MOQ Risk: Apex MOQ of 50,000 matches your target volume threshold. Hind Monobloc requires 20,000 units with custom tooling lead times of 6 weeks.
- Verdict: Issue Master RFQ to Apex for formulation validation and retain Hind Monobloc for secondary canister packaging.`
      );
      setLoadingVerdict(false);
    }, 700);
  };

  if (comparedList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-4 text-left">
        <div className="w-12 h-12 rounded-xl bg-white/[0.04] text-white/40 flex items-center justify-center mx-auto">
          <Scale className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white text-center">No facilities selected for comparison</h3>
        <p className="text-xs text-white/50 text-center max-w-md mx-auto">
          Browse manufacturer discovery or project shortlists and click "Compare" to evaluate facilities side-by-side across machinery, MOQ, and verified tolerances.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>HEAD-TO-HEAD FACILITY BENCHMARK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Manufacturing Comparison Matrix
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAiVerdict}
            disabled={loadingVerdict}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loadingVerdict ? 'Evaluating Fit...' : 'Generate AI Comparison Verdict'}</span>
          </button>
          <button
            onClick={clearComparison}
            className="px-3 py-2 rounded-xl text-xs text-white/50 hover:text-white bg-white/[0.04] transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* AI Comparative Verdict Panel */}
      {aiVerdict && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171A27] via-[#121420] to-[#0E1018] border border-[#FF5533]/30 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#FF5533] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Bizovist AI Comparative Verdict
            </span>
            <button
              onClick={() => setAiVerdict(null)}
              className="text-white/40 hover:text-white text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs font-mono text-white/90 whitespace-pre-line leading-relaxed">
            {aiVerdict}
          </p>
        </div>
      )}

      {/* Side-by-Side Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0E1019] shadow-2xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
              <th className="p-4 w-48 font-mono text-white/40 uppercase text-[11px] sticky left-0 bg-[#0E1019] z-10">
                Evaluation Metric
              </th>
              {comparedList.map((mfg) => (
                <th key={mfg.id} className="p-4 min-w-[260px] align-top border-l border-white/[0.06]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{mfg.name}</h4>
                      <p className="text-[11px] text-white/50 font-normal mt-0.5">{mfg.location}</p>
                    </div>
                    <button
                      onClick={() => toggleComparison(mfg.id)}
                      className="text-white/40 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <MatchScoreBadge score={89} size="sm" />
                    <EvidenceBadge type={mfg.evidenceSource.type} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {/* Row 1: Core Process */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Primary Processes
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/80">
                  <div className="flex flex-wrap gap-1">
                    {mfg.processes.map((p, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-white/80">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 2: Machinery Lines */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Installed Machinery
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/80 space-y-1">
                  {mfg.machinery.map((mach, i) => (
                    <div key={i} className="text-[11px] font-mono text-white/70">
                      • {mach.name} ({mach.count} units)
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Row 3: MOQ */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Standard MOQ
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06] font-mono font-bold text-white">
                  {mfg.moq.toLocaleString()} {mfg.moqUnit}
                </td>
              ))}
            </tr>

            {/* Row 4: Tolerances & Cleanroom */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Verified Tolerances
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06] font-mono text-emerald-400">
                  {mfg.machinery.find((m) => m.precisionTolerance)?.precisionTolerance || 'Standard ISO 2768'}
                </td>
              ))}
            </tr>

            {/* Row 5: Certifications */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Quality Certifications
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06]">
                  <div className="flex flex-wrap gap-1">
                    {mfg.certifications.map((c, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300">
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 6: Sample Policy */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Sample Lead Time
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06] text-white/70 text-xs">
                  {mfg.samplePolicy}
                </td>
              ))}
            </tr>

            {/* Action Row */}
            <tr>
              <td className="p-4 font-mono text-white/40 sticky left-0 bg-[#0E1019] z-10">
                Next Sourcing Action
              </td>
              {comparedList.map((mfg) => (
                <td key={mfg.id} className="p-4 border-l border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openManufacturerDetail(mfg)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs transition"
                    >
                      Dossier
                    </button>
                    <button
                      onClick={() => startNewRfq(mfg.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#FF5533] hover:bg-[#E04626] text-white text-xs font-semibold transition"
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
    </div>
  );
};

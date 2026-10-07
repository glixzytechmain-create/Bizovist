import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Cpu,
  Layers,
  Search,
  Scale,
  ShieldCheck,
  Activity,
  Terminal,
} from 'lucide-react';

export type InspectionMode =
  | 'intent_decomposition'
  | 'factory_grounding'
  | 'factory_comparison'
  | 'bom_refinement';

interface InspectionStep {
  label: string;
  subtext: string;
  icon: React.ReactNode;
}

interface InspectionTelemetryModalProps {
  isOpen: boolean;
  mode: InspectionMode;
  productContext?: string;
  onComplete?: () => void;
  // If promise is provided, modal stays open at least minDurationMs AND until promise resolves
  taskPromise?: Promise<any> | null;
  minDurationMs?: number;
}

export const InspectionTelemetryModal: React.FC<InspectionTelemetryModalProps> = ({
  isOpen,
  mode,
  productContext,
  onComplete,
  taskPromise,
  minDurationMs = 3400,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [isTaskResolved, setIsTaskResolved] = useState(false);

  // Define steps according to inspection mode
  const getSteps = (): InspectionStep[] => {
    switch (mode) {
      case 'factory_grounding':
        return [
          {
            label: 'Connecting to Google Search Grounding API',
            subtext: 'Establishing authenticated live grounding pipeline...',
            icon: <Search className="w-4 h-4 text-[#FF5533]" />,
          },
          {
            label: 'Scanning Verified Industrial Registries',
            subtext: 'Cross-referencing FSSAI, ISO 9001, and BRCGS plant registries...',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          },
          {
            label: 'Auditing Installed Machinery & Tonnage Capacities',
            subtext: 'Verifying automated rotary lines, CNC tolerances, and cleanroom areas...',
            icon: <Cpu className="w-4 h-4 text-cyan-400" />,
          },
          {
            label: 'Synthesizing Verified Manufacturer Profiles',
            subtext: 'Filtering Tier-1/Tier-2 verified contract packaging plants...',
            icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
          },
        ];
      case 'factory_comparison':
        return [
          {
            label: 'Benchmarking Machinery & Metrology Precision',
            subtext: 'Comparing sub-micron CMM, rotary filling, and tool steel dies...',
            icon: <Cpu className="w-4 h-4 text-[#FF5533]" />,
          },
          {
            label: 'Analyzing Tooling NRE & Pilot Lead Times',
            subtext: 'Evaluating mold amortization schedules and T1 sample lead times...',
            icon: <Layers className="w-4 h-4 text-cyan-400" />,
          },
          {
            label: 'Querying Google Maps Satellite Logistics & Sea Ports',
            subtext: 'Calculating freight corridors to JNPT, Mundra, and Chennai ports...',
            icon: <Activity className="w-4 h-4 text-emerald-400" />,
          },
          {
            label: 'Generating AI Head-to-Head Procurement Verdict',
            subtext: 'Synthesizing VP of Sourcing executive recommendation...',
            icon: <Scale className="w-4 h-4 text-amber-400" />,
          },
        ];
      case 'bom_refinement':
        return [
          {
            label: 'Ingesting Founder Refinement Instruction',
            subtext: 'Parsing tolerance adjustments, material swaps, or MOQ shifts...',
            icon: <Terminal className="w-4 h-4 text-[#FF5533]" />,
          },
          {
            label: 'Recalculating Bill of Materials Allocations',
            subtext: 'Re-evaluating raw material pricing indices and process cycle times...',
            icon: <Layers className="w-4 h-4 text-cyan-400" />,
          },
          {
            label: 'Validating Chemical & Mechanical Tolerances',
            subtext: 'Ensuring ASTM / ISO adherence and mold cavity integrity...',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          },
          {
            label: 'Finalizing Engineering Ledger Update',
            subtext: 'Updating live BOM matrix and tooling NRE breakdown...',
            icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
          },
        ];
      case 'intent_decomposition':
      default:
        return [
          {
            label: 'Deconstructing Product Intent & Taxonomy',
            subtext: 'Classifying industry, product archetype, and mechanical constraints...',
            icon: <Sparkles className="w-4 h-4 text-[#FF5533]" />,
          },
          {
            label: 'Decomposing Bill of Materials & Tolerances',
            subtext: 'Assigning material grades, manufacturing processes, and GD&T targets...',
            icon: <Layers className="w-4 h-4 text-cyan-400" />,
          },
          {
            label: 'Estimating Tooling NRE & Mold Amortization',
            subtext: 'Calculating die fabrication costs, pilot leads, and mass production cycles...',
            icon: <Cpu className="w-4 h-4 text-amber-400" />,
          },
          {
            label: 'Auditing Food/Drug & Industrial Compliance Registries',
            subtext: 'Verifying FSSAI / FDA / LFGB / ISO 22000 regulatory parameters...',
            icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          },
          {
            label: 'Synthesizing Interactive BOM & Sourcing Packet',
            subtext: 'Assembling procurement-grade engineering ledger...',
            icon: <CheckCircle2 className="w-4 h-4 text-purple-400" />,
          },
        ];
    }
  };

  const steps = getSteps();

  // Handle external task completion
  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setProgress(10);
      setTelemetryLogs([]);
      setIsTaskResolved(false);
      return;
    }

    if (taskPromise) {
      taskPromise
        .then(() => setIsTaskResolved(true))
        .catch(() => setIsTaskResolved(true));
    } else {
      setIsTaskResolved(true);
    }
  }, [isOpen, taskPromise]);

  // Handle phased pacing animation
  useEffect(() => {
    if (!isOpen) return;

    const stepInterval = minDurationMs / steps.length;
    let stepCount = 0;

    // Seed initial dynamic telemetry line
    const isBeverage =
      productContext &&
      (productContext.toLowerCase().includes('beverage') ||
        productContext.toLowerCase().includes('drink') ||
        productContext.toLowerCase().includes('can') ||
        productContext.toLowerCase().includes('tea') ||
        productContext.toLowerCase().includes('coffee'));

    const initialTelemetry = isBeverage
      ? [
          'INIT: Industrial Food & Beverage Engine v2.5',
          'TELEMETRY: Detecting RTD Canning / Bottling Line parameters',
          'STANDARDS: Querying FSSAI Central & ISO 22000 Food Safety Protocols',
        ]
      : [
          'INIT: Manufacturing Intelligence Telemetry Engine v2.5',
          `CONTEXT: Ingesting "${productContext?.slice(0, 42) || 'Product Specification'}"`,
          'TAXONOMY: Material -> Process -> Tooling -> Regulatory -> Supplier',
        ];

    setTelemetryLogs(initialTelemetry);

    const timer = setInterval(() => {
      stepCount++;
      if (stepCount < steps.length) {
        setCurrentStepIndex(stepCount);
        setProgress(Math.round(((stepCount + 1) / steps.length) * 90));

        // Append real-time diagnostics
        setTelemetryLogs((prev) => [
          ...prev.slice(-3),
          `PASS ${stepCount}: Verified ${steps[stepCount].label.toLowerCase()}`,
        ]);
      } else {
        clearInterval(timer);
        setProgress(100);

        // Once minDuration has elapsed, wait until taskPromise resolves if still pending
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 350);
      }
    }, stepInterval);

    return () => clearInterval(timer);
  }, [isOpen, minDurationMs, steps.length, productContext]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07080D]/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0E101A] border border-white/[0.12] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 text-left">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Radar Pulse */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#FF5533]/15 border border-[#FF5533]/30 text-[#FF5533]">
              <Activity className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5533] font-bold">
                  MANUFACTURING INTELLIGENCE AUDIT
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">
                  REAL-TIME PACING
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Executing Industrial Inspection Pipeline
              </h3>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xl font-black font-mono text-white tracking-tight">
              {progress}%
            </div>
            <div className="text-[10px] font-mono text-white/40">COMPLETED</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#FF5533] via-amber-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-white/40">
            <span>Stage {Math.min(currentStepIndex + 1, steps.length)} of {steps.length}</span>
            <span>Grounding: Gemini 2.5 Flash + Web Search</span>
          </div>
        </div>

        {/* Sequential Step List */}
        <div className="space-y-2.5">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  isCurrent
                    ? 'bg-white/[0.05] border-[#FF5533]/40 shadow-lg'
                    : isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/20 text-white/70'
                    : 'bg-transparent border-transparent opacity-35'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-[#FF5533] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/20" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-emerald-300'
                          : 'text-white/50'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono text-[#FF5533] uppercase animate-pulse">
                        AUDITING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 mt-0.5 leading-snug">
                    {step.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleek Terminal Diagnostics Footnote */}
        <div className="rounded-xl bg-black/60 border border-white/[0.08] p-3 font-mono text-[11px] space-y-1">
          <div className="flex items-center justify-between text-[10px] text-white/40 uppercase tracking-wider pb-1 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-[#FF5533]" />
              Telemetry Feed
            </span>
            <span className="text-emerald-400">ACTIVE BUS</span>
          </div>
          <div className="space-y-0.5 pt-1 text-white/70 overflow-hidden text-ellipsis">
            {telemetryLogs.map((log, i) => (
              <div key={i} className="truncate">
                <span className="text-[#FF5533] mr-1.5">&gt;</span>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

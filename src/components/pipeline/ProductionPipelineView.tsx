import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductionMilestone, MilestoneStatus, InspectionMetric } from '../../types';
import {
  Kanban,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck2,
  Layers,
  Wrench,
  ShieldCheck,
  ChevronRight,
  Plus,
  ArrowRight,
  Cpu,
  Calendar,
  Building2,
  Sparkles,
  Printer,
  Download,
  Flame,
  Award,
} from 'lucide-react';
import { LegalRfqModal } from '../rfq/LegalRfqModal';

const INITIAL_MILESTONES: ProductionMilestone[] = [
  {
    id: 'ms-01',
    stepNumber: 1,
    code: 'MS-01',
    title: 'CAD & DFM Freeze',
    stage: 'Engineering Design & Geometry Lock',
    description:
      'Wall thicknesses (0.60mm SUS 304), draft angles (1.5°), parting lines, and deep draw necking radii signed off with factory tooling engineers.',
    status: 'passed_locked',
    targetWeeks: 1,
    completedDate: 'March 28, 2026',
    inspectorName: 'Senior DFM Engineer K. Mehta',
    metrics: [
      { id: 'm1', label: 'Nominal Wall Thickness', target: '0.60 mm', measured: '0.61 mm', unit: 'mm', pass: true },
      { id: 'm2', label: 'Mold Draft Angle', target: '≥ 1.5°', measured: '1.5°', unit: 'deg', pass: true },
      { id: 'm3', label: 'Surface Finish Roughness', target: 'Ra ≤ 0.8 µm', measured: 'Ra 0.72 µm', unit: 'µm', pass: true },
    ],
    deliverables: ['3D STEP Solid CAD Model', '2D GD&T Blueprint with ±0.05mm critical datum', 'DFM Feasibility Sign-Off Memo'],
    notes: 'Signed off with zero draft interferences. Ready for tooling block EDM cutting.',
  },
  {
    id: 'ms-02',
    stepNumber: 2,
    code: 'MS-02',
    title: 'Legal RFQ & MSA Execution',
    stage: 'Commercial Binding & Tooling Bailment',
    description:
      'Master Supply Agreement countersigned. Tooling ownership retention clause locked (Buyer owns 100% of stamping dies). Defect scrap cap ratified at <1.8%.',
    status: 'passed_locked',
    targetWeeks: 1,
    completedDate: 'April 02, 2026',
    inspectorName: 'Procurement Counsel R. Varma',
    metrics: [
      { id: 'm4', label: 'Buyer Tooling Title Retention', target: '100% Buyer', measured: '100% Buyer Title', unit: '%', pass: true },
      { id: 'm5', label: 'Defect Scrap Ceiling Cap', target: '≤ 1.80%', measured: '1.80% Capped', unit: '%', pass: true },
      { id: 'm6', label: 'Inspection AQL Standard', target: 'Level II Normal', measured: 'AQL 1.0 / 2.5', unit: 'standard', pass: true },
    ],
    deliverables: ['Executed Master Supply Agreement', 'Tooling Bailment Certificate with serial tags', '30% NRE Wire Confirmation'],
    notes: 'Tooling ownership retention explicitly registered on factory machinery ledger.',
  },
  {
    id: 'ms-03',
    stepNumber: 3,
    code: 'MS-03',
    title: 'T1 Tooling & First Shot',
    stage: 'Tooling Fabrication & Mold Trial 1',
    description:
      'Hardened H13 steel mold and 500-ton hydraulic deep drawing dies machined. First 25 trial units stamped and molded to audit parting line flash, sink marks, and gate vestige.',
    status: 'in_progress',
    targetWeeks: 3,
    inspectorName: 'Chief Toolmaker S. Patil',
    metrics: [
      { id: 'm7', label: 'Necking Uniformity', target: '±0.08 mm', measured: '±0.06 mm', unit: 'mm', pass: true },
      { id: 'm8', label: 'Injection Parting Flash', target: '< 0.05 mm', measured: '0.04 mm', unit: 'mm', pass: true },
      { id: 'm9', label: 'Shot Cycle Time', target: '22 sec', measured: '25 sec', unit: 's', pass: false },
    ],
    deliverables: ['25 Pcs T1 Sample Batch', 'Die Spotting Blue Contact Report', 'CMM Coordinate Dimensional Report'],
    notes: 'Shot cycle time is currently 25s, mold cooling channel flow rate being re-calibrated to hit 22s target.',
  },
  {
    id: 'ms-04',
    stepNumber: 4,
    code: 'MS-04',
    title: 'CMM Metrology & Stress Testing',
    stage: 'Optical Inspection & Physical Lab Stress',
    description:
      'Zeiss Coordinate Measuring Machine (CMM) multi-point coordinate verification. 1.5-meter concrete drop testing across 6 orientations. Vacuum seal hold test at 3.5 bar.',
    status: 'review_required',
    targetWeeks: 2,
    inspectorName: 'QA Lab Director A. Deshmukh',
    metrics: [
      { id: 'm10', label: 'Cap Thread Pitch Variance', target: '±0.05 mm', measured: '±0.03 mm', unit: 'mm', pass: true },
      { id: 'm11', label: '1.5m 6-Axis Drop Test', target: '0 Structural Failure', measured: '0 Cracks / No leak', unit: 'drops', pass: true },
      { id: 'm12', label: 'Vacuum Chamber Seal Hold', target: '≥ 24 hrs at 3.5 bar', measured: '28 hrs maintained', unit: 'hrs', pass: true },
    ],
    deliverables: ['Full CMM Deviation Inspection Log', 'High-Speed Drop Test Impact Video', 'Pressure Decay Vacuum Test Certificate'],
    notes: 'Passed all mechanical drop tests. Awaiting final laser spectrometer material purity sign-off.',
  },
  {
    id: 'ms-05',
    stepNumber: 5,
    code: 'MS-05',
    title: 'Golden Sample (T2) Countersign',
    stage: 'Definitive Physical Master Lock',
    description:
      'Definitive master sample batch (5 units) produced with full production powder coat, laser etching, and silicone gasket assembly. Physical inspection and dual countersignature by Founder and Chief Quality Engineer.',
    status: 'not_started',
    targetWeeks: 1,
    metrics: [
      { id: 'm13', label: 'Cosmetic Surface Purity', target: 'Class A Zero Blemish', measured: 'Pending T2 Run', unit: 'grade', pass: false },
      { id: 'm14', label: 'Laser Etch Depth', target: '0.12 ±0.02 mm', measured: 'Pending', unit: 'mm', pass: false },
      { id: 'm15', label: 'Tamper Master Serial Tag', target: 'Dual Hologram Verified', measured: 'Pending', unit: 'tag', pass: false },
    ],
    deliverables: ['2 Sealed Master Samples (Factory Vault)', '2 Sealed Master Samples (Founder HQ)', 'Golden Sample Acceptance Certificate'],
    notes: 'Scheduled for production as soon as T1 cycle time calibration is locked.',
  },
  {
    id: 'ms-06',
    stepNumber: 6,
    code: 'MS-06',
    title: 'Mass Production Release (SOP)',
    stage: 'Commercial Start of Production (SOP)',
    description:
      'Full pilot batch of 1,000 units. Conveyor speed calibration, automated packaging, pre-shipment random inspection (AQL 1.0/2.5), and bill of lading clearance.',
    status: 'not_started',
    targetWeeks: 4,
    metrics: [
      { id: 'm16', label: 'Pilot Batch First-Pass Yield', target: '≥ 98.2%', measured: 'Pending SOP', unit: '%', pass: false },
      { id: 'm17', label: 'In-line Packaging Seal Rate', target: '100% Hermetic', measured: 'Pending', unit: '%', pass: false },
      { id: 'm18', label: 'Factory to Port Drayage', target: '≤ 24 hrs to JNPT', measured: 'Pending', unit: 'hrs', pass: false },
    ],
    deliverables: ['Pre-Shipment Inspection (PSI) Certificate', 'Container Seal & Bill of Lading (B/L)', 'Final Production QC Audit Packet'],
    notes: 'Factory slot reserved on Line 2 deep drawing press.',
  },
];

export const ProductionPipelineView: React.FC = () => {
  const { activeProject, setActiveView, openAiDrawer } = useApp();
  const [milestones, setMilestones] = useState<ProductionMilestone[]>(INITIAL_MILESTONES);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('ms-03');
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'passed_locked'>('all');

  const selectedMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];

  // Calculate overall pipeline progress
  const completedCount = milestones.filter((m) => m.status === 'passed_locked').length;
  const inProgressCount = milestones.filter(
    (m) => m.status === 'in_progress' || m.status === 'review_required'
  ).length;
  const progressPercent = Math.round(
    ((completedCount + inProgressCount * 0.5) / milestones.length) * 100
  );

  const handleUpdateStatus = (id: string, newStatus: MilestoneStatus) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: newStatus,
            completedDate:
              newStatus === 'passed_locked'
                ? new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : m.completedDate,
          };
        }
        return m;
      })
    );
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'passed_locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            PASSED & LOCKED
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Clock className="w-3 h-3 animate-spin" />
            IN PROGRESS
          </span>
        );
      case 'review_required':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            REVIEW REQUIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-white/40 border border-white/[0.06]">
            NOT STARTED
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
      {/* Top Header Card */}
      <div className="panel-precision p-5 sm:p-6 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FF5533]/15 text-[#FF5533] border border-[#FF5533]/25 uppercase tracking-wider">
                <Kanban className="w-3 h-3" />
                Physical Hardware Pipeline
              </span>
              <span className="text-xs font-mono text-white/40">
                PRD Milestone Standard 20 & 34
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Golden Sample (T1/T2) Milestone Tracker
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl leading-relaxed">
              Track physical tooling verification, optical metrology, drop testing, and golden sample sign-offs for{' '}
              <span className="text-white font-medium">"{activeProject?.title}"</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Generate Legal RFQ Packet */}
            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.09]"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Legal RFQ</span>
            </button>

            {/* AI Co-Founder DFM Review */}
            <button
              onClick={() =>
                openAiDrawer({
                  type: 'project',
                  data: activeProject,
                })
              }
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FF5533] hover:bg-[#E04626] text-white shadow-lg shadow-[#FF5533]/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Co-Founder</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Key Pipeline Metrics */}
        <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 uppercase block">Pipeline Progress</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-bold text-white">{progressPercent}%</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF5533] to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 uppercase block">Current Phase</span>
            <span className="text-sm font-bold text-cyan-400 mt-1 block truncate">
              {milestones.find((m) => m.status === 'in_progress')?.title || 'T1 First Shot'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 uppercase block">Est. Time to SOP</span>
            <span className="text-sm font-bold text-white mt-1 block">
              4-6 Weeks (On Schedule)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-white/40 uppercase block">Lead Partner Facility</span>
            <span className="text-sm font-bold text-white/90 mt-1 block truncate">
              Hind Monobloc (Pune)
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Milestone Rail (Left) + Selected Milestone Deep Dive (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 Milestones Interactive Stepper (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              Production Milestones ({milestones.length})
            </span>
            <span className="text-[11px] font-mono text-emerald-400">
              {completedCount} of {milestones.length} Locked
            </span>
          </div>

          <div className="space-y-2.5">
            {milestones.map((m) => {
              const isSelected = m.id === selectedMilestoneId;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMilestoneId(m.id)}
                  className={`panel-card-hover p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#151926] border-[#FF5533]/50 shadow-md'
                      : 'bg-[#0E1019] border-white/[0.07] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          m.status === 'passed_locked'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'in_progress'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : m.status === 'review_required'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-white/[0.05] text-white/40 border border-white/[0.08]'
                        }`}
                      >
                        {m.code.replace('MS-0', '')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-tight">{m.title}</h4>
                        <span className="text-[10px] font-mono text-white/40 block">
                          {m.stage}
                        </span>
                      </div>
                    </div>

                    <div>{getStatusBadge(m.status)}</div>
                  </div>

                  <p className="text-[11px] text-white/60 mt-2 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
                    <span>
                      {m.completedDate ? `Completed: ${m.completedDate}` : `Target: ${m.targetWeeks}w`}
                    </span>
                    <span className="text-[#FF5533] font-semibold flex items-center gap-0.5">
                      View Inspection Specs →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Inspection Details & Metric Logger (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Milestone Card */}
          <div className="panel-precision p-5 sm:p-6 rounded-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#FF5533]">
                    {selectedMilestone.code}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-mono text-white/50 uppercase">
                    {selectedMilestone.stage}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  {selectedMilestone.title}
                </h2>
              </div>

              {/* Status Switcher Selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/40">Status:</span>
                <select
                  value={selectedMilestone.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedMilestone.id, e.target.value as MilestoneStatus)
                  }
                  className="bg-[#121522] border border-white/[0.12] rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-[#FF5533]"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review_required">Review Required</option>
                  <option value="passed_locked">Passed & Locked</option>
                </select>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {selectedMilestone.description}
            </p>

            {/* Inspection & Lab Metrics Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  Dimensional & Physical Lab Test Readings
                </h3>
                <span className="text-[11px] font-mono text-white/40">
                  {selectedMilestone.metrics.length} Parameters Measured
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/25">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[10px] font-mono text-white/40 uppercase">
                      <th className="py-2.5 px-3">Inspection Parameter</th>
                      <th className="py-2.5 px-3">Target Spec</th>
                      <th className="py-2.5 px-3">Measured Lab Value</th>
                      <th className="py-2.5 px-3 text-right">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] font-mono">
                    {selectedMilestone.metrics.map((metric) => (
                      <tr key={metric.id} className="hover:bg-white/[0.01]">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {metric.label}
                        </td>
                        <td className="py-2.5 px-3 text-white/60">{metric.target}</td>
                        <td className="py-2.5 px-3 font-bold text-white">{metric.measured}</td>
                        <td className="py-2.5 px-3 text-right">
                          {metric.pass ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              PASS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              <Clock className="w-2.5 h-2.5" />
                              IN AUDIT
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checklist of Deliverables & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                  Mandatory Phase Deliverables
                </h4>
                <ul className="space-y-1.5 text-xs text-white/80">
                  {selectedMilestone.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Toolmaker & Metrology Notes
                </h4>
                <p className="text-xs text-white/70 leading-relaxed italic">
                  "{selectedMilestone.notes || 'No special engineering caveats flagged.'}"
                </p>
                {selectedMilestone.inspectorName && (
                  <div className="text-[10px] font-mono text-white/40 pt-2 border-t border-white/[0.06]">
                    Audit Lead: {selectedMilestone.inspectorName}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setIsRfqModalOpen(true)}
                className="btn-tactile text-xs font-semibold text-[#FF5533] hover:underline flex items-center gap-1"
              >
                <span>View Protective RFQ / MSA Terms for this Milestone →</span>
              </button>

              <button
                onClick={() =>
                  handleUpdateStatus(
                    selectedMilestone.id,
                    selectedMilestone.status === 'passed_locked'
                      ? 'in_progress'
                      : 'passed_locked'
                  )
                }
                className={`btn-tactile px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  selectedMilestone.status === 'passed_locked'
                    ? 'bg-white/[0.06] text-white/80 hover:bg-white/[0.1]'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20'
                }`}
              >
                {selectedMilestone.status === 'passed_locked'
                  ? 'Re-Open Milestone Audit'
                  : 'Pass & Lock Milestone ✓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legal RFQ Document Modal */}
      <LegalRfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        project={activeProject}
      />
    </div>
  );
};

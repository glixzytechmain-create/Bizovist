import React, { useState } from 'react';
import { Project, BomComponent } from '../../types';
import {
  X,
  Printer,
  Download,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Wrench,
  Scale,
  Calendar,
  Building,
  User,
  Copy,
  Check,
} from 'lucide-react';

interface LegalRfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  targetManufacturerName?: string;
}

export const LegalRfqModal: React.FC<LegalRfqModalProps> = ({
  isOpen,
  onClose,
  project,
  targetManufacturerName = 'Hind Monobloc & Extrusions Pvt Ltd',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const rfqRef = `RFQ-BZV-${project.id.replace('proj-', '').toUpperCase()}-2026-REV1`;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `BIZOVIST OFFICIAL PROCUREMENT RFQ PACKET
Reference: ${rfqRef}
Date: ${currentDate}
Project: ${project.title}
Target MOQ: ${project.targetMOQ.toLocaleString()} ${project.moqUnit}
Target Lead Time: ${project.targetLeadTime || '6-8 weeks'}

MASTER SUPPLY AGREEMENT TERMS:
1. Tooling & Die Ownership: 100% Buyer Ownership Retention.
2. Defect & Scrap Cap: Maximum 1.8% lot defect allowance.
3. Quality Standard: ISO 2859-1 Level II Normal (AQL 1.0 Major / 2.5 Minor).
4. Payment Schedule: 30% Tooling deposit, 40% T1 sample approval, 30% against B/L.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0D0F18] border border-white/[0.1] shadow-2xl overflow-hidden print-document-container text-left">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 border-b border-white/[0.08] bg-[#121522] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5533]/15 border border-[#FF5533]/30 flex items-center justify-center text-[#FF5533]">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <span>Official Procurement RFQ & MSA Packet</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  READY FOR EXECUTION
                </span>
              </h3>
              <p className="text-[11px] text-white/50 font-mono">
                Ref: {rfqRef} • Master Supply Terms Included
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/[0.08]"
              title="Copy Summary Text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="btn-tactile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5533] hover:bg-[#E04626] text-white shadow-md shadow-[#FF5533]/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#0B0D14] text-white font-sans">
          {/* Header block with Formal Border */}
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-white/[0.08] pb-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  BIZOVIST INDUSTRIAL SOURCING PLATFORM
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                  REQUEST FOR QUOTATION (RFQ)
                </h1>
                <div className="text-xs font-mono text-[#FF5533] font-semibold mt-0.5">
                  & MASTER PRODUCTION AGREEMENT SPECIFICATION
                </div>
              </div>

              <div className="text-right font-mono text-xs space-y-1">
                <div>
                  <span className="text-white/40">DOCUMENT REF: </span>
                  <span className="font-bold text-white">{rfqRef}</span>
                </div>
                <div>
                  <span className="text-white/40">EFFECTIVE DATE: </span>
                  <span className="text-white/80">{currentDate}</span>
                </div>
                <div>
                  <span className="text-white/40">CLASSIFICATION: </span>
                  <span className="text-amber-400 font-semibold">STRICT CONFIDENTIAL</span>
                </div>
              </div>
            </div>

            {/* Parties Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">Buyer / Procurement Authority</span>
                <p className="font-bold text-white text-sm">Founder Hardware Operations</p>
                <p className="text-white/60">Project: {project.title}</p>
                <p className="text-white/50">Industry: {project.industry}</p>
              </div>

              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-[10px] text-white/40 uppercase block">Addressed Manufacturer Facility</span>
                <p className="font-bold text-white text-sm">{targetManufacturerName}</p>
                <p className="text-white/60">Scope: Turnkey Tooling, Pilot Sampling & Mass Production</p>
                <p className="text-white/50">Target Port Drayage: JNPT / Mundra West Coast Corridor</p>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Scope & Commercial Targets */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[10px] text-white font-bold">1</span>
              <span>Commercial & Production Targets</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-white/40 uppercase block">Baseline Order MOQ</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {project.targetMOQ.toLocaleString()} {project.moqUnit}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-white/40 uppercase block">Target Unit Cost</span>
                <span className="font-bold text-[#FF5533] text-sm mt-0.5 block">
                  {project.targetUnitCost || '$3.40 - $4.85 / unit'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-white/40 uppercase block">Target Lead Time</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {project.targetLeadTime || '6-8 Weeks'}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-white/40 uppercase block">T1 Sample Cycle</span>
                <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
                  {project.toolingSummary?.goldenSampleLeadTimeWeeks || 2} Weeks
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Bill of Materials & Technical Specifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[10px] text-white font-bold">2</span>
              <span>Engineering Bill of Materials (BOM) & Tooling NRE</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/30">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.03] text-[10px] font-mono text-white/50 uppercase">
                    <th className="py-2.5 px-3">Part Name</th>
                    <th className="py-2.5 px-3">Material Grade</th>
                    <th className="py-2.5 px-3">Process</th>
                    <th className="py-2.5 px-3">Tooling Type</th>
                    <th className="py-2.5 px-3">Est. Tooling NRE</th>
                    <th className="py-2.5 px-3">Tolerance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] font-mono">
                  {project.components && project.components.length > 0 ? (
                    project.components.map((c: BomComponent, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.01]">
                        <td className="py-2.5 px-3 font-semibold text-white">{c.name}</td>
                        <td className="py-2.5 px-3 text-white/80">{c.materialGrade}</td>
                        <td className="py-2.5 px-3 text-white/70">{c.manufacturingProcess}</td>
                        <td className="py-2.5 px-3 text-white/70">{c.toolingType}</td>
                        <td className="py-2.5 px-3 font-semibold text-cyan-400">{c.toolingCostEstimate}</td>
                        <td className="py-2.5 px-3 text-amber-300">{c.tolerance}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-white/40">
                        Default assembly specifications apply.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Binding Master Supply Agreement (MSA) Clauses */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[10px] text-white font-bold">3</span>
              <span>Protective Master Supply Agreement (MSA) Clauses</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Clause 1: Tooling Ownership */}
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ARTICLE 3.1: BUYER TOOLING & DIE OWNERSHIP RETENTION</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  All custom dies, stamping punches, molds, jigs, fixtures, gauges, and CNC fixtures fabricated for this project remain the sole, exclusive, and unencumbered personal property of Buyer upon payment of the agreed NRE deposit. Manufacturer shall tag all tooling with Buyer's serial tag and shall not use, modify, or repurpose tooling for any third-party production under penalty of immediate injunction and liquidated damages. Tooling must be released to Buyer upon 5 days written notice.
                </p>
              </div>

              {/* Clause 2: Scrap Cap */}
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>ARTICLE 3.2: DEFECT RATE & SCRAP ALLOWANCE CAP (1.8% CEILING)</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  Scrap and defect allowance during progressive production is capped at a strict maximum of 1.80% of total lot quantity. Any defect overruns beyond this cap shall be replaced and remanufactured at Manufacturer's sole expense, including raw material, machine hours, and expedited shipping surcharges.
                </p>
              </div>

              {/* Clause 3: Quality Standard */}
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>ARTICLE 3.3: QUALITY BENCHMARK (ISO 2859-1 / ANSI ASQ Z1.4 LEVEL II)</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  Finished goods shall be inspected pursuant to ANSI/ASQ Z1.4 Level II Normal sampling plan. Acceptance Quality Limit (AQL) is specified at AQL 1.0 for Major Functional Defects (leaks, critical thread tolerance, structural cracks) and AQL 2.5 for Minor Cosmetic Defects (minor powder-coat scratches &lt; 0.5mm). Lots failing AQL criteria are rejected in toto.
                </p>
              </div>

              {/* Clause 4: Payment Terms */}
              <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>ARTICLE 3.4: MILESTONE PAYMENT SCHEDULE</span>
                </div>
                <p className="text-white/70 leading-relaxed text-[11px]">
                  1. Tooling NRE: 30% upon signing CAD freeze, 40% upon physical approval of T1 Golden Sample, 30% upon completion of first 1,000 unit production run.
                  <br />
                  2. Mass Production: 30% advance deposit for raw material procurement, 70% balance payable upon passed Pre-Shipment Inspection (PSI) and surrender of Clean on Board Bill of Lading (B/L).
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Authorized Countersignatures */}
          <div className="pt-4 border-t border-white/[0.08] space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
              Authorized Signatures & Execution
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.01] space-y-6">
                <div className="text-xs font-mono text-white/60">FOR BUYER (PROCURING ENTITY):</div>
                <div className="border-b border-white/20 h-10 flex items-end pb-1 font-mono text-xs text-white/40 italic">
                  [Authorized Digital Signature / Founder]
                </div>
                <div className="text-[11px] font-mono text-white/50 space-y-0.5">
                  <div>Name: Hardware Operations Director</div>
                  <div>Date: {currentDate}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.01] space-y-6">
                <div className="text-xs font-mono text-white/60">FOR SUPPLIER (MANUFACTURER):</div>
                <div className="border-b border-white/20 h-10 flex items-end pb-1 font-mono text-xs text-white/40 italic">
                  [Authorized Representative Signature & Facility Seal]
                </div>
                <div className="text-[11px] font-mono text-white/50 space-y-0.5">
                  <div>Company: {targetManufacturerName}</div>
                  <div>Date: ________________________</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Hidden when printing) */}
        <div className="no-print p-4 border-t border-white/[0.08] bg-[#121522] flex items-center justify-between text-xs font-mono text-white/50">
          <div>BIZOVIST Manufacturing Intelligence • Validated Contract Spec</div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-tactile px-4 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-white/80 border border-white/[0.08]"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="btn-tactile inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FF5533] hover:bg-[#E04626] text-white font-semibold"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Packet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

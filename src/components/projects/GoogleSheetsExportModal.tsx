import React, { useState } from 'react';
import { Project, Manufacturer } from '../../types';
import {
  X,
  FileSpreadsheet,
  Download,
  ExternalLink,
  CheckCircle2,
  Copy,
  Table,
  Sparkles,
} from 'lucide-react';

interface GoogleSheetsExportModalProps {
  project: Project | null;
  manufacturers: Manufacturer[];
  onClose: () => void;
}

export const GoogleSheetsExportModal: React.FC<GoogleSheetsExportModalProps> = ({
  project,
  manufacturers,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!project) return null;

  // Generate CSV data representation compatible with Google Sheets & Drive
  const generateCsvData = () => {
    let csv = `BIZOVIST MANUFACTURING BOM & RFQ SPECIFICATION SHEET\n`;
    csv += `Project Title,${project.title}\n`;
    csv += `Industry,${project.industry}\n`;
    csv += `Target Initial MOQ,${project.targetMOQ} ${project.moqUnit}\n`;
    csv += `Target Unit Cost,${project.targetUnitCost || 'TBD'}\n`;
    csv += `Preferred Geography,${project.locationPreference || 'Global'}\n\n`;

    csv += `ENGINEERING SPECIFICATIONS & TOLERANCES\n`;
    csv += `Dimension,Target Value,Importance\n`;
    project.specifications.forEach((s) => {
      csv += `"${s.dimension}","${s.value}","${s.importance}"\n`;
    });

    csv += `\nMANUFACTURING REQUIREMENTS CHECKLIST\n`;
    csv += `Requirement,Status,Engineering Note\n`;
    project.requirements.forEach((r) => {
      csv += `"${r.name}","${r.status}","${r.note}"\n`;
    });

    csv += `\nBILL OF MATERIALS (BOM)\n`;
    csv += `Material Item,Process Required\n`;
    project.materials.forEach((m, idx) => {
      csv += `"${m}","${project.processes[idx] || project.processes[0] || 'Standard'}"\n`;
    });

    csv += `\nMATCHED PRECISION FACILITIES\n`;
    csv += `Facility Name,Location,Standard MOQ,Lead Time,Nearest Port\n`;
    manufacturers.slice(0, 3).forEach((m) => {
      csv += `"${m.name}","${m.location}","${m.moq} ${m.moqUnit}","${m.leadTimeAvgWeeks} weeks","${m.nearestPort || 'Regional'}"\n`;
    });

    return csv;
  };

  const handleDownloadCsv = () => {
    const csvContent = generateCsvData();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.title.toLowerCase().replace(/\s+/g, '_')}_bom_sheets.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleCopyClipboard = () => {
    const csvContent = generateCsvData();
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Google Sheets import template link
  const googleSheetsNewTemplateUrl = 'https://docs.google.com/spreadsheets/u/0/create';

  return (
    <div className="fixed inset-0 z-50 bg-[#07080C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#11131E] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left my-auto space-y-5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Sheets & Drive BOM Export</h3>
              <p className="text-xs text-white/50">Formulation, Tolerances & Supplier Comparison Matrix</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration details */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 text-xs leading-relaxed">
          <p className="text-white/80">
            Export the complete decomposed manufacturing architecture for <strong className="text-white">"{project.title}"</strong> directly into Google Sheets. The export includes BOM items, tolerance thresholds, regulatory milestones, and shortlisted facilities with MOQ benchmarks.
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
              <span className="text-white/40 uppercase block">Specifications Count</span>
              <span className="font-bold text-white mt-0.5 block">{project.specifications.length} Tolerances</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.04]">
              <span className="text-white/40 uppercase block">Shortlisted Candidates</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">{manufacturers.length} Facilities Indexed</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadCsv}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl text-xs font-semibold bg-[#FF5533] hover:bg-[#E04626] text-white transition flex items-center justify-center gap-2 shadow-lg shadow-[#FF5533]/25"
          >
            <Download className="w-4 h-4" />
            <span>{downloaded ? 'Downloaded Successfully!' : 'Download CSV for Google Sheets'}</span>
          </button>

          <button
            onClick={handleCopyClipboard}
            className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.08] transition flex items-center justify-center gap-2"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Sheet Data'}</span>
          </button>

          <a
            href={googleSheetsNewTemplateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto py-3 px-4 rounded-xl text-xs font-medium bg-white text-black hover:bg-white/90 transition flex items-center justify-center gap-1.5"
          >
            <span>Open Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

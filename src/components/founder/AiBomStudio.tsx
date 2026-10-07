import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AIAnalysisResult, BomComponent, RequirementStatus } from '../../types';
import { aiService } from '../../services/aiService';
import {
  Sparkles,
  Send,
  Download,
  FileSpreadsheet,
  ArrowRight,
  Layers,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiBomStudio: React.FC = () => {
  const {
    latestAnalysis,
    activeProject,
    setActiveProject,
    createProjectFromAnalysis,
    refineBomWithAi,
    setActiveView,
    isInterpreting,
  } = useApp();

  // Active BOM state fallback to shaker bottle if not set
  const currentBOM: AIAnalysisResult = latestAnalysis || {
    projectName: activeProject?.title || 'Insulated Matte-Black Stainless Steel Shaker Bottle',
    summary:
      activeProject?.summary ||
      'Double-wall vacuum insulated 24oz stainless steel shaker bottle with leakproof twist-lock spout lid, silent agitator, and durable matte powder-coat finish for fitness brands.',
    industry: activeProject?.industry || 'Consumer Goods & Fitness Hardware',
    productCategory: activeProject?.productCategory || 'Drinkware & Insulated Containers',
    materials: activeProject?.materials || [
      '304 Stainless Steel (Body)',
      '316 Surgical Stainless (Agitator)',
      'BPA-Free Polypropylene (Lid)',
      'Food-grade Liquid Silicone (Seals)',
    ],
    processes: activeProject?.processes || [
      'Deep Drawing & Hydroforming',
      'Vacuum Brazing / Sealing',
      'Powder Coating & Laser Engraving',
      'Multi-Cavity Injection Molding',
    ],
    machineryNeeded: activeProject?.machineryNeeded || [
      'Hydraulic Deep Drawing Press (500T)',
      'Rotary Laser Welding System',
      'High-Vacuum Degassing Furnace',
      'Electrostatic Powder Spray Line',
    ],
    targetMOQ: activeProject?.targetMOQ || 10000,
    moqUnit: activeProject?.moqUnit || 'units',
    targetUnitCostEstimate: activeProject?.targetUnitCost || '$3.40 - $4.85 / unit',
    targetLeadTime: activeProject?.targetLeadTime || '6-8 weeks',
    locationPreference: activeProject?.locationPreference || 'India (Pune / Gujarat precision clusters)',
    components: activeProject?.components || [
      {
        name: 'Outer Vacuum Flask Body',
        materialGrade: 'SUS 304 Stainless Steel (0.6mm thickness)',
        manufacturingProcess: 'Deep Drawing, Necking & Hydroforming',
        toolingType: 'Progressive Deep Draw Stamping Die',
        toolingCostEstimate: '$3,800 - $5,500',
        unitCostContribution: '$1.75 - $2.40',
        tolerance: '+/- 0.08 mm',
      },
      {
        name: 'Inner Liquid Liner',
        materialGrade: 'SUS 304 / 316 Stainless Steel (0.5mm thickness)',
        manufacturingProcess: 'Deep Draw, Electropolish & Ultrasonic Wash',
        toolingType: 'Deep Draw Cavity Die',
        toolingCostEstimate: '$2,800 - $4,200',
        unitCostContribution: '$1.10 - $1.65',
        tolerance: '+/- 0.05 mm',
      },
      {
        name: 'Leakproof Spout Lid Closure',
        materialGrade: 'Food-grade BPA-Free Polypropylene (PP)',
        manufacturingProcess: 'Precision Multi-Cavity Injection Molding',
        toolingType: 'H13 Steel 4-Cavity Injection Mold',
        toolingCostEstimate: '$4,500 - $6,500',
        unitCostContribution: '$0.55 - $0.85',
        tolerance: '+/- 0.03 mm',
      },
      {
        name: 'High-Velocity Agitator / Whisk',
        materialGrade: 'Food-grade 316 Stainless Steel Wire',
        manufacturingProcess: 'Automatic CNC Wire Spring Coiling',
        toolingType: 'Standard Coiler Tooling (No NRE)',
        toolingCostEstimate: '$0 (Stock Tooling)',
        unitCostContribution: '$0.20 - $0.35',
        tolerance: '+/- 0.10 mm',
      },
      {
        name: 'Hermetic Gasket & O-Ring Seals',
        materialGrade: 'Food-Grade Liquid Silicone Rubber (LSR)',
        manufacturingProcess: 'LSR Liquid Injection Molding',
        toolingType: 'LSR 8-Cavity Mold',
        toolingCostEstimate: '$1,800 - $2,600',
        unitCostContribution: '$0.15 - $0.25',
        tolerance: '+/- 0.02 mm',
      },
      {
        name: 'Exterior Coating & Branding',
        materialGrade: 'Matte Black TGIC-Free Polyester Powder Coat',
        manufacturingProcess: 'Electrostatic Spray & Infrared Thermal Cure',
        toolingType: 'Custom Holding Fixtures & Laser Mask',
        toolingCostEstimate: '$600 - $900',
        unitCostContribution: '$0.35 - $0.55',
        tolerance: 'Coating thickness 60-80 µm',
      },
    ],
    toolingSummary: activeProject?.toolingSummary || {
      totalToolingNre: '$13,500 - $19,700',
      toolingLeadTimeWeeks: 4,
      goldenSampleLeadTimeWeeks: 2,
      massProductionWeeks: 6,
    },
    requirements: (activeProject?.requirements || [
      {
        id: 'req-1',
        name: 'Double-Wall Vacuum Thermal Insulation',
        category: 'Thermal',
        status: 'confirmed',
        note: '24-hour cold retention / 12-hour hot retention with copper vacuum lining',
        evidenceType: 'confirmed',
      },
      {
        id: 'req-2',
        name: 'Zero-Leak Hermetic Seal at 1.5 Bar',
        category: 'Closure',
        status: 'confirmed',
        note: 'Dual food-grade silicone seals with twist-lock latch tested to 1.5 bar internal pressure',
        evidenceType: 'confirmed',
      },
      {
        id: 'req-3',
        name: 'Ultra-Durable Matte Black Powder Coating',
        category: 'Surface Finish',
        status: 'confirmed',
        note: 'Cross-hatch adhesion ASTM D3359 Class 5B and 100-cycle dishwasher safe',
        evidenceType: 'confirmed',
      },
      {
        id: 'req-4',
        name: 'Electropolished 304/316 Odor-Free Interior',
        category: 'Food Contact',
        status: 'likely',
        note: 'Electropolishing eliminates micro-crevices preventing protein shake residue odor buildup',
        evidenceType: 'ai_inference',
      },
    ]).map((r) => ({
      name: r.name,
      status: r.status,
      note: r.note,
    })),
    specifications: (activeProject?.specifications || [
      { id: 'spec-1', dimension: 'Thermal Insulation Retention', value: '< 10°C cold at 24 hours (tested at 22°C ambient)', importance: 'critical' },
      { id: 'spec-2', dimension: 'Internal Capacity', value: '750 ml (24 oz) +/- 15 ml', importance: 'critical' },
      { id: 'spec-3', dimension: 'Powder Coat Thickness', value: '65 µm +/- 10 µm (scratch resistance > 3H pencil)', importance: 'high' },
      { id: 'spec-4', dimension: 'Drop Shock Resistance', value: '1.2m drop test onto concrete without vacuum loss', importance: 'critical' },
    ]).map((s) => ({
      dimension: s.dimension,
      value: s.value,
      importance: s.importance,
    })),
    regulatoryConsiderations: activeProject?.regulatoryConsiderations || [
      'FDA 21 CFR 175.300 & LFGB Food Contact Safety',
      'California Proposition 65 Heavy Metal Compliance (Lead/Cadmium Free)',
      'ISO 9001:2015 Quality Management System at Production Facility',
      'BPA/BPS-Free Certification on all Polypropylene & Silicone components',
    ],
    clarifyingQuestions: activeProject?.keyQuestionsForManufacturers || [
      'Do you require automated in-line vacuum testing machines (thermal sensor drop check) for 100% of units?',
      'What is your standard tooling lead time for custom PP lid mold sampling (T1 samples)?',
      'Can you provide automated rotary laser etching for individual founder logos in-house?',
    ],
  };

  // Conversational state with AI Co-Founder
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: `Welcome to the AI BOM Studio! I have decomposed your product intent into an official industrial Bill of Materials (BOM), tooling breakdown, and engineering tolerance envelope.\n\nKey Engineering Trade-offs:\n• **304 vs 316 Stainless Steel**: We specified SUS 304 for the outer hydroformed vacuum wall ($1.75-$2.40) and food-grade 316 wire for the high-velocity agitator to prevent acid etching.\n• **Tooling NRE**: Stamping dies + 4-cavity injection molds are estimated at $13.5k - $19.7k total.\n\nTell me if you want to swap materials, tweak tolerances, adjust MOQ, or add custom branding!`,
      timestamp: 'Just now',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isInterpreting]);

  const handleSendMessage = async (customInstruction?: string) => {
    const textToSend = customInstruction || inputMessage.trim();
    if (!textToSend || isInterpreting) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customInstruction) setInputMessage('');

    try {
      const updatedAnalysis = await refineBomWithAi(textToSend);
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Updated BOM & Tooling parameters applied! Modified specs, updated cost contributions, and adjusted tooling lead times are reflected live in the engineering matrix.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorReply: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `I made a localized adjustment, but encountered a transient network condition: ${err.message || 'Engine timeout'}. Current parameters remain preserved.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  const handleExportSheets = async () => {
    setExporting(true);
    setExportNotice(null);
    try {
      const projectPayload = {
        title: currentBOM.projectName,
        industry: currentBOM.industry,
        targetMOQ: currentBOM.targetMOQ,
        moqUnit: currentBOM.moqUnit,
        targetUnitCost: currentBOM.targetUnitCostEstimate,
        targetLeadTime: currentBOM.targetLeadTime,
        components: currentBOM.components,
        specifications: currentBOM.specifications,
        requirements: currentBOM.requirements,
      };

      const res = await aiService.exportProjectToSheets(projectPayload);
      if (res.csvContent) {
        // Trigger direct browser CSV download
        const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', res.downloadFilename || `${currentBOM.projectName.toLowerCase().replace(/\s+/g, '-')}-bom.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setExportNotice(`Official procurement BOM spreadsheet exported! File "${res.downloadFilename}" ready for Google Sheets.`);
        setTimeout(() => setExportNotice(null), 5000);
      }
    } catch (err: any) {
      setExportNotice(`Export failed: ${err.message || 'Unknown error'}`);
      setTimeout(() => setExportNotice(null), 5000);
    } finally {
      setExporting(false);
    }
  };

  const handleProceedToDiscovery = () => {
    createProjectFromAnalysis(currentBOM);
    setActiveView('discover');
  };

  const quickRefinementChips = [
    'Upgrade body to 316 Surgical Grade',
    'Add leakproof flip-cap with LSR gasket',
    'Lower initial target MOQ to 5,000 units',
    'Add laser etching & powder coat branding',
    'Minimize tooling NRE for pilot budget',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
      {/* Top Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#141624] via-[#10121C] to-[#0D0E17] border border-white/[0.1] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5533]/10 border border-[#FF5533]/25 text-[#FF5533] text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Co-Founder BOM Studio (Interactive Intake)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentBOM.projectName}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-3xl leading-relaxed">
              {currentBOM.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* 1-Click Google Sheets Export */}
            <button
              onClick={handleExportSheets}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-emerald-400 border border-emerald-500/30 shadow-lg hover:border-emerald-500/50 transition active:scale-95 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Generating Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>1-Click Sheets Export</span>
                </>
              )}
            </button>

            {/* Match Verified Facilities (Swipe Deck) */}
            <button
              onClick={handleProceedToDiscovery}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-xl shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition"
            >
              <span>Match Verified Factories</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* Dual-Panel Layout: Conversational Studio (Left) + Live Interactive BOM Matrix (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Conversational AI Co-Founder Studio (lg:col-span-5) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#0D0F18] border border-white/[0.1] shadow-xl flex flex-col h-[750px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FF5533] to-amber-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  AI Co-Founder Engineering
                </h3>
                <p className="text-[11px] text-white/50">Gemini 2.5 Flash • DFM & Sourcing</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE CONTEXT</span>
            </div>
          </div>

          {/* Quick Refinement Suggestion Chips */}
          <div className="px-3 py-2 border-b border-white/[0.06] bg-white/[0.01] overflow-x-auto no-scrollbar flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-white/40 shrink-0">Refine:</span>
            {quickRefinementChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isInterpreting}
                className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] hover:bg-[#FF5533]/15 text-white/70 hover:text-[#FF5533] border border-white/[0.08] hover:border-[#FF5533]/30 transition"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Chat Message Stream */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs leading-relaxed"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FF5533] to-[#D83E1E] text-white rounded-br-none shadow-md'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/90 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] font-mono text-white/30 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isInterpreting && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/60 text-xs font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF5533]" />
                <span>Gemini recalculating tooling, tolerances & BOM components...</span>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-white/[0.08] bg-white/[0.02]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask co-founder to adjust materials, tolerance, or tooling..."
                disabled={isInterpreting}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF5533]/60 focus:ring-1 focus:ring-[#FF5533]/40 transition"
              />
              <button
                type="submit"
                disabled={isInterpreting || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white disabled:opacity-40 hover:brightness-110 active:scale-95 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Live Interactive BOM Matrix & Tooling Engine (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Manufacturing Parameters */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#FF5533]" />
                Executive Sourcing Matrix
              </h3>
              <span className="text-[11px] font-mono text-white/50">{currentBOM.industry}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Target MOQ</span>
                <p className="font-bold text-white text-sm sm:text-base mt-0.5">
                  {currentBOM.targetMOQ.toLocaleString()} {currentBOM.moqUnit}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Target Unit Cost</span>
                <p className="font-bold text-[#FF5533] text-sm sm:text-base mt-0.5">
                  {currentBOM.targetUnitCostEstimate}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">Total Tooling NRE</span>
                <p className="font-bold text-cyan-400 text-sm sm:text-base mt-0.5">
                  {currentBOM.toolingSummary?.totalToolingNre || '$12,500 - $18,000'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase">T1 Sample Lead Time</span>
                <p className="font-bold text-emerald-400 text-sm sm:text-base mt-0.5">
                  {currentBOM.toolingSummary?.goldenSampleLeadTimeWeeks || 2} Weeks
                </p>
              </div>
            </div>
          </div>

          {/* Full Bill of Materials (BOM) & Tooling Breakdown Table */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                Engineering Bill of Materials (BOM) & Tooling
              </h3>
              <span className="text-[11px] font-mono text-white/40">
                {currentBOM.components?.length || 0} Critical Components Deconstructed
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-black/20">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.03] text-[10px] font-mono text-white/50 uppercase">
                    <th className="py-2.5 px-3">Component / Part</th>
                    <th className="py-2.5 px-3">Material Grade</th>
                    <th className="py-2.5 px-3">Process</th>
                    <th className="py-2.5 px-3">Tooling Type</th>
                    <th className="py-2.5 px-3">Tooling NRE</th>
                    <th className="py-2.5 px-3">Tolerance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {currentBOM.components && currentBOM.components.length > 0 ? (
                    currentBOM.components.map((part: BomComponent, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition">
                        <td className="py-2.5 px-3 font-semibold text-white">
                          {part.name}
                          <div className="text-[10px] text-white/40 font-mono">
                            Unit Cost: {part.unitCostContribution}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-white/90 border border-white/[0.08]">
                            {part.materialGrade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-white/70">{part.manufacturingProcess}</td>
                        <td className="py-2.5 px-3 text-white/70">{part.toolingType}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-cyan-400">
                          {part.toolingCostEstimate}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {part.tolerance}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-white/40 font-mono text-xs">
                        No BOM components extracted yet. Send a prompt to generate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tolerances, Engineering Specifications & Regulatory Accordion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Critical Tolerances & Specs */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                Critical Tolerances & Specs
              </h4>
              <div className="space-y-2">
                {currentBOM.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-white/50 text-[10px] font-mono uppercase block">
                        {spec.dimension}
                      </span>
                      <span className="font-semibold text-white">{spec.value}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        spec.importance === 'critical'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-white/[0.05] text-white/60'
                      }`}
                    >
                      {spec.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance & Regulatory Directives */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Compliance & QA Standards
              </h4>
              <ul className="space-y-2 text-xs text-white/70">
                {currentBOM.regulatoryConsiderations.map((reg, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-1.5 rounded bg-white/[0.01]">
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                    <span>{reg}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/40 uppercase block mb-1">
                  Supplier DFM Verification Questions:
                </span>
                <ul className="space-y-1 text-[11px] text-white/60 italic">
                  {currentBOM.clarifyingQuestions.slice(0, 2).map((q, idx) => (
                    <li key={idx}>• "{q}"</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

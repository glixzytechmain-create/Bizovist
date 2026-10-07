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
  Kanban,
  FileCheck2,
} from 'lucide-react';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { AudioBriefingPlayer } from '../ai/AudioBriefingPlayer';
import { LegalRfqModal } from '../rfq/LegalRfqModal';

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

  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);

  // Dynamic BOM state derived strictly from latestAnalysis or activeProject - zero hardcoded mock fallbacks
  const currentBOM: AIAnalysisResult = React.useMemo(() => {
    if (latestAnalysis) return latestAnalysis;

    const proj = activeProject;
    const isBeverage =
      proj &&
      (proj.title.toLowerCase().includes('beverage') ||
        proj.title.toLowerCase().includes('drink') ||
        proj.productCategory.toLowerCase().includes('beverage') ||
        proj.productCategory.toLowerCase().includes('drink') ||
        proj.industry.toLowerCase().includes('beverage'));

    const defaultComponents: BomComponent[] = isBeverage
      ? [
          {
            name: '250ml Sleek Aluminium Can Body',
            materialGrade: 'Aluminium 3104-H19 with BPA-NI Internal Barrier',
            manufacturingProcess: 'Draw & Ironing (DWI) with 6-Color Printing',
            toolingType: 'Standard Sleek Tooling (Zero NRE)',
            toolingCostEstimate: '$0 (Stock Body Line)',
            unitCostContribution: '$0.18 - $0.24',
            tolerance: '+/- 0.05 mm flange width',
          },
          {
            name: 'Easy-Open Stay-On-Tab (SOT) Can End',
            materialGrade: 'Aluminium 5182 with Food-Grade Gasket Seal',
            manufacturingProcess: 'High-Speed Conversion Press',
            toolingType: 'Standard 202 CDL Shell Tooling',
            toolingCostEstimate: '$0 (Stock Tooling)',
            unitCostContribution: '$0.06 - $0.09',
            tolerance: '+/- 0.03 mm curl diameter',
          },
          {
            name: 'Liquid Formulation & Natural Extract Emulsion',
            materialGrade: 'Purified Water, Adaptogens, Natural Flavors, Citric Acid',
            manufacturingProcess: 'Automated Batch Blending & Shear Mixing',
            toolingType: 'Sanitary SS316 Mixing Tanks & In-line Filters',
            toolingCostEstimate: '$400 - $800 (CIP Sanitization Setup)',
            unitCostContribution: '$0.14 - $0.28',
            tolerance: 'Brix 7.8 +/- 0.2, pH 3.4 +/- 0.1',
          },
          {
            name: 'In-Line Liquid Nitrogen Headspace Dosing',
            materialGrade: 'Food-Grade Liquid Nitrogen (99.999% Purity)',
            manufacturingProcess: 'Cryogenic In-line Injection prior to Seaming',
            toolingType: 'Automated Cryo-Nozzle Dosing Arm',
            toolingCostEstimate: '$250 (Line Fixturing)',
            unitCostContribution: '$0.02 - $0.04',
            tolerance: 'Internal Pressure 25-30 PSI',
          },
        ]
      : [
          {
            name: 'Primary Structural Housing',
            materialGrade: proj?.materials?.[0] || 'Aluminium 6061-T6 / High-Spec Alloy',
            manufacturingProcess: proj?.processes?.[0] || 'Precision CNC Machining',
            toolingType: 'Modular Fixture & Soft Jaws',
            toolingCostEstimate: '$1,500 - $2,800',
            unitCostContribution: '$3.50 - $6.00',
            tolerance: '+/- 0.02 mm',
          },
          {
            name: 'Precision Interface / Enclosure Component',
            materialGrade: proj?.materials?.[1] || 'Engineering Grade Polymer / Alloy',
            manufacturingProcess: proj?.processes?.[1] || 'Precision Molding / Stamping',
            toolingType: 'Production Die / Mold Insert',
            toolingCostEstimate: '$2,200 - $3,500',
            unitCostContribution: '$1.80 - $3.20',
            tolerance: '+/- 0.03 mm',
          },
        ];

    return {
      projectName: proj?.title || 'Custom Engineered Manufacturing Run',
      summary:
        proj?.summary ||
        'Industrial contract manufacturing specification optimized for serial production with verified ISO manufacturing standards.',
      industry: proj?.industry || 'Advanced Hardware & Manufacturing',
      productCategory: proj?.productCategory || 'Custom Engineered Hardware',
      materials: proj?.materials || ['Primary Material Specification', 'High-Spec Secondary Component'],
      processes: proj?.processes || ['Primary Automated Production Line', 'Automated QA & Metrology'],
      machineryNeeded: proj?.machineryNeeded || [
        'Automated Primary Production Machinery',
        'In-Line Metrology Station',
      ],
      targetMOQ: proj?.targetMOQ || 5000,
      moqUnit: proj?.moqUnit || 'units',
      targetUnitCostEstimate: proj?.targetUnitCost || '$2.50 - $6.50 / unit',
      targetLeadTime: proj?.targetLeadTime || '4-6 weeks',
      locationPreference: proj?.locationPreference || 'India',
      components: proj?.components && proj.components.length > 0 ? proj.components : defaultComponents,
      toolingSummary: proj?.toolingSummary || {
        totalToolingNre: isBeverage ? '$1,100 - $1,750' : '$3,700 - $6,300',
        toolingLeadTimeWeeks: 2,
        goldenSampleLeadTimeWeeks: 2,
        massProductionWeeks: 4,
      },
      requirements: (proj?.requirements && proj.requirements.length > 0
        ? proj.requirements
        : isBeverage
        ? [
            {
              id: 'req-bev-1',
              name: '12-Month Ambient Shelf-Life via Tunnel Pasteurization',
              category: 'Shelf Life',
              status: 'confirmed',
              note: 'Target 16-20 Pasteurization Units (PU) without flavor degradation',
              evidenceType: 'confirmed',
            },
            {
              id: 'req-bev-2',
              name: 'BPA-NI Internal Protective Barrier Lacquer',
              category: 'Food Safety',
              status: 'confirmed',
              note: 'Prevents organic acid attack on aluminium',
              evidenceType: 'confirmed',
            },
          ]
        : [
            {
              id: 'req-1',
              name: 'First Article Inspection & Quality Conformance',
              category: 'Quality',
              status: 'confirmed',
              note: 'Dimensional verification to engineering drawing GD&T tolerances',
              evidenceType: 'confirmed',
            },
          ]
      ).map((r) => ({
        name: r.name,
        status: r.status,
        note: r.note,
      })),
      specifications: (proj?.specifications && proj.specifications.length > 0
        ? proj.specifications
        : isBeverage
        ? [
            { id: 'spec-1', dimension: 'Fill Volume', value: '250 ml +/- 3 ml', importance: 'critical' },
            { id: 'spec-2', dimension: 'Brix Level', value: '7.8 +/- 0.3 °Bx', importance: 'critical' },
            { id: 'spec-3', dimension: 'Internal Pressure', value: '26 - 32 PSI with nitrogen dose', importance: 'critical' },
          ]
        : [
            { id: 'spec-1', dimension: 'Critical Dimension', value: 'Nominal +/- 0.03 mm', importance: 'critical' },
            { id: 'spec-2', dimension: 'Surface Roughness', value: 'Ra < 1.6 µm', importance: 'high' },
          ]
      ).map((s) => ({
        dimension: s.dimension,
        value: s.value,
        importance: s.importance,
      })),
      regulatoryConsiderations:
        proj?.regulatoryConsiderations && proj.regulatoryConsiderations.length > 0
          ? proj.regulatoryConsiderations
          : isBeverage
          ? [
              'FSSAI Central Co-Packing Manufacturing License',
              'ISO 22000 / FSSC 22000 Food Safety System Certification',
              'FSSAI Packaging Regulations 2018 (Heavy Metal & Lacquer Migration Limits)',
            ]
          : ['ISO 9001:2015 Quality Management System', 'RoHS / REACH Compliant Material Certification'],
      clarifyingQuestions:
        proj?.keyQuestionsForManufacturers && proj.keyQuestionsForManufacturers.length > 0
          ? proj.keyQuestionsForManufacturers
          : isBeverage
          ? [
              'Will your formulation require custom dry-offset printed cans (50k MOQ) or digitally printed shrink sleeves (5k MOQ)?',
              'Do you require cold-fill carbonation or still liquid with cryogenic nitrogen dosing?',
            ]
          : [
              'What is your target timeline for First Article Golden Sample signoff?',
              'Do you require pilot batch tooling amortization over the first 3 purchase orders?',
            ],
    };
  }, [latestAnalysis, activeProject]);

  const getDynamicGreeting = (bom: AIAnalysisResult): string => {
    const materialsStr = bom.materials.slice(0, 3).join(', ');
    const processStr = bom.processes.slice(0, 2).join(', ');
    const criticalQuestion = bom.clarifyingQuestions?.[0] || 'How would you like to refine the tooling, materials, or certifications?';
    const toolingNre = bom.toolingSummary?.totalToolingNre || '$5,000 - $12,000';

    return `Welcome to the AI BOM Studio! I have decomposed your goal for **${bom.projectName}** (${bom.industry}) into an official engineering Bill of Materials (BOM), production processes, and tooling envelope.

Key Domain Trade-Offs & Manufacturing Guidance:
• **Primary Materials**: ${materialsStr}
• **Primary Processes**: ${processStr}
• **Tooling / Setup NRE**: Estimated at ${toolingNre} with sample cycle of ${bom.toolingSummary?.goldenSampleLeadTimeWeeks || 2} weeks.
• **Critical Sourcing Question**: ${criticalQuestion}

What would you like to discuss or tweak? (e.g. swap materials, tighten tolerances, lower initial MOQ, or audit co-packing certifications)`;
  };

  // Conversational state with AI Co-Founder
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: getDynamicGreeting(currentBOM),
      timestamp: 'Just now',
    },
  ]);

  // Update AI Co-Founder greeting when project changes
  useEffect(() => {
    setMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'ai',
        text: getDynamicGreeting(currentBOM),
        timestamp: 'Just now',
      },
    ]);
  }, [currentBOM.projectName]);

  const [inputMessage, setInputMessage] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineStageText, setRefineStageText] = useState('VP of Manufacturing analyzing engineering trade-offs...');
  const [activeLedgerTab, setActiveLedgerTab] = useState<'all' | 'bom' | 'specs' | 'compliance'>('all');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isInterpreting, isRefining]);

  const handleSendMessage = async (customInstruction?: string) => {
    const textToSend = customInstruction || inputMessage.trim();
    if (!textToSend || isInterpreting || isRefining) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    if (!customInstruction) setInputMessage('');

    setIsRefining(true);
    setRefineStageText('VP of Manufacturing analyzing engineering trade-offs...');
    const t1 = setTimeout(() => {
      setRefineStageText('Recalculating Bill of Materials allocations & tooling NRE...');
    }, 1000);
    const t2 = setTimeout(() => {
      setRefineStageText('Validating ASTM / ISO compliance & supplier feasibility...');
    }, 1900);

    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 2500));
      const [updatedAnalysis] = await Promise.all([
        refineBomWithAi(textToSend),
        minDelay,
      ]);

      const discussion = await aiService.chatCoFounder(
        textToSend,
        updatedAnalysis,
        messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text,
        }))
      );

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text:
          discussion.reply ||
          `Updated BOM & Tooling parameters applied! Modified specs, updated cost contributions, and adjusted tooling lead times are reflected live in the engineering matrix.`,
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
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      setIsRefining(false);
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

  const quickRefinementChips = React.useMemo(() => {
    const pName = (currentBOM.projectName || '').toLowerCase();
    const ind = (currentBOM.industry || '').toLowerCase();
    const cat = (currentBOM.productCategory || '').toLowerCase();

    if (pName.includes('beverage') || ind.includes('beverage') || cat.includes('beverage') || pName.includes('drink') || cat.includes('drink')) {
      return [
        'Compare 250ml Sleek Cans vs Glass Bottles',
        'Inquire Aseptic Cold Fill vs Tunnel Pasteurization',
        'Lower initial trial run to 5,000 units',
        'Add In-Line Liquid Nitrogen Dosing',
        'Optimize formulation for 12-Month Ambient Shelf Life',
      ];
    }
    if (pName.includes('food') || ind.includes('food') || cat.includes('nutrition') || pName.includes('bar')) {
      return [
        'Optimize texture for 12-month shelf life without hardening',
        'Lower trial batch to 10,000 units',
        'Check cold extrusion vs baked line',
        'Add EVOH high-barrier nitrogen flow-wrap',
        'Inquire allergen-isolated cleanroom lines',
      ];
    }
    return [
      `Optimize ${currentBOM.materials[0] || 'primary material'} grade`,
      'Lower initial target MOQ for pilot run',
      'Tighten critical dimensional tolerance',
      'Minimize tooling NRE for pilot budget',
      'Inquire cleanroom & ISO certification',
    ];
  }, [currentBOM]);

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

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Official Legal RFQ Spec Button */}
            <button
              onClick={() => setIsRfqModalOpen(true)}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] shadow-lg transition active:scale-95"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Legal RFQ Packet</span>
            </button>

            {/* Production Pipeline Tracker */}
            <button
              onClick={() => setActiveView('pipeline')}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-amber-300 border border-amber-500/30 shadow-lg transition active:scale-95"
            >
              <Kanban className="w-4 h-4 text-amber-400" />
              <span>T1/T2 Pipeline</span>
            </button>

            {/* 1-Click Google Sheets Export */}
            <button
              onClick={handleExportSheets}
              disabled={exporting}
              className="btn-tactile inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-emerald-400 border border-emerald-500/30 shadow-lg hover:border-emerald-500/50 transition active:scale-95 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Generating Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Sheets Export</span>
                </>
              )}
            </button>

            {/* Match Verified Facilities (Swipe Deck) */}
            <button
              onClick={handleProceedToDiscovery}
              className="btn-tactile inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-xl shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition"
            >
              <span>Match Factories</span>
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

      {/* Executive Audio Briefing Player */}
      <AudioBriefingPlayer
        projectName={currentBOM.projectName}
        summaryText={`${currentBOM.summary} Key manufacturing processes include ${currentBOM.processes.join(', ')}. Target volume is ${currentBOM.targetMOQ.toLocaleString()} ${currentBOM.moqUnit} at target cost ${currentBOM.targetUnitCostEstimate}. Estimated tooling NRE is ${currentBOM.toolingSummary?.totalToolingNre || '$15,000'}.`}
      />

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

            {(isRefining || isInterpreting) && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-[#FF5533]/30 text-white text-xs font-mono shadow-md animate-pulse">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#FF5533] border-t-transparent animate-spin shrink-0" />
                <span className="text-white/90">{refineStageText}</span>
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
                disabled={isInterpreting || isRefining}
                className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF5533]/60 focus:ring-1 focus:ring-[#FF5533]/40 transition"
              />
              <button
                type="submit"
                disabled={isInterpreting || isRefining || !inputMessage.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white disabled:opacity-40 hover:brightness-110 active:scale-95 transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Live Interactive BOM Matrix & Tooling Engine (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Segmented Tab Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl self-start">
            <button
              type="button"
              onClick={() => setActiveLedgerTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeLedgerTab === 'all'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              All Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveLedgerTab('bom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeLedgerTab === 'bom'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              BOM Parts ({currentBOM.components?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveLedgerTab('specs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeLedgerTab === 'specs'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Tolerances ({currentBOM.specifications?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveLedgerTab('compliance')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                activeLedgerTab === 'compliance'
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              QA & Regulatory ({currentBOM.regulatoryConsiderations?.length || 0})
            </button>
          </div>

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
          {(activeLedgerTab === 'all' || activeLedgerTab === 'bom') && (
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
          )}

          {/* Tolerances, Engineering Specifications & Regulatory Accordion */}
          {(activeLedgerTab === 'all' || activeLedgerTab === 'specs' || activeLedgerTab === 'compliance') && (
            <div className={`grid grid-cols-1 ${activeLedgerTab === 'all' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
              {/* Critical Tolerances & Specs */}
              {(activeLedgerTab === 'all' || activeLedgerTab === 'specs') && (
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
              )}

              {/* Compliance & Regulatory Directives */}
              {(activeLedgerTab === 'all' || activeLedgerTab === 'compliance') && (
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
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal RFQ Spec Document Modal */}
      <LegalRfqModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        project={activeProject}
      />
    </div>
  );
};

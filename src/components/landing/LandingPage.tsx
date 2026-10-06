import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Building2,
  Search,
  Zap,
  Globe2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, setUserRole, analyzeIdea, isInterpreting } = useApp();
  const [ideaPrompt, setIdeaPrompt] = useState(
    'I want to manufacture a premium protein bar in India. Initial quantity around 50,000 units. I want individual wrapping and premium packaging.'
  );

  const samplePrompts = [
    {
      label: 'Protein Bar Line',
      prompt:
        'I want to manufacture a premium protein bar in India. Initial quantity around 50,000 units. I want individual wrapping and premium packaging.',
    },
    {
      label: 'Aluminium Bottles',
      prompt:
        'Find manufacturers in India who can make custom aluminium bottles with printing and an MOQ around 20,000.',
    },
    {
      label: 'Precision CNC Enclosures',
      prompt:
        'Custom 5-axis CNC machined 6061 aluminium actuator enclosures with Type III hard anodizing, MOQ 1,000 units.',
    },
    {
      label: 'Class 7 Medical Molding',
      prompt:
        'Cleanroom ISO Class 7 injection molded microfluidic cartridges in medical grade polycarbonate with ultrasonic welding.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaPrompt.trim() || isInterpreting) return;
    setUserRole('founder');
    try {
      await analyzeIdea(ideaPrompt);
    } catch {
      setActiveView('ai-understand');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#090A0F] text-slate-100 selection:bg-[#FF5533]/25 selection:text-[#FF7A59] overflow-hidden">
      {/* Background industrial lighting grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#FF5533]/15 via-[#FF5533]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top minimal header */}
      <nav className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5533] to-[#C9381A] flex items-center justify-center shadow-lg shadow-[#FF5533]/30">
            <span className="font-mono font-bold text-white text-base">B</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white font-mono">
            bizovist
          </span>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.05] text-white/50 border border-white/[0.08]">
            AI Manufacturing Intelligence
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setUserRole('manufacturer');
              setActiveView('mfg-dashboard');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition"
          >
            <Building2 className="w-3.5 h-3.5 text-white/50" />
            <span>I Make Things</span>
          </button>
          <button
            onClick={() => setActiveView('role-selection')}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition shadow-lg"
          >
            Enter Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-12 pb-24 text-center">
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.1] text-xs mb-8 text-white/80">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5533]" />
          <span>The AI Co-Founder for Physical Product Manufacturing</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto">
          Build what you imagine.
        </h1>

        {/* Supporting thesis */}
        <p className="mt-6 text-base sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Bizovist understands what you’re trying to make and finds the manufacturers that can
          actually produce it — without keyword spam or directory clutter.
        </p>

        {/* Interactive AI Product Intent Input */}
        <div className="mt-12 max-w-3xl mx-auto text-left">
          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 rounded-2xl bg-[#11131C] border border-white/[0.12] shadow-2xl shadow-black/80 hover:border-[#FF5533]/40 transition-all focus-within:border-[#FF5533] focus-within:ring-2 focus-within:ring-[#FF5533]/20"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40 mb-2 px-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5533]" />
              <span>Describe What You Want To Manufacture</span>
            </div>

            <textarea
              value={ideaPrompt}
              onChange={(e) => setIdeaPrompt(e.target.value)}
              placeholder="e.g. I want to manufacture a premium protein bar in India. Initial quantity around 50,000 units. I want individual wrapping and premium packaging..."
              rows={3}
              className="w-full bg-transparent border-0 text-white placeholder-white/30 text-sm sm:text-base focus:ring-0 focus:outline-none resize-none leading-relaxed"
            />

            <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                <span className="text-[11px] font-mono text-white/40 uppercase whitespace-nowrap">
                  Try prompt:
                </span>
                {samplePrompts.map((sp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setIdeaPrompt(sp.prompt)}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.06] whitespace-nowrap transition"
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isInterpreting}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/30 hover:brightness-110 active:scale-95 disabled:opacity-50 transition"
              >
                {isInterpreting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Decomposing BOM & Requirements...</span>
                  </>
                ) : (
                  <>
                    <span>Start Building</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Secondary Action for Manufacturers */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-white/50">
          <span>Are you a manufacturing facility?</span>
          <button
            onClick={() => {
              setUserRole('manufacturer');
              setActiveView('mfg-dashboard');
            }}
            className="text-[#FF5533] hover:underline font-medium inline-flex items-center gap-1"
          >
            <span>Explore live buyer demand feed</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Product Intelligence Architecture Demonstration */}
        <div className="mt-20 max-w-4xl mx-auto text-left">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5533] font-semibold">
              Taxonomy & Trust Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Manufacturing intelligence, decomposed to ground truth
            </h2>
            <p className="text-sm text-white/50 mt-2 max-w-xl mx-auto">
              We never match on keywords alone. Bizovist translates your idea through 8 deep engineering layers.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { step: '01', title: 'Industry & Product', desc: 'Functional Nutrition, Hardware, Packaging' },
              { step: '02', title: 'Materials & Grades', desc: 'Alloy 1070, EVOH Barrier, Whey Isolate' },
              { step: '03', title: 'Processes & Tooling', desc: 'Cold Extrusion, 5-Axis CNC, Nitrogen MAP' },
              { step: '04', title: 'Machinery & Line Audit', desc: 'Schuler 1200T, Bühler BCTC, DMG Mori' },
              { step: '05', title: 'Commercial Fit & MOQ', desc: '50k unit run, target $0.45/unit economics' },
              { step: '06', title: 'Regulatory Compliance', desc: 'FSSAI Central, ISO 22000, FDA 21 CFR' },
              { step: '07', title: 'Evidence Provenance', desc: 'Physical audit, electrical logs, CoA testing' },
              { step: '08', title: 'Production Partnership', desc: 'Golden samples, RFQ milestone agreements' },
            ].map((col, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition"
              >
                <span className="text-[10px] font-mono text-[#FF5533] font-bold">{col.step}</span>
                <h4 className="text-xs font-semibold text-white mt-1">{col.title}</h4>
                <p className="text-[11px] text-white/40 mt-1 leading-relaxed">{col.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature comparison: Bizovist vs Old Directories */}
        <div className="mt-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0D0F17] border border-white/[0.08] text-left">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-bold text-white">Why Bizovist is not a directory or marketplace</h3>
            <p className="text-xs text-white/50 mt-1">
              Legacy platforms optimize for broker ad clicks. Bizovist is built for serious production execution.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.04]">
                <span className="text-[11px] font-mono uppercase text-red-400 font-bold">
                  Legacy B2B Portals
                </span>
                <ul className="mt-3 space-y-2 text-xs text-white/50">
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✕</span>
                    <span>Brokers pretending to be factories</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✕</span>
                    <span>100+ spam WhatsApp inquiries after 1 search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✕</span>
                    <span>No machinery validation or tolerance data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-400">✕</span>
                    <span>Founders left guessing MOQ and unit economics</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#FF5533]/5 border border-[#FF5533]/20">
                <span className="text-[11px] font-mono uppercase text-[#FF5533] font-bold">
                  Bizovist AI Engine
                </span>
                <ul className="mt-3 space-y-2 text-xs text-white/80">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Intent decomposition: AI understands your product specifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Audited machinery: Tonnage, tolerances, and actual machine models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Evidence tiers: Never presents assumptions as confirmed facts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>AI Co-Founder: Guides sample testing, contracts, and negotiation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <button
            onClick={() => setActiveView('role-selection')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition shadow-2xl"
          >
            <span>Launch Bizovist Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

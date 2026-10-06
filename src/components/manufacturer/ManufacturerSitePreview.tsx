import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Globe,
  CheckCircle2,
  Cpu,
  Layers,
  ShieldCheck,
  Send,
  Building2,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';

export const ManufacturerSitePreview: React.FC = () => {
  const { manufacturers, setActiveView } = useApp();
  const mfg = manufacturers[1] || manufacturers[0]; // Apex Nutrition or Hind Metals

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left">
      {/* Top Browser URL Bar Simulation */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('mfg-dashboard')}
            className="flex items-center gap-1 text-white/50 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Console</span>
          </button>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-black/40 border border-white/[0.06] font-mono text-[11px] text-white/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>https://{mfg.subdomain || 'apex-nutrition'}.bizovist.com</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#FF5533]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Structured Intelligence Live Preview</span>
        </div>
      </div>

      {/* Structured Architecture Explainer Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-[#121420] border border-cyan-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h4 className="font-mono font-bold text-white uppercase text-[11px]">
            Dual-Sided Data Engine Architecture
          </h4>
          <p className="text-white/70 leading-relaxed text-[11px]">
            Every machine specification, tolerance metric, and material grade on this public site simultaneously powers Bizovist's discovery search, AI matching algorithms, and automated RFQ feasibility scoring.
          </p>
        </div>
        <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 whitespace-nowrap">
          Synced with Sourcing AI
        </span>
      </div>

      {/* The Live Public Web Presence */}
      <div className="rounded-2xl border border-white/[0.1] bg-[#0A0C14] shadow-2xl overflow-hidden">
        {/* Hero Section of the Manufacturer Website */}
        <div className="p-8 sm:p-12 border-b border-white/[0.08] relative overflow-hidden bg-gradient-to-br from-[#121422] to-[#0A0C14]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Direct Plant • ISO 22000 & BRCGS Grade AA</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {mfg.name}
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
              {mfg.tagline}. Turnkey industrial contract manufacturing engineered for modern challenger brands and high-growth consumer products.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-white/50">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF5533]" />
                {mfg.location}
              </span>
              <span>•</span>
              <span>{mfg.facilitySizeSqFt.toLocaleString()} sq.ft facility</span>
              <span>•</span>
              <span>{mfg.annualCapacity} capacity</span>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#FF5533] text-white hover:bg-[#E04626] transition shadow-lg shadow-[#FF5533]/25 flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Submit Technical RFQ Specification</span>
              </button>
              <button className="px-4 py-2.5 rounded-xl text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white transition">
                Request Golden Sample Kit
              </button>
            </div>
          </div>
        </div>

        {/* Section: Installed Precision Machinery */}
        <div className="p-8 border-b border-white/[0.08] space-y-6">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5533] font-bold">
              Factory Assets & Equipment
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Installed Machinery & Lines</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mfg.machinery.map((mach, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{mach.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 font-bold shrink-0">
                    {mach.count} Units Active
                  </span>
                </div>
                <p className="text-[11px] text-white/50 font-mono">
                  {mach.brand} {mach.model ? `• ${mach.model}` : ''}
                </p>
                {mach.precisionTolerance && (
                  <div className="text-[11px] font-mono text-emerald-400">
                    Tolerance: {mach.precisionTolerance}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section: Qualified Materials & Processes */}
        <div className="p-8 border-b border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase text-xs text-white/40">
              Formulation & Raw Materials
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {mfg.materials.map((mat, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-xs bg-white/[0.04] text-white/90 border border-white/[0.06]"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase text-xs text-white/40">
              Engineering Processes & Surface Finishing
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {mfg.processes.map((proc, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded text-xs bg-[#FF5533]/10 text-[#FF5533] border border-[#FF5533]/20"
                >
                  {proc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Quality & Certifications */}
        <div className="p-8 bg-white/[0.01] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-mono uppercase text-white/40">Audited Certifications:</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {mfg.certifications.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right font-mono text-xs text-white/40">
            <span>Powered by Bizovist Manufacturing OS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

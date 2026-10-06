import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BUYER_DEMAND_FEED } from '../../data/seedData';
import { BuyerDemandOpportunity } from '../../types';
import {
  TrendingUp,
  Building2,
  Sparkles,
  Users,
  ShieldCheck,
  Globe,
  MessageSquare,
  ArrowRight,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

export const ManufacturerDashboard: React.FC = () => {
  const { setActiveView, openAiDrawer } = useApp();
  const [selectedOpportunity, setSelectedOpportunity] = useState<BuyerDemandOpportunity | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 text-left">
      {/* Header & Capability Strength score */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141624] via-[#10121C] to-[#0D0E16] border border-white/[0.08] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MANUFACTURER OPERATING CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Apex BioFormulations & Co-Packing
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              Verified Plant ID: BIZ-IN-50492 • Cleanroom Class 100k Certified
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('mfg-site-preview')}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Business Site (apex.bizovist.com)</span>
            </button>
            <button
              onClick={() =>
                openAiDrawer({
                  type: 'global',
                  data: { role: 'manufacturer' },
                })
              }
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/25 hover:brightness-110 active:scale-95 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Sales Assistant</span>
            </button>
          </div>
        </div>

        {/* Profile Strength & Metric Badges */}
        <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white/40 uppercase block text-[10px]">Profile Strength</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">94% (Audited)</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white/40 uppercase block text-[10px]">Active Matched Founders</span>
            <span className="font-bold text-white text-sm mt-0.5 block">14 Sourcing Teams</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white/40 uppercase block text-[10px]">Inbound RFQs (30d)</span>
            <span className="font-bold text-[#FF5533] text-sm mt-0.5 block">6 High-Intent RFQs</span>
          </div>
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <span className="text-white/40 uppercase block text-[10px]">Available Line Capacity</span>
            <span className="font-bold text-white text-sm mt-0.5 block">Line 2 Open (Nov 2026)</span>
          </div>
        </div>
      </div>

      {/* AI Demand Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#FF5533]/15 via-[#1E1724] to-[#121420] border border-[#FF5533]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FF5533]/20 text-[#FF5533] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              High Intent Buyer Demand Signal
            </h4>
            <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
              3 founders are currently looking for manufacturers with your exact continuous cold extrusion & MAP flow-wrapping capabilities.
            </p>
          </div>
        </div>
        <span className="text-xs font-mono text-[#FF5533] shrink-0 font-semibold">
          High Intent Intent Pool: 120,000 units
        </span>
      </div>

      {/* Main Buyer Demand Feed (Critical Requirement 12) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live Buyer Demand Opportunities
            </h3>
          </div>
          <span className="text-xs text-white/40 font-mono">
            Updated continuously based on founder BOM submissions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUYER_DEMAND_FEED.map((opp) => (
            <div
              key={opp.id}
              className="p-5 rounded-2xl bg-gradient-to-b from-[#131522] to-[#0D0F17] border border-white/[0.08] hover:border-[#FF5533]/40 transition space-y-4 shadow-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {opp.intentLevel}
                    </span>
                    <span className="text-[11px] font-mono text-white/40">{opp.postedAgo}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">{opp.title}</h4>
                  <p className="text-xs text-white/50">{opp.productType} • {opp.location}</p>
                </div>

                <div className="text-right shrink-0 font-mono text-xs">
                  <span className="text-white/40 block text-[10px] uppercase">Target Run</span>
                  <span className="text-white font-bold">{opp.targetQuantity}</span>
                </div>
              </div>

              {/* Matched capability callout */}
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-white/40 uppercase">Matched With Your Asset:</span>
                  <span className="text-cyan-400 font-bold">{opp.matchedCapability}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {opp.requiredProcesses.map((proc, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-white/70"
                    >
                      ✓ {proc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Opportunity Actions */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="font-mono text-white/50 text-[11px]">
                  Budget: <strong className="text-white">{opp.budgetEstimated}</strong>
                </span>

                <button
                  onClick={() => setSelectedOpportunity(opp)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition flex items-center gap-1.5 shadow"
                >
                  <span>View Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunity Modal Viewer */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 bg-[#07080C]/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#11131E] border border-white/[0.1] shadow-2xl space-y-5 text-left">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  Verified Sourcing Opportunity
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {selectedOpportunity.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
                <span className="text-white/40 uppercase font-mono text-[10px]">Specifications Summary</span>
                <p className="text-white/80 leading-relaxed">
                  Founder has generated a detailed BOM through Bizovist AI. Requires {selectedOpportunity.targetQuantity} initial run with packaging nitrogen flush and sensory stability test.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 uppercase text-[10px] block">Location</span>
                  <span className="text-white font-bold">{selectedOpportunity.location}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-white/40 uppercase text-[10px] block">Estimated Budget</span>
                  <span className="text-emerald-400 font-bold">{selectedOpportunity.budgetEstimated}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedOpportunity(null)}
                className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedOpportunity(null);
                  setActiveView('messages');
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#FF5533] text-white hover:bg-[#E04626] transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Capability Dossier to Founder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

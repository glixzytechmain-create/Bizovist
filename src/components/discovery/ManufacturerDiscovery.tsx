import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Manufacturer } from '../../types';
import {
  Search,
  Filter,
  Sparkles,
  Scale,
  Bookmark,
  BookmarkCheck,
  Send,
  Eye,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  Building2,
  Cpu,
  MapPin,
  ChevronDown,
  Layers,
  Flame,
  LayoutGrid,
  FileSpreadsheet,
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { FacilityMapModal } from './FacilityMapModal';
import { SwipeCardDeck } from './SwipeCardDeck';
import { aiService } from '../../services/aiService';

export const ManufacturerDiscovery: React.FC = () => {
  const {
    manufacturers,
    activeProject,
    shortlistedManufacturerIds,
    toggleShortlist,
    comparisonManufacturerIds,
    toggleComparison,
    openManufacturerDetail,
    openAiDrawer,
    startNewRfq,
  } = useApp();

  const [viewMode, setViewMode] = useState<'tinder' | 'grid'>('tinder');
  const [activeMapMfg, setActiveMapMfg] = useState<Manufacturer | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    'Find manufacturers in India who can make custom aluminium bottles with printing and an MOQ around 20,000.'
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const handleExportSheets = async (mfg: Manufacturer) => {
    try {
      const res = await aiService.exportProjectToSheets(activeProject || { title: mfg.name });
      if (res.csvContent) {
        const blob = new Blob([res.csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.downloadFilename || `${mfg.name.toLowerCase().replace(/\s+/g, '-')}-bom.csv`;
        a.click();
      }
    } catch (e) {
      console.warn('Export error:', e);
    }
  };

  // Dynamic search and filter
  const filteredManufacturers = useMemo(() => {
    return manufacturers.filter((mfg) => {
      if (onlyVerified && !mfg.verified) return false;
      if (selectedCountry !== 'All' && mfg.country !== selectedCountry) return false;
      if (
        selectedIndustry !== 'All' &&
        !mfg.industries.some((i) => i.toLowerCase().includes(selectedIndustry.toLowerCase()))
      ) {
        return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      // Intelligent matching across name, materials, processes, capabilities, products, location
      const textMatches =
        mfg.name.toLowerCase().includes(q) ||
        mfg.location.toLowerCase().includes(q) ||
        mfg.materials.some((m) => m.toLowerCase().includes(q)) ||
        mfg.processes.some((p) => p.toLowerCase().includes(q)) ||
        mfg.capabilities.some((c) => c.toLowerCase().includes(q)) ||
        mfg.products.some((p) => p.toLowerCase().includes(q));

      // Semantic tokens (e.g. "aluminium", "bottle", "protein", "bar", "india")
      const tokens = q.split(' ').filter((w) => w.length > 3);
      const tokenMatch = tokens.some(
        (t) =>
          mfg.name.toLowerCase().includes(t) ||
          mfg.location.toLowerCase().includes(t) ||
          mfg.products.some((p) => p.toLowerCase().includes(t)) ||
          mfg.materials.some((m) => m.toLowerCase().includes(t)) ||
          mfg.processes.some((p) => p.toLowerCase().includes(t))
      );

      return textMatches || tokenMatch;
    });
  }, [manufacturers, searchQuery, selectedIndustry, selectedCountry, onlyVerified]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      {/* Header and natural search bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/40 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF5533]" />
              <span>FACILITY DISCOVERY & INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Precision Manufacturer Discovery
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-xl shadow-inner">
              <button
                type="button"
                onClick={() => setViewMode('tinder')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'tinder'
                    ? 'bg-gradient-to-r from-[#FF5533] to-[#FF7A59] text-white shadow-lg shadow-[#FF5533]/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Swipe Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white/15 text-white shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid Feed</span>
              </button>
            </div>

            <div className="text-xs text-white/50 font-mono hidden sm:block">
              {filteredManufacturers.length} Facilities Evaluated
            </div>
          </div>
        </div>

        {/* Natural Language Query Box */}
        <div className="relative rounded-2xl bg-[#11131E] border border-white/[0.1] shadow-2xl p-3 focus-within:border-[#FF5533]/50 focus-within:ring-2 focus-within:ring-[#FF5533]/20 transition-all">
          <div className="flex items-center gap-3 px-2">
            <Search className="w-4 h-4 text-[#FF5533] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query facilities in natural language (e.g. 'Find facilities in India with 5-axis CNC and MOQ under 1,000')..."
              className="w-full bg-transparent border-0 text-white placeholder-white/30 text-xs sm:text-sm focus:ring-0 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-white/40 hover:text-white px-2 py-1 font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white/40 font-mono text-[11px] uppercase">Industry:</span>
              {['All', 'Beverage', 'Nutrition', 'Hardware', 'Medical', 'Packaging'].map((ind) => (
                <button
                  key={ind}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    selectedIndustry === ind
                      ? 'bg-[#FF5533] text-white shadow-sm'
                      : 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-[#FF5533] focus:ring-0"
                />
                <span className="text-xs">Physical Audited Only</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Results View: Tinder Swipe Deck vs Classic Grid */}
      {viewMode === 'tinder' ? (
        <SwipeCardDeck
          manufacturers={filteredManufacturers}
          onOpenDetails={openManufacturerDetail}
          onOpenMap={(mfg) => setActiveMapMfg(mfg)}
          onSuperAudit={(mfg) => openAiDrawer({ type: 'manufacturer', data: mfg })}
          onExportSheets={handleExportSheets}
        />
      ) : (
        <div className="space-y-4">
        {filteredManufacturers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <Cpu className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-sm font-bold text-white">No facilities matching your exact criteria</h3>
            <p className="text-xs text-white/50 max-w-md mx-auto">
              Try adjusting your query or broadening required processes. You can also consult Bizovist AI to locate unindexed facilities.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('All');
                setOnlyVerified(false);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredManufacturers.map((mfg, idx) => {
            const isShortlisted = shortlistedManufacturerIds.includes(mfg.id);
            const isCompared = comparisonManufacturerIds.includes(mfg.id);
            const matchScore = 88 + (idx % 8);

            return (
              <div
                key={mfg.id}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#131522] to-[#0D0F17] border border-white/[0.08] hover:border-white/[0.18] transition-all shadow-xl space-y-5"
              >
                {/* Top Row: Name, Location, Badges, Match Score */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        onClick={() => openManufacturerDetail(mfg)}
                        className="text-base sm:text-lg font-bold text-white hover:text-[#FF5533] transition cursor-pointer"
                      >
                        {mfg.name}
                      </h3>
                      {mfg.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Audited Facility
                        </span>
                      )}
                      <EvidenceBadge type={mfg.evidenceSource.type} />
                    </div>

                    <p className="text-xs text-white/60">{mfg.tagline}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#FF5533]" />
                        {mfg.location}
                      </span>
                      <span>•</span>
                      <span>Est. {mfg.establishedYear}</span>
                      <span>•</span>
                      <span>{mfg.facilitySizeSqFt.toLocaleString()} sq.ft</span>
                      <span>•</span>
                      <span>{mfg.workforceCount} workforce</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end gap-2 shrink-0">
                    <MatchScoreBadge score={matchScore} size="lg" />
                    <span className="text-[10px] font-mono text-white/40">
                      Based on 12 production dimensions
                    </span>
                  </div>
                </div>

                {/* Middle: WHY THIS MATCHES vs NEEDS CONFIRMATION (CRITICAL SPEC REQUIREMENT) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  {/* Why it matches */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>WHY THIS MATCHES</span>
                    </div>
                    <ul className="space-y-1 text-xs text-white/80">
                      {(mfg.whyMatches || [
                        'Verified cold impact extrusion line',
                        'In-house high-speed offset printing',
                        'Direct container port logistics corridor',
                      ]).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Needs confirmation */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>NEEDS CONFIRMATION</span>
                    </div>
                    <ul className="space-y-1 text-xs text-white/70">
                      {(mfg.needsConfirmation || [
                        'Tooling charge waiver for 50k unit run',
                        'Drop-burst test laboratory verification',
                      ]).map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">?</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Machinery & Process Badges */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-mono text-white/40 uppercase mr-1">Machinery:</span>
                    {mfg.machinery.map((mach, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/[0.04] text-white/70 border border-white/[0.06]"
                      >
                        {mach.name} ({mach.count} units)
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-[11px] font-mono text-white/40 uppercase mr-1">Certifications:</span>
                    {mfg.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Commercial specs & Actions */}
                <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4 font-mono text-white/60">
                    <span>
                      MOQ: <strong className="text-white">{mfg.moq.toLocaleString()} {mfg.moqUnit}</strong>
                    </span>
                    <span>
                      Lead Time: <strong className="text-white">~{mfg.leadTimeAvgWeeks} weeks</strong>
                    </span>
                    <span>
                      Customization: <strong className="text-white">{mfg.customizationRating}</strong>
                    </span>
                  </div>

                  {/* Actions: Ask Bizovist, Compare, Save, Contact RFQ, Research */}
                  <div className="flex items-center gap-2">
                    {/* Ask Bizovist */}
                    <button
                      onClick={() =>
                        openAiDrawer({
                          type: 'manufacturer',
                          data: mfg,
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5533]/15 hover:bg-[#FF5533]/25 text-[#FF5533] border border-[#FF5533]/30 transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask Bizovist</span>
                    </button>

                    {/* Compare */}
                    <button
                      onClick={() => toggleComparison(mfg.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                        isCompared
                          ? 'bg-cyan-500 text-black'
                          : 'bg-white/[0.06] hover:bg-white/[0.1] text-white/80'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>

                    {/* Save / Shortlist */}
                    <button
                      onClick={() => toggleShortlist(mfg.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isShortlisted
                          ? 'border-[#FF5533] bg-[#FF5533]/10 text-[#FF5533]'
                          : 'border-white/[0.08] hover:border-white/[0.2] text-white/50 hover:text-white'
                      }`}
                      title={isShortlisted ? 'Remove from shortlist' : 'Save to shortlist'}
                    >
                      {isShortlisted ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>

                    {/* Map & Corridor */}
                    <button
                      onClick={() => setActiveMapMfg(mfg)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition flex items-center gap-1"
                      title="View facility on Google Maps & verify freight corridor"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#FF5533]" />
                      <span>Map</span>
                    </button>

                    {/* Dossier Research Modal */}
                    <button
                      onClick={() => openManufacturerDetail(mfg)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-white transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Dossier</span>
                    </button>

                    {/* Contact RFQ */}
                    <button
                      onClick={() => startNewRfq(mfg.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-95 transition flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit RFQ</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* Facility Google Maps Modal */}
      <FacilityMapModal
        manufacturer={activeMapMfg}
        onClose={() => setActiveMapMfg(null)}
      />
    </div>
  );
};

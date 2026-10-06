import React, { useState } from 'react';
import { Sparkles, Globe2, RotateCcw, Star, Scale, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface DeckEmptyStateProps {
  shortlistCount: number;
  totalEvaluated: number;
  onResetDeck: () => void;
  onViewShortlist: () => void;
  onLiveWebDiscovery: (query: string) => Promise<void>;
  currentProductQuery?: string;
}

export const DeckEmptyState: React.FC<DeckEmptyStateProps> = ({
  shortlistCount,
  totalEvaluated,
  onResetDeck,
  onViewShortlist,
  onLiveWebDiscovery,
  currentProductQuery = 'precision contract manufacturing facilities',
}) => {
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [customQuery, setCustomQuery] = useState(currentProductQuery);

  const handleWebDiscovery = async () => {
    setIsSearchingWeb(true);
    try {
      await onLiveWebDiscovery(customQuery);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full max-w-md mx-auto h-[580px] sm:h-[620px] bg-[#0E101B]/90 border border-white/[0.1] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl space-y-6"
    >
      {/* Radar Animation Graphic */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping" />
        <div className="absolute inset-4 rounded-full border border-cyan-500/30 animate-pulse" />
        <div className="absolute inset-8 rounded-full border border-[#FF5533]/40" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF5533]/20 via-purple-500/20 to-emerald-500/20 border border-white/20 flex items-center justify-center shadow-lg">
          <Globe2 className="w-8 h-8 text-white/90 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Cluster Deck Evaluated
        </h3>
        <p className="text-xs sm:text-sm text-slate-300/80 max-w-xs leading-relaxed">
          You've reviewed <span className="font-semibold text-white">{totalEvaluated}</span> facilities and shortlisted{' '}
          <span className="font-bold text-emerald-400">{shortlistCount}</span> precision partners.
        </p>
      </div>

      {/* Live Web Discovery Trigger using Google Search Grounding */}
      <div className="w-full bg-[#141829] border border-purple-500/30 rounded-2xl p-4 text-left space-y-3 shadow-inner">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>EXPAND WITH GEMINI WEB DISCOVERY</span>
        </div>
        <p className="text-[11px] text-white/60 leading-normal">
          Search the live internet via Google Grounding to discover unlisted plants and precision facilities.
        </p>
        <button
          type="button"
          onClick={handleWebDiscovery}
          disabled={isSearchingWeb}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isSearchingWeb ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Grounding Real Facilities with Google...</span>
            </>
          ) : (
            <>
              <Globe2 className="w-4 h-4" />
              <span>Discover More Plants from Web</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Bottom Action Options */}
      <div className="flex items-center gap-3 w-full">
        <button
          type="button"
          onClick={onResetDeck}
          className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs font-medium text-white/80 flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Rewind Deck</span>
        </button>

        <button
          type="button"
          onClick={onViewShortlist}
          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-950/40"
        >
          <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/40" />
          <span>View Shortlist ({shortlistCount})</span>
        </button>
      </div>
    </motion.div>
  );
};

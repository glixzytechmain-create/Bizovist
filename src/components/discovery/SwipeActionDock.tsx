import React from 'react';
import { RotateCcw, X, Sparkles, Star, Scale, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SwipeActionDockProps {
  canUndo: boolean;
  onUndo: () => void;
  onPass: () => void;
  onSuperAudit: () => void;
  onShortlist: () => void;
  onToggleCompare: () => void;
  isCompared: boolean;
  onQuickRfq: () => void;
  isAuditing?: boolean;
}

export const SwipeActionDock: React.FC<SwipeActionDockProps> = ({
  canUndo,
  onUndo,
  onPass,
  onSuperAudit,
  onShortlist,
  onToggleCompare,
  isCompared,
  onQuickRfq,
  isAuditing = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 py-4 px-2">
      {/* 1. Rewind Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUndo}
        disabled={!canUndo}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all shadow-lg ${
          canUndo
            ? 'bg-[#151828] border-amber-500/30 text-amber-400 hover:border-amber-400 hover:shadow-amber-500/20'
            : 'bg-[#10121C] border-white/5 text-white/20 cursor-not-allowed'
        }`}
        title="Rewind previous facility (Z)"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* 2. Nope / Pass Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        onClick={onPass}
        className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[#181014] border-2 border-rose-500/40 text-rose-500 flex items-center justify-center shadow-xl shadow-rose-950/40 hover:bg-rose-500/10 hover:border-rose-400 hover:shadow-rose-500/25 transition-all"
        title="Pass / Next facility (← Left Arrow)"
      >
        <X className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
      </motion.button>

      {/* 3. Super AI Audit Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.85 }}
        onClick={onSuperAudit}
        disabled={isAuditing}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-purple-900/60 to-indigo-900/60 border-2 border-purple-400/50 text-purple-300 flex items-center justify-center shadow-xl shadow-purple-900/40 hover:border-purple-300 hover:shadow-purple-500/30 transition-all relative group"
        title="Deep AI Co-Founder Audit (↑ Up Arrow)"
      >
        <Sparkles className={`w-6 h-6 sm:w-7 sm:h-7 ${isAuditing ? 'animate-spin text-purple-200' : 'group-hover:rotate-12 transition-transform'}`} />
        <span className="absolute -top-7 text-[10px] font-mono tracking-wider font-bold bg-purple-950/90 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          AI AUDIT
        </span>
      </motion.button>

      {/* 4. Shortlist / Match Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.88 }}
        onClick={onShortlist}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0E1A18] border-2 border-emerald-400/60 text-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-950/50 hover:bg-emerald-500/15 hover:border-emerald-300 hover:shadow-emerald-500/30 transition-all relative group"
        title="Shortlist & Save to Project (→ Right Arrow)"
      >
        <Star className="w-7 h-7 sm:w-8 sm:h-8 fill-emerald-400/20 stroke-[2.2] group-hover:fill-emerald-400 transition-colors" />
        <span className="absolute -top-7 text-[10px] font-mono tracking-wider font-bold bg-emerald-950/90 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          SHORTLIST
        </span>
      </motion.button>

      {/* 5. Compare Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleCompare}
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border transition-all shadow-lg ${
          isCompared
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-cyan-500/20'
            : 'bg-[#111422] border-cyan-500/30 text-cyan-400 hover:border-cyan-400 hover:shadow-cyan-500/20'
        }`}
        title="Add to Comparison Matrix (↓ Down Arrow)"
      >
        <Scale className="w-5 h-5" />
      </motion.button>

      {/* 6. Quick RFQ Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onQuickRfq}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1A1315] border border-[#FF5533]/40 text-[#FF5533] hover:border-[#FF5533] hover:shadow-lg hover:shadow-[#FF5533]/25 flex items-center justify-center transition-all"
        title="Open RFQ Spec Chat"
      >
        <MessageSquare className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

import React from 'react';

interface MatchScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getColor = (val: number) => {
    if (val >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 80) return 'text-[#FF5533] border-[#FF5533]/30 bg-[#FF5533]/10';
    if (val >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-slate-400 border-slate-500/30 bg-slate-500/10';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono tracking-tight ${getColor(
        score
      )} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{score}%</span>
      {showLabel && <span className="opacity-80 text-[10px] font-sans uppercase tracking-wider">MATCH</span>}
    </div>
  );
};

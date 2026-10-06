import React from 'react';
import { EvidenceType, RequirementStatus } from '../../types';
import { CheckCircle2, ShieldCheck, Globe, Sparkles, HelpCircle } from 'lucide-react';

interface EvidenceBadgeProps {
  type: EvidenceType | RequirementStatus;
  label?: string;
  className?: string;
}

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({ type, label, className = '' }) => {
  switch (type) {
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          {label || 'Confirmed'}
        </span>
      );

    case 'manufacturer_claimed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          {label || 'Manufacturer Claimed'}
        </span>
      );

    case 'public_evidence':
    case 'public_intelligence':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 ${className}`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          {label || (type === 'public_intelligence' ? 'Public Intelligence' : 'Public Evidence')}
        </span>
      );

    case 'ai_inference':
    case 'likely':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          {label || (type === 'likely' ? 'Likely (Inferred)' : 'AI Inference')}
        </span>
      );

    case 'needs_confirmation':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          {label || 'Needs Confirmation'}
        </span>
      );
  }
};

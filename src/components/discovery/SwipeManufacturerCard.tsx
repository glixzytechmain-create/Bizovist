import React, { useState } from 'react';
import { Manufacturer } from '../../types';
import {
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  FileSpreadsheet,
  Map,
  Clock,
  Package,
  Award,
} from 'lucide-react';
import { MatchScoreBadge } from '../ui/MatchScoreBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';

interface SwipeManufacturerCardProps {
  manufacturer: Manufacturer;
  onOpenDetails: (mfg: Manufacturer) => void;
  onOpenMap: (mfg: Manufacturer) => void;
  onSuperAudit: (mfg: Manufacturer) => void;
  onExportSheets?: (mfg: Manufacturer) => void;
}

export const SwipeManufacturerCard: React.FC<SwipeManufacturerCardProps> = ({
  manufacturer,
  onOpenDetails,
  onOpenMap,
  onSuperAudit,
  onExportSheets,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);

  const heroPhotos = manufacturer.photos && manufacturer.photos.length > 0
    ? manufacturer.photos
    : [
        manufacturer.avatarUrl ||
          'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      ];

  const currentPhoto = heroPhotos[photoIndex % heroPhotos.length];

  return (
    <div className="relative w-full h-[620px] sm:h-[650px] bg-[#0E101B] border border-white/[0.12] rounded-3xl overflow-hidden shadow-2xl flex flex-col select-none text-left">
      {/* 1. Hero Image with Overlay Gradients */}
      <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-slate-900">
        <img
          src={currentPhoto}
          alt={manufacturer.name}
          className="w-full h-full object-cover brightness-90 transform hover:scale-105 transition-transform duration-700 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E101B] via-[#0E101B]/40 to-black/30" />

        {/* Top Badges Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 z-10 pointer-events-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            <EvidenceBadge type={manufacturer.evidenceSource.type} />
            {manufacturer.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                VERIFIED PLANT
              </span>
            )}
          </div>

          <MatchScoreBadge score={94} size="md" showLabel />
        </div>

        {/* Photo Gallery Indicators if multiple photos */}
        {heroPhotos.length > 1 && (
          <div className="absolute bottom-3 left-4 flex gap-1.5 z-10">
            {heroPhotos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  photoIndex === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Facility Main Title on Image Bottom */}
        <div className="absolute bottom-3 right-4 left-4 z-10 pointer-events-auto">
          <div className="flex items-center gap-2 text-white/70 text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#FF5533] shrink-0" />
            <span className="truncate">{manufacturer.location}</span>
            <span className="text-white/30">•</span>
            <span className="font-semibold text-white/90">{manufacturer.country}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md truncate">
            {manufacturer.name}
          </h2>
        </div>
      </div>

      {/* 2. Scrollable Body Information */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-3.5 custom-scrollbar pointer-events-auto">
        {/* Tagline */}
        <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
          {manufacturer.tagline}
        </p>

        {/* Production Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 py-1">
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-mono text-white/40 uppercase">Min MOQ</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-0.5">
              {manufacturer.moq.toLocaleString()} {manufacturer.moqUnit}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-mono text-white/40 uppercase">Avg Lead Time</span>
            <span className="text-xs sm:text-sm font-bold text-cyan-300 mt-0.5">
              {manufacturer.leadTimeAvgWeeks} Weeks
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <span className="text-[10px] font-mono text-white/40 uppercase">Plant Floor</span>
            <span className="text-xs sm:text-sm font-bold text-amber-300 mt-0.5">
              {(manufacturer.facilitySizeSqFt / 1000).toFixed(0)}k sq.ft
            </span>
          </div>
        </div>

        {/* AI Co-Founder Match Intelligence */}
        {manufacturer.whyMatches && manufacturer.whyMatches.length > 0 && (
          <div className="rounded-xl p-3 bg-emerald-950/20 border border-emerald-500/25 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Co-Founder Match Rationale:</span>
            </div>
            <ul className="space-y-1 text-xs text-emerald-100/80">
              {manufacturer.whyMatches.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Needs Confirmation Alert */}
        {manufacturer.needsConfirmation && manufacturer.needsConfirmation.length > 0 && (
          <div className="rounded-xl p-2.5 bg-amber-950/20 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-300/90">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300">Needs Founder Confirmation: </span>
              <span>{manufacturer.needsConfirmation[0]}</span>
            </div>
          </div>
        )}

        {/* Machinery & Process Tags */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40 uppercase">
            <Cpu className="w-3 h-3 text-[#FF5533]" />
            <span>Audited Equipment & Machinery</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {manufacturer.machinery.slice(0, 3).map((mac, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-lg bg-black/40 border border-white/[0.08] text-[11px] font-mono text-white/80"
              >
                {mac.name}
              </span>
            ))}
            {manufacturer.certifications.slice(0, 2).map((cert, idx) => (
              <span
                key={`c-${idx}`}
                className="px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-300 font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Card Bottom Quick Links */}
      <div className="px-4 py-3 bg-[#0A0C14] border-t border-white/[0.08] flex items-center justify-between gap-2 shrink-0 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMap(manufacturer);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/[0.08] transition-colors"
          >
            <Map className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Pin</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSuperAudit(manufacturer);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Audit</span>
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(manufacturer);
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5533]/15 hover:bg-[#FF5533]/25 text-[#FF7A59] border border-[#FF5533]/30 transition-colors"
        >
          <span>Full Spec Sheet</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

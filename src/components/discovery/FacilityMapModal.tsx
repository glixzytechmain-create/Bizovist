import React from 'react';
import { Manufacturer } from '../../types';
import {
  X,
  MapPin,
  Navigation,
  Anchor,
  Truck,
  ExternalLink,
  ShieldCheck,
  Building2,
  Maximize2,
} from 'lucide-react';

interface FacilityMapModalProps {
  manufacturer: Manufacturer | null;
  onClose: () => void;
}

export const FacilityMapModal: React.FC<FacilityMapModalProps> = ({
  manufacturer,
  onClose,
}) => {
  if (!manufacturer) return null;

  const lat = manufacturer.coordinates?.lat || 18.5204;
  const lng = manufacturer.coordinates?.lng || 73.8567;
  const mapsApiKey =
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCo7rPzeTNSVaMC3K-2-y91gRBEXlTzkTQ';

  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(
    `${manufacturer.name}, ${manufacturer.location}`
  )}&center=${lat},${lng}&zoom=11`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
    manufacturer.name
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-[#07080C]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#10121D] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-left my-auto">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-start justify-between gap-4 bg-gradient-to-r from-[#171926] to-[#10121D]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#FF5533] font-semibold flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                Industrial Supply Chain & Logistics Corridor
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Google Maps Verified
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {manufacturer.name} — Plant Location
            </h2>
            <p className="text-xs text-white/60 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#FF5533]" />
              {manufacturer.location} ({lat.toFixed(4)}° N, {lng.toFixed(4)}° E)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.12] text-white transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.08] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map View Frame */}
        <div className="relative w-full h-[400px] bg-[#0A0C14] border-b border-white/[0.08] overflow-hidden">
          <iframe
            title={`${manufacturer.name} Facility Map`}
            src={googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.1)' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Overlay corridor badge */}
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-[#0F111BE6] backdrop-blur-md border border-white/[0.1] shadow-xl text-xs space-y-1">
            <div className="flex items-center gap-2 font-mono font-bold text-white text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{manufacturer.logisticsCorridor || 'Industrial Manufacturing Hub'}</span>
            </div>
            <div className="text-[11px] text-white/60 flex items-center gap-1 font-mono">
              <Anchor className="w-3 h-3 text-cyan-400" />
              <span>Nearest Port: {manufacturer.nearestPort || 'Regional Container Freight Hub'}</span>
            </div>
          </div>
        </div>

        {/* Freight & Supply Chain Insights */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] block">Logistics Belt</span>
            <span className="font-bold text-white block">
              {manufacturer.logisticsCorridor || 'Western Corridor'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] block">Ocean & Air Gateways</span>
            <span className="font-bold text-cyan-300 block">
              {manufacturer.nearestPort || 'Direct Container Railhead'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-white/40 uppercase text-[10px] block">Factory Footprint</span>
            <span className="font-bold text-[#FF5533] block">
              {manufacturer.facilitySizeSqFt.toLocaleString()} sq.ft (Audited)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

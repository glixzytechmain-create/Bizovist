import React, { useState } from 'react';
import { Manufacturer } from '../../types';
import {
  Anchor,
  Truck,
  Navigation,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Clock,
  Train,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Maximize2,
} from 'lucide-react';

interface LogisticsSatelliteRadarProps {
  manufacturers: Manufacturer[];
}

export const LogisticsSatelliteRadar: React.FC<LogisticsSatelliteRadarProps> = ({
  manufacturers,
}) => {
  const [selectedMfgId, setSelectedMfgId] = useState<string>(
    manufacturers[0]?.id || ''
  );

  const activeMfg =
    manufacturers.find((m) => m.id === selectedMfgId) || manufacturers[0];

  const mapsApiKey =
    (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyCo7rPzeTNSVaMC3K-2-y91gRBEXlTzkTQ';

  const lat = activeMfg?.coordinates?.lat || 18.5204;
  const lng = activeMfg?.coordinates?.lng || 73.8567;

  // Google Maps Satellite Embed URL
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(
    `${activeMfg?.name || 'Facility'}, ${activeMfg?.location || 'India'}`
  )}&center=${lat},${lng}&zoom=10&maptype=satellite`;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(
    activeMfg?.name || ''
  )}`;

  // Port benchmark database
  const getPortLogistics = (mfg: Manufacturer) => {
    const loc = mfg.location.toLowerCase();
    if (loc.includes('pune') || loc.includes('maharashtra') || loc.includes('mumbai')) {
      return {
        portName: 'Jawaharlal Nehru Port (JNPT / Nhava Sheva)',
        distanceKm: 128,
        drayageHours: '3.5 - 4.5 hours',
        railConnectivity: true,
        freightCorridor: 'Mumbai-Pune Industrial Expressway Corridor',
        riskLevel: 'Low (Year-Round Deepwater Handling)',
      };
    }
    if (loc.includes('gujarat') || loc.includes('sanand') || loc.includes('ahmedabad')) {
      return {
        portName: 'Mundra Port / Kandla Port Hub',
        distanceKm: 320,
        drayageHours: '5.5 - 6.5 hours',
        railConnectivity: true,
        freightCorridor: 'Western Dedicated Freight Corridor (DFC)',
        riskLevel: 'Low (Fastest Vessel Turnaround in Western India)',
      };
    }
    if (loc.includes('coimbatore') || loc.includes('tamil nadu')) {
      return {
        portName: 'Cochin Port / Tuticorin Sea Port',
        distanceKm: 175,
        drayageHours: '4.0 - 5.0 hours',
        railConnectivity: true,
        freightCorridor: 'NH-544 Coimbatore-Kochi Industrial Highway',
        riskLevel: 'Low (Deep Draft Transshipment)',
      };
    }
    if (loc.includes('bengaluru') || loc.includes('karnataka')) {
      return {
        portName: 'Chennai Sea Port / BLR Air Cargo',
        distanceKm: 290,
        drayageHours: '6.0 - 7.0 hours',
        railConnectivity: true,
        freightCorridor: 'Bengaluru-Chennai Expressway Corridor',
        riskLevel: 'Low (Dedicated Container Rail to Chennai Port)',
      };
    }
    return {
      portName: 'ICD Dadri Dry Port / Western DFC Rail to JNPT',
      distanceKm: 18,
      drayageHours: '0.8 hours to Railhead',
      railConnectivity: true,
      freightCorridor: 'Delhi-Mumbai Industrial Corridor (DMIC)',
      riskLevel: 'Low-Medium (Rail Transit Buffer Required)',
    };
  };

  return (
    <div className="rounded-2xl bg-[#0E1019] border border-white/[0.08] p-5 sm:p-6 space-y-6 shadow-2xl text-left">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF5533] uppercase tracking-wider font-semibold">
            <Truck className="w-3.5 h-3.5" />
            <span>Multi-Facility Satellite Radar & Freight Corridors</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Maritime Port & Supply Chain Logistics
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Real-time port drayage distances, container rail access, and ocean freight logistics routes.
          </p>
        </div>

        {/* Facility Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl">
          {manufacturers.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMfgId(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                m.id === activeMfg.id
                  ? 'bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white font-bold shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Satellite Frame + Logistics Intel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Google Maps Satellite Frame (lg:col-span-7) */}
        <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#07080C] relative shadow-xl">
          <div className="h-[420px] w-full relative">
            <iframe
              title={`${activeMfg.name} Satellite Radar`}
              src={googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: 'contrast(1.15) brightness(0.95)',
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* Floating Satellite HUD Badge */}
            <div className="absolute top-3 left-3 p-3 rounded-xl bg-[#090A10E6] backdrop-blur-md border border-white/[0.1] shadow-2xl text-xs space-y-1 max-w-[280px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SATELLITE GROUND TRUTH</span>
              </div>
              <h4 className="font-bold text-white text-xs truncate">{activeMfg.name}</h4>
              <p className="text-[10px] text-white/60 font-mono flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF5533]" />
                {activeMfg.location}
              </p>
            </div>

            {/* External Google Maps Button */}
            <div className="absolute bottom-3 right-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#090A10E6] hover:bg-black/90 backdrop-blur-md text-white text-xs font-medium border border-white/[0.15] shadow-lg transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#FF5533]" />
                <span>Open Satellite View</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Port Transit & Freight Details (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Facility Port Summary */}
          {(() => {
            const portInfo = getPortLogistics(activeMfg);
            return (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#FF5533] font-bold flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5" />
                    Primary Maritime Port
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {portInfo.distanceKm} km to Dock
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{portInfo.portName}</h4>
                  <p className="text-xs text-white/60 mt-0.5">{portInfo.freightCorridor}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">
                      Container Drayage
                    </span>
                    <span className="font-bold text-white text-xs mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {portInfo.drayageHours}
                    </span>
                  </div>

                  <div className="p-2 rounded bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-[10px] font-mono text-white/40 uppercase block">
                      Dedicated Rail
                    </span>
                    <span className="font-bold text-white text-xs mt-0.5 flex items-center gap-1">
                      <Train className="w-3 h-3 text-purple-400" />
                      {portInfo.railConnectivity ? 'Direct DFC Access' : 'Road Drayage'}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Logistics Risk: {portInfo.riskLevel}</span>
                </div>
              </div>
            );
          })()}

          {/* Quick Comparative Port Proximity Table across all compared facilities */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-2.5">
            <h4 className="text-xs font-mono uppercase text-white/40 font-semibold">
              All Compared Facilities — Port Proximity
            </h4>

            <div className="space-y-2">
              {manufacturers.map((m) => {
                const info = getPortLogistics(m);
                const isSelected = m.id === activeMfg.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMfgId(m.id)}
                    className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-[#FF5533]/10 border-[#FF5533]/40 text-white'
                        : 'bg-white/[0.01] hover:bg-white/[0.04] border-white/[0.06] text-white/80'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{m.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{m.location}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-cyan-400 font-mono">
                        {info.distanceKm} km
                      </div>
                      <div className="text-[10px] text-white/40 font-mono truncate max-w-[120px]">
                        {info.portName.split(' ')[0]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

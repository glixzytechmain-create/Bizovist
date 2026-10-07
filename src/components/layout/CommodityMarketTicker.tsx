import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Anchor,
  Cpu,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface TickerItem {
  id: string;
  category: 'raw_material' | 'logistics' | 'metrology';
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  badge?: string;
}

const TICKER_DATA: TickerItem[] = [
  {
    id: 'sus304',
    category: 'raw_material',
    label: 'SUS 304 Stainless Coil',
    value: '$2,840 / MT',
    change: '+1.2%',
    trend: 'up',
  },
  {
    id: 'al6061',
    category: 'raw_material',
    label: 'AL 6061-T6 Extrusion Billet',
    value: '$2,420 / MT',
    change: '-0.4%',
    trend: 'down',
  },
  {
    id: 'jnpt',
    category: 'logistics',
    label: 'JNPT Nhava Sheva Drayage',
    value: 'Corridor Clear',
    change: '16h avg transit',
    trend: 'neutral',
    badge: 'WEST COAST',
  },
  {
    id: 'pp_resin',
    category: 'raw_material',
    label: 'PP Copolymer (Injection Grade)',
    value: '$1,180 / MT',
    change: '+0.6%',
    trend: 'up',
  },
  {
    id: 'mundra',
    category: 'logistics',
    label: 'Mundra Port DFC Rail Link',
    value: 'Direct Freight Active',
    change: 'Berth < 10h',
    trend: 'neutral',
    badge: 'GUJARAT DFC',
  },
  {
    id: 'cmm',
    category: 'metrology',
    label: 'Zeiss CMM Metrology Baseline',
    value: '±0.005mm Calibrated',
    change: 'ISO 10360-2',
    trend: 'neutral',
  },
  {
    id: 'sus316',
    category: 'raw_material',
    label: 'SUS 316 Surgical Grade',
    value: '$3,920 / MT',
    change: '+0.9%',
    trend: 'up',
  },
  {
    id: 'machines',
    category: 'metrology',
    label: 'Verified Spindles & Presses',
    value: '2,840+ Active Units',
    change: 'Live Telemetry',
    trend: 'neutral',
  },
];

export const CommodityMarketTicker: React.FC = () => {
  // Duplicate array once for seamless infinite loop
  const displayItems = [...TICKER_DATA, ...TICKER_DATA];

  return (
    <div className="w-full bg-[#08090E] border-b border-white/[0.06] overflow-hidden select-none h-8 flex items-center relative z-20">
      {/* Subtle Left Label */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#0D0F17] border-r border-white/[0.08] text-[10px] font-mono uppercase tracking-wider text-white/50 shrink-0 z-10 shadow-sm">
        <Activity className="w-3 h-3 text-[#FF5533]" />
        <span className="font-semibold text-white/70">SUPPLY RADAR</span>
      </div>

      {/* Scrolling Track */}
      <div className="overflow-hidden flex-1 relative flex items-center h-full">
        <div className="animate-ticker-marquee flex items-center gap-6 pl-4 whitespace-nowrap">
          {displayItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="inline-flex items-center gap-2 text-[11px] font-mono text-white/70 hover:text-white transition-colors cursor-default"
            >
              <span className="text-white/40 text-[10px] uppercase font-semibold">
                {item.label}
              </span>
              <span className="font-bold text-white/90">{item.value}</span>

              {item.change && (
                <span
                  className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1 py-0.2 rounded ${
                    item.trend === 'up'
                      ? 'text-emerald-400 bg-emerald-500/10'
                      : item.trend === 'down'
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-white/50 bg-white/[0.04]'
                  }`}
                >
                  {item.trend === 'up' && <TrendingUp className="w-2.5 h-2.5" />}
                  {item.trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                  <span>{item.change}</span>
                </span>
              )}

              {item.badge && (
                <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-white/[0.05] border border-white/[0.08] text-white/40">
                  {item.badge}
                </span>
              )}

              <span className="text-white/15 ml-3">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

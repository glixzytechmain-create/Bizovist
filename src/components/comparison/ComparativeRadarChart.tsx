import React from 'react';
import { Manufacturer, ManufacturerComparisonResult } from '../../types';
import { ShieldCheck, Cpu, DollarSign, Clock, Truck, Award } from 'lucide-react';

interface ComparativeRadarChartProps {
  manufacturers: Manufacturer[];
  comparisonResult: ManufacturerComparisonResult | null;
}

export const ComparativeRadarChart: React.FC<ComparativeRadarChartProps> = ({
  manufacturers,
  comparisonResult,
}) => {
  const categories = [
    { key: 'precision', label: 'Precision & Tolerances', icon: Cpu, color: 'from-purple-500 to-indigo-500' },
    { key: 'toolingEconomy', label: 'Tooling Economy (Low NRE)', icon: DollarSign, color: 'from-emerald-500 to-teal-500' },
    { key: 'speed', label: 'Turnaround & MOQ Agility', icon: Clock, color: 'from-amber-500 to-orange-500' },
    { key: 'verificationTrust', label: 'Verification & Metrology', icon: ShieldCheck, color: 'from-cyan-500 to-blue-500' },
    { key: 'logistics', label: 'Maritime Port Proximity', icon: Truck, color: 'from-rose-500 to-pink-500' },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1019] border border-white/[0.08] space-y-6 shadow-2xl text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Multi-Vector Capability Benchmark</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Comparative Capability & Risk Radar
          </h3>
        </div>
        <div className="text-[11px] font-mono text-white/40">
          Scored 0–100 against engineering specifications
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono">
                  <Icon className="w-3.5 h-3.5 text-white/80" />
                  <span className="truncate">{cat.label}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                {manufacturers.map((mfg) => {
                  const score =
                    comparisonResult?.comparativeScores?.[mfg.id]?.[
                      cat.key as keyof (typeof comparisonResult.comparativeScores)[string]
                    ] || 85;

                  return (
                    <div key={mfg.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-white/70 truncate max-w-[120px]">
                          {mfg.name.split(' ')[0]}
                        </span>
                        <span className="font-bold text-white">{score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

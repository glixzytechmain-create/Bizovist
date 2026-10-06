import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Sparkles,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
} from 'lucide-react';

export const RoleSelectionModal: React.FC = () => {
  const { setUserRole, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('founder');
  const [step, setStep] = useState<'role' | 'adaptive'>('role');
  const [focusArea, setFocusArea] = useState<string>('Food, Nutrition & Supplements');

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setUserRole(role);
    setStep('adaptive');
  };

  const handleFinish = () => {
    if (selectedRole === 'manufacturer') {
      setActiveView('mfg-dashboard');
    } else {
      setActiveView('home');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080C]/90 backdrop-blur-2xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-[#11131E] border border-white/[0.1] shadow-2xl shadow-black/90 text-left">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5533]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-white/40 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5533]" />
            <span>BIZOVIST ONBOARDING</span>
          </div>
          <span>{step === 'role' ? 'STEP 1 OF 2' : 'STEP 2 OF 2'}</span>
        </div>

        {step === 'role' ? (
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              What brings you to Bizovist?
            </h2>
            <p className="text-sm text-white/60 mt-2">
              Select your primary intent. You can always switch or operate as both roles later.
            </p>

            <div className="mt-6 space-y-3">
              {/* Option 1: Founder */}
              <button
                onClick={() => handleRoleSelect('founder')}
                className="w-full p-4 rounded-xl border border-white/[0.08] hover:border-[#FF5533]/60 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF5533]/15 text-[#FF5533] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF5533] transition">
                      “I want to make something”
                    </h3>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition" />
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    I am a founder, brand, or engineer looking for precision manufacturing facilities, co-packers, or custom tooling partners.
                  </p>
                </div>
              </button>

              {/* Option 2: Manufacturer */}
              <button
                onClick={() => handleRoleSelect('manufacturer')}
                className="w-full p-4 rounded-xl border border-white/[0.08] hover:border-[#FF5533]/60 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition">
                      “I make things”
                    </h3>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition" />
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    I own or operate a manufacturing plant, machine shop, co-packing facility, or fabrication shop looking for qualified buyers.
                  </p>
                </div>
              </button>

              {/* Option 3: Both */}
              <button
                onClick={() => handleRoleSelect('both')}
                className="w-full p-4 rounded-xl border border-white/[0.08] hover:border-cyan-500/60 bg-white/[0.02] hover:bg-white/[0.04] transition-all text-left flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition">
                      “Both”
                    </h3>
                    <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition" />
                  </div>
                  <p className="text-xs text-white/50 mt-1 leading-relaxed">
                    We manufacture components while outsourcing specialized packaging, surface coatings, or sub-assemblies.
                  </p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Adaptive progressive step */
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {selectedRole === 'manufacturer'
                ? 'Select your primary manufacturing domain'
                : 'What category are you developing?'}
            </h2>
            <p className="text-sm text-white/60 mt-2">
              Progressive profiling allows Bizovist to index relevant machine tolerances and certification requirements.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Food, Nutrition & Supplements',
                'Aluminium & Metal Containers',
                'Precision CNC & Mechatronics',
                'Cleanroom Injection Molding',
                'Sustainable Molded Pulp Packaging',
                'Consumer Hardware & Electronics',
              ].map((domain, idx) => {
                const isSelected = focusArea === domain;
                return (
                  <button
                    key={idx}
                    onClick={() => setFocusArea(domain)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between ${
                      isSelected
                        ? 'border-[#FF5533] bg-[#FF5533]/10 text-white'
                        : 'border-white/[0.08] bg-white/[0.02] text-white/70 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <span>{domain}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF5533]" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <button
                onClick={() => setStep('role')}
                className="text-xs text-white/50 hover:text-white transition"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFinish}
                  className="text-xs text-white/40 hover:text-white/80 transition"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleFinish}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF5533] to-[#E04626] text-white shadow-lg shadow-[#FF5533]/30 hover:brightness-110 active:scale-95 transition"
                >
                  <span>Enter Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AudioBriefingPlayerProps {
  title?: string;
  summaryText: string;
  projectName?: string;
}

export const AudioBriefingPlayer: React.FC<AudioBriefingPlayerProps> = ({
  title = 'AI Co-Founder Strategic DFM Briefing',
  summaryText,
  projectName,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [supported, setSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    if (!supported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Reset any ongoing utterances

    const fullBriefingText = `BIZOVIST Manufacturing Intelligence Executive Briefing for ${
      projectName || 'your active project'
    }. ${summaryText}`;

    const utterance = new SpeechSynthesisUtterance(fullBriefingText);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleCycleSpeed = () => {
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 1.5 : 1.0;
    setRate(nextRate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 150);
  };

  // 14 subtle equalizer bars
  const waveBars = [0.4, 0.7, 0.3, 0.9, 0.6, 0.8, 0.4, 0.95, 0.5, 0.8, 0.35, 0.75, 0.5, 0.6];

  return (
    <div className="panel-precision p-3.5 sm:p-4 rounded-xl border border-white/[0.08] space-y-3 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Metadata */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/80 shrink-0">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-[#FF5533]" />
            ) : (
              <Sparkles className="w-4 h-4 text-white/50" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.05] text-white/40 border border-white/[0.06]">
                VOICE BRIEFING
              </span>
            </h4>
            <p className="text-[11px] text-white/50 font-mono">
              Synthesized DFM trade-offs & procurement guidance
            </p>
          </div>
        </div>

        {/* Player Controls & Waveform */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Waveform Bar Track */}
          <div className="flex items-center gap-0.5 h-6 px-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
            {waveBars.map((heightFactor, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-[#FF5533] wave-bar-active'
                    : 'bg-white/20 h-1.5'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(4, Math.round(heightFactor * 18))}px` : '4px',
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Speed Toggle */}
          <button
            onClick={handleCycleSpeed}
            className="btn-tactile px-2 py-1 rounded text-[10px] font-mono font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white/70 border border-white/[0.08]"
            title="Cycle Playback Speed"
          >
            {rate}x
          </button>

          {/* Restart */}
          {isPlaying && (
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition"
              title="Restart Audio"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Play / Pause Primary Button */}
          <button
            onClick={handleTogglePlay}
            disabled={!supported}
            className={`btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isPlaying
                ? 'bg-white/[0.1] text-white border border-white/[0.15]'
                : 'bg-[#FF5533] hover:bg-[#E04626] text-white shadow-md shadow-[#FF5533]/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Listen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transcript Collapsible */}
      <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono text-white/40">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="hover:text-white/70 flex items-center gap-1 transition"
        >
          <span>{showTranscript ? 'Hide Briefing Transcript' : 'View Briefing Transcript'}</span>
          {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {isPlaying && (
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PLAYING
          </span>
        )}
      </div>

      {showTranscript && (
        <div className="p-3 rounded-lg bg-black/30 border border-white/[0.06] text-xs text-white/70 leading-relaxed font-sans max-h-40 overflow-y-auto">
          {summaryText}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Manufacturer } from '../../types';
import { SwipeManufacturerCard } from './SwipeManufacturerCard';
import { SwipeActionDock } from './SwipeActionDock';
import { DeckEmptyState } from './DeckEmptyState';
import { useApp } from '../../context/AppContext';
import { aiService } from '../../services/aiService';

interface SwipeCardDeckProps {
  manufacturers: Manufacturer[];
  onOpenDetails: (mfg: Manufacturer) => void;
  onOpenMap: (mfg: Manufacturer) => void;
  onSuperAudit: (mfg: Manufacturer) => void;
  onExportSheets?: (mfg: Manufacturer) => void;
}

interface SwipeHistoryItem {
  manufacturer: Manufacturer;
  action: 'shortlist' | 'pass' | 'audit';
}

export const SwipeCardDeck: React.FC<SwipeCardDeckProps> = ({
  manufacturers,
  onOpenDetails,
  onOpenMap,
  onSuperAudit,
  onExportSheets,
}) => {
  const {
    shortlistedManufacturerIds,
    toggleShortlist,
    comparisonManufacturerIds,
    toggleComparison,
    startNewRfq,
    activeProject,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<SwipeHistoryItem[]>([]);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [deckList, setDeckList] = useState<Manufacturer[]>(manufacturers);

  // Sync deck with filter updates
  useEffect(() => {
    setDeckList(manufacturers);
    setCurrentIndex(0);
    setHistory([]);
  }, [manufacturers]);

  const activeCard = deckList[currentIndex];
  const nextCard = deckList[currentIndex + 1];
  const nextNextCard = deckList[currentIndex + 2];

  // Motion values for gesture physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);

  // Stamp opacity transforms
  const shortlistOpacity = useTransform(x, [30, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -30], [1, 0]);
  const auditOpacity = useTransform(y, [-110, -35], [1, 0]);

  // Action Handlers
  const handlePass = useCallback(() => {
    if (!activeCard) return;
    setHistory((prev) => [...prev, { manufacturer: activeCard, action: 'pass' }]);
    setCurrentIndex((prev) => prev + 1);
  }, [activeCard]);

  const handleShortlist = useCallback(() => {
    if (!activeCard) return;
    if (!shortlistedManufacturerIds.includes(activeCard.id)) {
      toggleShortlist(activeCard.id);
    }
    setHistory((prev) => [...prev, { manufacturer: activeCard, action: 'shortlist' }]);
    setCurrentIndex((prev) => prev + 1);
  }, [activeCard, shortlistedManufacturerIds, toggleShortlist]);

  const handleSuperAudit = useCallback(() => {
    if (!activeCard) return;
    onSuperAudit(activeCard);
  }, [activeCard, onSuperAudit]);

  const handleToggleCompare = useCallback(() => {
    if (!activeCard) return;
    toggleComparison(activeCard.id);
  }, [activeCard, toggleComparison]);

  const handleUndo = useCallback(() => {
    if (history.length === 0 || currentIndex === 0) return;
    const lastItem = history[history.length - 1];
    if (lastItem.action === 'shortlist' && shortlistedManufacturerIds.includes(lastItem.manufacturer.id)) {
      toggleShortlist(lastItem.manufacturer.id);
    }
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, [history, currentIndex, shortlistedManufacturerIds, toggleShortlist]);

  const handleQuickRfq = useCallback(() => {
    if (!activeCard) return;
    startNewRfq(activeCard.id);
  }, [activeCard, startNewRfq]);

  // Drag End handler with release physics
  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 100;
    const velocityThreshold = 400;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handleShortlist();
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handlePass();
    } else if (info.offset.y < -swipeThreshold || info.velocity.y < -velocityThreshold) {
      handleSuperAudit();
    }
    setDragDirection(null);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleShortlist();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePass();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleSuperAudit();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleToggleCompare();
      } else if (e.key.toLowerCase() === 'z' || e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShortlist, handlePass, handleSuperAudit, handleToggleCompare, handleUndo]);

  // Live Web Discovery fallback
  const handleLiveWebDiscovery = async (query: string) => {
    try {
      const res = await fetch('/api/ai/live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          geography: activeProject?.locationPreference || 'India & Global',
        }),
      });
      const data = await res.json();
      if (data.facilities && data.facilities.length > 0) {
        // Map discovered web facilities to Manufacturer format
        const newMfgs: Manufacturer[] = data.facilities.map((f: any, idx: number) => ({
          id: `web-discovered-${Date.now()}-${idx}`,
          name: f.name || 'Discovered Precision Facility',
          tagline: `Public intelligence: ${f.processes?.join(', ') || 'Custom manufacturing'}`,
          verified: false,
          verificationLevel: 'public_intelligence',
          location: f.location || 'Verified Industrial Hub',
          country: 'India',
          facilitySizeSqFt: 60000,
          workforceCount: 85,
          establishedYear: 2012,
          industries: [activeProject?.industry || 'Industrial Precision'],
          products: [activeProject?.title || 'Custom Component'],
          materials: f.materials || ['Standard Industrial Grade'],
          processes: f.processes || ['Precision Machining'],
          machinery: (f.machineryMentioned || ['Automated Cell Line']).map((m: string) => ({
            name: m,
            count: 2,
          })),
          capabilities: f.whyMatches || ['Discovered via Google Search Grounding'],
          certifications: f.certifications || ['ISO 9001 (Claimed)'],
          moq: f.estimatedMOQ || 10000,
          moqUnit: f.moqUnit || 'units',
          annualCapacity: 'Flexible Scale',
          leadTimeAvgWeeks: 6,
          customizationRating: 'High',
          evidenceSource: {
            type: 'public_evidence',
            details: f.evidenceProvenance || 'Google Search Grounded Discovery',
          },
          samplePolicy: 'Sample dispatch upon verified technical RFQ.',
          whyMatches: f.whyMatches || ['Discovered for matching procurement query'],
          needsConfirmation: f.needsConfirmation || ['Verify direct facility ownership vs broker'],
        }));

        setDeckList((prev) => [...prev, ...newMfgs]);
      }
    } catch (e) {
      console.warn('Web discovery error:', e);
    }
  };

  const isDeckFinished = currentIndex >= deckList.length;

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 select-none">
      {/* Keyboard Shortcuts Hint Bar */}
      <div className="hidden sm:flex items-center gap-4 text-[11px] font-mono text-white/40 pb-4">
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">←</kbd> Pass</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">→</kbd> Shortlist</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↑</kbd> AI Audit</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">↓</kbd> Compare</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70">Z</kbd> Undo</span>
      </div>

      {/* Main Card Stack Container */}
      <div className="relative w-full max-w-md h-[630px] sm:h-[660px] flex items-center justify-center">
        {isDeckFinished ? (
          <DeckEmptyState
            shortlistCount={shortlistedManufacturerIds.length}
            totalEvaluated={deckList.length}
            onResetDeck={() => {
              setCurrentIndex(0);
              setHistory([]);
            }}
            onViewShortlist={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLiveWebDiscovery={handleLiveWebDiscovery}
            currentProductQuery={activeProject?.title}
          />
        ) : (
          <div className="relative w-full h-full">
            {/* Background Layer 2 (Next-Next Card) */}
            {nextNextCard && (
              <div
                style={{
                  transform: 'scale(0.90) translateY(24px)',
                  opacity: 0.4,
                  transformOrigin: 'top center',
                }}
                className="absolute inset-0 pointer-events-none transition-transform duration-300"
              >
                <SwipeManufacturerCard
                  manufacturer={nextNextCard}
                  onOpenDetails={() => {}}
                  onOpenMap={() => {}}
                  onSuperAudit={() => {}}
                />
              </div>
            )}

            {/* Background Layer 1 (Next Card) */}
            {nextCard && (
              <div
                style={{
                  transform: 'scale(0.95) translateY(12px)',
                  opacity: 0.8,
                  transformOrigin: 'top center',
                }}
                className="absolute inset-0 pointer-events-none transition-transform duration-300"
              >
                <SwipeManufacturerCard
                  manufacturer={nextCard}
                  onOpenDetails={() => {}}
                  onOpenMap={() => {}}
                  onSuperAudit={() => {}}
                />
              </div>
            )}

            {/* Top Interactive Card */}
            {activeCard && (
              <motion.div
                key={activeCard.id}
                style={{
                  x,
                  y,
                  rotate,
                  cursor: 'grab',
                }}
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.65}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: 'grabbing' }}
                className="absolute inset-0 z-20 touch-none shadow-2xl"
              >
                {/* 1. SHORTLIST Stamp Overlay (Emerald) */}
                <motion.div
                  style={{ opacity: shortlistOpacity }}
                  className="absolute top-10 left-8 z-30 pointer-events-none -rotate-12 border-4 border-emerald-400 bg-emerald-950/80 text-emerald-300 font-black font-mono text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl tracking-widest shadow-2xl shadow-emerald-500/50 backdrop-blur-md"
                >
                  SHORTLIST ★
                </motion.div>

                {/* 2. PASS Stamp Overlay (Crimson) */}
                <motion.div
                  style={{ opacity: passOpacity }}
                  className="absolute top-10 right-8 z-30 pointer-events-none rotate-12 border-4 border-rose-500 bg-rose-950/80 text-rose-300 font-black font-mono text-2xl sm:text-3xl px-4 py-1.5 rounded-2xl tracking-widest shadow-2xl shadow-rose-500/50 backdrop-blur-md"
                >
                  PASS ✕
                </motion.div>

                {/* 3. AI AUDIT Stamp Overlay (Purple) */}
                <motion.div
                  style={{ opacity: auditOpacity }}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none border-4 border-purple-400 bg-purple-950/85 text-purple-200 font-black font-mono text-xl sm:text-2xl px-5 py-1.5 rounded-2xl tracking-wider shadow-2xl shadow-purple-500/50 backdrop-blur-md whitespace-nowrap"
                >
                  AI AUDIT ⚡
                </motion.div>

                {/* The Manufacturer Card Content */}
                <SwipeManufacturerCard
                  manufacturer={activeCard}
                  onOpenDetails={onOpenDetails}
                  onOpenMap={onOpenMap}
                  onSuperAudit={onSuperAudit}
                  onExportSheets={onExportSheets}
                />
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Controls Dock */}
      {!isDeckFinished && activeCard && (
        <SwipeActionDock
          canUndo={history.length > 0 && currentIndex > 0}
          onUndo={handleUndo}
          onPass={handlePass}
          onSuperAudit={handleSuperAudit}
          onShortlist={handleShortlist}
          onToggleCompare={handleToggleCompare}
          isCompared={comparisonManufacturerIds.includes(activeCard.id)}
          onQuickRfq={handleQuickRfq}
        />
      )}
    </div>
  );
};

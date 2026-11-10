import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import {
  Maximize2,
  Sliders,
  RotateCcw,
  Layers,
  ChevronDown
} from 'lucide-react';

export interface GalleryPhoto {
  id: string;
  src: string;
  aspect?: string;
}

interface ScrollSpreadCardGalleryProps {
  photos: GalleryPhoto[];
  onPhotoClick?: (src: string) => void;
}

export const ScrollSpreadCardGallery: React.FC<ScrollSpreadCardGalleryProps> = ({
  photos,
  onPhotoClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(Math.floor(photos.length / 2));
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [manualSpread, setManualSpread] = useState<number | null>(null); // null means scroll-driven
  const [hasScrolled, setHasScrolled] = useState(false);

  // Resize listener for responsive spread calculations
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Motion useScroll attached to this gallery section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'center 0.45']
  });

  // Smooth spring for cinematic inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001
  });

  // Track raw scroll state as fallback/reactivity
  const [scrollProgressVal, setScrollProgressVal] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      setScrollProgressVal(v);
      if (v > 0.05) setHasScrolled(true);
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  // Window scroll fallback calculation for bulletproof accuracy
  useEffect(() => {
    const handleWindowScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Section progress: 0 when top is near bottom of viewport, 1 when center reaches middle
      const startTrigger = windowH * 0.85;
      const endTrigger = windowH * 0.45;
      const currentPos = rect.top;

      let ratio = (startTrigger - currentPos) / (startTrigger - endTrigger);
      ratio = Math.max(0, Math.min(1, ratio));

      // If manual spread is not locked, sync with window scroll
      if (manualSpread === null) {
        setScrollProgressVal((prev) => {
          // Keep highest fidelity between motion useScroll and window listener
          return Math.abs(ratio - prev) > 0.02 ? ratio : prev;
        });
        if (ratio > 0.05) setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [manualSpread]);

  // Effective spread factor between 0 (tight stack) and 1 (fully spread apart like cards)
  const effectiveSpread = manualSpread !== null ? manualSpread : scrollProgressVal;

  const total = photos.length;
  const midIndex = (total - 1) / 2;

  // Responsive spread metrics based on current viewport
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const maxSpreadX = useMemo(() => {
    if (isMobile) return Math.min(windowWidth * 0.42, 170);
    if (isTablet) return Math.min(windowWidth * 0.44, 340);
    return Math.min(windowWidth * 0.46, 520);
  }, [windowWidth, isMobile, isTablet]);

  const maxRotateDeg = useMemo(() => {
    if (isMobile) return 18;
    if (isTablet) return 22;
    return 26;
  }, [isMobile, isTablet]);

  const maxArcY = useMemo(() => {
    if (isMobile) return 28;
    if (isTablet) return 40;
    return 55;
  }, [isMobile, isTablet]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-8 select-none"
    >
      {/* Top Gallery Toolbar: Real-time Spread Indicator & Tactile Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-2">
        {/* Left: Dynamic Spread Status & Instruction */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAE4D9]/90 border border-[#D4AF37]/30 text-[#8C6D45] text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>
              {effectiveSpread < 0.15
                ? 'Deck Stacked · Scroll to Spread'
                : effectiveSpread > 0.85
                ? 'Cards Spread Wide · Click to Expand'
                : `Spreading Cards (${Math.round(effectiveSpread * 100)}%)`}
            </span>
          </div>

          {manualSpread !== null && (
            <button
              type="button"
              onClick={() => setManualSpread(null)}
              className="text-[11px] font-mono text-[#8C6D45] hover:text-[#292722] underline underline-offset-2 flex items-center gap-1"
              title="Resume following page scroll up and down"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sync to Scroll</span>
            </button>
          )}
        </div>

        {/* Right: Quick Action Presets (Spread Out / Stack Together / Slider) */}
        <div className="flex items-center gap-2">
          {/* Preset Buttons */}
          <button
            type="button"
            onClick={() => setManualSpread(1)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              effectiveSpread >= 0.95 && manualSpread !== null
                ? 'bg-[#292722] text-[#D4AF37] shadow-sm'
                : 'bg-white/70 hover:bg-white text-[#5A554E] hover:text-[#292722] shadow-xs'
            }`}
          >
            Spread Cards
          </button>
          <button
            type="button"
            onClick={() => setManualSpread(0)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
              effectiveSpread <= 0.05 && manualSpread !== null
                ? 'bg-[#292722] text-[#D4AF37] shadow-sm'
                : 'bg-white/70 hover:bg-white text-[#5A554E] hover:text-[#292722] shadow-xs'
            }`}
          >
            Stack Deck
          </button>

          {/* Interactive Spread Slider */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#8C6D45]/20">
            <Sliders className="w-3.5 h-3.5 text-[#8C6D45]" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={effectiveSpread}
              onChange={(e) => setManualSpread(parseFloat(e.target.value))}
              aria-label="Manual Card Spread Slider"
              className="w-24 accent-[#8C6D45] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* STAGE: The Card Spread Arena */}
      <div className="relative w-full h-[480px] sm:h-[560px] md:h-[620px] lg:h-[680px] flex items-center justify-center overflow-visible">
        {/* Soft Ambient Gold Floor Glow */}
        <div
          className="absolute inset-0 max-w-4xl mx-auto rounded-full bg-radial from-[#D4AF37]/10 via-[#8C6D45]/5 to-transparent pointer-events-none transition-opacity duration-700"
          style={{ opacity: 0.3 + effectiveSpread * 0.5 }}
        />

        {/* Central Cards Spread Layout */}
        <div className="relative w-full h-full flex items-center justify-center">
          {photos.map((photo, i) => {
            const norm = (i - midIndex) / (midIndex || 1); // -1.0 to +1.0
            const isHovered = hoveredIndex === i;
            const isActive = activeCardIndex === i;

            // Target positions when FULLY SPREAD (effectiveSpread = 1)
            const targetX = norm * maxSpreadX;
            // Arc curve: cards curve slightly downwards towards edges like a real fan of cards
            const targetY = Math.pow(norm, 2) * maxArcY;
            const targetRotate = norm * maxRotateDeg;

            // Target positions when STACKED (effectiveSpread = 0)
            const stackedX = (i - midIndex) * (isMobile ? 1.5 : 2.5); // subtle stack offset
            const stackedY = i * (isMobile ? 1.2 : 2.0); // deck height
            const stackedRotate = (i % 2 === 0 ? 1 : -1) * (i * 0.8 - 2.5); // organic deck jitter
            const stackedScale = 1 - (total - 1 - i) * 0.007;

            // Interpolate based on current effectiveSpread
            const currentX = stackedX + (targetX - stackedX) * effectiveSpread;
            const currentY = stackedY + (targetY - stackedY) * effectiveSpread;
            const currentRotate = stackedRotate + (targetRotate - stackedRotate) * effectiveSpread;
            const baseScale = stackedScale + (1.0 - stackedScale) * effectiveSpread;

            // Final scale and elevation on hover
            const finalScale = isHovered ? baseScale * 1.08 : baseScale;
            const finalY = isHovered ? currentY - 24 : currentY;
            const finalRotate = isHovered ? 0 : currentRotate;

            // Layering: hovered card is highest; when spread, center cards sit nicely
            const baseZ = i <= midIndex ? i + 1 : total - i;
            const zIndex = isHovered ? 100 : isActive ? 50 : baseZ + 10;

            return (
              <motion.div
                key={photo.id}
                onMouseEnter={() => {
                  setHoveredIndex(i);
                  setActiveCardIndex(i);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setActiveCardIndex(i);
                  onPhotoClick?.(photo.src);
                }}
                style={{
                  zIndex,
                  transformOrigin: 'bottom center'
                }}
                animate={{
                  x: currentX,
                  y: finalY,
                  rotate: finalRotate,
                  scale: finalScale
                }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 24,
                  mass: 0.8
                }}
                className="absolute cursor-pointer select-none touch-manipulation group"
              >
                {/* Physical Photo Card */}
                <div
                  className={`relative rounded-2xl overflow-hidden bg-[#FAF7F0] p-1.5 sm:p-2 transition-all duration-300 ${
                    isHovered
                      ? 'shadow-[0_28px_60px_-12px_rgba(41,39,34,0.45)] ring-2 ring-[#D4AF37]'
                      : 'shadow-[0_12px_32px_-8px_rgba(41,39,34,0.25)]'
                  } w-[150px] h-[210px] sm:w-[190px] sm:h-[265px] md:w-[220px] md:h-[305px] lg:w-[240px] lg:h-[335px]`}
                >
                  {/* Photo Container */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#1C1B18]">
                    <img
                      src={photo.src}
                      alt={`Samson & Kevine — Gallery Portrait ${i + 1}`}
                      className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Subtle Luxury Film Grain & Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />

                    {/* Hover Expand Icon Indicator */}
                    <div
                      className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#1C1B18]/75 backdrop-blur-md text-[#D4AF37] flex items-center justify-center transition-all duration-300 ${
                        isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Card Index Pill (Subtle on hover) */}
                    <div
                      className={`absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#1C1B18]/75 backdrop-blur-md text-[#FAF7F0] text-[9px] font-mono tracking-widest uppercase transition-opacity duration-300 ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Gold Foil Border Shimmer */}
                  <div className="absolute inset-0 rounded-2xl border border-[#D4AF37]/30 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Scroll Guide (Appears initially when stacked, gently fades as user scrolls) */}
      {!hasScrolled && effectiveSpread < 0.25 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center gap-1.5 mt-2 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1C1B18]/85 text-[#FAF7F0] text-xs font-mono tracking-wider backdrop-blur-md shadow-lg">
            <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37] animate-bounce" />
            <span>Scroll down to spread cards apart</span>
          </div>
        </motion.div>
      )}

      {/* Bottom Photo Thumbnails Strip for Quick Direct Selection */}
      <div className="mt-8 pt-4 flex flex-col items-center">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8C6D45] mb-2.5">
          Quick Jump · {total} Editorial Portraits
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full px-4 py-2 no-scrollbar">
          {photos.map((p, idx) => {
            const isCurrent = activeCardIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setActiveCardIndex(idx);
                  setHoveredIndex(idx);
                  if (effectiveSpread < 0.3) setManualSpread(0.85);
                }}
                className={`relative shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                  isCurrent
                    ? 'w-10 h-14 ring-2 ring-[#D4AF37] scale-110 shadow-md'
                    : 'w-7 h-10 opacity-60 hover:opacity-100'
                }`}
                aria-label={`Jump to portrait ${idx + 1}`}
              >
                <img
                  src={p.src}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

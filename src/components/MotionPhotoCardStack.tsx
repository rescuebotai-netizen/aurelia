import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Layers,
  LayoutGrid
} from 'lucide-react';

export interface StackPhoto {
  id: string;
  src: string;
  aspect?: string;
}

interface MotionPhotoCardStackProps {
  photos: StackPhoto[];
  onPhotoClick?: (src: string) => void;
}

/**
 * Single Draggable Motion Card inside the Stack
 */
const MotionStackCard: React.FC<{
  photo: StackPhoto;
  index: number;
  totalVisible: number;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onClick: () => void;
}> = ({ photo, index, totalVisible, isTop, onSwipe, onClick }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);
  const opacity = useTransform(x, [-280, -180, 0, 180, 280], [0.4, 0.9, 1, 0.9, 0.4]);

  // Visual cues based on drag direction
  const rightOpacity = useTransform(x, [20, 100], [0, 1]);
  const leftOpacity = useTransform(x, [-100, -20], [1, 0]);

  // Geometric stacking calculations
  const yOffset = index * 12; // stack drops slightly down
  const scale = 1 - index * 0.05; // stack shrinks slightly in back
  const baseRotate = index === 0 ? 0 : index % 2 === 1 ? -2.5 * index : 2.5 * index;
  const zIndex = totalVisible - index;

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 80;
    const velocityThreshold = 450;

    if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      style={{
        zIndex,
        ...(isTop ? { x, rotate, opacity } : { rotate: `${baseRotate}deg` }),
        transformOrigin: 'bottom center'
      }}
      initial={{ scale: 0.85, opacity: 0, y: 30 }}
      animate={{
        scale,
        y: yOffset,
        opacity: Math.max(0.3, 1 - index * 0.22),
        transition: {
          type: 'spring',
          stiffness: 350,
          damping: 28
        }
      }}
      exit={{
        x: isTop ? (x.get() >= 0 ? 450 : -450) : 0,
        opacity: 0,
        rotate: isTop ? (x.get() >= 0 ? 25 : -25) : 0,
        transition: { duration: 0.35, ease: 'easeOut' }
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      className={`absolute inset-0 select-none ${
        isTop ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'
      }`}
    >
      <div
        onClick={() => {
          if (isTop && Math.abs(x.get()) < 10) {
            onClick();
          }
        }}
        className="relative w-full h-full rounded-2xl overflow-hidden bg-[#FAF7F0] shadow-2xl transition-shadow duration-300 hover:shadow-[0_25px_50px_-12px_rgba(181,154,114,0.35)]"
      >
        {/* Strictly pure high-resolution photo with NO text or description */}
        <img
          src={photo.src}
          alt="Samson & Kevine — Wedding Celebration Editorial"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center pointer-events-none select-none"
          draggable={false}
        />

        {/* Dynamic Motion Swipe Overlays (pure visual cues, no borders, no text) */}
        {isTop && (
          <>
            {/* Right Swipe Accent (Gold shimmer edge) */}
            <motion.div
              style={{ opacity: rightOpacity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-[#D4AF37]/35 pointer-events-none"
            />
            {/* Left Swipe Accent (Bronze shimmer edge) */}
            <motion.div
              style={{ opacity: leftOpacity }}
              className="absolute inset-0 bg-gradient-to-l from-transparent via-[#8C6D45]/15 to-[#8C6D45]/35 pointer-events-none"
            />
          </>
        )}

        {/* Ambient luxury glass shine */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export const MotionPhotoCardStack: React.FC<MotionPhotoCardStackProps> = ({
  photos,
  onPhotoClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  if (!photos || photos.length === 0) return null;

  const total = photos.length;
  const currentPhoto = photos[currentIndex % total];

  const handleSwipe = (direction: 'left' | 'right') => {
    setHasInteracted(true);
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => (direction === 'right' ? (prev + 1) % total : (prev + 1) % total));
  };

  const handleNext = useCallback(() => {
    setHasInteracted(true);
    setHistory((prev) => [...prev, currentIndex]);
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [currentIndex, total]);

  const handlePrev = useCallback(() => {
    setHasInteracted(true);
    if (history.length > 0) {
      const lastIndex = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentIndex(lastIndex);
    } else {
      setCurrentIndex((prev) => (prev - 1 + total) % total);
    }
  }, [history, total]);

  const handleReset = useCallback(() => {
    setHasInteracted(true);
    setHistory([]);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not focused in an input/textarea
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Up to 3 visible cards in stack
  const visibleCards = [0, 1, 2].map((offset) => {
    const idx = (currentIndex + offset) % total;
    return {
      photo: photos[idx],
      offset
    };
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Interactive Motion Card Stack Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-[420px] aspect-3/4 sm:aspect-4/5 mx-auto mb-8 sm:mb-10">
        <div className="relative w-full h-full">
          <AnimatePresence mode="popLayout">
            {visibleCards.map(({ photo, offset }) => (
              <MotionStackCard
                key={`${photo.id}-${currentIndex + offset}`}
                photo={photo}
                index={offset}
                totalVisible={3}
                isTop={offset === 0}
                onSwipe={handleSwipe}
                onClick={() => onPhotoClick?.(photo.src)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Gentle Motion First-Time Swipe Hint */}
        {!hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-[#1C1B18]/90 text-[#FAF7F0] text-[10px] font-mono tracking-wider backdrop-blur-md shadow-md flex items-center pointer-events-none z-40"
          >
            <span>Drag or swipe card left / right</span>
          </motion.div>
        )}
      </div>

      {/* Tactile Deck Controls & Progress Indicator */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md px-4">
        {/* Pagination Dots / Pip Bar */}
        <div className="flex items-center gap-1.5">
          {photos.map((_, i) => {
            const active = (currentIndex % total) === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setHasInteracted(true);
                  setHistory((prev) => [...prev, currentIndex]);
                  setCurrentIndex(i);
                }}
                className={`transition-all duration-300 rounded-full ${
                  active
                    ? 'w-5 h-1.5 bg-[#8C6D45] shadow-xs'
                    : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-[#B59A72]'
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            );
          })}
        </div>

        {/* Action Button Row - Compact Luxury Sizing */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 w-full">
          {/* Undo / Previous */}
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#8C6D45] text-[#8C6D45] hover:text-white shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Previous photo"
            title="Previous Photo"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Reset / Reshuffle */}
          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#8C6D45] text-[#292722] hover:text-white shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Reset stack"
            title="Reset stack"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Zoom / Enlarge */}
          <button
            type="button"
            onClick={() => onPhotoClick?.(currentPhoto.src)}
            className="w-8 h-8 rounded-full bg-[#292722] hover:bg-[#8C6D45] text-[#D4AF37] hover:text-white shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Enlarge photo"
            title="Enlarge photo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Swipe / Next */}
          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full bg-[#FAF7F0] hover:bg-[#8C6D45] text-[#8C6D45] hover:text-white shadow-xs hover:shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Next photo"
            title="Next Photo"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Counter */}
        <div className="text-center">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#8C6D45]">
            Photo {(currentIndex % total) + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  );
};

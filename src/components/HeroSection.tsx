import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface HeroSectionProps {
  onCreateClick: () => void;
  onExploreClick: () => void;
}

interface CarouselSlide {
  id: string;
  slideNumber: string;
  theme: string;
  quote: string;
  image: string;
  alt: string;
  focalPoint: string;
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'hero-1',
    slideNumber: '01',
    theme: 'Two Hearts, One Story',
    quote: 'Every love story deserves a beautiful beginning.',
    image: '/src/assets/images/IMG-20261107-WA0121.jpg',
    alt: 'Wedding celebration couple portrait',
    focalPoint: 'object-center'
  },
  {
    id: 'hero-2',
    slideNumber: '02',
    theme: 'Eternal Devotion',
    quote: 'A moment worth celebrating forever.',
    image: '/src/assets/images/IMG-20261107-WA0131.jpg',
    alt: 'Romantic wedding couple embrace',
    focalPoint: 'object-center'
  },
  {
    id: 'hero-3',
    slideNumber: '03',
    theme: 'Timeless Elegance',
    quote: 'United in love, guided by faith.',
    image: '/src/assets/images/IMG-20261107-WA0132.jpg',
    alt: 'Joyful wedding couple moment',
    focalPoint: 'object-center'
  },
  {
    id: 'hero-4',
    slideNumber: '04',
    theme: 'A Sacred Chapter',
    quote: 'What God has joined together, let no one separate.',
    image: '/src/assets/images/IMG-20261107-WA0136.jpg',
    alt: 'Elegant wedding couple portrait',
    focalPoint: 'object-center'
  },
  {
    id: 'hero-5',
    slideNumber: '05',
    theme: 'The Journey to Forever',
    quote: 'Two souls, one destiny, infinite love.',
    image: '/src/assets/images/IMG-20261107-WA0155.jpg',
    alt: 'Beautiful couple celebrating their union',
    focalPoint: 'object-center'
  }
];

const SLIDE_DURATION = 7000; // 7 seconds

export const HeroSection: React.FC<HeroSectionProps> = ({ onCreateClick, onExploreClick }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Touch handling for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  const goToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setProgress(0);
  };

  // Timer loop with 100ms progress tick
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 100;
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe listeners
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = SLIDES[currentSlideIndex];

  return (
    <section
      className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden select-none bg-[#1C1B18]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Cinematic Wedding Hero Carousel"
    >
      {/* 1. Cinematic Background Slides with Ken Burns Crossfade */}
      <div className="absolute inset-0 z-0">
        {SLIDES.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover ${slide.focalPoint} transition-transform duration-10000 ease-out ${
                  isActive ? 'scale-105 translate-x-1' : 'scale-100 translate-x-0'
                }`}
              />
            </div>
          );
        })}

        {/* 2. Measured Contrast Scrims (darker gradient behind text, no visible card box) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#1C1B18]/90 via-[#1C1B18]/45 to-[#1C1B18]/40 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-radial from-transparent via-[#1C1B18]/30 to-[#1C1B18]/70 pointer-events-none" />
      </div>

      {/* 3. Hero Content Overlay (Consistent Across Slides, No Boxed Cards) */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white flex flex-col items-center justify-center">
        {/* Dynamic Slide Kicker & Editorial Quote */}
        <div className="mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-editorial tracking-[0.28em] uppercase text-[#D4AF37] font-semibold">
            <span>Slide {currentSlide.slideNumber}</span>
            <span className="opacity-60">·</span>
            <span>{currentSlide.theme}</span>
          </div>
          <p className="mt-2 font-editorial italic text-base sm:text-lg text-[#F3EDE2]/90 max-w-xl transition-all duration-700">
            &ldquo;{currentSlide.quote}&rdquo;
          </p>
        </div>

        {/* Master Headline */}
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl leading-[1.08] font-normal tracking-tight text-[#FAF7F0] text-balance max-w-4xl drop-shadow-sm">
          An Invitation to Celebrate Love.
        </h1>

        {/* Supporting Text */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-[#F3EDE2]/85 max-w-2xl mx-auto leading-relaxed font-sans-ui font-light">
          Beautifully designed wedding invitations, personalized for every guest and delivered with love.
        </p>

        {/* Glassmorphic Minimalist CTAs - Refined Luxury Sizing */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#FAF7F0] hover:bg-white text-[#292722] text-[11px] font-semibold tracking-[0.18em] uppercase rounded-xs transition-all duration-200 shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            <span>Create your invitation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8C6D45]" />
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-6 py-2.5 bg-white/15 hover:bg-white/25 text-[#FAF7F0] backdrop-blur-md shadow-sm text-[11px] font-semibold tracking-[0.18em] uppercase rounded-xs transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <span>Explore how it works</span>
            <span className="text-[#D4AF37]">→</span>
          </button>
        </div>

        {/* Subtle Feature Indicators */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#F3EDE2]/70 font-sans-ui max-w-xl">
          <span>Curated Suites</span>
          <span className="opacity-40">·</span>
          <span>Guest Plus-One Concierge</span>
          <span className="opacity-40">·</span>
          <span>Instant WhatsApp &amp; PDF</span>
        </div>
      </div>

      {/* 4. Glassmorphic Navigation Controls & Arrows - Smaller Compact Scale */}
      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        aria-label="Previous wedding slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-[#FAF7F0] backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-hidden"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        aria-label="Next wedding slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-[#FAF7F0] backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-hidden"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* 5. Bottom Pagination Strip with Animated Progress */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex items-center justify-center gap-6 px-4">
        {/* Play / Pause toggle */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Resume auto carousel' : 'Pause auto carousel'}
          className="text-white/60 hover:text-white transition-colors p-1"
          title={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>

        {/* Slide Progress Indicators */}
        <div className="flex items-center gap-3">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                className="group flex flex-col items-start gap-1 p-1 focus:outline-hidden"
                aria-label={`Go to slide ${idx + 1}: ${slide.theme}`}
              >
                <div className="w-12 sm:w-20 h-1 bg-white/30 rounded-full overflow-hidden relative">
                  {isActive && (
                    <div
                      className="absolute inset-y-0 left-0 bg-[#D4AF37] rounded-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                  {!isActive && (
                    <div
                      className={`h-full w-full bg-white/30 group-hover:bg-white/60 transition-colors`}
                    />
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider transition-colors hidden sm:block ${
                    isActive ? 'text-[#D4AF37] font-semibold' : 'text-white/50 group-hover:text-white/80'
                  }`}
                >
                  {slide.slideNumber} · {slide.theme}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

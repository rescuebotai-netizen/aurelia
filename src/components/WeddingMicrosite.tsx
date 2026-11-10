import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WeddingData, GuestInvitation, SongRequest } from '../types/wedding';
import { InvitationCardPreview } from './InvitationCardPreview';
import { WeddingAudioPlayer } from '../utils/weddingAudioSynthesizer';
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  ArrowLeft,
  Download,
  MessageSquare,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Music,
  ExternalLink,
  Gift,
  Crown,
  Baby,
  CarFront,
  X,
  Menu,
  Layers,
  LayoutGrid
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MotionPhotoCardStack } from './MotionPhotoCardStack';
import { ScrollSpreadCardGallery } from './ScrollSpreadCardGallery';
import { OpeningInvitationExperience } from './OpeningInvitationExperience';

interface WeddingMicrositeProps {
  wedding: WeddingData;
  onBackToApp: () => void;
  onGuestRegistered: (guest: GuestInvitation) => void;
  onSongRequested?: (song: SongRequest) => void;
}

interface ScrollPopPhotoProps {
  src: string;
  alt: string;
  aspectClass?: string;
  index: number;
  onClick?: () => void;
}

/**
 * ScrollPopPhoto Component
 * Automatically pops up one by one as the guest scrolls up and down.
 * Strictly NO text or description appears on the photos.
 */
const ScrollPopPhoto: React.FC<ScrollPopPhotoProps> = ({
  src,
  alt,
  aspectClass = 'aspect-4/5',
  index,
  onClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Triggers as guest scrolls up and down
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`group cursor-pointer relative rounded-2xl overflow-hidden bg-[#FAF7F0] transition-all duration-700 ease-out transform ${
        isVisible
          ? 'opacity-100 scale-100 translate-y-0 shadow-2xl'
          : 'opacity-0 scale-90 translate-y-12 shadow-xs'
      }`}
      style={{
        transitionDelay: `${(index % 3) * 90}ms`
      }}
    >
      <div className={`${aspectClass} w-full overflow-hidden bg-neutral-200 relative`}>
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Editorial glass highlight reflection on hover - NO TEXT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      {/* Strict requirement: NO text or description on the photos */}
    </div>
  );
};

const JOURNEY_GALLERY_PHOTOS = [
  {
    id: 'jp-1',
    src: '/src/assets/images/IMG-20261107-WA0121.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-2',
    src: '/src/assets/images/IMG-20261107-WA0131.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-3',
    src: '/src/assets/images/IMG-20261107-WA0132.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-4',
    src: '/src/assets/images/IMG-20261107-WA0136.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-5',
    src: '/src/assets/images/IMG-20261107-WA0155.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-6',
    src: '/src/assets/images/IMG-20261107-WA0165.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-7',
    src: '/src/assets/images/IMG-20261107-WA0166.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-8',
    src: '/src/assets/images/IMG-20261107-WA0178.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-9',
    src: '/src/assets/images/IMG-20261107-WA0179.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-10',
    src: '/src/assets/images/IMG-20261107-WA0180.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-11',
    src: '/src/assets/images/IMG-20261107-WA0181.jpg',
    aspect: 'aspect-4/5'
  },
  {
    id: 'jp-12',
    src: '/src/assets/images/IMG-20261108-WA0008.jpg',
    aspect: 'aspect-3/4'
  },
  {
    id: 'jp-13',
    src: '/src/assets/images/IMG-20261108-WA0009.jpg',
    aspect: 'aspect-4/5'
  }
];

const MICROSITE_SLIDES = [
  {
    id: 'slide-1',
    title: 'Two Hearts, One Story',
    quote: 'Two Hearts, One Beautiful Story.',
    image: '/src/assets/images/IMG-20261107-WA0121.jpg'
  },
  {
    id: 'slide-2',
    title: 'Eternal Devotion',
    quote: 'Every love story deserves a beautiful beginning.',
    image: '/src/assets/images/IMG-20261107-WA0131.jpg'
  },
  {
    id: 'slide-3',
    title: 'Timeless Elegance',
    quote: 'A moment worth celebrating forever.',
    image: '/src/assets/images/IMG-20261107-WA0132.jpg'
  },
  {
    id: 'slide-4',
    title: 'A Sacred Chapter',
    quote: 'What God has joined together, let no one separate.',
    image: '/src/assets/images/IMG-20261107-WA0136.jpg'
  },
  {
    id: 'slide-5',
    title: 'The Journey to Forever',
    quote: 'Make our special day unforgettable.',
    image: '/src/assets/images/IMG-20261107-WA0155.jpg'
  }
];

export const WeddingMicrosite: React.FC<WeddingMicrositeProps> = ({
  wedding,
  onBackToApp,
  onGuestRegistered,
  onSongRequested
}) => {
  // Opening Interactive Animated Sequence State (Managed by OpeningInvitationExperience)
  const [showOpeningOverlay, setShowOpeningOverlay] = useState(true);

  // High-Resolution Lightbox View State
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<string | null>(null);

  // Photos Section View Mode (Scroll-driven card spread vs swipeable stack vs grid)
  const [galleryViewMode, setGalleryViewMode] = useState<'spread' | 'stack' | 'grid'>('spread');

  // Mobile Navigation Drawer State
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Carousel State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [, setCarouselProgress] = useState(0);

  // Audio Atmosphere State (Number One - Romantic Wedding Song)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioPlayerRef = useRef<WeddingAudioPlayer | null>(null);
  const [songVolume, setSongVolume] = useState(0.7);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);

  // Countdown timer to wedding date (Sunday, 20th December 2026)
  const [timeLeft, setTimeLeft] = useState({ days: 410, hours: 14, minutes: 22, seconds: 40 });

  // Guest invitation modal / inline generator state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneDietary, setPlusOneDietary] = useState('');
  const [dietary, setDietary] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'declined'>('attending');
  const [generatedPass, setGeneratedPass] = useState<GuestInvitation | null>(null);

  // Active FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Touch handling for mobile swipe
  const touchStartX = useRef<number | null>(null);

  // 2. Initialize Number One Wedding Audio Atmosphere
  useEffect(() => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new WeddingAudioPlayer((playing) => {
        setIsPlayingAudio(playing);
      });
      audioPlayerRef.current.setVolume(songVolume);
    }

    // Attempt gentle autoplay on microsite access
    audioPlayerRef.current.play().then(() => {
      setIsPlayingAudio(true);
    }).catch(() => {
      // Browser blocked initial autoplay until guest gesture
    });

    return () => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.destroy();
      }
    };
  }, [songVolume]);

  // One-time window click listener to start music if autoplay was blocked by browser
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!hasInteractedAudio && audioPlayerRef.current && !isPlayingAudio) {
        audioPlayerRef.current.play().then(() => {
          setIsPlayingAudio(true);
          setHasInteractedAudio(true);
        }).catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [hasInteractedAudio, isPlayingAudio]);

  const handleToggleAudio = () => {
    setHasInteractedAudio(true);
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new WeddingAudioPlayer((playing) => {
        setIsPlayingAudio(playing);
      });
      audioPlayerRef.current.setVolume(songVolume);
    }
    audioPlayerRef.current.toggle();
    setIsPlayingAudio(audioPlayerRef.current.isCurrentlyPlaying());
  };

  const handleDismissOverlay = () => {
    setShowOpeningOverlay(false);
    handleToggleAudio();
  };

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % MICROSITE_SLIDES.length);
    setCarouselProgress(0);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + MICROSITE_SLIDES.length) % MICROSITE_SLIDES.length);
    setCarouselProgress(0);
  }, []);

  // 7-second auto-transition
  useEffect(() => {
    if (isCarouselPaused) return;
    const intervalTime = 100;
    const step = (intervalTime / 7000) * 100;

    const timer = setInterval(() => {
      setCarouselProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isCarouselPaused, nextSlide]);

  // Dynamic live countdown timer to wedding date
  useEffect(() => {
    const calculateTime = () => {
      const targetStr = `${wedding.rawDate || '2026-12-20'}T13:00:00`;
      const targetDate = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, targetDate - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return { days, hours, minutes, seconds };
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);
    return () => clearInterval(timer);
  }, [wedding.rawDate]);

  const handleGenerateOnMicrosite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const guestId = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const guest: GuestInvitation = {
      id: guestId,
      fullName: guestName.trim(),
      email: guestEmail.trim(),
      status: attendance,
      eventsAttending: wedding.events.map((ev) => ev.id),
      hasPlusOne,
      plusOneName: hasPlusOne ? plusOneName.trim() : undefined,
      plusOneDietary: hasPlusOne ? plusOneDietary.trim() : undefined,
      plusOneStatus: hasPlusOne ? 'pending' : undefined,
      plusOneAllowed: true,
      dietaryRequirements: dietary.trim(),
      invitationGeneratedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkedIn: false
    };

    setGeneratedPass(guest);
    onGuestRegistered(guest);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B59A72', '#D4AF37', '#FAF7F0', '#292722']
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE2] text-[#292722] selection:bg-[#B59A72]/20 font-sans relative">
      {/* 0. INTERACTIVE 3D ENVELOPE OPENING EXPERIENCE ("THE INVITATION" WITH IMG-20261107-WA0181) */}
      {showOpeningOverlay && (
        <OpeningInvitationExperience
          wedding={wedding}
          onComplete={() => setShowOpeningOverlay(false)}
          onStartAudio={() => {
            setHasInteractedAudio(true);
            if (audioPlayerRef.current && !isPlayingAudio) {
              audioPlayerRef.current.play().then(() => {
                setIsPlayingAudio(true);
              }).catch(() => {});
            }
          }}
          isAudioPlaying={isPlayingAudio}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Top Floating Microsite Administrative & Minimal Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#1C1B18]/92 text-[#FAF7F0] backdrop-blur-md text-xs py-3 px-4 sm:px-6 flex items-center justify-between shadow-md">
        {/* Left: Couple Back link & Domain */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white transition-colors min-h-[44px] py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-semibold uppercase tracking-wider text-[11px] hidden sm:inline">
              Back to Aurelia Studio
            </span>
          </button>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span className="font-mono text-[11px] text-[#D4AF37]/90 hidden md:inline">
            https://{wedding.customDomain || 'samsonandkevine.wedding'}
          </span>
        </div>

        {/* Center: Minimal Navigation Menu (Our Story, The Wedding, Schedule, Gallery, Music, RSVP) */}
        <nav className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-[0.16em] text-neutral-300 font-medium">
          <a
            href="#microsite-story"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Our Story
          </a>
          <a
            href="#microsite-photos"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Photos
          </a>
          <a
            href="#microsite-welcome"
            className="hover:text-[#D4AF37] transition-colors"
          >
            The Wedding
          </a>
          <a
            href="#microsite-itinerary"
            className="hover:text-[#D4AF37] transition-colors"
          >
            Schedule
          </a>
          <a
            href="#microsite-rsvp-section"
            className="hover:text-[#D4AF37] transition-colors text-[#D4AF37] font-semibold"
          >
            RSVP
          </a>
        </nav>

        {/* Right: Audio Player Toggle & Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`px-3 py-1.5 rounded-full text-[10px] transition-all flex items-center gap-1.5 ${
              isPlayingAudio
                ? 'bg-[#D4AF37] text-[#1C1B18] font-semibold shadow-sm'
                : 'bg-white/15 text-white/90 hover:bg-white/25 shadow-xs'
            }`}
            title="Number One — Wedding Song"
          >
            {isPlayingAudio ? (
              <>
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-[#1C1B18] animate-pulse rounded-full" />
                  <span className="w-1 h-2 bg-[#1C1B18] animate-ping rounded-full" />
                  <span className="w-1 h-3.5 bg-[#1C1B18] animate-pulse rounded-full" />
                </div>
                <span className="hidden sm:inline">Number One: Playing</span>
                <span className="sm:hidden">Playing</span>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Play Number One</span>
                <span className="sm:hidden">Play Song</span>
              </>
            )}
          </button>

          {/* Mobile Navigation Drawer Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="lg:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF7F0] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Sheet Drawer */}
      {isMobileNavOpen && (
        <div className="lg:hidden sticky top-[56px] z-49 bg-[#1C1B18]/98 backdrop-blur-xl px-6 py-5 shadow-2xl text-center space-y-3">
          <div className="flex flex-col gap-2.5 text-xs uppercase tracking-[0.2em] font-medium text-neutral-300">
            <a
              href="#microsite-story"
              onClick={() => setIsMobileNavOpen(false)}
              className="py-3 hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center justify-center"
            >
              Our Story
            </a>
            <a
              href="#microsite-photos"
              onClick={() => setIsMobileNavOpen(false)}
              className="py-3 hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center justify-center"
            >
              Photos
            </a>
            <a
              href="#microsite-welcome"
              onClick={() => setIsMobileNavOpen(false)}
              className="py-3 hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center justify-center"
            >
              The Wedding
            </a>
            <a
              href="#microsite-itinerary"
              onClick={() => setIsMobileNavOpen(false)}
              className="py-3 hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center justify-center"
            >
              Schedule
            </a>
            <a
              href="#microsite-rsvp-section"
              onClick={() => setIsMobileNavOpen(false)}
              className="py-3 text-[#D4AF37] font-semibold transition-colors min-h-[44px] flex items-center justify-center"
            >
              RSVP
            </a>
          </div>
        </div>
      )}

      {/* 1. CINEMATIC FULL-SCREEN HERO CAROUSEL */}
      <section
        className="relative w-full min-h-[94vh] flex items-center justify-center overflow-hidden bg-[#1C1B18] text-white"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.targetTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const endX = e.changedTouches[0].clientX;
          if (touchStartX.current - endX > 50) nextSlide();
          else if (endX - touchStartX.current > 50) prevSlide();
          touchStartX.current = null;
        }}
      >
        {/* Background Slides */}
        <div className="absolute inset-0 z-0">
          {MICROSITE_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover object-center transition-transform duration-10000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Measured Contrast Scrims */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#1C1B18]/92 via-[#1C1B18]/50 to-[#1C1B18]/45 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-radial from-transparent via-[#1C1B18]/30 to-[#1C1B18]/70 pointer-events-none" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center flex flex-col items-center">
          {/* Couple Monogram Crest */}
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mb-5 text-[#D4AF37] backdrop-blur-md shadow-xl">
            <span className="font-editorial text-lg italic tracking-wider">{wedding.monogram || 'S & K'}</span>
          </div>

          <p className="text-[11px] sm:text-xs font-editorial tracking-[0.35em] uppercase text-[#D4AF37] font-semibold mb-2">
            Together With Their Families
          </p>

          <p className="font-editorial italic text-base sm:text-lg text-[#F3EDE2]/90 mb-3">
            Two Hearts, One Beautiful Story
          </p>

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#D4AF37]/90 font-medium mb-3">
            Celebration of Love
          </p>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-tight tracking-tight text-[#FAF7F0] drop-shadow-md break-words max-w-3xl">
            {wedding.partner1}
            <span className="block italic text-2xl sm:text-4xl my-2 text-[#D4AF37] font-light">
              &amp;
            </span>
            {wedding.partner2}
          </h1>

          <p className="font-editorial italic text-xs sm:text-base text-[#D4AF37] mt-3 tracking-wide max-w-xl mx-auto drop-shadow-xs">
            &ldquo;Therefore what God has joined together, let no one separate.&rdquo; — Mark 10:9
          </p>

          <p className="font-editorial text-sm sm:text-lg text-[#F3EDE2]/95 mt-2 tracking-wide font-medium">
            20 · 12 · 2026 · CAPE TOWN, SOUTH AFRICA
          </p>

          {/* Live Countdown Timer */}
          <div className="mt-8 flex items-center justify-center gap-2.5 sm:gap-6 text-center flex-wrap">
            {[
              { val: timeLeft.days, label: 'Days' },
              { val: timeLeft.hours, label: 'Hours' },
              { val: timeLeft.minutes, label: 'Mins' },
              { val: timeLeft.seconds, label: 'Secs' }
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-[#1C1B18]/80 backdrop-blur-md px-3 sm:px-4 py-2.5 rounded-xl shadow-lg min-w-[58px] sm:min-w-[72px]"
              >
                <div className="font-editorial text-2xl sm:text-3xl font-normal tabular-nums text-[#FAF7F0]">
                  {unit.val}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#D4AF37]">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-md sm:max-w-none justify-center">
            <button
              onClick={() => {
                document.getElementById('microsite-rsvp-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#8C6D45] text-[#1C1B18] hover:text-white text-xs font-semibold tracking-[0.18em] uppercase rounded-full transition-all shadow-xl min-h-[44px]"
            >
              Generate Your Guest Pass &amp; RSVP
            </button>
            <button
              onClick={() => {
                document.getElementById('microsite-welcome')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-4 bg-white/15 hover:bg-white/25 text-[#FAF7F0] backdrop-blur-md text-xs font-semibold tracking-[0.16em] uppercase rounded-full transition-all shadow-md min-h-[44px]"
            >
              Explore Celebration ↓
            </button>
          </div>

          {/* Subtle Scroll to Explore Indicator */}
          <div className="mt-12 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
              Scroll to Explore
            </span>
            <ChevronDown className="w-4 h-4 text-[#D4AF37] animate-bounce" />
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md shadow-lg flex items-center justify-center transition-transform hover:scale-105"
          aria-label="Next photo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* 1.5 WELCOME MESSAGE (THE ART OF FOREVER) */}
      <section id="microsite-welcome" className="py-20 lg:py-24 bg-[#FAF7F0] text-center scroll-mt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="w-11 h-11 rounded-full bg-[#8C6D45]/15 flex items-center justify-center mx-auto mb-4 text-[#8C6D45]">
            <Heart className="w-5 h-5 fill-[#8C6D45]/20 text-[#8C6D45]" />
          </div>

          <p className="text-xs font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold mb-3">
            Welcome to Our Sacred Union
          </p>

          <h2 className="font-editorial text-3xl sm:text-4xl text-[#292722] mb-6 font-normal">
            The Art of Forever
          </h2>

          <div className="relative p-6 sm:p-10 rounded-2xl bg-[#F3EDE2]/60 shadow-md">
            <p className="font-editorial italic text-lg sm:text-xl text-[#292722] leading-relaxed max-w-2xl mx-auto">
              &ldquo;Some stories are written in the stars, others are written by two hearts that find their way to each other. We are delighted to invite you to celebrate the beginning of our forever. Your presence will make our special day even more meaningful.&rdquo;
            </p>
            <div className="mt-6 pt-4 flex flex-col items-center">
              <span className="font-editorial text-base text-[#8C6D45] font-semibold">
                {wedding.partner1} &amp; {wedding.partner2}
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500 mt-0.5">
                Cape Town, South Africa
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOVE STORY CHAPTERS & INTERACTIVE TIMELINE */}
      <section id="microsite-story" className="py-20 lg:py-28 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold mb-2">
            The Journey to Forever
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722] font-normal tracking-wide">
            BEAUTIFUL LOVE STORY
          </h2>
        </div>

        {/* Editorial Love Letter Presentation */}
        <div className="bg-[#FAF7F0] rounded-2xl p-6 sm:p-12 mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#D4AF37]/15 to-transparent pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center space-y-4 font-editorial text-base sm:text-lg text-[#292722] leading-relaxed">
            <p className="text-xl sm:text-2xl text-[#8C6D45] italic font-normal">
              Everything began unexpectedly…
            </p>
            <p className="text-[#3E3A33]">
              A meeting, a glance, a simple exchange, and since then, everything has changed.
            </p>
            <p className="text-[#3E3A33]">
              We have shared laughter, dreams, challenges, and so many other precious moments.
            </p>
            <p className="text-[#292722] font-medium pt-2">
              Today, we are writing the most beautiful chapter of our lives, and we would love to share it with you.
            </p>
            <p className="text-[#8C6D45] font-semibold pt-1">
              Your presence means so much to us on this very special day!
            </p>
            <p className="pt-3 text-[#292722] font-editorial italic text-lg sm:text-xl inline-block">
              With all our love and our most sincere gratitude.
            </p>
            <div className="pt-2">
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C6D45] font-bold block">
                {wedding.partner1} &amp; {wedding.partner2}
              </span>
            </div>
          </div>
        </div>

        {/* PHOTOS SECTION: SCROLL-DRIVEN CARD SPREAD IN MOTION */}
        <div id="microsite-photos" className="pt-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-2">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
                Editorial Collection
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#292722] mt-0.5">
                Moments in Motion
              </h3>
            </div>

            {/* Interactive View Mode Selector: Scroll Card Spread vs Swipe Deck vs Grid */}
            <div className="flex items-center gap-1 p-1 bg-[#EAE4D9]/80 rounded-full text-xs shadow-md">
              <button
                type="button"
                onClick={() => setGalleryViewMode('spread')}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                  galleryViewMode === 'spread'
                    ? 'bg-[#292722] text-[#D4AF37] shadow-sm'
                    : 'text-[#5A554E] hover:text-[#292722]'
                }`}
                title="Cards spread apart dynamically as you scroll up and down"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Card Spread</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryViewMode('stack')}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                  galleryViewMode === 'stack'
                    ? 'bg-[#292722] text-[#D4AF37] shadow-sm'
                    : 'text-[#5A554E] hover:text-[#292722]'
                }`}
                title="Swipeable single card stack"
              >
                <span>Swipe Deck</span>
              </button>
              <button
                type="button"
                onClick={() => setGalleryViewMode('grid')}
                className={`px-3 py-1.5 rounded-full transition-all duration-200 text-xs font-medium flex items-center gap-1.5 ${
                  galleryViewMode === 'grid'
                    ? 'bg-[#292722] text-[#D4AF37] shadow-sm'
                    : 'text-[#5A554E] hover:text-[#292722]'
                }`}
                title="Editorial 3-column mosaic grid"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
          </div>

          {galleryViewMode === 'spread' ? (
            <ScrollSpreadCardGallery
              photos={JOURNEY_GALLERY_PHOTOS}
              onPhotoClick={(src) => setSelectedLightboxPhoto(src)}
            />
          ) : galleryViewMode === 'stack' ? (
            <div className="py-2">
              <MotionPhotoCardStack
                photos={JOURNEY_GALLERY_PHOTOS}
                onPhotoClick={(src) => setSelectedLightboxPhoto(src)}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
              {JOURNEY_GALLERY_PHOTOS.map((photo, idx) => (
                <ScrollPopPhoto
                  key={photo.id}
                  src={photo.src}
                  alt={`Samson & Kevine — The Journey to Forever ${idx + 1}`}
                  aspectClass={photo.aspect}
                  index={idx}
                  onClick={() => setSelectedLightboxPhoto(photo.src)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. DRESS CODE & PALETTE GUIDE */}
      <section className="py-16 bg-[#EFEAE2]/60 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block mb-2">
            Wedding Attire &amp; Mood
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl text-[#292722] mb-3">
            Dress Code
          </h3>
          <p className="text-sm text-[#5A554E] max-w-xl mx-auto leading-relaxed mb-8">
            We kindly invite our esteemed guests to celebrate in attire tailored for each memorable moment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            {/* Church Ceremony */}
            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl shadow-lg text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#8C6D45]/15 text-[#8C6D45] flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C6D45] font-mono block">
                    Benediction · 13:00
                  </span>
                  <h4 className="font-editorial text-xl text-[#292722]">Church Ceremony</h4>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-xs font-editorial uppercase tracking-wider text-[#8C6D45] font-bold">
                  Attire: Vintage Wear
                </p>
                <p className="text-xs text-[#5A554E] mt-1.5 leading-relaxed">
                  Tailored retro suits, classic modest silhouettes, heritage accessories, vintage hats, and timeless mid-century elegance.
                </p>
              </div>
            </div>

            {/* Dinning Ceremony */}
            <div className="bg-[#FAF7F0] p-6 sm:p-7 rounded-2xl shadow-lg text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#292722] text-[#D4AF37] flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C6D45] font-mono block">
                    Reception · 18:00 to 21:00
                  </span>
                  <h4 className="font-editorial text-xl text-[#292722]">Dinning Ceremony</h4>
                </div>
              </div>
              <div className="pt-3">
                <p className="text-xs font-editorial uppercase tracking-wider text-[#292722] font-bold">
                  Attire: Gala Wear
                </p>
                <p className="text-xs text-[#5A554E] mt-1.5 leading-relaxed">
                  Glamorous floor-length evening gowns, bespoke tuxedos, dinner suits, sparkling couture, and high-fashion celebration wear.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap">
            {[
              { name: 'Vintage Cream', color: '#F3EDE2' },
              { name: 'Warm Gold', color: '#B59A72' },
              { name: 'Gala Midnight', color: '#1C1B18' },
              { name: 'Champagne Ochre', color: '#D4AF37' },
              { name: 'Heritage Charcoal', color: '#292722' }
            ].map((swatch) => (
              <div key={swatch.name} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: swatch.color }}
                />
                <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MULTI-EVENT SCHEDULE & ITINERARY */}
      <section id="microsite-itinerary" className="py-20 lg:py-28 max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-16">
        <div className="text-center mb-12">
          {/* Top Scripture */}
          <div className="inline-block px-5 py-2.5 rounded-full bg-[#8C6D45]/10 mb-3 shadow-sm">
            <span className="font-editorial italic text-xs sm:text-sm text-[#8C6D45] font-semibold">
              &ldquo;Therefore what God has joined together, let no one separate.&rdquo; — Mark 10:9
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722] font-normal tracking-wide">
            Wedding Agenda
          </h2>
          <p className="text-xs text-neutral-600 mt-2 font-mono uppercase tracking-widest">
            {wedding.city} · {wedding.date}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {wedding.events.map((evt, idx) => (
            <div
              key={evt.id}
              className="bg-[#FAF7F0] p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-[#8C6D45] uppercase tracking-wider">
                    {idx === 0 ? 'Ceremony 01' : 'Reception 02'}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#8C6D45]/15 text-[#8C6D45] font-semibold">
                    {evt.dressCode}
                  </span>
                </div>
                <h3 className="font-editorial text-2xl sm:text-3xl text-[#292722] mb-3">
                  {evt.title}
                </h3>
                <div className="space-y-2 text-xs text-neutral-700 mb-4 bg-white/70 p-4 rounded-xl shadow-xs">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-[#8C6D45] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#292722] block">Time: {evt.time}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#8C6D45] mt-0.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#292722] block">{evt.venue}</span>
                      <span className="text-neutral-600 block mt-0.5 text-[11px]">Address: {evt.address}</span>
                    </div>
                  </div>
                </div>
                <p className="font-editorial italic text-xs text-[#8C6D45] pt-2">
                  &ldquo;{evt.description}&rdquo;
                </p>
              </div>

              <div className="mt-5 pt-3 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 font-medium">Attire: <strong className="text-[#292722]">{evt.dressCode}</strong></span>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                    `Samson & Kevine Wedding: ${evt.title}`
                  )}&details=${encodeURIComponent(evt.description)}&location=${encodeURIComponent(`${evt.venue}, ${evt.address}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#8C6D45] hover:underline flex items-center gap-1 font-medium min-h-[44px]"
                >
                  <span>Add to Google Cal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Scripture Quote Banner */}
        <div className="text-center max-w-2xl mx-auto p-6 rounded-2xl bg-[#FAF7F0] shadow-md">
          <p className="font-editorial italic text-base sm:text-lg text-[#292722]">
            &ldquo;I will restore to you the years that the swarming locust has eaten.&rdquo;
          </p>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8C6D45] font-semibold block mt-1.5">
            — Joel 2:25
          </span>
        </div>
      </section>

      {/* 5. GUEST INVITATION PASS & RSVP SECTION */}
      <section id="microsite-rsvp-section" className="py-20 bg-[#FAF7F0] scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold mb-2">
              Personalized Guest Concierge
            </p>
            <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722]">
              Generate Your Guest Pass &amp; RSVP
            </h2>
            <p className="text-xs text-neutral-600 mt-2">
              Kindly confirm your attendance before {wedding.rsvpDeadline || '1st December 2026'}
            </p>
          </div>

          {/* 3-Column Flanked Layout: Woman on Left | Form in Center | Man on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Woman / Bride Portrait */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center text-center">
              <div className="w-full max-w-[220px] aspect-3/4 rounded-t-full overflow-hidden shadow-2xl bg-neutral-100 group relative">
                <img
                  src="/src/assets/images/IMG-20261107-WA0179.jpg"
                  alt={`The Bride - ${wedding.partner2}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
                  The Bride
                </span>
                <h3 className="font-editorial text-xl text-[#292722] mt-0.5">
                  {wedding.partner2}
                </h3>
                <span className="text-[10px] font-editorial italic text-neutral-500">
                  &ldquo;We cannot wait to celebrate together!&rdquo;
                </span>
              </div>
            </div>

            {/* Center Column: Form & Live Pass Generator */}
            <div className="lg:col-span-6 w-full">
              {/* Mobile Pair Avatars (visible on small screens) */}
              <div className="flex lg:hidden items-center justify-center gap-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                    <img
                      src="/src/assets/images/IMG-20261107-WA0179.jpg"
                      alt="Bride"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-editorial font-medium">{wedding.partner2}</span>
                </div>
                <span className="font-editorial italic text-[#8C6D45]">&amp;</span>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                    <img
                      src="/src/assets/images/IMG-20261107-WA0180.jpg"
                      alt="Groom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-editorial font-medium">{wedding.partner1}</span>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl">
                {generatedPass ? (
                  <div className="text-center space-y-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-editorial text-3xl text-[#292722]">
                        Welcome, {generatedPass.fullName}!
                      </h3>
                      <p className="text-xs text-neutral-600 mt-1">
                        Your personalized invitation pass (ID: {generatedPass.id}) has been created with admission QR code.
                      </p>
                    </div>

                    <div className="max-w-md mx-auto">
                      <InvitationCardPreview
                        wedding={wedding}
                        guestName={generatedPass.fullName}
                        guestId={generatedPass.id}
                        hasPlusOne={generatedPass.hasPlusOne}
                        plusOneName={generatedPass.plusOneName}
                        plusOneStatus={generatedPass.plusOneStatus || 'pending'}
                        plusOneDietary={generatedPass.plusOneDietary}
                        showPassSide={true}
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-[#292722] text-white text-[11px] font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm hover:bg-[#8C6D45] transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#B59A72]" />
                        Download Printable Pass
                      </button>
                      <button
                        onClick={() => {
                          const text = encodeURIComponent(
                            `Here is my wedding invitation pass for ${wedding.partner1} & ${wedding.partner2}: https://${wedding.customDomain}/pass/${generatedPass.id}`
                          );
                          window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Save to WhatsApp
                      </button>
                      <button
                        onClick={() => setGeneratedPass(null)}
                        className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-[11px] uppercase tracking-wider rounded-full shadow-xs transition-colors"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateOnMicrosite} className="space-y-5 max-w-xl mx-auto text-xs">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                        Your Full Name <span className="text-[#8C6D45]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full px-4 py-3 text-base sm:text-sm bg-[#F7F4EE] rounded-xl text-[#292722] focus:bg-white focus:ring-2 focus:ring-[#8C6D45]/40 shadow-xs border-0 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                        Email Address (For pass confirmation)
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="alex@prestige.com"
                        className="w-full px-4 py-3 text-base sm:text-sm bg-[#F7F4EE] rounded-xl text-[#292722] focus:bg-white focus:ring-2 focus:ring-[#8C6D45]/40 shadow-xs border-0 outline-none transition-all"
                      />
                    </div>

                    {/* RSVP Attendance Toggle */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setAttendance('attending')}
                        className={`py-3 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px] ${
                          attendance === 'attending'
                            ? 'bg-[#292722] text-[#D4AF37] shadow-md'
                            : 'bg-[#FAF7F0] text-[#5A554E] hover:bg-neutral-100 shadow-xs'
                        }`}
                      >
                        Joyfully Attending
                      </button>
                      <button
                        type="button"
                        onClick={() => setAttendance('declined')}
                        className={`py-3 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all min-h-[44px] ${
                          attendance === 'declined'
                            ? 'bg-[#292722] text-[#D4AF37] shadow-md'
                            : 'bg-[#FAF7F0] text-[#5A554E] hover:bg-neutral-100 shadow-xs'
                        }`}
                      >
                        Regretfully Declining
                      </button>
                    </div>

                    {/* Plus-One Management Selection */}
                    <div className="p-4 bg-[#FAF7F0] rounded-xl shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-xs text-[#292722] block">
                            Confirm Accompanying Plus-One (+1)
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            Reserve an additional seat for a spouse or partner
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHasPlusOne(!hasPlusOne)}
                          className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                            hasPlusOne ? 'bg-[#8C6D45]' : 'bg-neutral-300'
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              hasPlusOne ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      {hasPlusOne && (
                        <div className="mt-3 pt-3 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold uppercase text-neutral-700 mb-1">
                              Plus-One Full Name <span className="text-[#8C6D45]">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={plusOneName}
                              onChange={(e) => setPlusOneName(e.target.value)}
                              placeholder="e.g. Clara Vance"
                              className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-white rounded-lg shadow-xs border-0 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold uppercase text-neutral-700 mb-1">
                              Plus-One Dietary Restrictions
                            </label>
                            <input
                              type="text"
                              value={plusOneDietary}
                              onChange={(e) => setPlusOneDietary(e.target.value)}
                              placeholder="e.g. Pescatarian, strictly vegan, nut allergy"
                              className="w-full px-3.5 py-2.5 text-base sm:text-xs bg-white rounded-lg shadow-xs border-0 outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Primary Guest Dietary Requirements */}
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                        Your Dietary / Meal Restrictions
                      </label>
                      <input
                        type="text"
                        value={dietary}
                        onChange={(e) => setDietary(e.target.value)}
                        placeholder="e.g. Gluten-free, vegetarian, seafood allergy"
                        className="w-full px-4 py-3 text-base sm:text-sm bg-[#F7F4EE] rounded-xl text-[#292722] focus:bg-white focus:ring-2 focus:ring-[#8C6D45]/40 shadow-xs border-0 outline-none transition-all"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[#292722] hover:bg-[#8C6D45] text-white text-[11px] font-semibold tracking-[0.16em] uppercase rounded-full transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Check className="w-3.5 h-3.5 text-[#B59A72]" />
                        <span>Generate Personalized Pass &amp; Confirm RSVP</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Man / Groom Portrait */}
            <div className="hidden lg:flex lg:col-span-3 flex-col items-center text-center">
              <div className="w-full max-w-[220px] aspect-3/4 rounded-t-full overflow-hidden shadow-2xl bg-neutral-100 group relative">
                <img
                  src="/src/assets/images/IMG-20261107-WA0180.jpg"
                  alt={`The Groom - ${wedding.partner1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-3">
                <span className="text-[10px] font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold block">
                  The Groom
                </span>
                <h3 className="font-editorial text-xl text-[#292722] mt-0.5">
                  {wedding.partner1}
                </h3>
                <span className="text-[10px] font-editorial italic text-neutral-500">
                  &ldquo;A pleasure to welcome you to our day.&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HONEYMOON FUND & GIFT REGISTRY */}

      <section className="py-16 bg-[#EFEAE2]/60 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Gift className="w-6 h-6 text-[#8C6D45] mx-auto mb-2" />
          <h3 className="font-editorial text-3xl text-[#292722] mb-2">
            Gift Registry &amp; Honeymoon Fund
          </h3>
          <p className="text-xs text-[#5A554E] leading-relaxed mb-6">
            Your presence at our celebration is the greatest gift of all. For those who have asked, we have created a registry to help us begin this sacred chapter together.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={wedding.giftRegistryUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-full transition-all shadow-md flex items-center gap-1.5 min-h-[44px]"
            >
              <span>View Curated Registry</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 8. WEDDING FAQS ACCORDION (MATCHING EXACT WEDDING DETAILS) */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-editorial uppercase tracking-[0.25em] text-[#8C6D45] font-semibold mb-1">
            Questions &amp; Details
          </p>
          <h3 className="font-editorial text-3xl sm:text-4xl text-[#292722]">
            Guest Frequently Asked Questions
          </h3>
          <p className="text-xs text-neutral-600 mt-2">
            Everything you need to know about celebrating Samson &amp; Kevine in Cape Town on Sunday, 20th December 2026.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Is transportation provided between venues?',
              icon: CarFront,
              a: 'There will be NO transport provision provided. Guests are kindly requested to arrange their own private vehicles, carpooling, or Uber rides between the church ceremony at Lion Voice Tabernacle (Wynberg) and the evening banquet at the Rooftop in Salt River.'
            },
            {
              q: 'Can children attend the celebration?',
              icon: Baby,
              a: 'Only kids from 0 to 5 years can attend the event in the evening. For children older than 5, we kindly ask that outside childcare arrangements be made so that all guests may fully enjoy the sacred benediction and formal evening reception.'
            },
            {
              q: 'What is the schedule and where are the venues located?',
              icon: Clock,
              a: 'The Wedding Benediction takes place at 13:00 at Lion Voice Tabernacle (11 Lower Maynard Rd Wynberg Station, Tailan Building Basement Hall). The Evening Reception continues from 18:00 to 21:00 at Rooftop, 39 Salt River Road, Salt River, Cape Town, Western Cape, 7405.'
            },
            {
              q: 'What are the required dress codes?',
              icon: Crown,
              a: 'We have chosen dual dress codes to honor both parts of our day: for the Church Ceremony at Lion Voice Tabernacle, the dress code is Vintage Wear (classic mid-century, retro tailored suits, modest heritage attire). For the Evening Dinning Ceremony, the dress code is Gala Wear (formal evening suits, tuxedos, and floor-length gowns).'
            },
            {
              q: 'When is the RSVP deadline?',
              icon: Calendar,
              a: 'Kindly confirm your attendance and generate your personalized admission pass on this microsite by 1st December 2026 to ensure your reserved place at the banquet.'
            },
            {
              q: 'Can I bring a plus-one and are dietary requirements accommodated?',
              icon: Heart,
              a: 'Yes. When generating your digital pass above, you can specify your accompanying plus-one spouse or partner and note any dietary restrictions (strictly vegan, vegetarian, gluten-free, halaal, or specific allergies) for our banquet chefs.'
            },
            {
              q: 'What is the photography policy during the benediction?',
              icon: Crown,
              a: 'We will hold an unplugged ceremony during the benediction at Lion Voice Tabernacle so everyone can be spiritually present with us. Our professional editorial photographers will document the moments, and high-resolution digital galleries will be shared with all guests!'
            }
          ].map((item, idx) => {
            const IconComp = item.icon;
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="bg-[#FAF7F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-editorial text-lg sm:text-xl text-[#292722] flex items-center justify-between hover:text-[#8C6D45] transition-colors min-h-[48px]"
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4 text-[#8C6D45] shrink-0" />
                    <span>{item.q}</span>
                  </div>
                  <span className="text-base font-mono font-semibold text-[#8C6D45]">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-[#5A554E] leading-relaxed pt-2">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1C1B18] text-[#FAF7F0] text-center text-xs">
        <p className="font-editorial text-2xl text-[#FAF7F0] mb-1">
          {wedding.partner1} &amp; {wedding.partner2}
        </p>
        <p className="text-neutral-400">Sunday, 20th December 2026 · {wedding.city}</p>
        <p className="text-[11px] text-[#B59A72] mt-4 uppercase tracking-widest">
          Aurelia Certified Wedding Microsite · Cape Town 2026
        </p>
      </footer>

      {/* Editorial High-Resolution Lightbox View */}
      {selectedLightboxPhoto && (
        <div
          className="fixed inset-0 z-110 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedLightboxPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedLightboxPhoto(null)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors min-h-[44px] min-w-[44px]"
            title="Close image view"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={selectedLightboxPhoto}
            alt="Expanded couple portrait"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

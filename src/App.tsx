import React, { useState, useEffect } from 'react';
import { WeddingData, GuestInvitation, InvitationStyle, SongRequest } from './types/wedding';
import { INITIAL_WEDDING, INITIAL_GUESTS } from './data/mockWedding';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { InvitationCollections } from './components/InvitationCollections';
import { HowItWorks } from './components/HowItWorks';
import { LiveGenerator } from './components/LiveGenerator';
import { CoupleStudio } from './components/CoupleStudio';
import { CoupleDashboard } from './components/CoupleDashboard';
import { WeddingMicrosite } from './components/WeddingMicrosite';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { CoupleAuthModal } from './components/CoupleAuthModal';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { Check } from 'lucide-react';

export default function App() {
  // Persistent Wedding Data
  const [wedding, setWedding] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem('aurelia_wedding_data_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.partner1 === 'Samson Ilunga' && parsed.rawDate === '2026-12-20') {
          return parsed;
        }
      }
      localStorage.removeItem('aurelia_wedding_data');
      localStorage.removeItem('aurelia_wedding_data_v2');
      localStorage.removeItem('aurelia_wedding_data_v3');
    } catch {
      // fallback
    }
    return INITIAL_WEDDING;
  });

  // Persistent Guest Roster (Starts completely empty)
  const [guests, setGuests] = useState<GuestInvitation[]>(() => {
    try {
      localStorage.removeItem('aurelia_guests_data');
      localStorage.removeItem('aurelia_guests_data_v2');
      localStorage.removeItem('aurelia_guests_data_v3');
      const saved = localStorage.getItem('aurelia_guests_data_v4');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_GUESTS;
  });

  // Role Gate: Guests only see the Couple Microsite by default.
  // Couple signs in with their assigned admin credential (both first names, e.g. "Samson & Kevine")
  const [isCoupleAdmin, setIsCoupleAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('aurelia_couple_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Active view: 'microsite' (default for guests) | 'landing' (Brand editorial) | 'studio' (Couple only) | 'dashboard' (Couple only)
  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'dashboard' | 'microsite'>('microsite');

  // Modal states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingTargetView, setPendingTargetView] = useState<'studio' | 'dashboard' | null>(null);
  const [emailPreviewGuest, setEmailPreviewGuest] = useState<GuestInvitation | null>(null);
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_wedding_data_v4', JSON.stringify(wedding));
    } catch {
      // ignore
    }
  }, [wedding]);

  useEffect(() => {
    try {
      localStorage.setItem('aurelia_guests_data_v4', JSON.stringify(guests));
    } catch {
      // ignore
    }
  }, [guests]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('studio')) {
        handleNavigate('studio');
      } else if (hash.includes('dashboard') || hash.includes('rsvp')) {
        handleNavigate('dashboard');
      } else if (hash.includes('microsite') || hash.includes('portal') || hash.includes('wedding')) {
        setCurrentView('microsite');
      } else if (hash.includes('landing') || hash.includes('home')) {
        setCurrentView('landing');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [isCoupleAdmin]);

  // Role Protected Navigation Guard
  const handleNavigate = (view: 'landing' | 'studio' | 'dashboard' | 'microsite') => {
    if ((view === 'studio' || view === 'dashboard') && !isCoupleAdmin) {
      setPendingTargetView(view);
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthenticated = () => {
    setIsCoupleAdmin(true);
    try {
      sessionStorage.setItem('aurelia_couple_admin', 'true');
    } catch {
      // ignore
    }
    const dest = pendingTargetView || 'studio';
    setCurrentView(dest);
    setPendingTargetView(null);
    setGlobalNotification(`Welcome, ${wedding.partner1} & ${wedding.partner2}! Couple Admin access unlocked.`);
    setTimeout(() => setGlobalNotification(null), 4000);
  };

  const handleLogoutAdmin = () => {
    setIsCoupleAdmin(false);
    try {
      sessionStorage.removeItem('aurelia_couple_admin');
    } catch {
      // ignore
    }
    setCurrentView('microsite');
    setGlobalNotification('Signed out of Couple Admin. Showing guest view.');
    setTimeout(() => setGlobalNotification(null), 3000);
  };

  // Complete Microsite & Data Erasure Right (GDPR / POPIA compliant)
  const handleDeleteMicrositeAndData = () => {
    try {
      localStorage.removeItem('aurelia_wedding_data');
      localStorage.removeItem('aurelia_guests_data');
      sessionStorage.removeItem('aurelia_couple_admin');
    } catch {
      // ignore
    }
    setIsCoupleAdmin(false);
    setWedding(INITIAL_WEDDING);
    setGuests(INITIAL_GUESTS);
    setCurrentView('microsite');
    setGlobalNotification(
      'Your wedding microsite, stationery designs, guest registry, and DJ song requests have been permanently erased.'
    );
    setTimeout(() => setGlobalNotification(null), 6000);
  };

  const handleUpdateWedding = (updated: WeddingData) => {
    setWedding(updated);
  };

  const handleGuestRegistered = (newGuest: GuestInvitation) => {
    setGuests((prev) => {
      const existingIdx = prev.findIndex((g) => g.id === newGuest.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newGuest;
        return copy;
      }
      return [newGuest, ...prev];
    });
  };

  const handleSelectStyle = (styleId: InvitationStyle) => {
    setWedding((prev) => ({
      ...prev,
      invitationStyle: styleId
    }));
  };

  const handleJumpToGenerator = (styleId: InvitationStyle) => {
    handleSelectStyle(styleId);
    if (currentView !== 'landing') setCurrentView('landing');
    setTimeout(() => {
      document.getElementById('generate-invitation')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleExploreClick = () => {
    if (currentView !== 'landing') setCurrentView('landing');
    setTimeout(() => {
      document.getElementById('invitation-designs')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const partnerFirstNames = `${wedding.partner1.split(' ')[0]} & ${wedding.partner2.split(' ')[0]}`;

  return (
    <div className="min-h-screen bg-[#F3EDE2] text-[#292722] flex flex-col font-sans-ui selection:bg-[#B59A72]/20">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCreate={() => handleNavigate('studio')}
        isCoupleAdmin={isCoupleAdmin}
        onOpenCoupleLogin={() => {
          setPendingTargetView('studio');
          setShowAuthModal(true);
        }}
        onLogoutAdmin={handleLogoutAdmin}
        partnerNames={partnerFirstNames}
      />

      {/* Global Status Banner / Notification */}
      {globalNotification && (
        <div className="bg-[#1C1B18] text-[#FAF7F0] px-4 py-2 text-xs border-b border-[#D4AF37]/30 flex items-center justify-center gap-2">
          <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{globalNotification}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: DEDICATED COUPLE MICROSITE (Default for guests) */}
        {currentView === 'microsite' && (
          <WeddingMicrosite
            wedding={wedding}
            onBackToApp={() => setCurrentView('landing')}
            onGuestRegistered={handleGuestRegistered}
            onSongRequested={(song) => {
              setWedding((prev) => ({
                ...prev,
                songRequests: [song, ...(prev.songRequests || [])]
              }));
              setGlobalNotification(`Song request "${song.songTitle}" sent to couple's DJ registry!`);
              setTimeout(() => setGlobalNotification(null), 3500);
            }}
          />
        )}

        {/* VIEW 2: EDITORIAL BRAND LANDING PAGE */}
        {currentView === 'landing' && (
          <>
            <HeroSection
              onCreateClick={() => handleNavigate('studio')}
              onExploreClick={handleExploreClick}
            />

            <InvitationCollections
              currentStyle={wedding.invitationStyle}
              onSelectStyle={handleSelectStyle}
              onOpenStudio={() => handleNavigate('studio')}
              onJumpToGenerator={handleJumpToGenerator}
            />

            <HowItWorks onCreateClick={() => handleNavigate('studio')} />

            <LiveGenerator
              wedding={wedding}
              onGuestRegistered={handleGuestRegistered}
              onOpenEmailPreview={(guest) => setEmailPreviewGuest(guest)}
            />

            <FinalCTA
              onCreateClick={() => handleNavigate('studio')}
              onExploreClick={handleExploreClick}
            />
          </>
        )}

        {/* VIEW 3: COUPLE STUDIO & ATELIER (Couple Admin Only) */}
        {currentView === 'studio' && (
          <CoupleStudio
            wedding={wedding}
            onUpdateWedding={handleUpdateWedding}
            onClose={() => setCurrentView('microsite')}
            onOpenMicrosite={() => setCurrentView('microsite')}
            onOpenDashboard={() => handleNavigate('dashboard')}
            onDeleteMicrosite={handleDeleteMicrositeAndData}
          />
        )}

        {/* VIEW 4: COUPLE DASHBOARD, RSVPs & DJ PLAYLIST (Couple Admin Only) */}
        {currentView === 'dashboard' && (
          <CoupleDashboard
            wedding={wedding}
            guests={guests}
            onUpdateGuests={(updated) => setGuests(updated)}
            onUpdateWedding={handleUpdateWedding}
            onClose={() => setCurrentView('microsite')}
            onOpenStudio={() => handleNavigate('studio')}
            onDeleteMicrosite={handleDeleteMicrositeAndData}
          />
        )}
      </main>

      {/* Global Footer (shown on landing and studio/dashboard) */}
      {currentView !== 'microsite' && (
        <Footer
          onNavigate={handleNavigate}
        />
      )}

      {/* Couple Authentication Gate Modal */}
      <CoupleAuthModal
        wedding={wedding}
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
      />


      {/* Email Delivery Preview Modal */}
      {emailPreviewGuest && (
        <EmailPreviewModal
          wedding={wedding}
          guest={emailPreviewGuest}
          onClose={() => setEmailPreviewGuest(null)}
        />
      )}
    </div>
  );
}

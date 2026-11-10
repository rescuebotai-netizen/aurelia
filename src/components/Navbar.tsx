import React from 'react';
import { Lock, ShieldCheck, LogOut } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'studio' | 'dashboard' | 'microsite';
  onNavigate: (view: 'landing' | 'studio' | 'dashboard' | 'microsite') => void;
  onOpenCreate: () => void;
  isCoupleAdmin: boolean;
  onOpenCoupleLogin: () => void;
  onLogoutAdmin: () => void;
  partnerNames: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenCreate,
  isCoupleAdmin,
  onOpenCoupleLogin,
  onLogoutAdmin,
  partnerNames
}) => {
  const isHeroLanding = currentView === 'landing';

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 shadow-sm ${
        isHeroLanding
          ? 'bg-[#1C1B18]/90 backdrop-blur-md text-[#FAF7F0]'
          : 'bg-[#FAF7F0]/95 backdrop-blur-md text-[#292722]'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 h-18">
        {/* Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('microsite')}
            className={`font-editorial text-2xl sm:text-3xl tracking-[0.2em] font-medium transition-colors whitespace-nowrap shrink-0 text-left focus:outline-hidden ${
              isHeroLanding ? 'text-[#FAF7F0] hover:text-[#D4AF37]' : 'text-[#292722] hover:text-[#8C6D45]'
            }`}
          >
            AURELIA
          </button>

          {isCoupleAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-mono tracking-wider font-semibold bg-[#8C6D45]/15 text-[#8C6D45] shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#8C6D45]" />
              Couple Admin
            </span>
          )}
        </div>

        {/* Navigation Links based on role */}
        <nav
          className={`hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase ${
            isHeroLanding ? 'text-[#FAF7F0]/80' : 'text-[#292722]/80'
          }`}
        >
          {/* Guest Facing Links */}
          <button
            onClick={() => onNavigate('microsite')}
            className={`transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 ${
              currentView === 'microsite'
                ? 'text-[#8C6D45] font-bold underline'
                : isHeroLanding
                ? 'hover:text-[#D4AF37]'
                : 'hover:text-[#8C6D45]'
            }`}
          >
            Wedding Microsite
          </button>

          {/* Couple Exclusive Services */}
          {isCoupleAdmin ? (
            <>
              <button
                onClick={() => onNavigate('studio')}
                className={`transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 ${
                  currentView === 'studio'
                    ? 'text-[#8C6D45] font-bold underline'
                    : isHeroLanding
                    ? 'hover:text-[#D4AF37]'
                    : 'hover:text-[#8C6D45]'
                }`}
              >
                Couple Studio
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 ${
                  currentView === 'dashboard'
                    ? 'text-[#8C6D45] font-bold underline'
                    : isHeroLanding
                    ? 'hover:text-[#D4AF37]'
                    : 'hover:text-[#8C6D45]'
                }`}
              >
                RSVP &amp; DJ Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={onOpenCoupleLogin}
              className="text-neutral-500 hover:text-[#8C6D45] transition-colors flex items-center gap-1 opacity-70 hover:opacity-100"
              title="Restricted to the couple"
            >
              <Lock className="w-3 h-3 text-[#8C6D45]" />
              <span>Couple Services</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:underline underline-offset-8 whitespace-nowrap shrink-0 text-neutral-400 hover:text-[#292722] text-[11px]`}
          >
            Brand Editorial
          </button>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {isCoupleAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('studio')}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs bg-[#292722] hover:bg-[#8C6D45] text-white transition-colors shadow-xs"
              >
                Open Studio
              </button>
              <button
                onClick={onLogoutAdmin}
                className="p-2.5 bg-black/5 hover:bg-rose-50 text-neutral-600 hover:text-rose-700 rounded-xs transition-colors shadow-xs"
                title="Sign out of Couple Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenCoupleLogin}
              className={`px-4 sm:px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] rounded-xs transition-colors shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                isHeroLanding
                  ? 'text-[#1C1B18] bg-[#FAF7F0] hover:bg-white'
                  : 'text-white bg-[#292722] hover:bg-[#8C6D45]'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-[#B59A72]" />
              <span>Couple Admin Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Links */}
      <div
        className={`flex md:hidden overflow-x-auto px-4 py-2 gap-4 text-[11px] uppercase tracking-wider scrollbar-none shadow-xs ${
          isHeroLanding
            ? 'bg-black/30 text-[#FAF7F0]/80'
            : 'bg-[#EFEAE2]/60 text-[#292722]/80'
        }`}
      >
        <button
          onClick={() => onNavigate('microsite')}
          className={`min-h-[44px] flex items-center whitespace-nowrap shrink-0 py-2 ${
            currentView === 'microsite' ? 'font-bold text-[#8C6D45]' : ''
          }`}
        >
          Microsite
        </button>
        {isCoupleAdmin ? (
          <>
            <button
              onClick={() => onNavigate('studio')}
              className={`min-h-[44px] flex items-center whitespace-nowrap shrink-0 py-2 ${
                currentView === 'studio' ? 'font-bold text-[#8C6D45]' : ''
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`min-h-[44px] flex items-center whitespace-nowrap shrink-0 py-2 ${
                currentView === 'dashboard' ? 'font-bold text-[#8C6D45]' : ''
              }`}
            >
              Dashboard
            </button>
            <button onClick={onLogoutAdmin} className="min-h-[44px] flex items-center whitespace-nowrap shrink-0 py-2 text-rose-700 font-semibold">
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={onOpenCoupleLogin}
            className="min-h-[44px] flex items-center whitespace-nowrap shrink-0 py-2 text-[#8C6D45] font-semibold"
          >
            Couple Sign In
          </button>
        )}
      </div>
    </header>
  );
};

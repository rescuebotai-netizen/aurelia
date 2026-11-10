import React from 'react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'studio' | 'dashboard' | 'microsite') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1C1B18] text-[#FAF7F0] py-16 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <span className="font-editorial text-3xl tracking-[0.2em] font-medium text-[#FAF7F0] block">
              AURELIA
            </span>
            <p className="font-editorial italic text-base text-[#B59A72]">
              Your love. Your story. Beautifully invited.
            </p>
            <p className="text-xs text-[#FAF7F0]/60 max-w-sm leading-relaxed">
              Bespoke digital stationery suites designed to celebrate eternal unions with European editorial aesthetics, personalized guest passes, and multi-channel delivery.
            </p>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B59A72] font-semibold mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F0]/70">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors"
                >
                  Homepage &amp; Overview
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#invitation-designs" className="hover:text-white transition-colors">
                  Invitation Collections
                </a>
              </li>
              <li>
                <a href="#generate-invitation" className="hover:text-white transition-colors">
                  Live Guest Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Couples & Venues */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#B59A72] font-semibold mb-4">
              Couples &amp; Venues
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF7F0]/70">
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-white transition-colors"
                >
                  Invitation Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  RSVP &amp; Door Check-In
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('microsite')}
                  className="hover:text-white transition-colors"
                >
                  Sample Guest Portal
                </button>
              </li>
              <li>
                <span className="text-[#FAF7F0]/40">
                  Custom Domain Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF7F0]/50 gap-4">
          <p>© {new Date().getFullYear()} Aurelia Luxury Invitations. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Champagne Ivory · Soft Champagne · Midnight Charcoal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

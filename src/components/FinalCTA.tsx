import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

interface FinalCTAProps {
  onCreateClick: () => void;
  onExploreClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onCreateClick, onExploreClick }) => {
  return (
    <section className="py-20 lg:py-28 bg-[#292722] text-[#F3EDE2] relative overflow-hidden text-center">
      {/* Subtle background ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(181,154,114,0.15)_0,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="w-9 h-9 rounded-full bg-[#B59A72]/20 flex items-center justify-center mx-auto mb-5 text-[#B59A72] shadow-xs">
          <Heart className="w-4 h-4" />
        </div>

        <p className="text-xs font-editorial uppercase tracking-[0.28em] text-[#B59A72] font-semibold mb-3">
          A Beautiful Beginning
        </p>

        <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-[#FAF7F0] max-w-2xl mx-auto">
          Make Every Invitation a Beautiful Beginning.
        </h2>

        <p className="mt-4 text-sm sm:text-base text-[#FAF7F0]/70 max-w-xl mx-auto leading-relaxed">
          Craft an invitation experience as unforgettable as your vows. Personalize each card for every guest, share effortlessly via WhatsApp, and manage your entire celebration with serene elegance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onCreateClick}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#B59A72] hover:bg-[#8C6D45] text-white text-[11px] font-semibold tracking-[0.16em] uppercase rounded-xs transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Create Your Wedding Invitation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-6 py-2.5 bg-white/10 hover:bg-white/20 text-[#F3EDE2] text-[11px] font-semibold tracking-[0.16em] uppercase rounded-xs transition-colors shadow-sm"
          >
            Explore Collections
          </button>
        </div>
      </div>
    </section>
  );
};

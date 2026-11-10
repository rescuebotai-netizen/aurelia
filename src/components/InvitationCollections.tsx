import React, { useState } from 'react';
import { INVITATION_STYLES } from '../data/mockWedding';
import { InvitationStyle, InvitationStyleMeta } from '../types/wedding';
import { ArrowRight, Eye, Check } from 'lucide-react';

interface InvitationCollectionsProps {
  currentStyle: InvitationStyle;
  onSelectStyle: (styleId: InvitationStyle) => void;
  onOpenStudio: () => void;
  onJumpToGenerator: (styleId: InvitationStyle) => void;
}

export const InvitationCollections: React.FC<InvitationCollectionsProps> = ({
  currentStyle,
  onSelectStyle,
  onOpenStudio,
  onJumpToGenerator
}) => {
  const [selectedPreview, setSelectedPreview] = useState<InvitationStyleMeta | null>(null);

  return (
    <section id="invitation-designs" className="py-20 lg:py-28 bg-[#EFEAE2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-editorial tracking-[0.25em] uppercase text-[#8C6D45] font-semibold mb-2">
            Curated Stationery Suites
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722] font-normal tracking-tight">
            The Invitation Collections
          </h2>
          <p className="mt-4 text-base text-[#5A554E] max-w-xl mx-auto leading-relaxed">
            Five distinguished aesthetic suites, engineered with high-definition digital typography, tactile deckled textures, and bespoke metallic foil detailing.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INVITATION_STYLES.map((style, idx) => {
            const isSelected = currentStyle === style.id;
            return (
              <div
                key={style.id}
                className={`bg-[#FAF7F0] rounded-sm overflow-hidden transition-all duration-300 flex flex-col group ${
                  isSelected
                    ? 'ring-2 ring-[#8C6D45]/40 shadow-2xl scale-[1.01]'
                    : 'shadow-md hover:shadow-xl'
                }`}
              >
                {/* Image Showcase */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#FAF7F0]">
                  <img
                    src={style.image}
                    alt={style.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#292722]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => setSelectedPreview(style)}
                      className="w-full py-2 bg-white/90 backdrop-blur-xs text-[#292722] text-xs uppercase tracking-wider font-semibold rounded-xs hover:bg-white flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#8C6D45]" />
                      Inspect Suite Details
                    </button>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-[#292722] text-[#F3EDE2] text-[10px] tracking-wider uppercase font-semibold px-2.5 py-1 rounded-xs flex items-center gap-1 shadow-sm">
                      <Check className="w-3 h-3 text-[#B59A72]" />
                      Active Style
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#8C6D45] uppercase tracking-wider mb-1">
                      <span>0{idx + 1}. {style.fontCategory}</span>
                      <span className="capitalize">{style.recommendedFoil} Foil</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-normal text-[#292722]">
                      {style.name}
                    </h3>
                    <p className="text-xs text-[#5A554E] mt-2 line-clamp-2 leading-relaxed">
                      {style.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 pt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onSelectStyle(style.id);
                        onJumpToGenerator(style.id);
                      }}
                      className="text-xs font-semibold uppercase tracking-wider text-[#292722] hover:text-[#8C6D45] flex items-center gap-1 transition-colors min-h-[44px]"
                    >
                      <span>Try in Generator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectStyle(style.id);
                        onOpenStudio();
                      }}
                      className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider bg-[#292722]/5 hover:bg-[#292722] hover:text-white rounded-xs transition-colors min-h-[44px]"
                    >
                      Customize
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Inspecting Suite */}
        {selectedPreview && (
          <div className="fixed inset-0 z-50 bg-[#292722]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF7F0] rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative">
              <button
                onClick={() => setSelectedPreview(null)}
                className="absolute top-4 right-4 text-[#292722]/60 hover:text-[#292722] text-xl font-mono min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-sm overflow-hidden shadow-md">
                  <img
                    src={selectedPreview.image}
                    alt={selectedPreview.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover"
                  />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#8C6D45] font-semibold">
                    Stationery Suite Inspection
                  </span>
                  <h3 className="font-editorial text-3xl font-normal text-[#292722] mt-1">
                    {selectedPreview.name}
                  </h3>
                  <p className="text-xs text-[#8C6D45] mt-1 font-medium">
                    {selectedPreview.tagline}
                  </p>
                  <p className="text-sm text-[#5A554E] mt-4 leading-relaxed">
                    {selectedPreview.description}
                  </p>

                  <div className="mt-6 space-y-2 text-xs bg-black/5 rounded-xs p-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Typography Suite:</span>
                      <span className="font-semibold">{selectedPreview.fontCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Paper Tone:</span>
                      <span className="font-semibold capitalize">{selectedPreview.recommendedPaper} Heavy Card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Foil Detailing:</span>
                      <span className="font-semibold capitalize">{selectedPreview.recommendedFoil} Hot Stamping</span>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => {
                        onSelectStyle(selectedPreview.id);
                        onJumpToGenerator(selectedPreview.id);
                        setSelectedPreview(null);
                      }}
                      className="flex-1 py-3 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors min-h-[44px]"
                    >
                      Use This Template
                    </button>
                    <button
                      onClick={() => setSelectedPreview(null)}
                      className="px-4 py-3 bg-black/5 text-[#292722] text-xs font-semibold uppercase tracking-wider rounded-xs hover:bg-black/10 transition-colors min-h-[44px]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

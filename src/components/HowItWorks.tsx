import React from 'react';
import { Heart, Share2, UserCheck, ShieldCheck, Download, Smartphone } from 'lucide-react';

export const HowItWorks: React.FC<{
  onCreateClick: () => void;
}> = ({ onCreateClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Couple Creates Wedding Page',
      subtitle: 'Profiles, venues, itinerary & dress code',
      desc: 'Set your partner names, dates, bespoke message, photos, multi-event schedules (Cocktails, Church, Banquet, Brunch), and custom microsite URL.',
      icon: Heart
    },
    {
      num: '02',
      title: 'Select & Style Invitation',
      subtitle: 'Premium templates & foil accents',
      desc: 'Choose from five curated aesthetics. Customize paper tone, typography, hot-stamped foil (Gold, Rose, Silver), and custom host wording.',
      icon: Smartphone
    },
    {
      num: '03',
      title: 'Share Unique Wedding Link',
      subtitle: 'Effortless guest distribution',
      desc: 'Send your personalized wedding link to family and friends via WhatsApp, private SMS, or email invitations with one tap.',
      icon: Share2
    },
    {
      num: '04',
      title: 'Guest Generates Pass',
      subtitle: 'Name, plus-one & dietary options',
      desc: 'Guests access your wedding microsite, enter their name, select admitted event sessions, confirm plus-ones, and note dietary needs.',
      icon: UserCheck
    },
    {
      num: '05',
      title: 'Instant Multi-Channel Receipt',
      subtitle: 'WhatsApp, PDF download & Email',
      desc: 'Guests receive high-res downloadable 5x7 invitation cards, instant WhatsApp digital cards, and calendar reminders with verification QR codes.',
      icon: Download
    },
    {
      num: '06',
      title: 'Live Host Management & QR Check-In',
      subtitle: 'Real-time RSVPs & entrance scanner',
      desc: 'Monitor attending guest tallies, dietary breakdowns, and empower venue doormen to scan or verify QR guest pass IDs at the entrance.',
      icon: ShieldCheck
    }
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-editorial tracking-[0.25em] uppercase text-[#8C6D45] font-semibold mb-2">
            The Wedding Journey
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722] font-normal tracking-tight">
            How Aurelia Works
          </h2>
          <p className="mt-4 text-base text-[#5A554E] max-w-xl mx-auto leading-relaxed">
            A seamless bridge between high-end bespoke stationery and effortless digital concierge technology.
          </p>
        </div>

        {/* 3-Core Steps Highlight Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="p-6 bg-[#FAF7F0] rounded-sm shadow-md hover:shadow-lg transition-shadow text-center">
            <span className="font-editorial text-3xl text-[#8C6D45] block mb-1">01. Create</span>
            <p className="text-xs text-[#5A554E]">Design your bespoke digital invitation suite and multi-event itinerary in minutes.</p>
          </div>
          <div className="p-6 bg-[#FAF7F0] rounded-sm shadow-md hover:shadow-lg transition-shadow text-center">
            <span className="font-editorial text-3xl text-[#8C6D45] block mb-1">02. Personalize</span>
            <p className="text-xs text-[#5A554E]">Guests generate their unique pass, plus-ones, and tailored dietary preferences.</p>
          </div>
          <div className="p-6 bg-[#FAF7F0] rounded-sm shadow-md hover:shadow-lg transition-shadow text-center">
            <span className="font-editorial text-3xl text-[#8C6D45] block mb-1">03. Share</span>
            <p className="text-xs text-[#5A554E]">Distribute seamlessly across WhatsApp, high-res PDF, and track RSVPs live.</p>
          </div>
        </div>

        {/* Detailed 6-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FAF7F0]/90 p-6 sm:p-8 rounded-sm shadow-md hover:shadow-xl flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial text-2xl font-semibold text-[#8C6D45]">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#B59A72]/15 flex items-center justify-center text-[#8C6D45]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-editorial text-xl font-normal text-[#292722] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-[#8C6D45] font-medium mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[#5A554E] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 text-center">
          <button
            onClick={onCreateClick}
            className="px-8 py-3.5 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold tracking-[0.16em] uppercase rounded-xs transition-colors shadow-sm"
          >
            Start Your Invitation Suite
          </button>
        </div>
      </div>
    </section>
  );
};

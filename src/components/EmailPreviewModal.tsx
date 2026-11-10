import React from 'react';
import { WeddingData, GuestInvitation } from '../types/wedding';
import { Mail, ShieldCheck, Check, Calendar, MapPin } from 'lucide-react';

interface EmailPreviewModalProps {
  wedding: WeddingData;
  guest: GuestInvitation | null;
  onClose: () => void;
}

export const EmailPreviewModal: React.FC<EmailPreviewModalProps> = ({
  wedding,
  guest,
  onClose
}) => {
  if (!guest) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#292722]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-[#292722]">
        {/* Email Header bar */}
        <div className="bg-[#FAF7F0] p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Mail className="w-4 h-4 text-[#8C6D45]" />
            <span className="font-semibold text-[#292722]">Invitation Delivery Preview:</span>
            <span className="font-mono text-neutral-500">
              {guest.email || `${guest.fullName.toLowerCase().replace(/\s+/g, '.')}@luxurymail.com`}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-800 font-mono text-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Email metadata fields */}
        <div className="px-6 py-3 text-xs text-neutral-500 space-y-1 bg-[#FCFAF7]">
          <div>
            <strong className="text-neutral-700">From:</strong> {wedding.partner1} &amp; {wedding.partner2} via Aurelia Concierge &lt;invitations@aurelia.invites&gt;
          </div>
          <div>
            <strong className="text-neutral-700">Subject:</strong> An Invitation to Celebrate Love: {wedding.partner1} &amp; {wedding.partner2} ({wedding.date})
          </div>
        </div>

        {/* Email Body: Luxury Stationery Card */}
        <div className="p-6 sm:p-10 bg-[#F3EDE2]/40 flex justify-center">
          <div className="w-full max-w-lg bg-[#FAF7F0] p-8 rounded-xs text-center shadow-lg">
            {/* Monogram */}
            <div className="font-editorial italic text-lg text-[#8C6D45] mb-2">
              {wedding.monogram}
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 mb-4">
              {wedding.headline}
            </p>

            <h2 className="font-editorial text-3xl sm:text-4xl text-[#292722] font-normal leading-tight">
              {wedding.partner1}
              <span className="block italic text-xl my-0.5 text-[#B59A72]">&amp;</span>
              {wedding.partner2}
            </h2>

            <p className="text-xs uppercase tracking-widest text-[#8C6D45] font-semibold mt-4 mb-2">
              Request the Pleasure of Your Company
            </p>

            {/* Personalized Guest Box */}
            <div className="my-5 py-4 px-4 bg-white/80 rounded-xs shadow-xs">
              <span className="font-editorial text-2xl text-[#292722]">
                Dear {guest.fullName},
              </span>
              {guest.hasPlusOne && (
                <span className="block text-xs text-neutral-600 mt-0.5">
                  &amp; {guest.plusOneName || 'Guest'}
                </span>
              )}
            </div>

            <p className="font-editorial italic text-sm text-[#5A554E] leading-relaxed max-w-sm mx-auto mb-6">
              &ldquo;We would be delighted to have you celebrate our wedding day with us in Cape Town.&rdquo;
            </p>

            <div className="space-y-1.5 text-xs text-neutral-700 py-3 bg-black/5 rounded-xs p-3 mb-6">
              <div className="font-semibold">{wedding.date}</div>
              <div>{wedding.venue}</div>
              <div className="text-neutral-500">{wedding.city}</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={onClose}
                className="w-full py-3.5 bg-[#292722] text-white text-xs font-semibold tracking-wider uppercase rounded-xs hover:bg-[#8C6D45] transition-colors min-h-[44px] shadow-sm"
              >
                Access Digital Pass &amp; Itinerary
              </button>
              <div className="text-[11px] text-neutral-400">
                Pass ID: <span className="font-mono text-neutral-600">{guest.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F0] text-center text-xs text-neutral-500 flex justify-between items-center shadow-xs">
          <span>Sent via Aurelia Certified Delivery</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#292722] text-white rounded-xs text-xs font-semibold min-h-[44px]"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

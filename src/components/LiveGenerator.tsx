import React, { useState } from 'react';
import { WeddingData, GuestInvitation, InvitationStyle, FoilAccent, PaperTone } from '../types/wedding';
import { InvitationCardPreview } from './InvitationCardPreview';
import { Download, Mail, Check, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveGeneratorProps {
  wedding: WeddingData;
  onGuestRegistered: (guest: GuestInvitation) => void;
  onOpenEmailPreview: (guest: GuestInvitation) => void;
}

export const LiveGenerator: React.FC<LiveGeneratorProps> = ({
  wedding,
  onGuestRegistered,
  onOpenEmailPreview
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<'attending' | 'declined'>('attending');
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() => wedding.events.map((e) => e.id));
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [plusOneName, setPlusOneName] = useState('');
  const [plusOneDietary, setPlusOneDietary] = useState('');
  const [dietary, setDietary] = useState('');
  const [generatedGuestId, setGeneratedGuestId] = useState(() => `AUR-${Math.floor(1000 + Math.random() * 9000)}`);
  const [deliverySuccess, setDeliverySuccess] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick preset guests for testing
  const presets = [
    { name: 'Alex Morgan', plusOne: 'Clara Vance', p1Dietary: 'Gluten-free', dietary: 'Pescatarian' },
    { name: 'Eleanor Jane Reed', plusOne: '', p1Dietary: '', dietary: 'Strictly Vegan' },
    { name: 'Lord Henry Sinclair', plusOne: 'Lady Beatrice Sinclair', p1Dietary: 'None', dietary: 'None' }
  ];

  const handleApplyPreset = (preset: { name: string; plusOne: string; p1Dietary: string; dietary: string }) => {
    setFullName(preset.name);
    setHasPlusOne(Boolean(preset.plusOne));
    setPlusOneName(preset.plusOne);
    setPlusOneDietary(preset.p1Dietary);
    setDietary(preset.dietary);
    const newId = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedGuestId(newId);
  };

  const handleEventToggle = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const guest: GuestInvitation = {
      id: generatedGuestId,
      fullName: fullName.trim() || 'Alex Morgan',
      email: email.trim(),
      phone: phone.trim(),
      status: rsvpStatus,
      eventsAttending: selectedEvents,
      hasPlusOne,
      plusOneName: hasPlusOne ? plusOneName.trim() : undefined,
      plusOneDietary: hasPlusOne ? plusOneDietary.trim() : undefined,
      plusOneStatus: hasPlusOne ? 'pending' : undefined,
      plusOneAllowed: true,
      dietaryRequirements: dietary.trim(),
      invitationSentVia: 'whatsapp',
      invitationGeneratedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkedIn: false
    };

    onGuestRegistered(guest);

    // Fire celebratory gold confetti
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B59A72', '#D4AF37', '#FAF7F0', '#292722']
      });
    } catch {
      // ignore
    }

    setDeliverySuccess('Invitation generated and verified in guest concierge.');
    setTimeout(() => setDeliverySuccess(null), 4000);
  };

  const currentGuestObject: GuestInvitation = {
    id: generatedGuestId,
    fullName: fullName.trim() || 'Alex Morgan',
    email,
    phone,
    status: rsvpStatus,
    eventsAttending: selectedEvents,
    hasPlusOne,
    plusOneName: hasPlusOne ? plusOneName.trim() : undefined,
    dietaryRequirements: dietary,
    invitationGeneratedAt: 'Just now',
    checkedIn: false
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Dear ${fullName || 'Guest'},\n\n${wedding.partner1} & ${wedding.partner2} request the pleasure of your company at their Wedding Celebration in ${wedding.city} on ${wedding.date}.\n\nAccess your personalized invitation card and entrance pass (ID: ${generatedGuestId}):\nhttps://${wedding.customDomain || 'samsonandkevine.wedding'}/pass/${generatedGuestId}\n\nWe look forward to celebrating together!`
    );
    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = () => {
    const link = `https://${wedding.customDomain || 'aurelia.invites'}/pass/${generatedGuestId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="generate-invitation" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-editorial tracking-[0.25em] uppercase text-[#8C6D45] font-semibold mb-2">
            Section D · Live Experience
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#292722] font-normal tracking-tight">
            Generate Your Invitation
          </h2>
          <p className="mt-4 text-base text-[#5A554E] max-w-xl mx-auto leading-relaxed">
            Enter your details below to preview your personalized digital invitation suite, custom QR entrance pass, and multi-channel delivery options.
          </p>

          {/* Quick preset chips */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap text-xs text-neutral-500">
            <span>Quick Demo Profiles:</span>
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="px-2.5 py-1 rounded-sm bg-[#FAF7F0] border border-[#B59A72]/30 text-[#292722] hover:bg-[#8C6D45] hover:text-white transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Couple Portrait Vignettes: Woman on the Left, Man on the Right */}
          <div className="mt-8 flex items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-3">
              <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-t-full overflow-hidden shadow-md">
                <img
                  src="/src/assets/images/IMG-20261107-WA0179.jpg"
                  alt={`The Bride - ${wedding.partner1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-left">
                <span className="text-[9px] uppercase font-editorial tracking-[0.2em] text-[#8C6D45] font-semibold block">
                  The Bride
                </span>
                <span className="font-editorial text-base sm:text-lg text-[#292722]">{wedding.partner1}</span>
              </div>
            </div>

            <span className="font-editorial italic text-xl sm:text-2xl text-[#8C6D45]">&amp;</span>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] uppercase font-editorial tracking-[0.2em] text-[#8C6D45] font-semibold block">
                  The Groom
                </span>
                <span className="font-editorial text-base sm:text-lg text-[#292722]">{wedding.partner2}</span>
              </div>
              <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-t-full overflow-hidden shadow-md">
                <img
                  src="/src/assets/images/IMG-20261107-WA0180.jpg"
                  alt={`The Groom - ${wedding.partner2}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Form (Left) & Live Card Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT: Guest Information Form (Glassmorphic) */}
          <div className="lg:col-span-6 bg-[#FAF7F0]/90 backdrop-blur-md p-6 sm:p-8 rounded-sm border border-[#B59A72]/30 shadow-lg">
            <div className="flex items-center justify-between pb-4 border-b border-[#B59A72]/20 mb-6">
              <div>
                <span className="text-[11px] font-editorial uppercase tracking-[0.2em] text-[#8C6D45] block">
                  Guest Concierge
                </span>
                <h3 className="font-editorial text-2xl text-[#292722]">
                  Guest Information
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8C6D45] px-2 py-1 bg-[#B59A72]/10 rounded-xs">
                Pass: {generatedGuestId}
              </span>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* RSVP Attendance Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2">
                  RSVP Attendance
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('attending')}
                    className={`py-2 px-3 text-xs font-medium rounded-xs border transition-all flex items-center justify-center gap-1.5 ${
                      rsvpStatus === 'attending'
                        ? 'bg-[#292722] text-white border-[#292722]'
                        : 'bg-white text-[#292722] border-[#B59A72]/30 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59A72]" />
                    Joyfully Attends
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('declined')}
                    className={`py-2 px-3 text-xs font-medium rounded-xs border transition-all ${
                      rsvpStatus === 'declined'
                        ? 'bg-[#292722] text-white border-[#292722]'
                        : 'bg-white text-[#292722] border-[#B59A72]/30 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    Regretfully Declines
                  </button>
                </div>
              </div>

              {/* Guest Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                  Guest Full Name <span className="text-[#8C6D45]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45] focus:ring-1 focus:ring-[#8C6D45]"
                />
              </div>

              {/* Email Address & WhatsApp Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    WhatsApp Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 555 1234"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                  />
                </div>
              </div>

              {/* Applicable Events Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2">
                  Select Applicable Event Sessions
                </label>
                <div className="space-y-2">
                  {wedding.events.map((evt) => {
                    const isChecked = selectedEvents.includes(evt.id);
                    return (
                      <label
                        key={evt.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xs border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-white border-[#8C6D45]/60'
                            : 'bg-white/50 border-[#B59A72]/20 hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleEventToggle(evt.id)}
                          className="mt-0.5 rounded-xs accent-[#8C6D45]"
                        />
                        <div className="flex-1 text-xs">
                          <span className="font-semibold text-[#292722] block">
                            {evt.title}
                          </span>
                          <span className="text-neutral-500 text-[11px]">
                            {evt.date} · {evt.time} · {evt.venue}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Plus-One Option */}
              <div className="p-3 bg-white/70 rounded-xs border border-[#B59A72]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#292722] block">
                      Accompanying Person (Plus-One)
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Reserve a seat for a spouse or guest
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
                  <div className="mt-3 pt-3 border-t border-[#B59A72]/20 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#292722] mb-1">
                        Plus-One Full Name <span className="text-[#8C6D45]">*</span>
                      </label>
                      <input
                        type="text"
                        value={plusOneName}
                        onChange={(e) => setPlusOneName(e.target.value)}
                        placeholder="e.g. Clara Vance"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#292722] mb-1">
                        Plus-One Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        value={plusOneDietary}
                        onChange={(e) => setPlusOneDietary(e.target.value)}
                        placeholder="e.g. Gluten-free, vegetarian, none"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                      />
                    </div>
                    <p className="text-[10px] text-[#8C6D45] italic">
                      * Plus-one requests will be presented in the couple concierge for final seat allocation and attendance confirmation.
                    </p>
                  </div>
                )}
              </div>

              {/* Primary Guest Dietary Requirements */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                  Primary Guest Dietary / Meal Requirements
                </label>
                <input
                  type="text"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  placeholder="e.g. Pescatarian, strictly vegan, nut allergy, gluten-free"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                />
              </div>

              {/* Submit / Generate Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#292722] hover:bg-[#8C6D45] text-white text-[11px] font-semibold tracking-[0.16em] uppercase rounded-xs transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-3.5 h-3.5 text-[#B59A72]" />
                  <span>Generate &amp; Personalize Invitation</span>
                </button>
              </div>

              {deliverySuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{deliverySuccess}</span>
                </div>
              )}
            </form>

            {/* Delivery Channels Strip */}
            <div className="mt-8 pt-6 border-t border-[#B59A72]/25">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C6D45] block mb-3">
                Invitation Delivery Channels:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="p-2.5 bg-white border border-[#B59A72]/30 hover:border-[#8C6D45] rounded-xs text-xs font-medium text-[#292722] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C6D45]" />
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => onOpenEmailPreview(currentGuestObject)}
                  className="p-2.5 bg-white border border-[#B59A72]/30 hover:border-[#8C6D45] rounded-xs text-xs font-medium text-[#292722] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 text-[#8C6D45]" />
                  Email Suite
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="p-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-xs text-xs font-medium text-emerald-900 flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp
                </button>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="hover:text-[#8C6D45] transition-colors underline"
                >
                  {copiedLink ? 'Copied direct link!' : 'Copy Guest Pass URL'}
                </button>
                <span>Interactive live design concept</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Invitation Card Preview */}
          <div className="lg:col-span-6 flex flex-col items-center sticky top-24">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D45]">
                Real-Time Live Preview
              </span>
              <span className="text-xs text-neutral-500">
                Style: <span className="font-semibold capitalize text-[#292722]">{wedding.invitationStyle}</span>
              </span>
            </div>

            <InvitationCardPreview
              wedding={wedding}
              guestName={fullName}
              guestId={generatedGuestId}
              guestStatus={rsvpStatus}
              selectedEventIds={selectedEvents}
              plusOneName={plusOneName}
              hasPlusOne={hasPlusOne}
              plusOneStatus="pending"
              plusOneDietary={plusOneDietary}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

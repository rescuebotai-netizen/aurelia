import React, { useState } from 'react';
import {
  WeddingData,
  InvitationStyle,
  FoilAccent,
  PaperTone,
  CardOrientation,
  DecorativeGraphic,
  PhotoFrameStyle,
  WaxSealStyle
} from '../types/wedding';
import { QRCodeSVG } from '../utils/qrCode';
import { Calendar, MapPin, CheckCircle, ShieldCheck, Crown, Heart, Download, Loader2 } from 'lucide-react';
import { downloadCeremonyCardPDF, downloadDigitalVenuePassPDF } from '../utils/pdfGenerator';

interface InvitationCardPreviewProps {
  wedding: WeddingData;
  guestName: string;
  guestId?: string;
  guestStatus?: 'attending' | 'declined' | 'pending';
  selectedEventIds?: string[];
  plusOneName?: string;
  hasPlusOne?: boolean;
  plusOneStatus?: 'confirmed' | 'rejected' | 'pending';
  plusOneDietary?: string;
  overrideStyle?: InvitationStyle;
  overrideFoil?: FoilAccent;
  overridePaper?: PaperTone;
  overrideOrientation?: CardOrientation;
  compact?: boolean;
  showPassSide?: boolean;
}

export const InvitationCardPreview: React.FC<InvitationCardPreviewProps> = ({
  wedding,
  guestName,
  guestId = 'AUR-8012',
  guestStatus = 'attending',
  selectedEventIds = ['evt-2', 'evt-3'],
  plusOneName,
  hasPlusOne = false,
  plusOneStatus = 'confirmed',
  plusOneDietary,
  overrideStyle,
  overrideFoil,
  overridePaper,
  overrideOrientation,
  compact = false,
  showPassSide: initialShowPassSide = false
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'access'>(initialShowPassSide ? 'access' : 'card');
  const [downloadingType, setDownloadingType] = useState<'card' | 'pass' | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const PDF_STEPS = [
    'Initializing vector canvas',
    'Rendering bespoke calligraphy',
    'Generating high-density QR gate pass',
    'Packaging print-ready typography and finishing touches'
  ];

  const currentStepIndex = Math.max(
    0,
    PDF_STEPS.findIndex((s) => s.toLowerCase() === (downloadStatus || '').toLowerCase())
  );
  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / PDF_STEPS.length) * 100));

  const handleDownloadCard = async () => {
    try {
      setDownloadingType('card');
      setDownloadStatus('Initializing vector canvas');
      await downloadCeremonyCardPDF({
        wedding,
        guestName,
        guestId,
        hasPlusOne,
        plusOneName,
        onStatusUpdate: (msg) => setDownloadStatus(msg)
      });
    } catch (err) {
      console.error('Failed to download Ceremony Card:', err);
    } finally {
      setDownloadingType(null);
      setDownloadStatus('');
    }
  };

  const handleDownloadPass = async () => {
    try {
      setDownloadingType('pass');
      setDownloadStatus('Initializing vector canvas');
      await downloadDigitalVenuePassPDF({
        wedding,
        guestName,
        guestId,
        hasPlusOne,
        plusOneName,
        plusOneStatus,
        plusOneDietary,
        selectedEventIds,
        onStatusUpdate: (msg) => setDownloadStatus(msg)
      });
    } catch (err) {
      console.error('Failed to download Digital Pass:', err);
    } finally {
      setDownloadingType(null);
      setDownloadStatus('');
    }
  };

  const style = overrideStyle || wedding.invitationStyle;
  const foil = overrideFoil || wedding.foilAccent;
  const paper = overridePaper || wedding.paperTone;
  const orientation = overrideOrientation || wedding.cardOrientation || 'portrait';

  // Check custom branding colors
  const isCustomPalette = wedding.customColors?.isCustom;
  const customBg = wedding.customColors?.background;
  const customFoil = wedding.customColors?.foil;
  const customText = wedding.customColors?.text;
  const customBorder = wedding.customColors?.border;

  // Selected events
  const admittedEvents = wedding.events.filter((e) => selectedEventIds.includes(e.id));
  const displayName = guestName.trim() || 'Alex Morgan';

  // Paper Background Classes if not custom
  const getPaperClasses = () => {
    if (isCustomPalette) return 'shadow-2xl';
    switch (paper) {
      case 'midnight':
        return 'bg-[#1C1B18] text-[#F3EDE2] border-[#D4AF37]/40 shadow-2xl';
      case 'white':
        return 'bg-[#FFFFFF] text-[#292722] border-neutral-300 shadow-xl';
      case 'blush':
        return 'bg-[#FAF4EE] text-[#332E2A] border-[#C98B82]/30 shadow-xl';
      case 'stone':
        return 'bg-[#EFEAE2] text-[#292722] border-[#B59A72]/40 shadow-xl';
      case 'ivory':
      default:
        return 'bg-[#FAF7F0] text-[#292722] border-[#B59A72]/40 shadow-2xl';
    }
  };

  // Foil accent style / class
  const getFoilStyle = (): React.CSSProperties | undefined => {
    if (isCustomPalette && customFoil) {
      return {
        background: `linear-gradient(135deg, ${customFoil} 0%, #FAF7F0 45%, ${customFoil} 70%, #9A7B4F 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      };
    }
    return undefined;
  };

  const getFoilClass = () => {
    if (isCustomPalette) return '';
    switch (foil) {
      case 'rose':
        return 'rose-foil-text';
      case 'silver':
        return 'silver-foil-text';
      case 'blind':
        return paper === 'midnight' ? 'text-[#FAF7F0]/90' : 'text-[#3E3A33]';
      case 'gold':
      default:
        return 'gold-foil-text';
    }
  };

  const isDark = isCustomPalette
    ? false
    : paper === 'midnight';

  const isLandscape = orientation === 'landscape';

  // Dynamic typography font selector support
  const getFontClass = () => {
    switch (wedding.selectedFontFamily) {
      case 'playfair':
        return 'font-playfair';
      case 'cinzel':
        return 'font-cinzel tracking-wider uppercase';
      case 'bodoni':
        return 'font-bodoni';
      case 'jakarta':
        return 'font-jakarta font-semibold';
      case 'montserrat':
        return 'font-montserrat font-medium';
      case 'cormorant':
      default:
        return 'font-editorial';
    }
  };

  // Render decorative graphic
  const renderDecorativeMotif = () => {
    const motif = wedding.decorativeGraphic || 'botanical';
    if (motif === 'none') return null;

    if (motif === 'botanical') {
      return (
        <div className="flex items-center justify-center gap-2 text-[#B59A72] my-1 opacity-90">
          <svg className="w-6 h-4 rotate-180" viewBox="0 0 24 16" fill="currentColor">
            <path d="M0,8 C6,2 14,3 24,0 C18,6 14,14 0,8 Z" />
          </svg>
          <span className="text-[10px] uppercase font-serif tracking-[0.2em] font-semibold text-current">✦</span>
          <svg className="w-6 h-4" viewBox="0 0 24 16" fill="currentColor">
            <path d="M0,8 C6,2 14,3 24,0 C18,6 14,14 0,8 Z" />
          </svg>
        </div>
      );
    }

    if (motif === 'crest') {
      return (
        <div className="flex items-center justify-center gap-1.5 text-[#D4AF37] my-1">
          <Crown className="w-4 h-4" />
        </div>
      );
    }

    if (motif === 'artdeco') {
      return (
        <div className="flex items-center justify-center gap-2 text-[#B59A72] my-1">
          <div className="w-6 h-[1px] bg-current" />
          <div className="w-2 h-2 rotate-45 border border-current" />
          <div className="w-6 h-[1px] bg-current" />
        </div>
      );
    }

    return null;
  };

  // Render Wax Seal Insignia
  const renderWaxSeal = () => {
    const sealType = wedding.waxSealStyle || 'monogram';
    return (
      <div
        className={`w-9 h-9 rounded-full card-wax-shadow flex items-center justify-center border transition-transform duration-300 hover:scale-105 ${
          isDark
            ? 'bg-[#8C6D45] border-[#D4AF37]/40 text-[#1C1B18]'
            : 'bg-[#B59A72] border-[#FAF7F0]/40 text-white'
        }`}
        style={isCustomPalette ? { backgroundColor: customFoil || '#B59A72' } : {}}
      >
        {sealType === 'crest' ? (
          <Crown className="w-4 h-4 text-white" />
        ) : sealType === 'heart' ? (
          <Heart className="w-4 h-4 text-white fill-white" />
        ) : sealType === 'botanical' ? (
          <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.5 7 4 12 4 16c0 3.3 2.7 6 6 6 1.4 0 2.8-.5 3.8-1.4 1 1 2.4 1.4 3.8 1.4 3.3 0 6-2.7 6-6 0-4-2.5-9-8-14zm-1 17.9c-2.2 0-4-1.8-4-4 0-2.8 1.9-6.8 5-10.4v14.4zm2 0V5.5c3.1 3.6 5 7.6 5 10.4 0 2.2-1.8 4-4 4z" />
          </svg>
        ) : (
          <span className="font-editorial text-xs font-bold tracking-tighter">
            {wedding.partner1[0]}
            {wedding.partner2[0]}
          </span>
        )}
      </div>
    );
  };

  // Render Couple Photo on Card
  const renderCouplePhoto = () => {
    if (!wedding.showPhotoOnCard || !wedding.couplePhotoUrl) return null;
    const frame = wedding.photoFrameStyle || 'arch';

    const frameClasses = () => {
      switch (frame) {
        case 'cameo':
          return 'w-24 h-24 rounded-full border-2 border-[#B59A72]/50 shadow-md overflow-hidden mx-auto my-2';
        case 'inset':
          return 'w-32 h-24 rounded-xs border border-[#B59A72]/40 shadow-sm overflow-hidden mx-auto my-2';
        case 'arch':
        default:
          return 'w-24 h-32 rounded-t-full border border-[#B59A72]/40 shadow-md overflow-hidden mx-auto my-2';
      }
    };

    return (
      <div className={frameClasses()}>
        <img
          src={wedding.couplePhotoUrl}
          alt={`${wedding.partner1} & ${wedding.partner2}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* View Switcher Tabs (Card vs Venue Access Pass) */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-[620px] mb-3">
        <div className="flex items-center gap-1 p-1 bg-[#292722]/5 rounded-lg text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              activeTab === 'card'
                ? 'bg-white text-[#292722] shadow-xs font-semibold'
                : 'text-[#292722]/70 hover:text-[#292722]'
            }`}
          >
            Ceremony Invitation Card (Landscape)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('access')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'access'
                ? 'bg-white text-[#292722] shadow-xs font-semibold'
                : 'text-[#292722]/70 hover:text-[#292722]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#B59A72]" />
            QR Digital Venue Pass
          </button>
        </div>

        {/* Quick Download Button matching current active tab */}
        <div className="flex items-center gap-2">
          {activeTab === 'card' ? (
            <button
              type="button"
              onClick={handleDownloadCard}
              disabled={Boolean(downloadingType)}
              className="px-3 py-1.5 rounded-xs bg-[#292722] hover:bg-[#8C6D45] text-white text-[11px] font-semibold tracking-wider uppercase transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              title="Download Ceremony Card (Landscape PDF) personalized with Gemini AI"
            >
              {downloadingType === 'card' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B59A72]" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#B59A72]" />
              )}
              <span>Download Card PDF</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownloadPass}
              disabled={Boolean(downloadingType)}
              className="px-3 py-1.5 rounded-xs bg-[#292722] hover:bg-[#8C6D45] text-white text-[11px] font-semibold tracking-wider uppercase transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              title="Download QR Digital Venue Pass (PDF) with Gemini AI Concierge protocol"
            >
              {downloadingType === 'pass' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B59A72]" />
              ) : (
                <Download className="w-3.5 h-3.5 text-[#B59A72]" />
              )}
              <span>Download Pass PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time PDF Generation Status Indicator */}
      {downloadingType && (
        <div className="w-full max-w-[620px] mb-3 px-3.5 py-1.5 bg-[#FAF7F0] border border-[#B59A72]/40 rounded-xs text-xs text-[#292722] flex items-center gap-2.5 animate-pulse shadow-xs">
          <Loader2 className="w-3.5 h-3.5 text-[#8C6D45] animate-spin shrink-0" />
          <span className="font-editorial text-xs text-[#8C6D45] font-semibold">
            Archival PDF Generation:
          </span>
          <span className="text-neutral-700 text-xs font-medium truncate">{downloadStatus}</span>
        </div>
      )}

      {/* Main Printable / Display Card Container */}
      <div
        id="printable-invitation-pass"
        className={`relative transition-all duration-300 rounded-sm paper-deckle border ${getPaperClasses()} ${
          compact ? 'scale-95' : ''
        } ${
          isLandscape
            ? 'w-full max-w-[620px] p-6 sm:p-8 min-h-[440px]'
            : 'w-full max-w-[440px] p-6 sm:p-8 min-h-[620px]'
        }`}
        style={{
          ['--card-bg' as string]: customBg || '#FAF7F0',
          ['--card-foil' as string]: customFoil || '#D4AF37',
          ['--card-text' as string]: customText || '#292722',
          ['--card-border' as string]: customBorder || '#B59A72',
          ...(isCustomPalette
            ? {
                backgroundColor: 'var(--card-bg)',
                color: 'var(--card-text)',
                borderColor: 'var(--card-border)'
              }
            : {}),
          boxShadow: isDark
            ? '0 20px 40px -10px rgba(0,0,0,0.6), inset 0 0 40px rgba(212,175,55,0.05)'
            : '0 20px 40px -15px rgba(41,39,34,0.12), inset 0 0 50px rgba(181,154,114,0.08)'
        }}
      >
        {/* Decorative Inner Border */}
        <div
          className={`absolute inset-3 sm:inset-4 pointer-events-none rounded-xs border ${
            style === 'royal'
              ? 'border-[#D4AF37]/50'
              : style === 'minimalist'
              ? 'border-neutral-300'
              : 'border-[#B59A72]/30'
          }`}
          style={isCustomPalette && customBorder ? { borderColor: `${customBorder}40` } : {}}
        >
          {/* Ornate corner marks */}
          {(style === 'classic' || style === 'royal' || wedding.decorativeGraphic === 'artdeco') && (
            <>
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#B59A72]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#B59A72]" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#B59A72]" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#B59A72]" />
            </>
          )}

          {/* Arch graphic motif */}
          {(style === 'minimalist' || wedding.decorativeGraphic === 'arch') && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-20 border-t border-x border-neutral-300/60 rounded-t-full pointer-events-none" />
          )}
        </div>

        {activeTab === 'card' ? (
          /* FRONT INVITATION VIEW */
          isLandscape ? (
            /* LANDSCAPE LAYOUT */
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-h-[380px]">
              {/* Left Column: Photo / Crest */}
              <div className="md:col-span-5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-[#B59A72]/20 pb-4 md:pb-0 md:pr-4">
                {wedding.showPhotoOnCard && wedding.couplePhotoUrl ? (
                  <div className="w-full max-w-[200px] aspect-4/5 rounded-t-full border border-[#B59A72]/40 overflow-hidden shadow-md">
                    <img
                      src={wedding.couplePhotoUrl}
                      alt="Couple"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6">
                    <div className="w-16 h-16 rounded-full border border-[#B59A72]/40 flex items-center justify-center mb-2">
                      <span className="font-editorial text-2xl font-light italic text-[#8C6D45]">
                        {wedding.monogram}
                      </span>
                    </div>
                    {renderDecorativeMotif()}
                  </div>
                )}
                <div className="mt-3">{renderWaxSeal()}</div>
              </div>

              {/* Right Column: Invitation Typography & Guest Salutation */}
              <div className="md:col-span-7 flex flex-col items-center text-center justify-between py-1">
                <div>
                  <p
                    className={`text-[10px] uppercase tracking-[0.25em] font-medium ${
                      isDark ? 'text-neutral-400' : 'text-[#7A746B]'
                    }`}
                  >
                    {wedding.headline || 'Together with their families'}
                  </p>
                  <h1 className={`${getFontClass()} text-2xl sm:text-3xl lg:text-4xl leading-tight font-normal tracking-wide mt-1`}>
                    <span className={getFoilClass()} style={getFoilStyle()}>{wedding.partner1}</span>
                    <span className="italic text-lg mx-1.5 text-[#B59A72]">&amp;</span>
                    <span className={getFoilClass()} style={getFoilStyle()}>{wedding.partner2}</span>
                  </h1>
                </div>

                {/* Highlighted Guest Name */}
                <div className="my-3 w-full">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-1">
                    Request the pleasure of the company of
                  </p>
                  <div
                    className={`py-1.5 px-3 rounded-xs border-y ${
                      isDark ? 'border-[#D4AF37]/30 bg-white/5' : 'border-[#B59A72]/30 bg-[#B59A72]/5'
                    }`}
                  >
                    <h3 className="font-editorial text-lg sm:text-xl font-semibold">
                      {displayName}
                      {hasPlusOne && plusOneName && (
                        <span className="block text-xs font-sans-ui font-normal opacity-85 mt-0.5">
                          &amp; {plusOneName}
                        </span>
                      )}
                    </h3>
                  </div>
                  <p className="font-editorial italic text-xs mt-1 text-[#5A554E]">
                    &ldquo;We would be delighted to have you celebrate with us.&rdquo;
                  </p>
                </div>

                {/* Agenda & Scripture on Landscape Invitation Card */}
                <div className="pt-2 border-t border-[#B59A72]/20 w-full text-[10px] space-y-1.5">
                  <p className="font-editorial italic text-[10.5px] text-[#8C6D45] leading-snug">
                    &ldquo;Therefore what God has joined together, let no one separate.&rdquo; — Mark 10:9
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-left bg-black/5 dark:bg-white/5 p-2 rounded-xs border border-[#B59A72]/20">
                    <div>
                      <span className="font-semibold block font-editorial text-[11px] text-[#292722] dark:text-[#FAF7F0]">
                        Wedding Benediction · 13:00
                      </span>
                      <span className="block text-[9.5px] text-neutral-600 dark:text-neutral-400">Lion Voice Tabernacle</span>
                      <span className="block text-[8.5px] text-neutral-500 truncate">11 Lower Maynard Rd Wynberg</span>
                      <span className="text-[#8C6D45] text-[8.5px] font-mono uppercase block font-semibold">Vintage Wear</span>
                    </div>
                    <div>
                      <span className="font-semibold block font-editorial text-[11px] text-[#292722] dark:text-[#FAF7F0]">
                        Evening Reception · 18:00–21:00
                      </span>
                      <span className="block text-[9.5px] text-neutral-600 dark:text-neutral-400">Rooftop, 39 Salt River Rd</span>
                      <span className="block text-[8.5px] text-neutral-500 truncate">Salt River, Cape Town</span>
                      <span className="text-[#8C6D45] text-[8.5px] font-mono uppercase block font-semibold">Gala Wear</span>
                    </div>
                  </div>
                  <p className="font-editorial italic text-[9.5px] text-neutral-500">
                    &ldquo;I will restore to you the years that the swarming locust has eaten.&rdquo; — Joel 2:25
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* PORTRAIT LAYOUT */
            <div className="relative z-10 flex flex-col items-center text-center justify-between h-full min-h-[560px]">
              {/* Top Monogram / Motif */}
              <div className="pt-1 flex flex-col items-center">
                {renderDecorativeMotif()}
                <div className="font-editorial italic text-base text-[#8C6D45] mb-0.5">
                  {wedding.monogram}
                </div>
                <p
                  className={`text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium ${
                    isDark ? 'text-neutral-400' : 'text-[#7A746B]'
                  }`}
                >
                  {wedding.headline || 'Celebration of Love'}
                </p>
              </div>

              {/* Couple Photo if active */}
              {renderCouplePhoto()}

              {/* Couple Names */}
              <div className="py-2 my-auto">
                <h1 className={`${getFontClass()} text-3xl sm:text-4xl lg:text-[40px] leading-tight font-normal tracking-wide`}>
                  <span className={getFoilClass()} style={getFoilStyle()}>{wedding.partner1}</span>
                  <span className="block font-editorial italic text-2xl my-0.5 text-[#B59A72]">
                    &amp;
                  </span>
                  <span className={getFoilClass()} style={getFoilStyle()}>{wedding.partner2}</span>
                </h1>
              </div>

              {/* Request Pleasure & Guest Name Slot */}
              <div className="py-1 w-full max-w-xs">
                <p
                  className={`text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mb-1.5 ${
                    isDark ? 'text-neutral-400' : 'text-[#7A746B]'
                  }`}
                >
                  Request the pleasure of the company of
                </p>

                {/* Highlighted Guest Name */}
                <div
                  className={`py-1.5 px-4 rounded-xs border-y ${
                    isDark
                      ? 'border-[#D4AF37]/30 bg-white/5'
                      : 'border-[#B59A72]/30 bg-[#B59A72]/5'
                  }`}
                >
                  <h3 className="font-editorial text-lg sm:text-xl font-semibold tracking-wide">
                    {displayName}
                    {hasPlusOne && plusOneName && (
                      <span className="block text-xs font-sans-ui font-normal opacity-85 mt-0.5">
                        &amp; {plusOneName}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              {/* Wedding Agenda, Venues & Scriptures on Portrait Card */}
              <div className="pt-2 pb-1 border-t border-[#B59A72]/20 w-full space-y-1.5">
                <p className="font-editorial italic text-xs text-[#8C6D45]">
                  &ldquo;Therefore what God has joined together, let no one separate.&rdquo; — Mark 10:9
                </p>

                <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#292722] dark:text-[#FAF7F0]">
                  {wedding.date} · Cape Town
                </p>

                {/* Agenda events */}
                <div className="space-y-1.5 text-left bg-black/5 dark:bg-white/5 p-2 rounded-xs border border-[#B59A72]/20 text-[11px]">
                  <div className="border-b border-[#B59A72]/15 pb-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold font-editorial text-xs text-[#292722] dark:text-[#FAF7F0]">
                        Wedding Benediction · 13:00
                      </span>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#8C6D45] font-semibold">
                        Vintage Wear
                      </span>
                    </div>
                    <span className="block text-[10px] text-neutral-600 dark:text-neutral-300">
                      Lion Voice Tabernacle
                    </span>
                    <span className="block text-[9px] text-neutral-500">
                      11 Lower Maynard Rd Wynberg Station, Tailan Building
                    </span>
                  </div>

                  <div className="pt-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold font-editorial text-xs text-[#292722] dark:text-[#FAF7F0]">
                        Evening Reception · 18:00 to 21:00
                      </span>
                      <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#8C6D45] font-semibold">
                        Gala Wear
                      </span>
                    </div>
                    <span className="block text-[10px] text-neutral-600 dark:text-neutral-300">
                      Rooftop, 39 Salt River Road
                    </span>
                    <span className="block text-[9px] text-neutral-500">
                      Salt River, Cape Town, Western Cape
                    </span>
                  </div>
                </div>

                <p className="font-editorial italic text-[10px] text-neutral-500">
                  &ldquo;I will restore to you the years that the swarming locust has eaten.&rdquo; — Joel 2:25
                </p>

                {/* Wax Seal Badge */}
                <div className="mt-1 flex items-center justify-center">
                  {renderWaxSeal()}
                </div>
              </div>
            </div>
          )
        ) : (
          /* DIGITAL VENUE PASS & QR CODE VIEW */
          <div className="relative z-10 flex flex-col items-center justify-between h-full min-h-[560px]">
            <div className="w-full text-center pt-2">
              <div className="flex items-center justify-center gap-1.5 text-[#B59A72] text-[11px] uppercase tracking-[0.2em] font-medium mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Guest Pass
              </div>
              <h2 className="font-editorial text-2xl font-normal tracking-wide">
                Entrance Pass &amp; Itinerary
              </h2>
              <div className="text-[11px] font-mono tracking-widest text-[#8C6D45] uppercase mt-0.5">
                Pass ID: {guestId}
              </div>
            </div>

            {/* QR Code Container */}
            <div className="my-auto flex flex-col items-center p-4 bg-white rounded-sm border border-[#B59A72]/30 shadow-xs">
              <QRCodeSVG
                value={`AURELIA-WEDDING:${wedding.slug}:GUEST:${guestId}:${displayName}`}
                size={140}
                fgColor="#292722"
              />
              <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 mt-2">
                Scan for venue admission
              </span>
            </div>

            {/* Guest Details & Plus-One Status */}
            <div className="w-full bg-white/40 backdrop-blur-xs p-3 rounded-xs border border-[#B59A72]/20 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#B59A72]/15">
                <span className="text-neutral-500 font-sans-ui text-[11px]">Primary Guest</span>
                <span className="font-semibold text-right">{displayName}</span>
              </div>
              {hasPlusOne && (
                <div className="flex justify-between items-center py-1 border-b border-[#B59A72]/15">
                  <span className="text-neutral-500 font-sans-ui text-[11px]">Accompanying (+1)</span>
                  <div className="text-right">
                    <span className="font-semibold block">
                      {plusOneName || 'Guest Requested'}
                    </span>
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold ${
                        plusOneStatus === 'confirmed'
                          ? 'text-emerald-700'
                          : plusOneStatus === 'rejected'
                          ? 'text-rose-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {plusOneStatus === 'confirmed'
                        ? '• Confirmed Seat'
                        : plusOneStatus === 'rejected'
                        ? '• Single Only (Declined)'
                        : '• Pending Review'}
                    </span>
                  </div>
                </div>
              )}
              {hasPlusOne && plusOneDietary && (
                <div className="flex justify-between items-center py-1 border-b border-[#B59A72]/15">
                  <span className="text-neutral-500 font-sans-ui text-[11px]">+1 Dietary</span>
                  <span className="font-medium text-right text-[11px] text-neutral-700">
                    {plusOneDietary}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-[#B59A72]/15">
                <span className="text-neutral-500 font-sans-ui text-[11px]">RSVP Status</span>
                <span className="font-semibold text-emerald-700 capitalize">
                  {guestStatus}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 font-sans-ui text-[11px]">Dress Code</span>
                <span className="font-medium text-right text-[11px] truncate max-w-[180px]">
                  {wedding.dressCodeSummary}
                </span>
              </div>
            </div>

            {/* Admitted Sessions */}
            <div className="w-full text-left mt-3">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium block mb-1">
                Admitted Events ({admittedEvents.length}):
              </span>
              <div className="space-y-1">
                {admittedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-center justify-between text-[11px] py-1 px-2 rounded-xs bg-white/30 border border-[#B59A72]/15"
                  >
                    <span className="font-medium truncate max-w-[200px]">{evt.title}</span>
                    <span className="text-neutral-500 text-[10px] font-mono">{evt.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-center text-neutral-400 mt-3">
              Please present this verified entrance pass upon arrival at Lion Voice Tabernacle &amp; Rooftop 39 Salt River Road.
            </div>
          </div>
        )}
      </div>

      {/* Quick Indicator Below Card */}
      <div className="mt-3 flex items-center justify-between w-full max-w-xl px-1 text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#B59A72]" />
            {wedding.rawDate}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#B59A72]" />
            {wedding.city}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C6D45] hidden sm:inline">
          {activeTab === 'card' ? 'Ceremony Invitation' : 'QR Venue Gate Pass'}
        </span>
      </div>

      {/* High-Resolution PDF Generation Stepper (Active during download) */}
      {downloadingType && (
        <div className="mt-4 w-full max-w-xl bg-[#1C1B18] text-[#FAF7F0] p-4 rounded-xs shadow-xl transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-editorial text-xs tracking-wider text-white font-medium uppercase">
                Archival Print Rendering Engine
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#D4AF37] px-2 py-0.5 rounded-full bg-white/10 shadow-xs">
              {downloadingType === 'card' ? 'Landscape Ceremony Card' : 'QR Venue Gate Pass'}
            </span>
          </div>

          {/* Progress Bar & Status Text */}
          <div className="mt-3.5">
            <div className="flex justify-between items-center text-[11px] mb-1.5 text-neutral-300">
              <span className="font-medium text-[#FAF7F0] flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 text-[#D4AF37] animate-spin" />
                {downloadStatus || 'Initializing generation...'}
              </span>
              <span className="font-mono text-[#D4AF37] font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B59A72] via-[#D4AF37] to-[#FAF7F0] transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 4-Step Live Stepper Indicator */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {PDF_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div
                  key={step}
                  className={`flex items-center gap-2.5 p-2 rounded-xs transition-colors ${
                    isCurrent
                      ? 'bg-[#D4AF37]/25 text-white font-medium shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-950/40 text-emerald-300'
                      : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-neutral-700 flex items-center justify-center text-[9px] font-mono text-neutral-300">
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Separate PDF Download Buttons */}
      <div className="mt-4 w-full max-w-xl">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C6D45]">
            Separate PDF Downloads
          </span>
          <span className="text-[9px] text-neutral-500 font-sans uppercase tracking-wider">
            300 DPI Archival Resolution
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Button 1: Ceremony Card (Landscape PDF) */}
          <button
            type="button"
            onClick={handleDownloadCard}
            disabled={downloadingType !== null}
            className="group relative flex flex-col items-start p-3 text-left bg-[#FAF7F0] hover:bg-[#F3EDE2] rounded-xs shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-editorial text-sm font-semibold text-[#292722] group-hover:text-[#8C6D45] transition-colors">
                Ceremony Card (Landscape PDF)
              </span>
              <div className="p-1.5 rounded-xs bg-[#292722] text-[#D4AF37] group-hover:scale-105 transition-transform shadow-xs">
                <Download className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] text-neutral-600 font-sans leading-relaxed">
              Landscape A5 keepsake card with bespoke ceremonial AI blessing and gold foil framing.
            </span>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#8C6D45]">
              <span className="font-semibold">Landscape PDF</span>
              <span>·</span>
              <span>Print-Ready A5</span>
            </div>
          </button>

          {/* Button 2: Digital Venue Pass (QR Pass PDF) */}
          <button
            type="button"
            onClick={handleDownloadPass}
            disabled={downloadingType !== null}
            className="group relative flex flex-col items-start p-4 text-left bg-white hover:bg-neutral-50 rounded-xs shadow-md hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-editorial text-sm font-semibold text-[#292722] group-hover:text-[#8C6D45] transition-colors">
                Digital Venue Pass (QR PDF)
              </span>
              <div className="p-1.5 rounded-xs bg-[#8C6D45] text-white group-hover:scale-105 transition-transform shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <span className="text-[11px] text-neutral-600 font-sans leading-relaxed">
              Portrait admission pass with scannable high-density QR code and estate gate protocol.
            </span>
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#292722]">
              <span className="font-semibold">Portrait PDF</span>
              <span>·</span>
              <span>QR Security Pass</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

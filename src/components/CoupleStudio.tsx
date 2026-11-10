import React, { useState } from 'react';
import {
  WeddingData,
  InvitationStyle,
  FoilAccent,
  PaperTone,
  EventDetail,
  CardOrientation,
  PhotoFrameStyle,
  DecorativeGraphic,
  WaxSealStyle
} from '../types/wedding';
import { INVITATION_STYLES } from '../data/mockWedding';
import { InvitationCardPreview } from './InvitationCardPreview';
import {
  Check,
  ArrowLeft,
  Globe,
  Upload,
  Image,
  Palette,
  RotateCcw,
  Plus,
  Trash2,
  Crown,
  Heart,
  Layout
} from 'lucide-react';

interface CoupleStudioProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: WeddingData) => void;
  onClose: () => void;
  onOpenMicrosite: () => void;
  onOpenDashboard: () => void;
  onDeleteMicrosite?: () => void;
}

export const FONT_OPTIONS = [
  { id: 'cormorant', name: 'Cormorant Garamond', label: 'Editorial Serif', fontClass: 'font-cormorant' },
  { id: 'bodoni', name: 'Bodoni Moda', label: 'High-Fashion Italian Serif', fontClass: 'font-bodoni' },
  { id: 'playfair', name: 'Playfair Display', label: 'Romantic Classic Serif', fontClass: 'font-playfair' },
  { id: 'cinzel', name: 'Cinzel', label: 'Classical Roman Inscriptional', fontClass: 'font-cinzel' },
  { id: 'montserrat', name: 'Montserrat', label: 'Crisp Architectural Sans', fontClass: 'font-montserrat' },
  { id: 'jakarta', name: 'Plus Jakarta Sans', label: 'Modern Minimalist Sans', fontClass: 'font-jakarta' }
];

export const CoupleStudio: React.FC<CoupleStudioProps> = ({
  wedding,
  onUpdateWedding,
  onClose,
  onOpenMicrosite,
  onOpenDashboard,
  onDeleteMicrosite
}) => {
  const [formData, setFormData] = useState<WeddingData>({ ...wedding });
  const [activeTab, setActiveTab] = useState<'design' | 'artwork' | 'branding' | 'details' | 'schedule' | 'privacy'>('design');
  const [saveToast, setSaveToast] = useState(false);
  const [isAiWordingLoading, setIsAiWordingLoading] = useState(false);
  const [aiWordingToast, setAiWordingToast] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Pre-loaded photography options for couple
  const couplePhotoPresets = [
    { label: 'Golden Hour Celebration', url: '/src/assets/images/IMG-20261107-WA0121.jpg' },
    { label: 'Eternal Romance', url: '/src/assets/images/IMG-20261107-WA0131.jpg' },
    { label: 'Timeless Union', url: '/src/assets/images/IMG-20261107-WA0132.jpg' },
    { label: 'Sacred Benediction', url: '/src/assets/images/IMG-20261107-WA0136.jpg' }
  ];

  const handleStyleChange = (styleId: InvitationStyle) => {
    const meta = INVITATION_STYLES.find((s) => s.id === styleId);
    setFormData((prev) => ({
      ...prev,
      invitationStyle: styleId,
      foilAccent: meta ? meta.recommendedFoil : prev.foilAccent,
      paperTone: meta ? meta.recommendedPaper : prev.paperTone
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({
            ...prev,
            couplePhotoUrl: reader.result as string,
            showPhotoOnCard: true
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUpdateWedding(formData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddEvent = () => {
    const newEvent: EventDetail = {
      id: `evt-${Date.now()}`,
      title: 'New Wedding Session',
      date: formData.date,
      time: '19:00',
      venue: formData.venue,
      address: formData.city,
      dressCode: 'Formal Elegance',
      description: 'Join us for this special moment.'
    };
    setFormData((prev) => ({
      ...prev,
      events: [...prev.events, newEvent]
    }));
  };

  const handleRemoveEvent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id)
    }));
  };

  const handleUpdateEvent = (id: string, field: keyof EventDetail, value: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    }));
  };

  // Color preset applicator
  const applyPalettePreset = (name: string, bg: string, foil: string, text: string, border: string) => {
    setFormData((prev) => ({
      ...prev,
      customColors: {
        background: bg,
        foil: foil,
        text: text,
        border: border,
        isCustom: true
      }
    }));
  };

  const handleGenerateAiWording = async (tone: string) => {
    setIsAiWordingLoading(true);
    try {
      const res = await fetch('/api/ai/wording', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invitation',
          tone,
          partner1: formData.partner1,
          partner2: formData.partner2,
          keywords: `${formData.venue}, ${formData.city}, ${formData.date}`
        })
      });
      const data = await res.json();
      if (data.text) {
        setFormData((prev) => ({
          ...prev,
          storyMessage: data.text,
          headline: `An Invitation to Celebrate Love`
        }));
        setAiWordingToast(true);
        setTimeout(() => setAiWordingToast(false), 3500);
      }
    } catch {
      // ignore
    } finally {
      setIsAiWordingLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm permanent erasure.');
      return;
    }
    setDeleteError(null);
    setShowDeleteModal(false);
    if (onDeleteMicrosite) {
      onDeleteMicrosite();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3EDE2] text-[#292722] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Studio Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#B59A72]/20 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FAF7F0] rounded-xs border border-[#B59A72]/30 text-[#292722] transition-colors"
              title="Return to Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-editorial uppercase tracking-[0.2em] text-[#8C6D45] block">
                Couple Studio &amp; Atelier
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal">
                {formData.partner1} &amp; {formData.partner2}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenMicrosite}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] transition-colors flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#8C6D45]" />
              View Guest Microsite
            </button>
            <button
              onClick={onOpenDashboard}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] transition-colors flex items-center gap-1.5"
            >
              Manage Guest RSVPs
            </button>
            <button
              onClick={() => handleSave()}
              className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#292722] hover:bg-[#8C6D45] rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>

        {saveToast && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All invitation styling and wedding settings updated successfully!</span>
          </div>
        )}

        {/* 2-Column Split: Customization Atelier (Left) & Real-time Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Atelier Controls */}
          <div className="lg:col-span-7 bg-[#FAF7F0] p-6 sm:p-8 rounded-sm border border-[#B59A72]/30 shadow-md">
            {/* Extended Navigation Tabs */}
            <div className="flex border-b border-[#B59A72]/20 mb-6 gap-3 sm:gap-5 text-xs uppercase tracking-wider font-semibold overflow-x-auto">
              <button
                onClick={() => setActiveTab('design')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'design'
                    ? 'border-[#8C6D45] text-[#8C6D45]'
                    : 'border-transparent text-neutral-500 hover:text-[#292722]'
                }`}
              >
                1. Layout &amp; Style
              </button>
              <button
                onClick={() => setActiveTab('artwork')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'artwork'
                    ? 'border-[#8C6D45] text-[#8C6D45]'
                    : 'border-transparent text-neutral-500 hover:text-[#292722]'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                2. Couple Photo &amp; Graphics
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'branding'
                    ? 'border-[#8C6D45] text-[#8C6D45]'
                    : 'border-transparent text-neutral-500 hover:text-[#292722]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                3. Custom Branding Colors
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'border-[#8C6D45] text-[#8C6D45]'
                    : 'border-transparent text-neutral-500 hover:text-[#292722]'
                }`}
              >
                4. Wedding Profile
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'schedule'
                    ? 'border-[#8C6D45] text-[#8C6D45]'
                    : 'border-transparent text-neutral-500 hover:text-[#292722]'
                }`}
              >
                5. Sessions ({formData.events.length})
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`pb-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'privacy'
                    ? 'border-rose-700 text-rose-700'
                    : 'border-transparent text-neutral-500 hover:text-rose-700'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                6. Privacy &amp; Deletion
              </button>
            </div>

            {/* TAB 1: LAYOUT & ORIENTATION & STYLE */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                {/* 1. Orientation Switcher */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2 flex items-center gap-1.5">
                    <Layout className="w-3.5 h-3.5 text-[#8C6D45]" />
                    Invitation Card Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cardOrientation: 'portrait' })}
                      className={`p-3.5 rounded-xs border text-center transition-all flex flex-col items-center gap-2 ${
                        formData.cardOrientation === 'portrait'
                          ? 'bg-[#292722] text-white border-[#292722] shadow-sm'
                          : 'bg-white border-[#B59A72]/30 text-[#292722] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="w-7 h-10 border-2 border-current rounded-xs" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Portrait (5x7&quot; Vertical)
                      </span>
                      <span className="text-[10px] opacity-70">Traditional Luxury Editorial</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cardOrientation: 'landscape' })}
                      className={`p-3.5 rounded-xs border text-center transition-all flex flex-col items-center gap-2 ${
                        formData.cardOrientation === 'landscape'
                          ? 'bg-[#292722] text-white border-[#292722] shadow-sm'
                          : 'bg-white border-[#B59A72]/30 text-[#292722] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="w-10 h-7 border-2 border-current rounded-xs" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Landscape (7x5&quot; Horizontal)
                      </span>
                      <span className="text-[10px] opacity-70">Modern Panoramic Split</span>
                    </button>
                  </div>
                </div>

                {/* 2. Template Styles */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-3">
                    Curated Template Style
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INVITATION_STYLES.map((style) => {
                      const isSel = formData.invitationStyle === style.id;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => handleStyleChange(style.id)}
                          className={`p-3 rounded-xs border text-left transition-all flex items-start gap-3 ${
                            isSel
                              ? 'bg-white border-[#8C6D45] ring-2 ring-[#8C6D45]/20 shadow-xs'
                              : 'bg-white/60 border-[#B59A72]/20 hover:bg-white'
                          }`}
                        >
                          <img
                            src={style.image}
                            alt={style.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-xs border border-neutral-200 shrink-0"
                          />
                          <div>
                            <span className="font-editorial text-base font-medium text-[#292722] block">
                              {style.name}
                            </span>
                            <span className="text-[10px] text-neutral-500 line-clamp-1">
                              {style.tagline}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Typography Font Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2 flex items-center justify-between">
                    <span>Invitation Typography Font Family</span>
                    <span className="text-[10px] text-[#8C6D45] font-mono lowercase">live real-time update</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {FONT_OPTIONS.map((f) => {
                      const isSel = (formData.selectedFontFamily || 'cormorant') === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, selectedFontFamily: f.id as any })}
                          className={`p-2.5 rounded-xs border text-left transition-all ${
                            isSel
                              ? 'bg-white border-[#8C6D45] ring-2 ring-[#8C6D45]/30 shadow-xs'
                              : 'bg-white/70 border-[#B59A72]/20 hover:bg-white'
                          }`}
                        >
                          <span className={`${f.fontClass} text-lg text-[#292722] block leading-tight truncate`}>
                            {wedding.partner1} &amp; {wedding.partner2}
                          </span>
                          <span className="text-[10px] text-[#8C6D45] font-semibold block mt-0.5">
                            {f.name}
                          </span>
                          <span className="text-[9px] text-neutral-400 block truncate">
                            {f.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Headline & Wording */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    Invitation Headline
                  </label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: COUPLE PHOTO & GRAPHICS */}
            {activeTab === 'artwork' && (
              <div className="space-y-6">
                {/* Photo On Card Toggle */}
                <div className="p-4 bg-white rounded-xs border border-[#B59A72]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#292722] block">
                      Feature Couple Portrait on Invitation Card
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Embeds an artistic portrait of the couple onto the invitation
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, showPhotoOnCard: !formData.showPhotoOnCard })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.showPhotoOnCard ? 'bg-[#8C6D45]' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.showPhotoOnCard ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Upload or Select Couple Photo */}
                <div className="space-y-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722]">
                    Couple Photo Selection / Upload
                  </label>

                  {/* Upload button */}
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-white border border-[#B59A72]/40 hover:border-[#8C6D45] rounded-xs cursor-pointer text-xs font-medium flex items-center gap-2 text-[#292722] transition-colors">
                      <Upload className="w-4 h-4 text-[#8C6D45]" />
                      <span>Upload Custom Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-neutral-500">PNG, JPG up to 10MB</span>
                  </div>

                  {/* Preset Photos */}
                  <div className="pt-2">
                    <span className="text-[11px] text-neutral-500 block mb-2">Or select from curated shoot portraits:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {couplePhotoPresets.map((preset) => {
                        const isChosen = formData.couplePhotoUrl === preset.url;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                couplePhotoUrl: preset.url,
                                showPhotoOnCard: true
                              })
                            }
                            className={`p-1 rounded-xs border text-left transition-all ${
                              isChosen
                                ? 'ring-2 ring-[#8C6D45] border-[#8C6D45]'
                                : 'border-neutral-200 hover:border-[#8C6D45]'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-16 object-cover rounded-xs"
                            />
                            <span className="text-[9px] font-medium text-neutral-700 block truncate mt-1">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Photo Frame Style */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2">
                    Portrait Frame Style
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'arch', label: 'Arched Top Frame' },
                      { id: 'cameo', label: 'Cameo Medallion' },
                      { id: 'inset', label: 'Gallery Inset' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoFrameStyle: f.id as PhotoFrameStyle })}
                        className={`p-2.5 text-xs rounded-xs border text-center transition-all ${
                          formData.photoFrameStyle === f.id
                            ? 'bg-[#292722] text-white border-[#292722]'
                            : 'bg-white border-[#B59A72]/30 text-[#292722] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Decorative Graphics & Motifs */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2">
                    Decorative Stationery Graphics
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'botanical', label: 'Olive Laurel', icon: '✦' },
                      { id: 'crest', label: 'Heraldic Crown', icon: '♔' },
                      { id: 'artdeco', label: 'Art Deco Lines', icon: '◇' },
                      { id: 'none', label: 'Pure Minimalist', icon: '—' }
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, decorativeGraphic: g.id as DecorativeGraphic })}
                        className={`p-2.5 rounded-xs border text-center transition-all ${
                          formData.decorativeGraphic === g.id
                            ? 'bg-[#292722] text-white border-[#292722]'
                            : 'bg-white border-[#B59A72]/30 text-[#292722] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        <span className="text-base block mb-0.5">{g.icon}</span>
                        <span className="text-[11px] block">{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wax Seal Insignia Motif */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-2">
                    Wax Seal Insignia
                  </label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      { id: 'monogram', label: 'Couple Initials' },
                      { id: 'crest', label: 'Royal Crown' },
                      { id: 'heart', label: 'Eternal Heart' },
                      { id: 'botanical', label: 'Laurel Sprig' }
                    ].map((ws) => (
                      <button
                        key={ws.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, waxSealStyle: ws.id as WaxSealStyle })}
                        className={`p-2 text-[11px] rounded-xs border text-center transition-all ${
                          formData.waxSealStyle === ws.id
                            ? 'bg-[#292722] text-white border-[#292722]'
                            : 'bg-white border-[#B59A72]/30 text-[#292722] hover:bg-[#FAF7F0]'
                        }`}
                      >
                        {ws.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CUSTOM BRANDING COLORS */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                {/* Custom Branding Toggle */}
                <div className="p-4 bg-white rounded-xs border border-[#B59A72]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#292722] block">
                      Enable Bespoke Color Palette
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Override default paper tones with your wedding theme colors
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        customColors: {
                          ...formData.customColors,
                          isCustom: !formData.customColors?.isCustom
                        }
                      })
                    }
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      formData.customColors?.isCustom ? 'bg-[#8C6D45]' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        formData.customColors?.isCustom ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 1-Tap Luxury Color Schemes */}
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#292722] block mb-2">
                    Curated Luxury Color Harmonizers
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        name: 'Champagne & Gold',
                        bg: '#FAF7F0',
                        foil: '#D4AF37',
                        text: '#292722',
                        border: '#B59A72'
                      },
                      {
                        name: 'Midnight & Gold',
                        bg: '#1C1B18',
                        foil: '#D4AF37',
                        text: '#F3EDE2',
                        border: '#D4AF37'
                      },
                      {
                        name: 'Tuscan Terracotta',
                        bg: '#F5ECE3',
                        foil: '#C57A58',
                        text: '#3D2F28',
                        border: '#C57A58'
                      },
                      {
                        name: 'Rose Quartz & Blush',
                        bg: '#FAF3F0',
                        foil: '#E0A899',
                        text: '#3A2E2C',
                        border: '#E0A899'
                      },
                      {
                        name: 'Sage Botanical',
                        bg: '#F2F5F1',
                        foil: '#7A8B78',
                        text: '#222B22',
                        border: '#7A8B78'
                      },
                      {
                        name: 'Pure Alabaster & Silver',
                        bg: '#FFFFFF',
                        foil: '#8B939E',
                        text: '#1E232A',
                        border: '#C5CBD3'
                      }
                    ].map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() =>
                          applyPalettePreset(pal.name, pal.bg, pal.foil, pal.text, pal.border)
                        }
                        className="p-2.5 rounded-xs border border-neutral-300 hover:border-[#8C6D45] text-left transition-colors bg-white flex items-center gap-2.5"
                      >
                        <div className="flex gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: pal.bg }}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: pal.foil }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-[#292722] truncate">
                          {pal.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Individual Hex Pickers */}
                <div className="p-4 bg-white rounded-xs border border-[#B59A72]/20 space-y-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C6D45] block">
                    Fine-Tune Hex Color Values
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Background Color */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Stationery Card Background
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.customColors?.background || '#FAF7F0'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                background: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border border-neutral-300"
                        />
                        <input
                          type="text"
                          value={formData.customColors?.background || '#FAF7F0'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                background: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase border border-neutral-300 rounded-xs"
                        />
                      </div>
                    </div>

                    {/* Foil Accent Color */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Metallic Foil / Accent
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.customColors?.foil || '#D4AF37'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                foil: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border border-neutral-300"
                        />
                        <input
                          type="text"
                          value={formData.customColors?.foil || '#D4AF37'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                foil: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase border border-neutral-300 rounded-xs"
                        />
                      </div>
                    </div>

                    {/* Text Color */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Typography Text Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.customColors?.text || '#292722'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                text: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border border-neutral-300"
                        />
                        <input
                          type="text"
                          value={formData.customColors?.text || '#292722'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                text: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase border border-neutral-300 rounded-xs"
                        />
                      </div>
                    </div>

                    {/* Border Line Color */}
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                        Border Hairline Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={formData.customColors?.border || '#B59A72'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                border: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="w-8 h-8 rounded-xs cursor-pointer border border-neutral-300"
                        />
                        <input
                          type="text"
                          value={formData.customColors?.border || '#B59A72'}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              customColors: {
                                ...formData.customColors,
                                border: e.target.value,
                                isCustom: true
                              }
                            })
                          }
                          className="flex-1 px-2.5 py-1.5 text-xs font-mono uppercase border border-neutral-300 rounded-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: WEDDING PROFILE */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                      Partner 1 Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.partner1}
                      onChange={(e) => setFormData({ ...formData, partner1: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                      Partner 2 Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.partner2}
                      onChange={(e) => setFormData({ ...formData, partner2: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                      Wedding Date (Display Text)
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                      Monogram (Initials)
                    </label>
                    <input
                      type="text"
                      value={formData.monogram}
                      onChange={(e) => setFormData({ ...formData, monogram: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    Main Venue Name
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    City &amp; Country
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722] mb-1.5">
                    Dress Code Guidance
                  </label>
                  <input
                    type="text"
                    value={formData.dressCodeSummary}
                    onChange={(e) => setFormData({ ...formData, dressCodeSummary: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#292722]">
                      Couple Love Story / Welcome Message
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-neutral-500 font-medium">AI Assist:</span>
                      <button
                        type="button"
                        onClick={() => handleGenerateAiWording('poetic')}
                        disabled={isAiWordingLoading}
                        className="px-2 py-0.5 bg-[#FAF7F0] border border-[#B59A72]/40 hover:bg-[#8C6D45] hover:text-white rounded-xs text-[10px] font-medium text-[#8C6D45] transition-colors flex items-center gap-1"
                      >
                        <Heart className="w-2.5 h-2.5" />
                        <span>Poetic</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGenerateAiWording('timeless')}
                        disabled={isAiWordingLoading}
                        className="px-2 py-0.5 bg-[#FAF7F0] border border-[#B59A72]/40 hover:bg-[#8C6D45] hover:text-white rounded-xs text-[10px] font-medium text-[#8C6D45] transition-colors flex items-center gap-1"
                      >
                        <Heart className="w-2.5 h-2.5" />
                        <span>Timeless</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={formData.storyMessage}
                    onChange={(e) => setFormData({ ...formData, storyMessage: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
                  />
                  {aiWordingToast && (
                    <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Custom romantic wording generated with Gemini!</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: MULTI-EVENT SCHEDULE */}
            {activeTab === 'schedule' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-neutral-600">
                    Define the full wedding itinerary (Ceremony, Banquet, Cocktails, Brunch).
                  </p>
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="px-3 py-1.5 bg-[#292722] text-white text-xs font-medium rounded-xs hover:bg-[#8C6D45] flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Session
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.events.map((evt, idx) => (
                    <div
                      key={evt.id}
                      className="p-4 bg-white rounded-xs border border-[#B59A72]/30 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                        <span className="text-xs font-semibold uppercase text-[#8C6D45]">
                          Session 0{idx + 1}
                        </span>
                        {formData.events.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEvent(evt.id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors"
                            title="Remove session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Session Title
                          </label>
                          <input
                            type="text"
                            value={evt.title}
                            onChange={(e) => handleUpdateEvent(evt.id, 'title', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Date &amp; Time
                          </label>
                          <input
                            type="text"
                            value={`${evt.date} · ${evt.time}`}
                            onChange={(e) => {
                              const parts = e.target.value.split('·');
                              handleUpdateEvent(evt.id, 'date', parts[0]?.trim() || evt.date);
                              if (parts[1]) handleUpdateEvent(evt.id, 'time', parts[1].trim());
                            }}
                            className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Venue &amp; Location
                          </label>
                          <input
                            type="text"
                            value={evt.venue}
                            onChange={(e) => handleUpdateEvent(evt.id, 'venue', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                            Dress Code
                          </label>
                          <input
                            type="text"
                            value={evt.dressCode}
                            onChange={(e) => handleUpdateEvent(evt.id, 'dressCode', e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: DATA PRIVACY & COMPLETE MICROSITE DELETION */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xs">
                  <div className="flex items-start gap-3">
                    <Trash2 className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-900">
                        Couple Data Privacy &amp; Erasure Rights
                      </h3>
                      <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                        Under global data protection standards (GDPR / POPIA), as the wedding couple you hold the absolute right to permanently delete your wedding microsite, customized invitation stationery, and all collected guest data at any time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border border-[#B59A72]/30 rounded-xs space-y-4">
                  <h4 className="font-editorial text-lg text-[#292722]">
                    What will be permanently erased:
                  </h4>
                  <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                    <li>The couple&apos;s published wedding microsite and URL access</li>
                    <li>All invitation stationery styles, bespoke color palettes, and photos</li>
                    <li>Entire guest list registry, RSVP confirmations, and contact details</li>
                    <li>Plus-one accommodation records, seating statuses, and dietary notes</li>
                    <li>Guest reception song requests and DJ celebration playlist notes</li>
                  </ul>

                  <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-rose-700 block">
                        Permanent Action
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        This operation cannot be reversed once confirmed.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Request Complete Deletion</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Live Invitation Preview */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D45]">
                Card Live Rendering
              </span>
              <span className="text-xs text-neutral-500">
                Orientation: <span className="font-semibold capitalize text-[#292722]">{formData.cardOrientation}</span> ·{' '}
                {formData.customColors?.isCustom ? (
                  <span className="text-[#8C6D45] font-semibold">Custom Palette</span>
                ) : (
                  <span className="capitalize">{formData.foilAccent} Foil</span>
                )}
              </span>
            </div>

            <InvitationCardPreview
              wedding={formData}
              guestName="Alex Morgan"
              guestId="AUR-8012"
              selectedEventIds={formData.events.map((e) => e.id)}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1B18]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FAF7F0] rounded-sm max-w-md w-full border border-rose-300 shadow-2xl p-6 relative">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteError(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 font-mono text-sm"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-editorial text-2xl font-normal text-rose-950 text-center mb-1">
              Confirm Complete Deletion
            </h3>
            <p className="text-xs text-neutral-600 text-center mb-4 leading-relaxed">
              This will permanently delete your wedding microsite and completely wipe all registered guests, plus-ones, and song requests from storage.
            </p>

            {deleteError && (
              <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs">
                {deleteError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Type <span className="font-mono text-rose-700">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 text-sm bg-white border border-rose-300 rounded-xs font-mono uppercase focus:outline-hidden focus:border-rose-700"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                >
                  Permanently Delete Everything
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteError(null);
                  }}
                  className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 rounded-xs text-neutral-700 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

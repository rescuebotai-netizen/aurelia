export type InvitationStyle = 'classic' | 'minimalist' | 'royal' | 'botanical' | 'contemporary';

export type FoilAccent = 'gold' | 'rose' | 'silver' | 'blind' | 'custom';

export type PaperTone = 'ivory' | 'white' | 'midnight' | 'blush' | 'stone' | 'custom';

export type CardOrientation = 'portrait' | 'landscape';

export type PhotoFrameStyle = 'arch' | 'cameo' | 'inset' | 'editorial-split';

export type DecorativeGraphic = 'none' | 'botanical' | 'crest' | 'artdeco' | 'arch';

export type WaxSealStyle = 'monogram' | 'botanical' | 'crest' | 'heart';

export interface CustomBrandingColors {
  background: string;
  foil: string;
  text: string;
  border: string;
  isCustom: boolean;
}

export interface EventDetail {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  dressCode: string;
  description: string;
}

export interface LoveStoryMoment {
  year: string;
  title: string;
  description: string;
  location: string;
  image?: string;
}

export interface SongRequest {
  id: string;
  guestName: string;
  songTitle: string;
  artist: string;
  status?: 'approved' | 'must-play' | 'declined' | 'pending';
  notes?: string;
  djNotes?: string;
  danceEnergy?: 'chill' | 'mid-tempo' | 'high-energy' | 'party-anthem';
  requestedAt?: string;
  votes?: number;
}

export interface WeddingData {
  id: string;
  slug: string;
  partner1: string;
  partner2: string;
  date: string;
  rawDate: string;
  city: string;
  venue: string;
  headline: string;
  storyMessage: string;
  dressCodeSummary: string;
  heroImage: string;
  invitationStyle: InvitationStyle;
  foilAccent: FoilAccent;
  paperTone: PaperTone;
  monogram: string;
  events: EventDetail[];
  rsvpDeadline: string;
  giftRegistryUrl: string;
  customDomain: string;

  // Visual Customization & Design options
  cardOrientation: CardOrientation;
  selectedFontFamily: string;
  couplePhotoUrl: string;
  showPhotoOnCard: boolean;
  photoFrameStyle: PhotoFrameStyle;
  decorativeGraphic: DecorativeGraphic;
  waxSealStyle: WaxSealStyle;
  customColors: CustomBrandingColors;

  // Microsite rich content
  storyTimeline?: LoveStoryMoment[];
  songRequests?: SongRequest[];
  scripture1?: string;
  scripture2?: string;
  storyTitle?: string;
  storyParagraphs?: string[];
  dressCodeChurch?: string;
  dressCodeDining?: string;
}

export interface GuestInvitation {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  status: 'attending' | 'declined' | 'pending';
  eventsAttending: string[];
  hasPlusOne: boolean;
  plusOneName?: string;
  plusOneDietary?: string;
  plusOneStatus?: 'confirmed' | 'rejected' | 'pending';
  plusOneAllowed?: boolean;
  dietaryRequirements?: string;
  invitationSentVia?: 'whatsapp' | 'email' | 'download';
  invitationGeneratedAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
  notes?: string;
}

export interface InvitationStyleMeta {
  id: InvitationStyle;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accentColor: string;
  borderStyle: string;
  fontCategory: string;
  recommendedPaper: PaperTone;
  recommendedFoil: FoilAccent;
}

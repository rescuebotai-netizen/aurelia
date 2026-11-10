import { WeddingData, GuestInvitation, InvitationStyleMeta } from '../types/wedding';

export const INITIAL_WEDDING: WeddingData = {
  id: 'wed-aur-001',
  slug: 'samson-kevine',
  partner1: 'Samson Ilunga',
  partner2: 'Kevine Bonganga',
  date: 'Sunday, 20th December 2026',
  rawDate: '2026-12-20',
  city: 'Cape Town, Western Cape',
  venue: 'Lion Voice Tabernacle & Rooftop 39 Salt River Road',
  headline: 'Celebration of Love',
  storyTitle: 'BEAUTIFUL LOVE STORY',
  storyMessage: 'Everything began unexpectedly… A meeting, a glance, a simple exchange, and since then, everything has changed. Today, we are writing the most beautiful chapter of our lives.',
  storyParagraphs: [
    'Everything began unexpectedly…',
    'A meeting, a glance, a simple exchange, and since then, everything has changed.',
    'We have shared laughter, dreams, challenges, and so many other precious moments.',
    'Today, we are writing the most beautiful chapter of our lives, and we would love to share it with you.',
    'Your presence means so much to us on this very special day!',
    'With all our love and our most sincere gratitude.'
  ],
  dressCodeSummary: 'Church Ceremony: Vintage Wear · Dinning Ceremony: Gala Wear',
  dressCodeChurch: 'Vintage Wear',
  dressCodeDining: 'Gala Wear',
  scripture1: 'Therefore what God has joined together, let no one separate. — Mark 10:9',
  scripture2: 'I will restore to you the years that the swarming locust has eaten. — Joel 2:25',
  heroImage: '/src/assets/images/IMG-20261107-WA0121.jpg',
  invitationStyle: 'classic',
  foilAccent: 'gold',
  paperTone: 'ivory',
  monogram: 'S & K',
  rsvpDeadline: '1st December 2026',
  giftRegistryUrl: 'https://registry.aurelia.invites/samson-kevine',
  customDomain: 'samsonandkevine.wedding',

  // Visual Customization & Design options
  cardOrientation: 'portrait',
  selectedFontFamily: 'cormorant',
  couplePhotoUrl: '/src/assets/images/IMG-20261107-WA0131.jpg',
  showPhotoOnCard: true,
  photoFrameStyle: 'arch',
  decorativeGraphic: 'botanical',
  waxSealStyle: 'monogram',
  customColors: {
    background: '#FAF7F0',
    foil: '#D4AF37',
    text: '#292722',
    border: '#B59A72',
    isCustom: false
  },

  // Microsite rich interactive content
  storyTimeline: [
    {
      year: 'Chapter 01',
      title: 'A Meeting & A Glance',
      location: 'Unexpected Beginnings',
      description: 'Everything began unexpectedly… A meeting, a glance, a simple exchange, and since then, everything has changed.',
      image: '/src/assets/images/IMG-20261107-WA0121.jpg'
    },
    {
      year: 'Chapter 02',
      title: 'Laughter, Dreams & Moments',
      location: 'Growing Together',
      description: 'We have shared laughter, dreams, challenges, and so many other precious moments along the way.',
      image: '/src/assets/images/IMG-20261107-WA0131.jpg'
    },
    {
      year: 'Chapter 03',
      title: 'Our Most Beautiful Chapter',
      location: 'Cape Town, Western Cape',
      description: 'Today, we are writing the most beautiful chapter of our lives, and we would love to share it with you.',
      image: '/src/assets/images/IMG-20261107-WA0132.jpg'
    },
    {
      year: 'Mark 10:9',
      title: 'United in Holy Matrimony',
      location: 'Lion Voice Tabernacle',
      description: 'Therefore what God has joined together, let no one separate. With all our love and our most sincere gratitude.',
      image: '/src/assets/images/IMG-20261107-WA0136.jpg'
    }
  ],
  songRequests: [],
  events: [
    {
      id: 'evt-benediction',
      title: 'Wedding Benediction',
      date: 'Sunday, 20th December 2026',
      time: '13:00',
      venue: 'Lion Voice Tabernacle',
      address: '11 Lower Maynard Rd Wynberg Station, Tailan Building Basement Hall.',
      dressCode: 'Vintage Wear',
      description: 'Therefore what God has joined together, let no one separate. — Mark 10:9'
    },
    {
      id: 'evt-reception',
      title: 'Evening Reception',
      date: 'Sunday, 20th December 2026',
      time: '18:00 to 21:00',
      venue: 'Rooftop',
      address: '39 Salt River Road, Salt River, Cape Town, Western Cape, 7405',
      dressCode: 'Gala Wear',
      description: 'I will restore to you the years that the swarming locust has eaten. — Joel 2:25'
    }
  ]
};

export const INVITATION_STYLES: InvitationStyleMeta[] = [
  {
    id: 'classic',
    name: 'Timeless Classic',
    tagline: 'Hand-deckled cotton paper with raised gold foil calligraphy',
    description: 'Heritage typography inspired by European royal wedding correspondence. Featuring hand-torn deckled edges, pure warm cotton fibers, and genuine hot-stamped gold foil leaf.',
    image: '/src/assets/images/IMG-20261107-WA0121.jpg',
    accentColor: '#B59A72',
    borderStyle: 'border border-[#B59A72]/30',
    fontCategory: 'Traditional Serif & Calligraphy',
    recommendedPaper: 'ivory',
    recommendedFoil: 'gold'
  },
  {
    id: 'minimalist',
    name: 'Modern Minimalist',
    tagline: 'Architectural precision and sculptural blind debossing',
    description: 'For the contemporary couple who prizes serene negative space, sculptural blind debossing arches, and balanced proportional grid systems on heavy travertine cardstock.',
    image: '/src/assets/images/IMG-20261107-WA0131.jpg',
    accentColor: '#6B6861',
    borderStyle: 'border border-neutral-300',
    fontCategory: 'Architectural Serif & Sans',
    recommendedPaper: 'white',
    recommendedFoil: 'blind'
  },
  {
    id: 'royal',
    name: 'Royal Elegance',
    tagline: 'Deep midnight charcoal with ornate heraldic crest & velvet band',
    description: 'Bespoke aristocratic grandeur. Heavy 600gsm midnight charcoal board paired with heraldic family cresting, ornate corner filigree, and hand-poured bronze wax seal.',
    image: '/src/assets/images/IMG-20261107-WA0132.jpg',
    accentColor: '#D4AF37',
    borderStyle: 'border border-[#D4AF37]/50',
    fontCategory: 'Regal Heraldic & Roman Capitals',
    recommendedPaper: 'midnight',
    recommendedFoil: 'gold'
  },
  {
    id: 'botanical',
    name: 'Botanical Romance',
    tagline: 'Hand-painted olive foliage, floral vellum wrap & fine linen',
    description: 'Fine art watercolor botanicals interwoven with luminous rose gold foil accents, translucent botanical vellum outer jackets, and soft champagne organic linen weave.',
    image: '/src/assets/images/IMG-20261107-WA0136.jpg',
    accentColor: '#7A8B78',
    borderStyle: 'border border-[#7A8B78]/30',
    fontCategory: 'Delicate Italic Script & Serif',
    recommendedPaper: 'blush',
    recommendedFoil: 'rose'
  },
  {
    id: 'contemporary',
    name: 'Contemporary Luxury',
    tagline: 'Frosted acrylic vellum with engraved champagne metallic typography',
    description: 'High-fashion editorial elegance featuring optical frosted acrylic, art-deco geometric hairline borders, custom brass wax stamps, and textured linen envelopes.',
    image: '/src/assets/images/IMG-20261107-WA0155.jpg',
    accentColor: '#C5A880',
    borderStyle: 'border border-[#C5A880]/40',
    fontCategory: 'Geometric High-Fashion Serif',
    recommendedPaper: 'stone',
    recommendedFoil: 'gold'
  }
];

export const INITIAL_GUESTS: GuestInvitation[] = [];


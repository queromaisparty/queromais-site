// ============================================
// TIPOS GLOBAIS - QUERO MAIS
// ============================================

export type Language = 'pt' | 'en' | 'es';

export interface TranslatableContent {
  pt: string;
  en: string;
  es: string;
}

// ============================================
// USUÁRIO ADMIN
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  createdAt: string;
  lastLogin?: string;
}

// ============================================
// INGRESSOS — multi-plataforma
// ============================================

export type TicketPlatform = 'sympla' | 'ingresse' | 'shotgun' | 'bilheteria_digital' | 'custom';

export interface TicketLink {
  id: string;
  platform: TicketPlatform;
  label: string;           // Ex: "Ingresso Normal", "VIP", "Camarote"
  url: string;
  price?: number;          // Preço (opcional, só exibição)
  type: 'free' | 'paid';
}

// ============================================
// EVENTOS
// ============================================

export interface Event {
  id: string;
  slug: string;
  title: TranslatableContent;
  shortDescription?: TranslatableContent;
  description: TranslatableContent;

  // Mídia
  coverImage: string;
  flyer?: string;            // imagem de flyer separada da capa
  gallery: string[];

  // Data e Local
  date: string;              // ISO date: "2025-12-31"
  time: string;              // "23:00"
  endTime?: string;          // "06:00" (opcional)
  /** @deprecated use venue+city */
  location?: string;
  venue: string;
  city: string;
  state?: string;
  address?: string;

  // Ingressos — multi-plataforma
  ticketLinks: TicketLink[];
  /** @deprecated use ticketLinks[0].url */
  ticketUrl?: string;
  /** @deprecated use ticketLinks vipUrl typed */
  vipUrl?: string;
  /** @deprecated use ticketUrl */
  ticketLink?: string;

  // Status e Visibilidade
  status: 'active' | 'inactive' | 'sold_out';
  featured: boolean;
  featuredHome: boolean;     // destaque específico na seção Hero da Home
  order: number;

  // SEO
  seoTitle?: TranslatableContent;
  seoDescription?: TranslatableContent;

  // Meta
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FICA MAIS PARTY
// ============================================

export interface FicaMaisParty {
  showInHome: boolean;
  isActivePage: boolean;
  manifestoCurto: TranslatableContent;
  manifestoCompleto: TranslatableContent;
  homeMedia: string;
  pageMedia: string;
  upcomingDates: PartyDate[];
  galleryAlbumId?: string; // Relation to Albums for Vibes/AM
}

export interface PartyDate {
  id: string;
  date: string;
  time: string;
  location: string;
  ticketLink?: string;
}

// ============================================
// STORYTELLING
// ============================================

export interface TimelineItem {
  id: string;
  year?: string;
  title: string;
  description: string;
  order: number;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  order: number;
}

export interface Storytelling {
  id: string;
  // Hero
  heroTitle: string;
  heroTagline: string;
  // Stats (vazio até números reais serem confirmados)
  stats: StatItem[];
  // Origem e Propósito
  origemTitle: string;
  origemText1: string;
  origemText2: string;
  origemImage: string;
  // Essência
  essenciaTitle: string;
  essenciaText1: string;
  essenciaText2: string;
  essenciaImage: string;
  tags: string[];
  // Símbolo: A Borboleta
  simboloTitle: string;
  simboloText1: string;
  simboloText2: string;
  simboloImage: string;
  // Narrativa Contínua
  narrativaTitle: string;
  narrativaIntro: string;
  timeline: TimelineItem[];
  // CTA Final
  ctaText: string;
  ctaButtonLabel: string;
  ctaButtonLink: string;
  // Resumo da Home
  homeTitle: string;
  homeText1: string;
  homeText2: string;
  homeCTA: string;
}

// ============================================
// QM MUSIC
// ============================================

export interface DJ {
  id: string;
  name: string;
  bio: TranslatableContent;
  image: string;
  resident: boolean;
  socialLinks: SocialLink[];
}

export interface DJSet {
  id: string;
  djId: string;
  title: TranslatableContent;
  description: TranslatableContent;
  coverImage: string;
  audioUrl?: string;
  externalLink?: string;
  playlistUrl?: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  title: TranslatableContent;
  description: TranslatableContent;
  coverImage: string;
  tracks: Track[];
  externalUrl?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

// ============================================
// GALERIA
// ============================================

export interface GalleryAlbum {
  id: string;
  eventId?: string;
  title: string;
  description: string;
  coverImage: string;
  images: GalleryImage[];
  videos: GalleryVideo[];
  category?: string;
  order: number;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: TranslatableContent;
  downloadAllowed: boolean;
  source: 'upload' | 'url' | 'gdrive';
  gdriveId?: string;
  width?: number;
  height?: number;
}

export interface GalleryVideo {
  id: string;
  url: string;
  thumbnail: string;
  caption?: TranslatableContent;
  type: 'reel' | 'video';
}

export interface GoogleDriveConfig {
  folderId: string;
  folderName: string;
  connected: boolean;
  lastSync?: string;
}

// ============================================
// LOJA
// ============================================

export interface Product {
  id: string;
  name: TranslatableContent;
  description: TranslatableContent;
  images: string[];
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  name: TranslatableContent;
  description: TranslatableContent;
  price: number;
  quantity: number;
  status: 'active' | 'inactive' | 'sold_out';
}

// ============================================
// CONTATO
// ============================================

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  address?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'nova' | 'lida' | 'respondida' | 'arquivada';
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: TranslatableContent;
  answer: TranslatableContent;
  category: string;
  order: number;
  status: 'active' | 'inactive';
}

// ============================================
// CONFIGURAÇÕES
// ============================================

export interface SiteConfig {
  siteName: TranslatableContent;
  siteDescription: TranslatableContent;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: SocialLink[];
  seo: SEOConfig;
}

export interface SEOConfig {
  title: TranslatableContent;
  description: TranslatableContent;
  keywords: string;
  ogImage: string;
}

export interface Banner {
  id: string;
  title: TranslatableContent;
  subtitle: TranslatableContent;
  image: string;
  link?: string;
  buttonText: TranslatableContent;
  position: 'home_hero' | 'home_middle' | 'home_bottom';
  status: 'active' | 'inactive';
}

// ============================================
// HOME SECTIONS
// ============================================

export interface HomeSection {
  id: string;
  type: 'hero' | 'events' | 'fica_mais' | 'sobre' | 'music' | 'voce' | 'shop' | 'contact';
  title: TranslatableContent;
  subtitle: TranslatableContent;
  content: TranslatableContent;
  image?: string;
  buttonText?: TranslatableContent;
  buttonLink?: string;
  order: number;
  status: 'active' | 'inactive';
}

// ============================================
// CARRINHO
// ============================================

export interface CartItem {
  id: string;
  productId?: string;
  ticketId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

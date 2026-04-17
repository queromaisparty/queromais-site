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
// EVENTOS
// ============================================

export interface Event {
  id: string;
  title: TranslatableContent;
  description: TranslatableContent;
  coverImage: string;
  date: string;
  time: string;
  location: string;
  ticketLink?: string;
  gallery: string[];
  status: 'active' | 'inactive' | 'finished';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FICA MAIS PARTY
// ============================================

export interface FicaMaisParty {
  id: string;
  title: TranslatableContent;
  description: TranslatableContent;
  images: string[];
  videos: string[];
  upcomingDates: PartyDate[];
  status: 'active' | 'inactive';
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

export interface Storytelling {
  id: string;
  history: TranslatableContent;
  mission: TranslatableContent;
  values: TranslatableContent;
  founder: FounderInfo;
  images: string[];
}

export interface FounderInfo {
  name: string;
  bio: TranslatableContent;
  image: string;
}

// ============================================
// QM MUSIC
// ============================================

export interface DJ {
  id: string;
  name: string;
  bio: TranslatableContent;
  image: string;
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
  title: TranslatableContent;
  description: TranslatableContent;
  coverImage: string;
  images: GalleryImage[];
  videos: GalleryVideo[];
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: TranslatableContent;
  downloadAllowed: boolean;
}

export interface GalleryVideo {
  id: string;
  url: string;
  thumbnail: string;
  caption?: TranslatableContent;
  type: 'reel' | 'video';
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

export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
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
  type: 'hero' | 'events' | 'fica_mais' | 'storytelling' | 'music' | 'gallery' | 'shop' | 'contact';
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

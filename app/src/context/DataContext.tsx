import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { 
  Event, 
  FicaMaisParty, 
  Storytelling, 
  DJ, 
  DJSet, 
  Playlist,
  GalleryAlbum,
  Product,
  Ticket,
  FAQ,
  ContactInfo,
  Banner,
  HomeSection,
  SiteConfig,
  ContactMessage
} from '@/types';

interface DataContextType {
  // Eventos
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getFeaturedEvents: () => Event[];
  getUpcomingEvents: () => Event[];
  
  // Fica Mais Party
  ficaMaisParty: FicaMaisParty | null;
  updateFicaMaisParty: (data: Partial<FicaMaisParty>) => void;
  
  // Storytelling
  storytelling: Storytelling;
  updateStorytelling: (data: Partial<Storytelling>) => void;
  
  // QM Music
  djs: DJ[];
  djSets: DJSet[];
  playlists: Playlist[];
  addDJ: (dj: Omit<DJ, 'id'>) => void;
  updateDJ: (id: string, dj: Partial<DJ>) => void;
  deleteDJ: (id: string) => void;
  addDJSet: (set: Omit<DJSet, 'id' | 'createdAt'>) => void;
  updateDJSet: (id: string, set: Partial<DJSet>) => void;
  deleteDJSet: (id: string) => void;
  
  // Galeria
  galleryAlbums: GalleryAlbum[];
  addGalleryAlbum: (album: Omit<GalleryAlbum, 'id' | 'createdAt'>) => void;
  updateGalleryAlbum: (id: string, album: Partial<GalleryAlbum>) => void;
  deleteGalleryAlbum: (id: string) => void;
  
  // Loja
  products: Product[];
  tickets: Ticket[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // FAQ
  faqs: FAQ[];
  addFAQ: (faq: Omit<FAQ, 'id'>) => void;
  updateFAQ: (id: string, faq: Partial<FAQ>) => void;
  deleteFAQ: (id: string) => void;
  
  // Mensagens de Contato
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => void;
  updateContactMessage: (id: string, msg: Partial<ContactMessage>) => void;
  deleteContactMessage: (id: string) => void;
  
  // Contato
  contactInfo: ContactInfo;
  updateContactInfo: (info: Partial<ContactInfo>) => void;
  
  // Banners
  banners: Banner[];
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  
  // Home Sections
  homeSections: HomeSection[];
  updateHomeSection: (id: string, section: Partial<HomeSection>) => void;
  
  // Config
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// ==========================================
// HELPERS
// ==========================================
function mapToDB(obj: any): any {
  if (Array.isArray(obj)) return obj.map(mapToDB);
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc: any, key) => {
    const snake = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    acc[snake] = obj[key] === undefined ? null : obj[key];
    return acc;
  }, {});
}

function mapFromDB(obj: any): any {
  if (Array.isArray(obj)) return obj.map(mapFromDB);
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc: any, key) => {
    const camel = key.replace(/([-_][a-z])/g, g => g.toUpperCase().replace('-', '').replace('_', ''));
    let val = obj[key];
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
      try { val = JSON.parse(val); } catch (e) {}
    }
    acc[camel] = val;
    return acc;
  }, {});
}

const defaultStorytelling: Storytelling = {
  id: '1',
  heroTitle: 'EXPERIÊNCIAS QUE MARCAM',
  heroTagline: 'Onde o dia se transforma em experiência.',
  stats: [],
  origemTitle: 'Onde o dia se transforma em experiência',
  origemText1: 'Nascida no Rio de Janeiro, a Quero Mais Day Party surge com um propósito claro: não ser apenas mais uma festa, mas uma experiência completa, imersiva e inesquecível.',
  origemText2: 'Desde o início, a marca foi concebida para provocar algo maior. Não se trata apenas de música. Se trata de transformação. Do desejo de criar suas edições em momentos que marcam as pessoas.',
  origemImage: '',
  essenciaTitle: 'A essência por trás da marca',
  essenciaText1: 'A Quero Mais nasce para redefinir a forma como as pessoas vivem o entretenimento. Aqui, a experiência não começa na entrada do evento. Ela começa no primeiro contato.',
  essenciaText2: 'Cada edição começa no anúncio que instiga, na estética que envolve e na narrativa que captura. E se estende até o último momento: na energia da pista, na construção dos sets e na memória que permanece.',
  essenciaImage: '',
  tags: ['Experiência', 'Transformação', 'Narrativa', 'Memória'],
  simboloTitle: 'O símbolo: a borboleta',
  simboloText1: 'No centro de tudo está o brasão da marca: a borboleta. Mais do que um elemento visual, ela é a representação viva do que é a Quero Mais Day Party.',
  simboloText2: 'A borboleta carrega o significado da metamorfose, o processo de transformação profunda, inevitável e necessária. A Quero Mais nasce exatamente nesse ponto de transição. A borboleta não é apenas símbolo. É um convite.',
  simboloImage: '',
  narrativaTitle: 'Narrativa contínua',
  narrativaIntro: 'Cada edição é um capítulo de uma história maior. Os temas não são eventos isolados: são partes de um mesmo universo narrativo. Eles se conectam, evoluem e se transformam. Sempre estamos a contar o próximo passo da nossa história.',
  timeline: [
    { id: '1', title: 'Metamorphosis', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 1 },
    { id: '2', title: 'The Grand Masquerade', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 2 },
    { id: '3', title: 'Universo das Cores', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 3 },
    { id: '4', title: 'Vale Encantado', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 4 },
    { id: '5', title: 'Another Miracle', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 5 },
    { id: '6', title: 'Efeito Borboleta', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 6 },
    { id: '7', title: 'Era Uma Vez', description: 'Parte de um universo narrativo em constante evolução, onde cada edição amplia a história da Quero Mais.', order: 7 },
  ],
  ctaText: 'Conheça os próximos capítulos dessa experiência.',
  ctaButtonLabel: 'Ver próximos eventos',
  ctaButtonLink: '/eventos',
  homeTitle: 'Onde o dia se transforma em experiência',
  homeText1: 'Nascida no Rio de Janeiro, a Quero Mais Day Party surgiu com o propósito de ser mais do que uma festa.',
  homeText2: 'Uma experiência imersiva, estética e transformadora que marca cada edição.',
  homeCTA: 'Conheça nossa história',
};
const defaultContactInfo: ContactInfo = { email: 'contato@queromaisparty.com.br', phone: '(21) 9 7259-6991', whatsapp: '(21) 972596991', instagram: '@queromaisparty', address: 'RIO DE JANEIRO' };
const defaultSiteConfig: SiteConfig = { siteName: { pt: 'Quero Mais', en: 'Want More', es: 'Quiero Más' }, siteDescription: { pt: 'Experiências', en: 'Experiences', es: 'Experiencias' }, logo: '/logo.png', favicon: '/favicon.ico', primaryColor: '#CCFF00', secondaryColor: '#8B5CF6', socialLinks: [], seo: { title: {pt:'Quero Mais', en:'Want More', es:'Quiero Más'}, description: {pt:'Exp', en:'Exp', es:'Exp'}, keywords: 'festas', ogImage: '/og-image.jpg'} };

function useOptimisticCRUD<T extends { id: string }>(table: string, setState: React.Dispatch<React.SetStateAction<T[]>>) {
  const add = useCallback(async (item: Omit<T, 'id'|'createdAt'|'updatedAt'>) => {
    const optId = `temp-${Date.now()}`;
    const optItem = { ...item, id: optId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as unknown as T;
    setState(prev => [...prev, optItem]);
    try {
      const { data, error } = await supabase.from(table).insert([mapToDB(item)]).select().single();
      if (error) throw error;
      setState(prev => prev.map(e => e.id === optId ? (mapFromDB(data) as T) : e));
    } catch (err: any) {
      setState(prev => prev.filter(e => e.id !== optId));
      toast.error('Erro ao adicionar na nuvem.');
      console.error(err);
    }
  }, [table, setState]);

  const update = useCallback(async (id: string, itemData: Partial<T>) => {
    setState(prev => prev.map(e => e.id === id ? { ...e, ...itemData, updatedAt: new Date().toISOString() } : e));
    try {
      if (id.startsWith('temp-')) return;
      const mapped = mapToDB(itemData);
      const { error } = await supabase.from(table).update(mapped).eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      toast.error('Erro ao atualizar na nuvem.');
      console.error(err);
    }
  }, [table, setState]);

  const del = useCallback(async (id: string) => {
    setState(prev => prev.filter(e => e.id !== id));
    try {
      if (id.startsWith('temp-')) return;
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      toast.error('Erro ao remover da nuvem.');
      console.error(err);
    }
  }, [table, setState]);

  return { add, update, del };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [ficaMaisParty, setFicaMaisParty] = useState<FicaMaisParty | null>(null);
  const [storytelling, setStorytelling] = useState<Storytelling>(defaultStorytelling);
  const [djs, setDJs] = useState<DJ[]>([]);
  const [djSets, setDJSets] = useState<DJSet[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const fetchTable = async (table: string, setter: any) => {
          const { data } = await supabase.from(table).select('*');
          if (data && mounted) setter(data.map(mapFromDB));
        };
        await Promise.all([
          fetchTable('events', setEvents),
          fetchTable('djs', setDJs),
          fetchTable('dj_sets', setDJSets),
          fetchTable('playlists', setPlaylists),
          fetchTable('gallery_albums', setGalleryAlbums),
          fetchTable('products', setProducts),
          fetchTable('tickets', setTickets),
          fetchTable('faqs', setFaqs),
          fetchTable('banners', setBanners),
          fetchTable('contact_messages', setContactMessages),
        ]);

        const { data: config } = await supabase.from('site_config').select('*').limit(1).single();
        if (config && mounted) {
          setSiteConfig(mapFromDB(config));
          if (config.fica_mais_party) setFicaMaisParty(mapFromDB(config.fica_mais_party));
          if (config.storytelling) setStorytelling(mapFromDB(config.storytelling));
          if (config.home_sections) setHomeSections(mapFromDB(config.home_sections));
        }

        const { data: contact } = await supabase.from('contact_info').select('*').limit(1).single();
        if (contact && mounted) setContactInfo(mapFromDB(contact));
      } catch (e) {
        console.error('Error load supabase data:', e);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  const crudEvents = useOptimisticCRUD('events', setEvents);
  const crudDjs = useOptimisticCRUD('djs', setDJs);
  const crudDjSets = useOptimisticCRUD('dj_sets', setDJSets);
  // const crudPlaylists = useOptimisticCRUD('playlists', setPlaylists);
  const crudGallery = useOptimisticCRUD('gallery_albums', setGalleryAlbums);
  const crudProducts = useOptimisticCRUD('products', setProducts);
  // const crudTickets = useOptimisticCRUD('tickets', setTickets);
  const crudFaqs = useOptimisticCRUD('faqs', setFaqs);
  const crudBanners = useOptimisticCRUD('banners', setBanners);
  const crudMessages = useOptimisticCRUD('contact_messages', setContactMessages);

  const getFeaturedEvents = useCallback(() => events.filter(e => e.featured && e.status === 'active'), [events]);
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events.filter(e => new Date(e.date) >= now && e.status === 'active').sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const updateSiteConfig = useCallback(async (data: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...data }));
    try {
      await supabase.from('site_config').update(mapToDB(data)).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { console.error(e); }
  }, []);

  const updateFicaMaisParty = useCallback(async (data: Partial<FicaMaisParty>) => {
    setFicaMaisParty(prev => ({ ...prev, ...data } as any));
    try {
      await supabase.from('site_config').update({ fica_mais_party: data }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { console.error(e); }
  }, []);

  const updateStorytelling = useCallback(async (data: Partial<Storytelling>) => {
    setStorytelling(prev => ({ ...prev, ...data } as any));
    try {
      await supabase.from('site_config').update({ storytelling: data }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { console.error(e); }
  }, []);

  const updateHomeSection = useCallback(async (id: string, data: Partial<HomeSection>) => {
    let currentSections: HomeSection[] = [];
    setHomeSections(prev => {
      currentSections = prev.map(s => s.id === id ? { ...s, ...data } : s);
      return currentSections;
    });
    try {
      await supabase.from('site_config').update({ home_sections: currentSections }).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { console.error(e); }
  }, []);

  const updateContactInfo = useCallback(async (data: Partial<ContactInfo>) => {
    setContactInfo(prev => ({ ...prev, ...data } as any));
    try {
      await supabase.from('contact_info').update(mapToDB(data)).neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (e) { console.error(e); }
  }, []);

  return (
    <DataContext.Provider value={{
      events, addEvent: crudEvents.add, updateEvent: crudEvents.update, deleteEvent: crudEvents.del, getFeaturedEvents, getUpcomingEvents,
      ficaMaisParty, updateFicaMaisParty,
      storytelling, updateStorytelling,
      djs, djSets, playlists, addDJ: crudDjs.add, updateDJ: crudDjs.update, deleteDJ: crudDjs.del, addDJSet: crudDjSets.add, updateDJSet: crudDjSets.update, deleteDJSet: crudDjSets.del,
      galleryAlbums, addGalleryAlbum: crudGallery.add, updateGalleryAlbum: crudGallery.update, deleteGalleryAlbum: crudGallery.del,
      products, tickets, addProduct: crudProducts.add, updateProduct: crudProducts.update, deleteProduct: crudProducts.del,
      faqs, addFAQ: crudFaqs.add, updateFAQ: crudFaqs.update, deleteFAQ: crudFaqs.del,
      contactInfo, updateContactInfo,
      contactMessages, addContactMessage: crudMessages.add, updateContactMessage: crudMessages.update, deleteContactMessage: crudMessages.del,
      banners, addBanner: crudBanners.add, updateBanner: crudBanners.update, deleteBanner: crudBanners.del,
      homeSections, updateHomeSection,
      siteConfig, updateSiteConfig
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
}

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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
  ContactMessage,
  NewsletterSubscriber
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
  addPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt'>) => void;
  updatePlaylist: (id: string, playlist: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  
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
  
  // Newsletter
  newsletterSubscribers: NewsletterSubscriber[];
  addNewsletterSubscriber: (sub: Omit<NewsletterSubscriber, 'id'|'createdAt'>) => void;
  updateNewsletterSubscriber: (id: string, sub: Partial<NewsletterSubscriber>) => void;
  deleteNewsletterSubscriber: (id: string) => void;
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
  heroTitle: 'VIVA A METAMORFOSE',
  heroTagline: 'Onde cada edição transforma o dia em uma experiência inesquecível.',
  stats: [
    { label: 'EDIÇÕES', value: '15+' },
    { label: 'CIDADES', value: '03' },
    { label: 'PESSOAS', value: '40K+' }
  ],
  origemTitle: 'Onde o dia se transforma em experiência',
  origemText1: 'Nascida no pulsar do Rio de Janeiro, a Quero Mais Day Party surgiu com um propósito que transcende a música: criar momentos de transformação real.',
  origemText2: 'Não somos apenas um evento. Somos um capítulo na história de cada pessoa que escolhe viver a energia da borboleta.',
  origemImage: '',
  essenciaTitle: 'A essência por trás da borboleta',
  essenciaText1: 'Nossa marca é guiada pela estética, pela narrativa e pela conexão. Cada detalhe, do anúncio ao último beat, é planejado para ser imersivo.',
  essenciaText2: 'Aqui, a metamorfose é celebrada. Mudamos a cada edição, evoluímos a cada tema, mas mantemos a alma vibrante.',
  essenciaImage: '',
  tags: ['Metamorfose', 'Experiência', 'Estética', 'Conexão'],
  simboloTitle: 'O símbolo: A Borboleta',
  simboloText1: 'Muito mais que um ícone, a borboleta representa o processo de evolução constante. Ela convida você a sair do casulo e viver a liberdade.',
  simboloText2: 'A cada bater de asas, uma nova edição, uma nova história, um novo sentimento que perdura.',
  simboloImage: '',
  narrativaTitle: 'Uma Jornada Contínua',
  narrativaIntro: 'Nossos temas não são isolados. Eles formam um universo narrativo que se expande. Conheça as edições que definiram nossa trajetória até aqui.',
  timeline: [
    { id: '1', title: 'Metamorphosis', description: 'O despertar da marca e o início da nossa jornada narrativa.', order: 1 },
    { id: '2', title: 'The Grand Masquerade', description: 'Mistério e elegância em uma edição que elevou nossos padrões.', order: 2 },
    { id: '3', title: 'Universo das Cores', description: 'A explosão cromática que celebrou a diversidade da nossa pista.', order: 3 },
    { id: '4', title: 'Vale Encantado', description: 'Natureza e música em perfeita sintonia.', order: 4 },
  ],
  ctaText: 'Pronto para escrever o próximo capítulo conosco?',
  ctaButtonLabel: 'Ver Agenda Oficial',
  ctaButtonLink: '/eventos',
  homeTitle: 'VIVA A SUA MELHOR VERSÃO',
  homeText1: 'Nascida no Rio de Janeiro, a Quero Mais é uma celebração itinerante que redefine o conceito de Day Party.',
  homeText2: 'Estética impecável, curadoria musical de alto nível e um público que pulsa na mesma frequência.',
  homeCTA: 'Conheça nossa história',
};
const defaultContactInfo: ContactInfo = { 
  email: 'contato@queromaisparty.com.br', 
  phone: '(21) 97259-6991', 
  whatsapp: '21972596991', 
  instagram: '@queromaisparty', 
  address: 'RIO DE JANEIRO - RJ' 
};
const defaultSiteConfig: SiteConfig = { 
  siteName: { pt: 'Quero Mais Day Party', en: 'Want More Day Party', es: 'Quiero Más Day Party' }, 
  siteDescription: { pt: 'Experiência Imersiva | Estética | Música', en: 'Immersive Experience | Aesthetics | Music', es: 'Experiencia Inmersiva | Estética | Música' }, 
  logo: '/logo.png', 
  favicon: '/favicon.ico', 
  primaryColor: '#CCFF00', 
  secondaryColor: '#8B5CF6', 
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/queromaisparty' },
    { platform: 'facebook', url: 'https://facebook.com/queromaisparty' }
  ], 
  seo: { 
    title: {pt: 'Quero Mais Day Party | Agenda Oficial', en: 'Want More Day Party | Official Schedule', es: 'Quiero Más Day Party | Agenda Oficial'}, 
    description: {pt: 'A maior experiência de day party do Rio de Janeiro. Confira nossa agenda, compre ingressos e viva a metamorfose.', en: 'The greatest day party experience in Rio. Check our schedule and buy tickets.', es: 'La mejor experiencia de day party en Río. Consulta nuestra agenda y compra entradas.'}, 
    keywords: 'festa, rio de janeiro, day party, música eletrônica, eventos, quero mais', 
    ogImage: '/og-image.jpg'
  }, 
  hero: { 
    active: true, 
    desktop: { url: '/hero-scroll.mp4', upload: '' }, 
    mobile: { url: '/videoversaomobile.mp4', upload: '' }, 
    fallbackImage: '/hero-poster.jpg' 
  } 
};

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
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);
  const siteConfigIdRef = useRef<string | null>(null);
  const contactInfoIdRef = useRef<string | null>(null);

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
          fetchTable('newsletter_subscribers', setNewsletterSubscribers),
        ]);

        const { data: config } = await supabase.from('site_config').select('*').limit(1).single();
        if (config && mounted) {
          siteConfigIdRef.current = config.id; // Guardar UUID real
          console.log('✅ site_config carregado, id:', config.id, 'primary_color:', config.primary_color);
          setSiteConfig(mapFromDB(config));
          if (config.fica_mais_party) setFicaMaisParty(mapFromDB(config.fica_mais_party));
          if (config.storytelling) setStorytelling(mapFromDB(config.storytelling));
          if (config.home_sections) setHomeSections(mapFromDB(config.home_sections));
        } else {
          console.warn('⚠️ Nenhuma row encontrada em site_config! Execute a migration SQL.');
        }

        const { data: contact } = await supabase.from('contact_info').select('*').limit(1).single();
        if (contact && mounted) {
          contactInfoIdRef.current = contact.id; // Guardar UUID real
          setContactInfo(mapFromDB(contact));
        } else {
          console.warn('⚠️ Nenhuma row encontrada em contact_info! Execute a migration SQL.');
        }
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
  const crudPlaylists = useOptimisticCRUD('playlists', setPlaylists);
  const crudGallery = useOptimisticCRUD('gallery_albums', setGalleryAlbums);
  const crudProducts = useOptimisticCRUD('products', setProducts);
  // const crudTickets = useOptimisticCRUD('tickets', setTickets);
  const crudFaqs = useOptimisticCRUD('faqs', setFaqs);
  const crudBanners = useOptimisticCRUD('banners', setBanners);
  const crudMessages = useOptimisticCRUD('contact_messages', setContactMessages);
  const crudNewsletter = useOptimisticCRUD('newsletter_subscribers', setNewsletterSubscribers);

  const getFeaturedEvents = useCallback(() => events.filter(e => e.featured && e.status === 'active'), [events]);
  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events.filter(e => new Date(e.date) >= now && e.status === 'active').sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const updateSiteConfig = useCallback(async (data: Partial<SiteConfig>) => {
    setSiteConfig(prev => ({ ...prev, ...data }));
    try {
      const configId = siteConfigIdRef.current;
      if (!configId) {
        console.error('❌ Sem ID de site_config — execute a migration SQL no Supabase!');
        return;
      }
      const { error } = await supabase
        .from('site_config')
        .update(mapToDB(data))
        .eq('id', configId);
      if (error) {
        console.error('❌ Erro ao salvar site_config:', error);
      } else {
        console.log('✅ site_config salvo com sucesso:', Object.keys(data));
      }
    } catch (e) { console.error('Exceção updateSiteConfig:', e); }
  }, []);

  const updateFicaMaisParty = useCallback(async (data: Partial<FicaMaisParty>) => {
    setFicaMaisParty(prev => ({ ...prev, ...data } as any));
    try {
      const configId = siteConfigIdRef.current;
      if (!configId) return;
      await supabase.from('site_config').update({ fica_mais_party: data }).eq('id', configId);
    } catch (e) { console.error(e); }
  }, []);

  const updateStorytelling = useCallback(async (data: Partial<Storytelling>) => {
    setStorytelling(prev => ({ ...prev, ...data } as any));
    try {
      const configId = siteConfigIdRef.current;
      if (!configId) return;
      await supabase.from('site_config').update({ storytelling: data }).eq('id', configId);
    } catch (e) { console.error(e); }
  }, []);

  const updateHomeSection = useCallback(async (id: string, data: Partial<HomeSection>) => {
    let currentSections: HomeSection[] = [];
    setHomeSections(prev => {
      currentSections = prev.map(s => s.id === id ? { ...s, ...data } : s);
      return currentSections;
    });
    try {
      const configId = siteConfigIdRef.current;
      if (!configId) return;
      await supabase.from('site_config').update({ home_sections: currentSections }).eq('id', configId);
    } catch (e) { console.error(e); }
  }, []);

  const updateContactInfo = useCallback(async (data: Partial<ContactInfo>) => {
    setContactInfo(prev => ({ ...prev, ...data } as any));
    try {
      const cId = contactInfoIdRef.current;
      if (!cId) return;
      await supabase.from('contact_info').update(mapToDB(data)).eq('id', cId);
    } catch (e) { console.error(e); }
  }, []);

  return (
    <DataContext.Provider value={{
      events, addEvent: crudEvents.add, updateEvent: crudEvents.update, deleteEvent: crudEvents.del, getFeaturedEvents, getUpcomingEvents,
      ficaMaisParty, updateFicaMaisParty,
      storytelling, updateStorytelling,
      djs, djSets, playlists, addDJ: crudDjs.add, updateDJ: crudDjs.update, deleteDJ: crudDjs.del, addDJSet: crudDjSets.add, updateDJSet: crudDjSets.update, deleteDJSet: crudDjSets.del, addPlaylist: crudPlaylists.add, updatePlaylist: crudPlaylists.update, deletePlaylist: crudPlaylists.del,
      galleryAlbums, addGalleryAlbum: crudGallery.add, updateGalleryAlbum: crudGallery.update, deleteGalleryAlbum: crudGallery.del,
      products, tickets, addProduct: crudProducts.add, updateProduct: crudProducts.update, deleteProduct: crudProducts.del,
      faqs, addFAQ: crudFaqs.add, updateFAQ: crudFaqs.update, deleteFAQ: crudFaqs.del,
      contactInfo, updateContactInfo,
      contactMessages, addContactMessage: crudMessages.add, updateContactMessage: crudMessages.update, deleteContactMessage: crudMessages.del,
      newsletterSubscribers, addNewsletterSubscriber: crudNewsletter.add, updateNewsletterSubscriber: crudNewsletter.update, deleteNewsletterSubscriber: crudNewsletter.del,
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

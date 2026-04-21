import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
  SiteConfig
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
  storytelling: Storytelling | null;
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

// Chaves do LocalStorage
const STORAGE_KEYS = {
  events: 'qm-events',
  ficaMaisParty: 'qm-fica-mais',
  storytelling: 'qm-storytelling',
  djs: 'qm-djs',
  djSets: 'qm-dj-sets',
  playlists: 'qm-playlists',
  gallery: 'qm-gallery',
  products: 'qm-products',
  tickets: 'qm-tickets',
  faqs: 'qm-faqs',
  contact: 'qm-contact',
  banners: 'qm-banners',
  homeSections: 'qm-home-sections',
  siteConfig: 'qm-site-config'
};

// Dados iniciais
const defaultContactInfo: ContactInfo = {
  email: 'contato@queromaisparty.com.br',
  phone: '(21) 9 7259-6991',
  whatsapp: '(21) 972596991',
  instagram: '@queromaisparty',
  address: 'RIO DE JANEIRO'
};

const defaultSiteConfig: SiteConfig = {
  siteName: { pt: 'Quero Mais', en: 'Want More', es: 'Quiero Más' },
  siteDescription: { 
    pt: 'Experiências únicas e inesquecíveis', 
    en: 'Unique and unforgettable experiences',
    es: 'Experiencias únicas e inolvidables'
  },
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#CCFF00',
  secondaryColor: '#8B5CF6',
  socialLinks: [
    { platform: 'instagram', url: 'https://instagram.com/queromais' },
    { platform: 'whatsapp', url: 'https://wa.me/5511999999999' }
  ],
  seo: {
    title: { pt: 'Quero Mais', en: 'Want More', es: 'Quiero Más' },
    description: { 
      pt: 'Experiências únicas e inesquecíveis',
      en: 'Unique and unforgettable experiences',
      es: 'Experiencias únicas e inolvidables'
    },
    keywords: 'festas, eventos, música, dj, balada',
    ogImage: '/og-image.jpg'
  }
};

const defaultHomeSections: HomeSection[] = [
  {
    id: '1',
    type: 'hero',
    title: { pt: 'QUERO MAIS', en: 'WANT MORE', es: 'QUIERO MÁS' },
    subtitle: { 
      pt: 'Experiências que transcendem',
      en: 'Experiences that transcend',
      es: 'Experiencias que trascienden'
    },
    content: { 
      pt: 'Vive momentos únicos e inesquecíveis com a Quero Mais.',
      en: 'Live unique and unforgettable moments with Quero Mais.',
      es: 'Vive momentos únicos e inolvidables con Quero Más.'
    },
    order: 1,
    status: 'active'
  },
  {
    id: '2',
    type: 'events',
    title: { pt: 'PRÓXIMOS EVENTOS', en: 'UPCOMING EVENTS', es: 'PRÓXIMOS EVENTOS' },
    subtitle: { 
      pt: 'Não perca nossas próximas festas',
      en: 'Don\'t miss our next parties',
      es: 'No te pierdas nuestras próximas fiestas'
    },
    content: { pt: '', en: '', es: '' },
    order: 2,
    status: 'active'
  },
  {
    id: '3',
    type: 'fica_mais',
    title: { pt: 'FICA MAIS PARTY', en: 'FICA MAIS PARTY', es: 'FICA MAIS PARTY' },
    subtitle: { 
      pt: 'O after da Quero Mais',
      en: 'The Quero Mais after party',
      es: 'El after de Quero Más'
    },
    content: { 
      pt: 'A festa continua quando o sol nasce.',
      en: 'The party continues when the sun rises.',
      es: 'La fiesta continúa cuando sale el sol.'
    },
    order: 3,
    status: 'active'
  },
  {
    id: '4',
    type: 'music',
    title: { pt: 'QM MUSIC', en: 'QM MUSIC', es: 'QM MUSIC' },
    subtitle: { 
      pt: 'Sets e playlists dos nossos DJs',
      en: 'Sets and playlists from our DJs',
      es: 'Sets y playlists de nuestros DJs'
    },
    content: { 
      pt: 'Sinta a energia da Quero Mais em qualquer lugar.',
      en: 'Feel the energy of Quero Mais anywhere.',
      es: 'Siente la energía de Quero Más en cualquier lugar.'
    },
    order: 4,
    status: 'active'
  },
  {
    id: '5',
    type: 'voce',
    title: { pt: 'GALERIA', en: 'GALLERY', es: 'GALERÍA' },
    subtitle: { 
      pt: 'Momentos inesquecíveis',
      en: 'Unforgettable moments',
      es: 'Momentos inolvidables'
    },
    content: { 
      pt: 'Reviva os melhores momentos das nossas festas.',
      en: 'Relive the best moments of our parties.',
      es: 'Revive los mejores momentos de nuestras fiestas.'
    },
    order: 5,
    status: 'active'
  }
];

const defaultFAQs: FAQ[] = [
  {
    id: '1',
    question: { 
      pt: 'Como comprar ingressos?',
      en: 'How to buy tickets?',
      es: '¿Cómo comprar entradas?'
    },
    answer: { 
      pt: 'Você pode comprar ingressos através da nossa loja online ou na portaria do evento.',
      en: 'You can buy tickets through our online store or at the event entrance.',
      es: 'Puedes comprar entradas a través de nuestra tienda online o en la entrada del evento.'
    },
    category: 'ingressos',
    order: 1,
    status: 'active'
  },
  {
    id: '2',
    question: { 
      pt: 'Qual é a idade mínima?',
      en: 'What is the minimum age?',
      es: '¿Cuál es la edad mínima?'
    },
    answer: { 
      pt: 'A idade mínima para nossos eventos é 18 anos.',
      en: 'The minimum age for our events is 18 years.',
      es: 'La edad mínima para nuestros eventos es de 18 años.'
    },
    category: 'eventos',
    order: 2,
    status: 'active'
  },
  {
    id: '3',
    question: { 
      pt: 'Como faço para ser DJ residente?',
      en: 'How do I become a resident DJ?',
      es: '¿Cómo puedo ser DJ residente?'
    },
    answer: { 
      pt: 'Envie seu portfolio pelo formulário de contato.',
      en: 'Send your portfolio through the contact form.',
      es: 'Envía tu portfolio a través del formulario de contacto.'
    },
    category: 'music',
    order: 3,
    status: 'active'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Estados
  const [events, setEvents] = useState<Event[]>([]);
  const [ficaMaisParty, setFicaMaisParty] = useState<FicaMaisParty | null>(null);
  const [storytelling, setStorytelling] = useState<Storytelling | null>(null);
  const [djs, setDJs] = useState<DJ[]>([]);
  const [djSets, setDJSets] = useState<DJSet[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [galleryAlbums, setGalleryAlbums] = useState<GalleryAlbum[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>(defaultFAQs);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>(defaultHomeSections);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(defaultSiteConfig);

  // Carregar dados do LocalStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const storedEvents = localStorage.getItem(STORAGE_KEYS.events);
        if (storedEvents) setEvents(JSON.parse(storedEvents));

        const storedFicaMais = localStorage.getItem(STORAGE_KEYS.ficaMaisParty);
        if (storedFicaMais) setFicaMaisParty(JSON.parse(storedFicaMais));

        const storedStory = localStorage.getItem(STORAGE_KEYS.storytelling);
        if (storedStory) setStorytelling(JSON.parse(storedStory));

        const storedDJs = localStorage.getItem(STORAGE_KEYS.djs);
        if (storedDJs) setDJs(JSON.parse(storedDJs));

        const storedSets = localStorage.getItem(STORAGE_KEYS.djSets);
        if (storedSets) setDJSets(JSON.parse(storedSets));

        const storedPlaylists = localStorage.getItem(STORAGE_KEYS.playlists);
        if (storedPlaylists) setPlaylists(JSON.parse(storedPlaylists));

        const storedGallery = localStorage.getItem(STORAGE_KEYS.gallery);
        if (storedGallery) setGalleryAlbums(JSON.parse(storedGallery));

        const storedProducts = localStorage.getItem(STORAGE_KEYS.products);
        if (storedProducts) setProducts(JSON.parse(storedProducts));

        const storedTickets = localStorage.getItem(STORAGE_KEYS.tickets);
        if (storedTickets) setTickets(JSON.parse(storedTickets));

        const storedFaqs = localStorage.getItem(STORAGE_KEYS.faqs);
        if (storedFaqs) setFaqs(JSON.parse(storedFaqs));

        const storedContact = localStorage.getItem(STORAGE_KEYS.contact);
        if (storedContact) {
          const parsed = JSON.parse(storedContact);
          if (parsed.email === 'contato@queromais.com') {
            setContactInfo(defaultContactInfo);
            localStorage.setItem(STORAGE_KEYS.contact, JSON.stringify(defaultContactInfo));
          } else {
            setContactInfo(parsed);
          }
        }

        const storedBanners = localStorage.getItem(STORAGE_KEYS.banners);
        if (storedBanners) setBanners(JSON.parse(storedBanners));

        const storedSections = localStorage.getItem(STORAGE_KEYS.homeSections);
        if (storedSections) setHomeSections(JSON.parse(storedSections));

        const storedConfig = localStorage.getItem(STORAGE_KEYS.siteConfig);
        if (storedConfig) setSiteConfig(JSON.parse(storedConfig));
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Helpers para salvar no LocalStorage
  const saveToStorage = useCallback((key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  }, []);

  // Eventos
  const addEvent = useCallback((event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      saveToStorage(STORAGE_KEYS.events, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateEvent = useCallback((id: string, eventData: Partial<Event>) => {
    setEvents(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...eventData, updatedAt: new Date().toISOString() } : e);
      saveToStorage(STORAGE_KEYS.events, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage(STORAGE_KEYS.events, updated);
      return updated;
    });
  }, [saveToStorage]);

  const getFeaturedEvents = useCallback(() => {
    return events.filter(e => e.featured && e.status === 'active');
  }, [events]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return events
      .filter(e => new Date(e.date) >= now && e.status === 'active')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  // Fica Mais Party
  const updateFicaMaisParty = useCallback((data: Partial<FicaMaisParty>) => {
    setFicaMaisParty(prev => {
      const updated = prev ? { ...prev, ...data } : { 
        showInHome: true,
        isActivePage: true,
        manifestoCurto: { pt: '', en: '', es: '' },
        manifestoCompleto: { pt: '', en: '', es: '' },
        homeMedia: '',
        pageMedia: '',
        upcomingDates: [],
        ...data 
      } as FicaMaisParty;
      saveToStorage(STORAGE_KEYS.ficaMaisParty, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Storytelling
  const updateStorytelling = useCallback((data: Partial<Storytelling>) => {
    setStorytelling(prev => {
      const updated = prev ? { ...prev, ...data } : { ...data, id: '1' } as Storytelling;
      saveToStorage(STORAGE_KEYS.storytelling, updated);
      return updated;
    });
  }, [saveToStorage]);

  // DJs
  const addDJ = useCallback((dj: Omit<DJ, 'id'>) => {
    const newDJ: DJ = { ...dj, id: Date.now().toString() };
    setDJs(prev => {
      const updated = [...prev, newDJ];
      saveToStorage(STORAGE_KEYS.djs, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateDJ = useCallback((id: string, djData: Partial<DJ>) => {
    setDJs(prev => {
      const updated = prev.map(d => d.id === id ? { ...d, ...djData } : d);
      saveToStorage(STORAGE_KEYS.djs, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteDJ = useCallback((id: string) => {
    setDJs(prev => {
      const updated = prev.filter(d => d.id !== id);
      saveToStorage(STORAGE_KEYS.djs, updated);
      return updated;
    });
  }, [saveToStorage]);

  // DJ Sets
  const addDJSet = useCallback((set: Omit<DJSet, 'id' | 'createdAt'>) => {
    const newSet: DJSet = {
      ...set,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDJSets(prev => {
      const updated = [...prev, newSet];
      saveToStorage(STORAGE_KEYS.djSets, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateDJSet = useCallback((id: string, setData: Partial<DJSet>) => {
    setDJSets(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...setData } : s);
      saveToStorage(STORAGE_KEYS.djSets, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteDJSet = useCallback((id: string) => {
    setDJSets(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveToStorage(STORAGE_KEYS.djSets, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Galeria
  const addGalleryAlbum = useCallback((album: Omit<GalleryAlbum, 'id' | 'createdAt'>) => {
    const newAlbum: GalleryAlbum = {
      ...album,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGalleryAlbums(prev => {
      const updated = [...prev, newAlbum];
      saveToStorage(STORAGE_KEYS.gallery, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateGalleryAlbum = useCallback((id: string, albumData: Partial<GalleryAlbum>) => {
    setGalleryAlbums(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...albumData } : a);
      saveToStorage(STORAGE_KEYS.gallery, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteGalleryAlbum = useCallback((id: string) => {
    setGalleryAlbums(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveToStorage(STORAGE_KEYS.gallery, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Produtos
  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => {
      const updated = [...prev, newProduct];
      saveToStorage(STORAGE_KEYS.products, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateProduct = useCallback((id: string, productData: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...productData } : p);
      saveToStorage(STORAGE_KEYS.products, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveToStorage(STORAGE_KEYS.products, updated);
      return updated;
    });
  }, [saveToStorage]);

  // FAQ
  const addFAQ = useCallback((faq: Omit<FAQ, 'id'>) => {
    const newFAQ: FAQ = { ...faq, id: Date.now().toString() };
    setFaqs(prev => {
      const updated = [...prev, newFAQ];
      saveToStorage(STORAGE_KEYS.faqs, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateFAQ = useCallback((id: string, faqData: Partial<FAQ>) => {
    setFaqs(prev => {
      const updated = prev.map(f => f.id === id ? { ...f, ...faqData } : f);
      saveToStorage(STORAGE_KEYS.faqs, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteFAQ = useCallback((id: string) => {
    setFaqs(prev => {
      const updated = prev.filter(f => f.id !== id);
      saveToStorage(STORAGE_KEYS.faqs, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Contato
  const updateContactInfo = useCallback((info: Partial<ContactInfo>) => {
    setContactInfo(prev => {
      const updated = { ...prev, ...info };
      saveToStorage(STORAGE_KEYS.contact, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Banners
  const addBanner = useCallback((banner: Omit<Banner, 'id'>) => {
    const newBanner: Banner = { ...banner, id: Date.now().toString() };
    setBanners(prev => {
      const updated = [...prev, newBanner];
      saveToStorage(STORAGE_KEYS.banners, updated);
      return updated;
    });
  }, [saveToStorage]);

  const updateBanner = useCallback((id: string, bannerData: Partial<Banner>) => {
    setBanners(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...bannerData } : b);
      saveToStorage(STORAGE_KEYS.banners, updated);
      return updated;
    });
  }, [saveToStorage]);

  const deleteBanner = useCallback((id: string) => {
    setBanners(prev => {
      const updated = prev.filter(b => b.id !== id);
      saveToStorage(STORAGE_KEYS.banners, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Home Sections
  const updateHomeSection = useCallback((id: string, sectionData: Partial<HomeSection>) => {
    setHomeSections(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...sectionData } : s);
      saveToStorage(STORAGE_KEYS.homeSections, updated);
      return updated;
    });
  }, [saveToStorage]);

  // Site Config
  const updateSiteConfig = useCallback((config: Partial<SiteConfig>) => {
    setSiteConfig(prev => {
      const updated = { ...prev, ...config };
      saveToStorage(STORAGE_KEYS.siteConfig, updated);
      return updated;
    });
  }, [saveToStorage]);

  return (
    <DataContext.Provider value={{
      events, addEvent, updateEvent, deleteEvent, getFeaturedEvents, getUpcomingEvents,
      ficaMaisParty, updateFicaMaisParty,
      storytelling, updateStorytelling,
      djs, djSets, playlists, addDJ, updateDJ, deleteDJ, addDJSet, updateDJSet, deleteDJSet,
      galleryAlbums, addGalleryAlbum, updateGalleryAlbum, deleteGalleryAlbum,
      products, tickets, addProduct, updateProduct, deleteProduct,
      faqs, addFAQ, updateFAQ, deleteFAQ,
      contactInfo, updateContactInfo,
      banners, addBanner, updateBanner, deleteBanner,
      homeSections, updateHomeSection,
      siteConfig, updateSiteConfig
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

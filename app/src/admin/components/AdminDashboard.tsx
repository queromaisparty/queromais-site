import { 
  LayoutDashboard, 
  Calendar, 
  Moon, 
  BookOpen, 
  Music, 
  Image, 
  ShoppingBag, 
  Mail,
  HelpCircle,
  Settings,
  LogOut,
  Users,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { AdminGallery } from './AdminGallery';
import { AdminEvents } from './AdminEvents';
import { AdminShop } from './AdminShop';
import { AdminMusic } from './AdminMusic';
import { AdminSobre } from './AdminSobre';
import { AdminFicaMais } from './AdminFicaMais';
import { AdminContact } from './AdminContact';
import { AdminNewsletter } from './AdminNewsletter';
import { AdminFAQ } from './AdminFAQ';
import { AdminSettings } from './AdminSettings';

type AdminSection = 
  | 'dashboard'
  | 'events'
  | 'fica-mais'
  | 'storytelling'
  | 'music'
  | 'gallery'
  | 'shop'
  | 'contact'
  | 'faq'
  | 'newsletter'
  | 'settings';

interface AdminDashboardProps {
  currentSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

export function AdminDashboard({ currentSection, onSectionChange, onLogout }: AdminDashboardProps) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const { events, products, galleryAlbums, djs } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Se o AuthContext disser que a sessão não existe (ou expirou), force o logout
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onLogout();
    }
  }, [isLoading, isAuthenticated, onLogout]);

  const handleLogout = () => {
    logout();
    onLogout();
    toast.success(t({ pt: 'Logout realizado com sucesso', en: 'Logout successful', es: 'Cierre de sesión exitoso' }));
  };

  const menuItems = [
    { id: 'dashboard',    label: { pt: 'Dashboard',       en: 'Dashboard',    es: 'Panel'        }, icon: LayoutDashboard },
    { id: 'events',       label: { pt: 'Eventos',          en: 'Events',       es: 'Eventos'      }, icon: Calendar },
    { id: 'fica-mais',    label: { pt: 'Fica Mais Party',  en: 'Fica Mais',    es: 'Fica Mais'    }, icon: Moon },
    { id: 'storytelling', label: { pt: 'Storytelling',     en: 'Storytelling', es: 'Storytelling' }, icon: BookOpen },
    { id: 'music',        label: { pt: 'QM Music',         en: 'QM Music',     es: 'QM Music'     }, icon: Music },
    { id: 'gallery',      label: { pt: 'Você na QM',       en: 'You at QM',    es: 'Usted en QM'  }, icon: Image },
    { id: 'shop',         label: { pt: 'Loja',             en: 'Shop',         es: 'Tienda'       }, icon: ShoppingBag },
    { id: 'contact',      label: { pt: 'Contato',          en: 'Contact',      es: 'Contacto'     }, icon: Mail },
    { id: 'newsletter',   label: { pt: 'Newsletter',       en: 'Newsletter',   es: 'Boletín'      }, icon: Mail },
    { id: 'faq',          label: { pt: 'FAQ',              en: 'FAQ',          es: 'FAQ'          }, icon: HelpCircle },
    { id: 'settings',     label: { pt: 'Configurações',    en: 'Settings',     es: 'Configuración'}, icon: Settings },
  ];

  const stats = [
    { label: { pt: 'Eventos', en: 'Events', es: 'Eventos' },        value: events.length,       icon: Calendar,     gradient: 'from-admin-accent to-[#FF6BB5]' },
    { label: { pt: 'Produtos', en: 'Products', es: 'Productos' },   value: products.length,     icon: ShoppingBag,  gradient: 'from-purple-600 to-purple-400' },
    { label: { pt: 'Álbuns', en: 'Albums', es: 'Álbumes' },         value: galleryAlbums.length, icon: Image,        gradient: 'from-sky-500 to-sky-400' },
    { label: { pt: 'DJs', en: 'DJs', es: 'DJs' },                   value: djs.length,          icon: Music,        gradient: 'from-amber-500 to-amber-300' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* ── MOBILE TOPBAR ─────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-16 flex items-center px-4 gap-4 bg-white border-b border-slate-200">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors" aria-label="Menu">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <img src="/LOGOQUEROMAIS_PRETA.svg" alt="QM" className="h-4 w-auto" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</span>
      </div>

      {/* ── SIDEBAR BACKDROP (mobile) ───────────── */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200 transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } shadow-sm h-[100dvh]`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div>
              <img 
                src="/LOGOQUEROMAIS_PRETA.svg" 
                alt="Quero Mais" 
                className="h-4 w-auto mb-1.5"
              />
              <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onSectionChange(item.id as AdminSection); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all text-sm font-medium border-l-4 ${
                  isActive 
                    ? 'bg-slate-50 text-admin-accent border-admin-accent' 
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:border-none'
                }`}
              >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-admin-accent' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`} />
                <span>{t(item.label)}</span>
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-admin-accent to-[#FF6BB5] text-white shadow-sm">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-red-600 bg-red-50 hover:bg-red-100"
          >
            <LogOut className="w-4 h-4" />
            <span>{t({ pt: 'Encerrar Sessão', en: 'Logout', es: 'Salir' })}</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <main className="flex-1 h-[100dvh] overflow-x-hidden overflow-y-auto pt-16 lg:pt-0 scroll-smooth">
        
        {/* DASHBOARD */}
        {currentSection === 'dashboard' && (
          <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {t({ pt: 'Bom dia', en: 'Good morning', es: 'Buenos días' })} 👋
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">
                {t({ pt: 'Visão geral do sistema e atalhos rápidos', en: 'System overview and shortcuts', es: 'Visión general del sistema y atajos' })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-xl p-6 bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                    <p className="text-sm font-medium text-slate-500 tracking-wide mt-1 uppercase">{t(stat.label)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6">
                {t({ pt: 'Ações Frequentes', en: 'Quick Actions', es: 'Acciones Rápidas' })}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-6">
                {[
                  { section: 'events',  label: { pt: 'Novo Evento',    en: 'New Event',    es: 'Nuevo Evento'   }, desc: { pt: 'Publicar e gerenciar ingressos', en: 'Publish and manage tickets', es: 'Publicar y gestionar entradas' }, icon: Calendar },
                  { section: 'gallery', label: { pt: 'Upload de Fotos', en: 'Upload Photos', es: 'Subir Fotos'  }, desc: { pt: 'Adicionar álbuns à galeria',     en: 'Add albums to gallery',           es: 'Agregar álbumes a la galería'   }, icon: Image },
                  { section: 'shop',    label: { pt: 'Novo Produto',    en: 'New Product',  es: 'Nuevo Producto' }, desc: { pt: 'Cadastrar na loja boutique',       en: 'Register in boutique',        es: 'Registrar en boutique'    }, icon: ShoppingBag },
                ].map((action) => (
                  <button
                    key={action.section}
                    onClick={() => onSectionChange(action.section as AdminSection)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-admin-accent hover:shadow-sm transition-all group text-left"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-slate-100 group-hover:bg-pink-50 transition-colors">
                      <action.icon className="w-5 h-5 text-slate-400 group-hover:text-admin-accent transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{t(action.label)}</p>
                      <p className="text-xs text-slate-500 truncate">{t(action.desc)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-admin-accent transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SEÇÕES */}
        {currentSection === 'events' && <AdminEvents />}
        {currentSection === 'shop' && <div className="p-6 lg:p-10 max-w-7xl mx-auto"><AdminShop /></div>}
        {currentSection === 'music' && <AdminMusic />}
        {currentSection === 'storytelling' && <AdminSobre />}
        {currentSection === 'fica-mais' && <AdminFicaMais />}
        {currentSection === 'contact' && <AdminContact />}
        {currentSection === 'newsletter' && <AdminNewsletter />}
        {currentSection === 'gallery' && <div className="p-6 lg:p-10 max-w-7xl mx-auto"><AdminGallery /></div>}
        {currentSection === 'faq' && <AdminFAQ />}
        {currentSection === 'settings' && <AdminSettings />}

      </main>
    </div>
  );
}

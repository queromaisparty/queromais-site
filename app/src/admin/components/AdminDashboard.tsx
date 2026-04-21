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
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { AdminGallery } from './AdminGallery';
import { AdminEvents } from './AdminEvents';
import { AdminShop } from './AdminShop';
import { AdminMusic } from './AdminMusic';
import { AdminSobre } from './AdminSobre';
import { AdminFicaMais } from './AdminFicaMais';
import { AdminContact } from './AdminContact';

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
  | 'settings';

interface AdminDashboardProps {
  currentSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
}

// ── Paleta magenta ──────────────────────────────────
// Primária: #E91E8C (magenta vibrante)
// Hover:    #C4157A
// Fundo:    #F5F5F7 (cinza-branco Apple-like)
// Sidebar:  #FFFFFF
// Border:   #E8E8ED
// Texto:    #1A1A2E

export function AdminDashboard({ currentSection, onSectionChange, onLogout }: AdminDashboardProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { events, products, galleryAlbums, djs } = useData();

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
    { id: 'faq',          label: { pt: 'FAQ',              en: 'FAQ',          es: 'FAQ'          }, icon: HelpCircle },
    { id: 'settings',     label: { pt: 'Configurações',    en: 'Settings',     es: 'Configuración'}, icon: Settings },
  ];

  const stats = [
    { label: { pt: 'Eventos', en: 'Events', es: 'Eventos' },        value: events.length,       icon: Calendar,     gradient: 'from-[#E91E8C] to-[#FF6BB5]' },
    { label: { pt: 'Produtos', en: 'Products', es: 'Productos' },   value: products.length,     icon: ShoppingBag,  gradient: 'from-[#7C3AED] to-[#A78BFA]' },
    { label: { pt: 'Álbuns', en: 'Albums', es: 'Álbumes' },         value: galleryAlbums.length, icon: Image,        gradient: 'from-[#0EA5E9] to-[#38BDF8]' },
    { label: { pt: 'DJs', en: 'DJs', es: 'DJs' },                   value: djs.length,          icon: Music,        gradient: 'from-[#F59E0B] to-[#FCD34D]' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F5F7' }}>

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{
          background: '#FFFFFF',
          borderRight: '1px solid #E8E8ED',
          boxShadow: '2px 0 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: '#E8E8ED' }}>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #FF6BB5)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight" style={{ color: '#1A1A2E' }}>
                QUERO <span style={{ color: '#E91E8C' }}>MAIS</span>
              </h1>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id as AdminSection)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm font-medium"
                style={{
                  background: isActive ? '#FCE7F3' : 'transparent',
                  color: isActive ? '#E91E8C' : '#6B7280',
                  borderLeft: isActive ? '3px solid #E91E8C' : '3px solid transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = '#FDF2F8';
                    (e.currentTarget as HTMLElement).style.color = '#E91E8C';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = '#6B7280';
                  }
                }}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{t(item.label)}</span>
              </button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t space-y-1" style={{ borderColor: '#E8E8ED' }}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E91E8C, #FF6BB5)' }}
            >
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: '#1A1A2E' }}>{user?.name}</p>
              <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ color: '#EF4444' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <LogOut className="w-4 h-4" />
            <span>{t({ pt: 'Sair', en: 'Logout', es: 'Salir' })}</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <main className="flex-1 overflow-auto">

        {/* DASHBOARD */}
        {currentSection === 'dashboard' && (
          <div className="p-8 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                {t({ pt: 'Bom dia', en: 'Good morning', es: 'Buenos días' })} 👋
              </h2>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                {t({ pt: 'Visão geral do seu site', en: 'Overview of your website', es: 'Visión general de tu sitio' })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E8ED',
                    boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4`}
                  >
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-black" style={{ color: '#1A1A2E' }}>{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9CA3AF' }}>{t(stat.label)}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#FFFFFF', border: '1px solid #E8E8ED', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
            >
              <h3 className="text-base font-bold mb-5" style={{ color: '#1A1A2E' }}>
                {t({ pt: 'Ações Rápidas', en: 'Quick Actions', es: 'Acciones Rápidas' })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { section: 'events',  label: { pt: 'Novo Evento',    en: 'New Event',    es: 'Nuevo Evento'   }, desc: { pt: 'Criar e publicar evento', en: 'Create and publish event', es: 'Crear y publicar evento' }, icon: Calendar },
                  { section: 'gallery', label: { pt: 'Upload de Fotos', en: 'Upload Photos', es: 'Subir Fotos'  }, desc: { pt: 'Adicionar à galeria',     en: 'Add to gallery',           es: 'Agregar a la galería'   }, icon: Image },
                  { section: 'shop',    label: { pt: 'Novo Produto',    en: 'New Product',  es: 'Nuevo Producto' }, desc: { pt: 'Cadastrar na loja',       en: 'Register in store',        es: 'Registrar en tienda'    }, icon: ShoppingBag },
                ].map((action) => (
                  <button
                    key={action.section}
                    onClick={() => onSectionChange(action.section as AdminSection)}
                    className="flex items-center gap-4 p-4 rounded-xl text-left transition-all group"
                    style={{ background: '#F9FAFB', border: '1px solid #E8E8ED' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#FDF2F8';
                      (e.currentTarget as HTMLElement).style.borderColor = '#F9A8D4';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = '#F9FAFB';
                      (e.currentTarget as HTMLElement).style.borderColor = '#E8E8ED';
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: '#FCE7F3' }}
                    >
                      <action.icon className="w-4 h-4" style={{ color: '#E91E8C' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{t(action.label)}</p>
                      <p className="text-xs" style={{ color: '#9CA3AF' }}>{t(action.desc)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: '#D1D5DB' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECÇÕES EM DESENVOLVIMENTO (Restantes) */}
        {currentSection !== 'dashboard' &&
          currentSection !== 'gallery' &&
          currentSection !== 'events' &&
          currentSection !== 'shop' &&
          currentSection !== 'music' &&
          currentSection !== 'storytelling' &&
          currentSection !== 'fica-mais' &&
          currentSection !== 'contact' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                {t(menuItems.find(i => i.id === currentSection)?.label || { pt: 'Seção', en: 'Section', es: 'Sección' })}
              </h2>
              <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
                {t({ pt: 'Gerencie esta seção do site', en: 'Manage this section', es: 'Gestiona esta sección' })}
              </p>
            </div>
            <div
              className="rounded-2xl p-12 text-center"
              style={{ background: '#FFFFFF', border: '1px solid #E8E8ED' }}
            >
              <div
                className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
                style={{ background: '#FCE7F3' }}
              >
                <Settings className="w-8 h-8" style={{ color: '#E91E8C' }} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A2E' }}>
                {t({ pt: 'Em Desenvolvimento', en: 'Under Development', es: 'En Desarrollo' })}
              </h3>
              <p className="text-sm max-w-sm mx-auto" style={{ color: '#9CA3AF' }}>
                {t({
                  pt: 'Esta funcionalidade está sendo implementada e em breve estará disponível.',
                  en: 'This feature is being implemented and will be available soon.',
                  es: 'Esta funcionalidad está siendo implementada y estará disponible pronto.',
                })}
              </p>
            </div>
          </div>
        )}

        {/* EVENTOS */}
        {currentSection === 'events' && (
          <AdminEvents />
        )}

        {/* LOJA */}
        {currentSection === 'shop' && (
          <AdminShop />
        )}

        {/* MUSIC */}
        {currentSection === 'music' && (
          <AdminMusic />
        )}

        {/* SOBRE / STORYTELLING */}
        {currentSection === 'storytelling' && (
          <AdminSobre />
        )}

        {/* FICA MAIS */}
        {currentSection === 'fica-mais' && (
          <AdminFicaMais />
        )}

        {/* CONTACT / FAQ */}
        {currentSection === 'contact' && (
          <AdminContact />
        )}

        {/* GALERIA */}
        {currentSection === 'gallery' && (
          <div className="p-8">
            <AdminGallery />
          </div>
        )}
      </main>
    </div>
  );
}

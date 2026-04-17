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

export function AdminDashboard({ currentSection, onSectionChange, onLogout }: AdminDashboardProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { events, products, galleryAlbums, djs } = useData();

  const handleLogout = () => {
    logout();
    onLogout();
    toast.success(t({
      pt: 'Logout realizado com sucesso',
      en: 'Logout successful',
      es: 'Cierre de sesión exitoso'
    }));
  };

  const menuItems = [
    { id: 'dashboard', label: { pt: 'Dashboard', en: 'Dashboard', es: 'Panel' }, icon: LayoutDashboard },
    { id: 'events', label: { pt: 'Eventos', en: 'Events', es: 'Eventos' }, icon: Calendar },
    { id: 'fica-mais', label: { pt: 'Fica Mais Party', en: 'Fica Mais Party', es: 'Fica Mais Party' }, icon: Moon },
    { id: 'storytelling', label: { pt: 'Storytelling', en: 'Storytelling', es: 'Storytelling' }, icon: BookOpen },
    { id: 'music', label: { pt: 'QM Music', en: 'QM Music', es: 'QM Music' }, icon: Music },
    { id: 'gallery', label: { pt: 'Galeria', en: 'Gallery', es: 'Galería' }, icon: Image },
    { id: 'shop', label: { pt: 'Loja', en: 'Shop', es: 'Tienda' }, icon: ShoppingBag },
    { id: 'contact', label: { pt: 'Contato', en: 'Contact', es: 'Contacto' }, icon: Mail },
    { id: 'faq', label: { pt: 'FAQ', en: 'FAQ', es: 'FAQ' }, icon: HelpCircle },
    { id: 'settings', label: { pt: 'Configurações', en: 'Settings', es: 'Configuración' }, icon: Settings },
  ];

  const stats = [
    { 
      label: { pt: 'Total de Eventos', en: 'Total Events', es: 'Total de Eventos' }, 
      value: events.length,
      icon: Calendar,
      color: 'bg-[#CCFF00]'
    },
    { 
      label: { pt: 'Produtos', en: 'Products', es: 'Productos' }, 
      value: products.length,
      icon: ShoppingBag,
      color: 'bg-[#8B5CF6]'
    },
    { 
      label: { pt: 'Álbuns', en: 'Albums', es: 'Álbumes' }, 
      value: galleryAlbums.length,
      icon: Image,
      color: 'bg-pink-500'
    },
    { 
      label: { pt: 'DJs', en: 'DJs', es: 'DJs' }, 
      value: djs.length,
      icon: Music,
      color: 'bg-blue-500'
    },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 border-r border-white/10 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-white">
            QUERO <span className="text-[#CCFF00]">MAIS</span>
          </h1>
          <p className="text-white/40 text-xs mt-1">
            {t({ pt: 'Painel Admin', en: 'Admin Panel', es: 'Panel Admin' })}
          </p>
        </div>

        <nav className="px-4 pb-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id as AdminSection)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all mb-1 ${
                currentSection === item.id
                  ? 'bg-[#CCFF00] text-black'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{t(item.label)}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-[#CCFF00] rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-white/40 text-sm truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">{t({ pt: 'Sair', en: 'Logout', es: 'Salir' })}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentSection === 'dashboard' && (
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {t({ pt: 'Dashboard', en: 'Dashboard', es: 'Panel' })}
              </h2>
              <p className="text-white/50">
                {t({ 
                  pt: 'Visão geral do seu site',
                  en: 'Overview of your website',
                  es: 'Visión general de tu sitio web'
                })}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-black" />
                  </div>
                  <p className="text-white/50 text-sm mb-1">{t(stat.label)}</p>
                  <p className="text-white text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white text-xl font-bold mb-6">
                {t({ pt: 'Ações Rápidas', en: 'Quick Actions', es: 'Acciones Rápidas' })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { 
                    section: 'events', 
                    label: { pt: 'Adicionar Evento', en: 'Add Event', es: 'Agregar Evento' },
                    desc: { pt: 'Criar novo evento', en: 'Create new event', es: 'Crear nuevo evento' }
                  },
                  { 
                    section: 'gallery', 
                    label: { pt: 'Upload de Fotos', en: 'Upload Photos', es: 'Subir Fotos' },
                    desc: { pt: 'Adicionar fotos à galeria', en: 'Add photos to gallery', es: 'Agregar fotos a la galería' }
                  },
                  { 
                    section: 'shop', 
                    label: { pt: 'Novo Produto', en: 'New Product', es: 'Nuevo Producto' },
                    desc: { pt: 'Cadastrar produto na loja', en: 'Register product in store', es: 'Registrar producto en tienda' }
                  },
                ].map((action) => (
                  <button
                    key={action.section}
                    onClick={() => onSectionChange(action.section as AdminSection)}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <div>
                      <p className="text-white font-bold">{t(action.label)}</p>
                      <p className="text-white/50 text-sm">{t(action.desc)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentSection !== 'dashboard' && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {t(menuItems.find(i => i.id === currentSection)?.label || { pt: 'Seção', en: 'Section', es: 'Sección' })}
                </h2>
                <p className="text-white/50">
                  {t({ 
                    pt: 'Gerencie esta seção do site',
                    en: 'Manage this section of the website',
                    es: 'Gestiona esta sección del sitio web'
                  })}
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#CCFF00]/10 rounded-full flex items-center justify-center">
                <Settings className="w-10 h-10 text-[#CCFF00]" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">
                {t({ pt: 'Em Desenvolvimento', en: 'Under Development', es: 'En Desarrollo' })}
              </h3>
              <p className="text-white/50 max-w-md mx-auto">
                {t({
                  pt: 'Esta funcionalidade está sendo implementada. Em breve você poderá gerenciar esta seção completamente.',
                  en: 'This feature is being implemented. Soon you will be able to manage this section completely.',
                  es: 'Esta funcionalidad está siendo implementada. Pronto podrás gestionar esta sección completamente.'
                })}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

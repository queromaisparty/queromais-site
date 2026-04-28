import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider, useData } from '@/context/DataContext';

import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { ScrollToTop } from '@/components/ScrollToTop';
import { HomePage } from '@/pages/HomePage';
import { EventosPage } from '@/pages/EventosPage';
import { EventoDetalhePage } from '@/pages/EventoDetalhePage';
import { FicaMaisPage } from '@/pages/FicaMaisPage';
import { SobrePage } from '@/pages/SobrePage';
import { MusicPage } from '@/pages/MusicPage';
import { VoceNaQMPage } from '@/pages/VoceNaQMPage';
import { ShopPage } from '@/pages/ShopPage';
import { ContactPage } from '@/pages/ContactPage';
import { FAQPage } from '@/pages/FAQPage';

import { AdminLogin } from '@/admin/components/AdminLogin';
import { AdminDashboard } from '@/admin/components/AdminDashboard';
import './App.css';

type View = 'website' | 'admin-login' | 'admin-dashboard';
type AdminSection =
  | 'dashboard'
  | 'home'
  | 'events'
  | 'fica-mais'
  | 'sobre'
  | 'qm-music'
  | 'voce-na-qm'
  | 'shop'
  | 'contact'
  | 'faq'
  | 'header'
  | 'footer'
  | 'seo'
  | 'banners'
  | 'social'
  | 'users'
  | 'logs'
  | 'settings';

const toasterStyle = {
  style: {
    background: '#1a1a1a',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
  },
};

function SiteEngine() {
  const { siteConfig } = useData();

  useEffect(() => {
    if (!siteConfig) return;

    // 1. Atualizar SEO (Title e Meta Description)
    const title = siteConfig.seo?.title?.pt || siteConfig.siteName?.pt || 'Quero Mais';
    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', siteConfig.seo?.description?.pt || siteConfig.siteDescription?.pt || '');

    // 2. Atualizar CSS Variables Globais (Variáveis de Cor)
    const root = document.documentElement;
    root.style.setProperty('--primary-color', siteConfig.primaryColor || 'var(--primary-color, #E91E8C)');
    root.style.setProperty('--secondary-color', siteConfig.secondaryColor || '#8B5CF6');
  }, [siteConfig]);

  return null;
}

function AdminRouteHandler({ onTrigger }: { onTrigger: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Quando acessar a rota /admin, limpa a URL via React Router
    // e muda o estado (view) para mostrar o login
    navigate('/', { replace: true });
    onTrigger();
  }, [navigate, onTrigger]);

  return null;
}

function App() {
  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem('@QueroMais:view') as View) || 'website';
  });
  const [adminSection, setAdminSection] = useState<AdminSection>(() => {
    return (localStorage.getItem('@QueroMais:adminSection') as AdminSection) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('@QueroMais:view', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('@QueroMais:adminSection', adminSection);
  }, [adminSection]);

  const handleAdminRoute = () => {
    setCurrentView(prev => prev === 'admin-dashboard' ? 'admin-dashboard' : 'admin-login');
  };

  const handleAdminClick = () => setCurrentView('admin-login');
  const handleAdminLogin = () => setCurrentView('admin-dashboard');
  const handleAdminLogout = () => {
    setCurrentView('website');
    setAdminSection('dashboard');
  };

  // ── SITE PÚBLICO ──────────────────────────────
  if (currentView === 'website') {
    return (
      <LanguageProvider>
        <DataProvider>
          <SiteEngine />
          <ScrollToTop />
          <Toaster position="top-center" toastOptions={toasterStyle} />
          <Routes>
            <Route element={<WebsiteLayout onAdminClick={handleAdminClick} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/eventos/:slug" element={<EventoDetalhePage />} />
              <Route path="/fica-mais" element={<FicaMaisPage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/vocenaqm" element={<VoceNaQMPage />} />
              <Route path="/loja" element={<ShopPage />} />
              <Route path="/contato" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/admin" element={<AdminRouteHandler onTrigger={handleAdminRoute} />} />
            </Route>
          </Routes>
        </DataProvider>
      </LanguageProvider>
    );
  }

  // ── ADMIN LOGIN ───────────────────────────────
  if (currentView === 'admin-login') {
    return (
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <SiteEngine />
            <div className="min-h-screen bg-[#0A0A0A] text-white">
              <Toaster position="top-center" toastOptions={toasterStyle} />
              <button
                onClick={() => setCurrentView('website')}
                className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-sans"
              >
                ← Voltar ao Site
              </button>
              <AdminLogin onLogin={handleAdminLogin} />
            </div>
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    );
  }

  // ── ADMIN DASHBOARD ───────────────────────────
  if (currentView === 'admin-dashboard') {
    return (
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <SiteEngine />
            <div className="min-h-screen bg-[#0A0A0A] text-white">
              <Toaster position="top-center" toastOptions={toasterStyle} />
              <AdminDashboard
                currentSection={adminSection as Parameters<typeof AdminDashboard>[0]['currentSection']}
                onSectionChange={(s) => setAdminSection(s as AdminSection)}
                onLogout={handleAdminLogout}
                onGoToSite={() => setCurrentView('website')}
              />
            </div>
          </LanguageProvider>
        </DataProvider>
      </AuthProvider>
    );
  }

  return null;
}

export default App;

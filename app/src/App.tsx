import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';

import { WebsiteLayout } from '@/components/layout/WebsiteLayout';
import { HomePage } from '@/pages/HomePage';
import { EventosPage } from '@/pages/EventosPage';
import { FicaMaisPage } from '@/pages/FicaMaisPage';
import { SobrePage } from '@/pages/SobrePage';
import { MusicPage } from '@/pages/MusicPage';
import { VoceNaQMPage } from '@/pages/VoceNaQMPage';
import { ShopPage } from '@/pages/ShopPage';
import { ContactPage } from '@/pages/ContactPage';

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

function App() {
  const [currentView, setCurrentView] = useState<View>('website');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');

  useEffect(() => {
    if (window.location.pathname === '/admin') {
      window.history.replaceState(null, '', '/');
      setCurrentView('admin-login');
    }
  }, []);

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
          <Toaster position="top-center" toastOptions={toasterStyle} />
          <Routes>
            <Route element={<WebsiteLayout onAdminClick={handleAdminClick} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/eventos" element={<EventosPage />} />
              <Route path="/fica-mais" element={<FicaMaisPage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/music" element={<MusicPage />} />
              <Route path="/vocenaqm" element={<VoceNaQMPage />} />
              <Route path="/loja" element={<ShopPage />} />
              <Route path="/contato" element={<ContactPage />} />
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
            <div className="min-h-screen bg-[#0A0A0A] text-white">
              <Toaster position="top-center" toastOptions={toasterStyle} />
              <AdminDashboard
                currentSection={adminSection as Parameters<typeof AdminDashboard>[0]['currentSection']}
                onSectionChange={(s) => setAdminSection(s as AdminSection)}
                onLogout={handleAdminLogout}
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

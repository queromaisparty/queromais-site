import { useState } from 'react';
import { Toaster } from 'sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/sections/HeroSection';
import { EventsSection } from '@/sections/EventsSection';
import { FicaMaisSection } from '@/sections/FicaMaisSection';
import { SobreSection } from '@/sections/SobreSection';
import { MusicSection } from '@/sections/MusicSection';
import { VoceSection } from '@/sections/VoceSection';
import { ShopSection } from '@/sections/ShopSection';
import { ContactSection } from '@/sections/ContactSection';
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
          <div className="min-h-screen bg-white text-black">
            <Toaster position="top-center" toastOptions={toasterStyle} />
            <Header />
            <main className="pt-14 lg:pt-16">
              <HeroSection />
              <EventsSection />
              <FicaMaisSection />
              <SobreSection />
              <MusicSection />
              <VoceSection />
              <ShopSection />
              <ContactSection />
            </main>
            <Footer onAdminClick={handleAdminClick} />
          </div>
        </DataProvider>
      </LanguageProvider>
    );
  }

  // ── ADMIN LOGIN ───────────────────────────────
  if (currentView === 'admin-login') {
    return (
      <AuthProvider>
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

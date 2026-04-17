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
import { StorytellingSection } from '@/sections/StorytellingSection';
import { MusicSection } from '@/sections/MusicSection';
import { GallerySection } from '@/sections/GallerySection';
import { ShopSection } from '@/sections/ShopSection';
import { ContactSection } from '@/sections/ContactSection';
import { AdminLogin } from '@/admin/components/AdminLogin';
import { AdminDashboard } from '@/admin/components/AdminDashboard';
import './App.css';

type View = 'website' | 'admin-login' | 'admin-dashboard';
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

function App() {
  const [currentView, setCurrentView] = useState<View>('website');
  const [adminSection, setAdminSection] = useState<AdminSection>('dashboard');

  const handleAdminClick = () => {
    setCurrentView('admin-login');
  };

  const handleAdminLogin = () => {
    setCurrentView('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setCurrentView('website');
    setAdminSection('dashboard');
  };

  const handleSectionChange = (section: AdminSection) => {
    setAdminSection(section);
  };

  // Renderizar o site principal
  if (currentView === 'website') {
    return (
      <LanguageProvider>
        <DataProvider>
          <div className="min-h-screen bg-black text-white">
            <Toaster 
              position="top-center" 
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)'
                }
              }}
            />
            <Header />
            <main>
              <HeroSection />
              <EventsSection />
              <FicaMaisSection />
              <StorytellingSection />
              <MusicSection />
              <GallerySection />
              <ShopSection />
              <ContactSection />
            </main>
            <Footer onAdminClick={handleAdminClick} />
          </div>
        </DataProvider>
      </LanguageProvider>
    );
  }

  // Renderizar login do admin
  if (currentView === 'admin-login') {
    return (
      <AuthProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-black text-white">
            <Toaster 
              position="top-center"
              toastOptions={{
                style: {
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)'
                }
              }}
            />
            <button
              onClick={() => setCurrentView('website')}
              className="fixed top-4 left-4 z-50 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              ← Voltar ao Site
            </button>
            <AdminLogin onLogin={handleAdminLogin} />
          </div>
        </LanguageProvider>
      </AuthProvider>
    );
  }

  // Renderizar dashboard do admin
  if (currentView === 'admin-dashboard') {
    return (
      <AuthProvider>
        <DataProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-black text-white">
              <Toaster 
                position="top-center"
                toastOptions={{
                  style: {
                    background: '#1a1a1a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }
                }}
              />
              <AdminDashboard 
                currentSection={adminSection}
                onSectionChange={handleSectionChange}
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

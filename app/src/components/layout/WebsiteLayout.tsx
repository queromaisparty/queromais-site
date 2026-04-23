import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface WebsiteLayoutProps {
  onAdminClick: () => void;
}

export function WebsiteLayout({ onAdminClick }: WebsiteLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden w-full max-w-[100vw] relative">
      <Header />
      <main className="w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer onAdminClick={onAdminClick} />
    </div>
  );
}

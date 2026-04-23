import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface WebsiteLayoutProps {
  onAdminClick: () => void;
}

export function WebsiteLayout({ onAdminClick }: WebsiteLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <Outlet />
      <Footer onAdminClick={onAdminClick} />
    </div>
  );
}

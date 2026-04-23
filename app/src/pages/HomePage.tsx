import { HeroSection } from '@/sections/HeroSection';
import { EventsSection } from '@/sections/EventsSection';
import { FicaMaisSection } from '@/sections/FicaMaisSection';
import { SobreSection } from '@/sections/SobreSection';
import { MusicSection } from '@/sections/MusicSection';
import { GallerySection } from '@/sections/GallerySection';
import { ShopSection } from '@/sections/ShopSection';
import { ContactSection } from '@/sections/ContactSection';

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <EventsSection />
      <FicaMaisSection />
      <SobreSection />
      <MusicSection />
      <GallerySection />
      <ShopSection />
      <ContactSection />
    </main>
  );
}



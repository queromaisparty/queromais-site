import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HomeBanner {
  enabled: boolean;
  title: string;
  text: string;
  imageUrl: string | null;
  buttonLabel: string;
  buttonLink: string;
}

export function HomeDJContestBanner() {
  const [banner, setBanner] = useState<HomeBanner | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('dj_contest_settings')
        .select('home_banner_enabled, home_banner_title, home_banner_text, home_banner_image_url, home_banner_button_label, home_banner_button_link')
        .eq('id', 1)
        .single();

      if (data && data.home_banner_enabled !== false) {
        setBanner({
          enabled: true,
          title: data.home_banner_title || 'QUERO MAIS DJ CONTEST',
          text: data.home_banner_text || 'Quem merece a vaga na final? Vote agora e ajude a decidir os finalistas!',
          imageUrl: data.home_banner_image_url || null,
          buttonLabel: data.home_banner_button_label || 'Vote agora',
          buttonLink: data.home_banner_button_link || '/dj-contest',
        });
      }
    })();
  }, []);

  if (!banner) return null;

  const isExternal = /^https?:\/\//i.test(banner.buttonLink);

  const ButtonInner = (
    <span className="inline-flex items-center gap-2 px-10 py-4 bg-[#E91E8C] hover:bg-[#d01577] text-white text-sm font-bold tracking-widest uppercase transition-colors rounded-full shadow-lg shadow-[#E91E8C]/30">
      {banner.buttonLabel}
      <ChevronRight className="w-4 h-4" />
    </span>
  );

  return (
    <section id="dj-contest-banner" className="py-12 md:py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A1A2E] shadow-xl">
          {/* Imagem de fundo */}
          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
          )}
          {/* Overlay para leitura */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A2E] via-[#1A1A2E]/85 to-[#1A1A2E]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(233,30,140,0.35),transparent_60%)]" />

          <div className="relative z-10 px-6 py-14 md:px-16 md:py-20 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 mb-6">
              <Trophy className="w-4 h-4 text-[#E91E8C]" />
              <span className="text-[11px] font-bold tracking-widest uppercase">Concurso</span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white tracking-tighter uppercase mb-5 leading-none">
              {banner.title}
            </h2>

            <p className="text-white/70 text-base md:text-lg font-medium mb-8 max-w-xl mx-auto md:mx-0">
              {banner.text}
            </p>

            {isExternal ? (
              <a href={banner.buttonLink} target="_blank" rel="noopener noreferrer">
                {ButtonInner}
              </a>
            ) : (
              <Link to={banner.buttonLink}>{ButtonInner}</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

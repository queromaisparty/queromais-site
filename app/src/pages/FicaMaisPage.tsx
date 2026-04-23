import { Disc3, ArrowRight, Moon, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useLanguage } from '@/context/LanguageContext';

export function FicaMaisPage() {
  const { t } = useLanguage();
  const { djs, ficaMaisParty, galleryAlbums } = useData();
  const residentes = djs.filter(dj => dj.category === 'resident');

  const ficaMaisAlbum = galleryAlbums.find(a => a.id === ficaMaisParty?.galleryAlbumId && (a.status === 'active' || !a.status));
  const galleryImages = ficaMaisAlbum?.images.slice(0, 4) ?? [];

  const manifesto =
    ficaMaisParty?.manifestoCompleto?.pt ||
    ficaMaisParty?.manifestoCurto?.pt ||
    'Quando a noite termina para a maioria, a nossa verdadeira jornada começa. Fica Mais Party é o selo oficial de after-hours da Quero Mais, dedicado aos guerreiros da alvorada.';

  return (
    <main className="pt-24 min-h-screen bg-white">

      {/* Hero Fica Mais */}
      <section className="relative overflow-hidden w-full mb-12">
        {ficaMaisParty?.pageMedia ? (
          <>
            <div className="absolute inset-0">
              <img src={ficaMaisParty.pageMedia} alt="Fica Mais Party" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-white" />
            </div>
            <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 sm:p-12 lg:p-24 max-w-4xl">
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-qm-magenta mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-qm-magenta" />
                  O After Oficial
                </div>
                <h1 className="font-black text-4xl sm:text-6xl lg:text-6xl text-white uppercase tracking-tighter leading-[0.9] mb-6 sm:mb-8">
                  FICA MAIS <span className="text-qm-magenta">PARTY</span>
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 font-medium leading-relaxed mb-12 max-w-2xl">
                  {manifesto}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gradient-to-br from-qm-magenta/10 via-white to-orange-50">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Moon className="w-64 h-64 text-qm-magenta" />
              </div>
              <div className="relative z-10 p-8 sm:p-16 lg:p-24 max-w-4xl">
                <div className="text-sm font-bold uppercase tracking-[0.3em] text-qm-magenta mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-qm-magenta" />
                  O After Oficial
                </div>
                <h1 className="font-black text-6xl sm:text-6xl lg:text-6xl text-black uppercase tracking-tighter leading-[0.9] mb-8">
                  FICA MAIS <span className="text-qm-magenta">PARTY</span>
                </h1>
                <p className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed mb-12">
                  {manifesto}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Os Residentes */}
      <section className="w-full bg-white mb-20">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tighter mb-2">Trilha da Alvorada</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Conheça os residentes oficiais que comandam nossa cabine quando o sol nasce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residentes.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center border border-gray-200 border-dashed bg-gray-50">
                <p className="text-gray-500 font-medium">Nenhum residente cadastrado no momento.</p>
              </div>
            ) : (
              residentes.map(dj => (
                <div key={dj.id} className="group relative overflow-hidden bg-[#F2F2F2] border border-gray-200 shadow-sm cursor-pointer hover:shadow-xl transition-all">
                  <div className="aspect-square overflow-hidden">
                    <img src={dj.image} alt={dj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-qm-magenta text-xs font-bold uppercase tracking-widest mb-1">Residente Oficial</div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-3">{dj.name}</h3>
                    <div className="flex gap-2">
                      {dj.socialLinks?.find(l => l.platform === 'soundcloud')?.url && (
                        <a href={dj.socialLinks.find(l => l.platform === 'soundcloud')?.url} title={`${dj.name} no SoundCloud`} className="w-10 h-10 bg-[#FF5500] text-white flex items-center justify-center hover:scale-110 transition-transform">
                          <Disc3 className="w-4 h-4" />
                        </a>
                      )}
                      {dj.socialLinks?.find(l => l.platform === 'instagram')?.url && (
                        <a href={dj.socialLinks.find(l => l.platform === 'instagram')?.url} title={`${dj.name} no Instagram`} className="w-10 h-10 bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Galeria Fica Mais */}
      <section className="w-full bg-[#F2F2F2] py-24">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-300 pb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tighter">Galeria Fica Mais</h2>
              <p className="text-gray-600 mt-1">A fotografia de um público que não quer ir embora.</p>
            </div>
            <a href="/vocenaqm" className="text-qm-magenta font-bold uppercase text-sm tracking-wider hover:text-qm-magenta-dark transition-colors flex items-center gap-2">
              Ver Todas <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map(img => (
                <div key={img.id} className="aspect-square bg-gray-200 overflow-hidden">
                  <img src={img.url} alt={ficaMaisAlbum ? t(ficaMaisAlbum.title) : 'Fica Mais'} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border border-gray-200 border-dashed">
              <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-400 font-medium">Fotos em breve.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}



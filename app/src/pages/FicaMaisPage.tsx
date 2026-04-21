import { Sunrise, Disc3, ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';

export function FicaMaisPage() {
  const { djs } = useData();
  const residentes = djs.filter(dj => dj.resident === true);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nível 2: Manifesto Fica Mais */}
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#E91E8C]/10 via-white to-orange-50 border border-gray-100 mb-20">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Sunrise className="w-64 h-64 text-[#E91E8C]" />
           </div>
           
           <div className="relative z-10 p-8 sm:p-16 lg:p-24 max-w-4xl">
             <div className="text-sm font-bold uppercase tracking-[0.3em] text-[#E91E8C] mb-6 flex items-center gap-3">
               <span className="w-8 h-px bg-[#E91E8C]" />
               O After Oficial
             </div>
             <h1 className="font-sans font-black text-6xl sm:text-7xl lg:text-8xl text-black uppercase tracking-tighter leading-[0.9] mb-8">
               A pista <br/> não <span className="text-[#E91E8C]">para.</span>
             </h1>
             <p className="text-xl sm:text-2xl text-gray-600 font-medium leading-relaxed mb-12">
               Quando a noite termina para a maioria, a nossa verdadeira jornada começa. 
               Fica Mais Party é o selo oficial de after-hours da Quero Mais, dedicado aos guerreiros da alvorada.
             </p>
             <button className="bg-[#4A4A4A] hover:bg-black text-white font-bold uppercase tracking-widest px-8 py-4 rounded-xl flex items-center gap-3 transition-all shadow-md">
               Ouça as Playlists <Disc3 className="w-5 h-5" />
             </button>
           </div>
        </div>

        {/* Nível 2: Os Mestres da Manhã (Residentes) */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight mb-2">Trilha da Alvorada</h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto">
              Conheça os residentes oficiais que comandam nossa cabine quando o sol nasce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {residentes.length === 0 ? (
               <div className="col-span-full py-12 flex flex-col items-center justify-center border border-gray-200 border-dashed rounded-3xl bg-gray-50">
                  <p className="text-gray-500 font-medium">Nenhum residente cadastrado no momento.</p>
               </div>
            ) : (
              residentes.map(dj => (
                <div key={dj.id} className="group relative overflow-hidden rounded-3xl bg-[#F2F2F2] border border-gray-200 shadow-sm cursor-pointer hover:shadow-xl transition-all">
                  <div className="aspect-square overflow-hidden">
                    <img src={dj.image} alt={dj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-[#E91E8C] text-xs font-bold uppercase tracking-widest mb-1">
                      {'Residente Oficial'}
                    </div>
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
                      {dj.name}
                    </h3>
                    <div className="flex gap-2">
                       {dj.socialLinks?.find(l => l.platform === 'soundcloud')?.url && <a href={dj.socialLinks.find(l => l.platform === 'soundcloud')?.url} className="w-10 h-10 rounded-full bg-[#FF5500] text-white flex items-center justify-center hover:scale-110 transition-transform"><Disc3 className="w-4 h-4" /></a>}
                       {dj.socialLinks?.find(l => l.platform === 'instagram')?.url && <a href={dj.socialLinks.find(l => l.platform === 'instagram')?.url} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20 hover:bg-white hover:text-black transition-colors"><ArrowRight className="w-4 h-4" /></a>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Nível 2: Galeria VIBES / AM */}
        <div className="rounded-3xl border border-gray-200 bg-[#F2F2F2] p-8 sm:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-300 pb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">Vibes / AM</h2>
              <p className="text-gray-600 mt-1">A fotografia de um público que não quer ir embora.</p>
            </div>
            <a href="/vocenaqm" className="text-[#E91E8C] font-bold uppercase text-sm tracking-wider hover:text-[#D81B80] transition-colors flex items-center gap-2">
              Ver Todas <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80" className="w-full h-full object-cover" /></div>
             <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&q=80" className="w-full h-full object-cover" /></div>
             <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=500&q=80" className="w-full h-full object-cover" /></div>
             <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden"><img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80" className="w-full h-full object-cover" /></div>
          </div>
        </div>

      </div>
    </main>
  );
}

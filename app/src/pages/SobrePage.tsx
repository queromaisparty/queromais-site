import { Target, Users, Zap, Award, MonitorPlay, Speaker, Zap as ZapIcon } from 'lucide-react';

export function SobrePage() {
  
  const timeline = [
    { year: '2010', title: 'O Início', desc: 'A primeira edição da Quero Mais nasceu com um pequeno grupo de sonhadores apaixonados por música eletrônica.' },
    { year: '2015', title: 'A Virada de Chave', desc: 'Mudança de patamar com o primeiro festival open air atraindo público de 5 estados diferentes.' },
    { year: '2019', title: 'Palcos Internacionais', desc: 'Introdução de atrações globais e infraestrutura de festivais mundiais.' },
    { year: '2024', title: 'Nova Era', desc: 'Estabelecimento da Quero Mais como uma produtora multiplataforma de entretenimento noturno.' }
  ];

  const stats = [
    { label: 'Anos de Pista', value: '14+', icon: Award },
    { label: 'Vidas Tocadas', value: '500k', icon: Users },
    { label: 'Artistas', value: '300+', icon: Target },
    { label: 'Edições', value: '50+', icon: Zap }
  ];

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nível 2: Header da Produtora */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-sans font-black text-5xl sm:text-7xl lg:text-8xl text-black uppercase tracking-tighter leading-[0.9] mb-8">
              CRIADORES DE <br /> <span className="text-[#E91E8C] bg-clip-text text-transparent bg-gradient-to-r from-[#E91E8C] to-[#D81B80]">MOMENTOS.</span>
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-3xl leading-relaxed">
              Muito mais que uma festa, somos uma plataforma de experiências. 
              Nossa missão sempre foi unir pessoas puras através da música e 
              produção audiovisual de alto impacto.
            </p>
          </div>
        </div>

        {/* Nível 2: Grid de Estatísticas Numericas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-32">
          {stats.map((S, i) => (
            <div key={i} className="bg-[#F2F2F2] border border-gray-200 rounded-3xl p-8 flex flex-col items-center text-center hover:border-[#E91E8C]/50 transition-colors shadow-sm group">
              <S.icon className="w-8 h-8 text-[#E91E8C] mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-black text-black mb-2">{S.value}</div>
              <div className="text-xs uppercase tracking-widest text-[#4A4A4A] font-bold">{S.label}</div>
            </div>
          ))}
        </div>

        {/* Nível 2: A Gênese / Timeline */}
        <div className="mb-32 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight">Nossa História</h2>
            <p className="text-sm text-[#E91E8C] font-bold uppercase tracking-widest mt-2">Capítulos de uma Saga</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Linha vertical central */}
            <div className="absolute top-0 bottom-0 left-[15px] sm:left-1/2 w-px bg-gradient-to-b from-transparent via-[#E91E8C]/50 to-transparent sm:-translate-x-1/2" />

            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <div key={idx} className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16 ${idx % 2 === 0 ? 'sm:flex-row-reverse text-left sm:text-right' : 'text-left'}`}>
                  
                  {/* Ponto na timeline */}
                  <div className="absolute left-[11px] sm:left-1/2 w-[9px] h-[9px] bg-[#E91E8C] rounded-full sm:-translate-x-1/2 mt-1 sm:mt-0 shadow-[0_0_15px_rgba(233,30,140,0.4)]" />
                  
                  {/* Conteúdo */}
                  <div className="flex-1 ml-10 sm:ml-0">
                    <div className="text-4xl font-black text-gray-200 mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                  
                  <div className="flex-1 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nível 2: A Estrutura (Showcase Técnico) */}
        <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-white border border-gray-200 shadow-xl p-8 sm:p-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight mb-6">
                Tecnologia <br className="hidden sm:block" />
                <span className="text-[#E91E8C]">Audiovisual</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Do Sound System calibrado com precisão cirúrgica aos painéis de LED responsivos, 
                nossa engenharia de pista foi projetada para conectar você à música da forma mais física e pura possível.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                    <Speaker className="w-6 h-6 text-[#E91E8C]" />
                  </div>
                  <div>
                    <h4 className="text-black font-bold mb-1">Acoustic Engineering</h4>
                    <p className="text-sm text-gray-500">Design de som surround feito para evitar fadiga e maximizar o peso dos graves graves.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                    <MonitorPlay className="w-6 h-6 text-[#E91E8C]" />
                  </div>
                  <div>
                    <h4 className="text-black font-bold mb-1">Immersive Visuals</h4>
                    <p className="text-sm text-gray-500">LED Mapping avançado que reage perfeitamente em sincronia com os BPMs da pista.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F2F2] flex items-center justify-center shrink-0">
                    <ZapIcon className="w-6 h-6 text-[#E91E8C]" />
                  </div>
                  <div>
                    <h4 className="text-black font-bold mb-1">Laser Architecture</h4>
                    <p className="text-sm text-gray-500">Baterias de LEDs dinâmicos tecendo tetos tridimensionais de luz sobre o público.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop" alt="Estrutura de Show" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-[#E91E8C]/10 blur-3xl -z-10" />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDJContest, type DJParticipant } from '@/hooks/useDJContest';
import { toast } from 'sonner';
import { Trophy, User, PlayCircle, MapPin, Music } from 'lucide-react';

// Validação oficial dos dígitos verificadores do CPF
function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  for (const factor of [10, 11]) {
    let sum = 0;
    for (let i = 0; i < factor - 1; i++) sum += parseInt(digits[i]) * (factor - i);
    const check = ((sum * 10) % 11) % 10;
    if (check !== parseInt(digits[factor - 1])) return false;
  }
  return true;
}

function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function AudioPlayer({ url }: { url: string }) {
  if (!url) return null;

  const isSoundCloud = url.includes('soundcloud.com');
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isMixcloud = url.includes('mixcloud.com');

  if (isSoundCloud) {
    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23E91E8C&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
    return (
      <iframe
        width="100%"
        height="120"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        className="rounded-xl border border-slate-200/60 shadow-sm mt-3"
      />
    );
  }

  if (isYouTube) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0] || '';
    }
    
    if (videoId) {
      return (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-200/60 shadow-sm mt-3">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
  }

  if (isMixcloud) {
    const embedUrl = `https://www.mixcloud.com/widget/iframe/?mini=1&light=1&feed=${encodeURIComponent(url)}`;
    return (
      <iframe
        width="100%"
        height="60"
        frameBorder="0"
        src={embedUrl}
        className="rounded-xl border border-slate-200/60 shadow-sm mt-3"
      />
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E91E8C] hover:underline mt-3"
    >
      <PlayCircle className="w-4 h-4" /> Ouvir Set Externo
    </a>
  );
}

export function DJContestSection() {
  const { settings, participants, loading, submitVote, submitJuryVote } = useDJContest();
  const [selectedDJ, setSelectedDJ] = useState<DJParticipant | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [juryCode, setJuryCode] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  const juryMode = Boolean(settings?.final_jury_only && settings?.current_phase === 'final');

  // Link personalizado do jurado: /dj-contest?codigo=QM-XXXXX pré-preenche o código
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const fromLink = searchParams.get('codigo');
    if (fromLink) setJuryCode(fromLink.toUpperCase());
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-[#E91E8C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center pt-24">
        <p className="font-semibold text-lg">Configurações do concurso não encontradas.</p>
      </div>
    );
  }

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // Honeypot
    if (!selectedDJ) return;

    // Modo jurado: código de uso único validado e queimado no banco
    if (juryMode) {
      if (!juryCode.trim()) {
        toast.error('Informe seu código de votação.');
        return;
      }
      setIsSubmitting(true);
      const result = await submitJuryVote(selectedDJ.id, juryCode);
      setIsSubmitting(false);

      if (result.success) {
        toast.success(result.message);
        setSelectedDJ(null);
        setJuryCode('');
      } else {
        toast.error(result.message);
      }
      return;
    }

    if (localStorage.getItem(`dj_voted_${settings.current_phase}`)) {
      toast.error('Você já votou nesta fase no seu dispositivo.');
      return;
    }

    if (!isValidCPF(cpf)) {
      toast.error('CPF inválido. Confira os números digitados.');
      return;
    }

    setIsSubmitting(true);
    const result = await submitVote(selectedDJ.id, name, email, cpf);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      localStorage.setItem(`dj_voted_${settings.current_phase}`, 'true');
      setSelectedDJ(null);
      setName('');
      setEmail('');
      setCpf('');
    } else {
      toast.error(result.message);
    }
  };

  const getWinner = () => {
    if (!settings.winner_id) return null;
    return participants.find(p => p.id === settings.winner_id);
  };

  const winner = getWinner();

  return (
    <section className="min-h-screen bg-slate-50 text-slate-900 pt-32 pb-24 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-[#1A1A2E] uppercase">
            {settings.contest_title}
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
            {settings.contest_description || 'Apoie o seu DJ favorito.'}
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm">
            <Trophy className="w-5 h-5 text-[#E91E8C]" />
            <span className="font-bold tracking-wider uppercase text-xs">
              FASE ATUAL: {settings.current_phase}
            </span>
          </div>
        </div>

        {/* Revelação do Vencedor */}
        {settings.results_public && winner && (
          <div className="mb-20 bg-gradient-to-br from-[#E91E8C]/10 to-[#8B5CF6]/10 border border-[#E91E8C]/20 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(233,30,140,0.1),transparent)] pointer-events-none" />
            <Trophy className="w-20 h-20 text-[#E91E8C] mx-auto mb-6 relative z-10 animate-bounce" />
            <h2 className="text-3xl md:text-5xl font-black text-[#1A1A2E] mb-2 relative z-10 uppercase">Vencedor!</h2>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#E91E8C] mb-6 relative z-10 shadow-lg">
              {winner.photo_url ? (
                <img src={winner.photo_url} alt={winner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
              )}
            </div>
            <h3 className="text-4xl font-black text-[#E91E8C] mb-4 relative z-10">{winner.name}</h3>
            <p className="text-slate-600 text-lg relative z-10 max-w-lg mx-auto">
              Agradecemos a todos que votaram e participaram do {settings.contest_title}!
            </p>
          </div>
        )}

        {/* Grid de Participantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {participants.filter(p => p.phase === settings.current_phase).map(dj => (
            <div key={dj.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-[#E91E8C]/50 hover:shadow-md transition-all duration-300 group flex flex-col h-full">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                {dj.photo_url ? (
                  <img src={dj.photo_url} alt={dj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-1 leading-tight">{dj.name}</h3>
                
                {/* Ficha Técnica do DJ */}
                {dj.tech_sheet && (
                  <div className="flex flex-col gap-1 mb-3">
                    {dj.tech_sheet.cidade && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dj.tech_sheet.cidade}</span>
                      </div>
                    )}
                    {dj.tech_sheet.genero && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        <Music className="w-3.5 h-3.5 text-slate-400" />
                        <span>{dj.tech_sheet.genero}</span>
                      </div>
                    )}
                  </div>
                )}

                {dj.bio && <p className="text-slate-500 text-sm line-clamp-3 mb-4">{dj.bio}</p>}
                
                {/* Embed do Player de Áudio/Vídeo */}
                {dj.set_url && (
                  <div className="mb-6 mt-auto">
                    <AudioPlayer url={dj.set_url} />
                  </div>
                )}
                
                <button 
                  disabled={!settings.voting_open || settings.results_public}
                  onClick={() => setSelectedDJ(dj)}
                  className="w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-white transition-all disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed bg-[#E91E8C] hover:bg-[#d01577] text-sm shadow-sm"
                >
                  {settings.results_public ? 'Encerrado' : (settings.voting_open ? 'Votar' : 'Em Breve')}
                </button>
              </div>
            </div>
          ))}
          {participants.filter(p => p.phase === settings.current_phase).length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              Nenhum participante ativo nesta fase no momento.
            </div>
          )}
        </div>

        {/* Modal de Voto */}
        {selectedDJ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setSelectedDJ(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-lg transition-colors"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-2 text-[#1A1A2E]">Votar em <span className="text-[#E91E8C]">{selectedDJ.name}</span></h3>
              <p className="text-slate-500 mb-6 text-sm">
                {juryMode
                  ? 'Votação restrita. Informe seu código de votação exclusivo.'
                  : 'Preencha seus dados para confirmar. Apenas 1 voto por pessoa (CPF) nesta fase.'}
              </p>

              <form onSubmit={handleVote} className="space-y-4">
                {juryMode ? (
                  <div>
                    <label className="block text-slate-500 text-xs font-bold uppercase mb-2 tracking-wide">Código de Votação</label>
                    <input
                      type="text"
                      required
                      placeholder="QM-XXXXX"
                      value={juryCode}
                      onChange={e => setJuryCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-mono tracking-widest focus:outline-none focus:border-[#E91E8C] transition-colors"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">Código de uso único enviado pela organização. Vale 1 voto.</p>
                  </div>
                ) : (
                <>
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2 tracking-wide">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#E91E8C] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2 tracking-wide">CPF</label>
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={e => setCpf(formatCPF(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#E91E8C] transition-colors"
                  />
                  <p className="text-[11px] text-slate-400 mt-1.5">Usado apenas para validar 1 voto por pessoa. Não é divulgado.</p>
                </div>
                <div>
                  <label className="block text-slate-500 text-xs font-bold uppercase mb-2 tracking-wide">E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#E91E8C] transition-colors"
                  />
                </div>
                </>
                )}

                {/* Honeypot */}
                <div className="hidden">
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-4 py-4 rounded-xl font-bold uppercase tracking-wider text-white bg-[#E91E8C] hover:bg-[#d01577] disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? 'Processando...' : 'Confirmar Voto'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

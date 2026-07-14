import { useState } from 'react';
import { useDJContest, type DJParticipant } from '@/hooks/useDJContest';
import { toast } from 'sonner';

import { PlayCircle, Trophy, User } from 'lucide-react';

export function DJContestSection() {
  const { settings, participants, loading, submitVote } = useDJContest();
  const [selectedDJ, setSelectedDJ] = useState<DJParticipant | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24">
        <div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center pt-24">
        <p>Configurações do concurso não encontradas.</p>
      </div>
    );
  }

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // Honeypot
    if (!selectedDJ) return;

    if (localStorage.getItem(`dj_voted_${settings.current_phase}`)) {
      toast.error('Você já votou nesta fase no seu dispositivo.');
      return;
    }

    setIsSubmitting(true);
    const result = await submitVote(selectedDJ.id, name, email);
    setIsSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      localStorage.setItem(`dj_voted_${settings.current_phase}`, 'true');
      setSelectedDJ(null);
      setName('');
      setEmail('');
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
    <section className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-[#CCFF00]">
            {settings.contest_title.toUpperCase()}
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {settings.contest_description || 'Apoie o seu DJ favorito.'}
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
            <Trophy className="w-5 h-5 text-[#8B5CF6]" />
            <span className="font-medium tracking-wide uppercase">
              FASE ATUAL: {settings.current_phase}
            </span>
          </div>
        </div>

        {/* Revelação do Vencedor */}
        {settings.results_public && winner && (
          <div className="mb-20 bg-gradient-to-br from-[#CCFF00]/20 to-[#8B5CF6]/20 border border-[#CCFF00]/30 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <Trophy className="w-20 h-20 text-[#CCFF00] mx-auto mb-6 relative z-10" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-2 relative z-10">VENCEDOR!</h2>
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#CCFF00] mb-6 relative z-10">
              {winner.photo_url ? (
                <img src={winner.photo_url} alt={winner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-white/50" />
                </div>
              )}
            </div>
            <h3 className="text-4xl font-bold text-[#CCFF00] mb-4 relative z-10">{winner.name}</h3>
            <p className="text-white/80 text-lg relative z-10">
              Agradecemos a todos que votaram e participaram do {settings.contest_title}!
            </p>
          </div>
        )}

        {/* Grid de Participantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {participants.filter(p => p.phase === settings.current_phase).map(dj => (
            <div key={dj.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#CCFF00]/50 transition-colors group">
              <div className="aspect-square relative overflow-hidden bg-white/5">
                {dj.photo_url ? (
                  <img src={dj.photo_url} alt={dj.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-white/20" />
                  </div>
                )}
                {dj.set_url && (
                  <a href={dj.set_url} target="_blank" rel="noopener noreferrer" className="absolute bottom-4 right-4 w-12 h-12 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6" />
                  </a>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{dj.name}</h3>
                {dj.bio && <p className="text-white/60 text-sm line-clamp-2 mb-6">{dj.bio}</p>}
                
                <button 
                  disabled={!settings.voting_open || settings.results_public}
                  onClick={() => setSelectedDJ(dj)}
                  className="w-full py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-[#CCFF00] hover:bg-[#b3ff00]"
                >
                  {settings.results_public ? 'Encerrado' : (settings.voting_open ? 'Votar' : 'Em Breve')}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Voto */}
        {selectedDJ && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md p-8 relative">
              <button 
                onClick={() => setSelectedDJ(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white"
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-2">Votar em <span className="text-[#CCFF00]">{selectedDJ.name}</span></h3>
              <p className="text-white/60 mb-6 text-sm">
                Preencha seus dados para confirmar. Apenas 1 voto por e-mail nesta fase.
              </p>
              
              <form onSubmit={handleVote} className="space-y-4">
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs font-bold uppercase mb-2">E-mail</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                
                {/* Honeypot */}
                <div className="hidden">
                  <input type="text" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full mt-4 py-4 rounded-xl font-bold uppercase tracking-wider text-black bg-[#CCFF00] hover:bg-[#b3ff00] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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

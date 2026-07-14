import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { DJParticipant, DJContestSettings } from '@/hooks/useDJContest';
import { Download, Plus, Save, Trash2, Edit2, ImageIcon } from 'lucide-react';

export function AdminDJContest() {
  const [activeTab, setActiveTab] = useState<'participants' | 'settings' | 'results'>('participants');
  
  // States
  const [participants, setParticipants] = useState<DJParticipant[]>([]);
  const [settings, setSettings] = useState<DJContestSettings | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Forms
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Partial<DJParticipant>>({});

  useEffect(() => {
    fetchSettings();
    if (activeTab === 'participants') fetchParticipants();
    if (activeTab === 'results') fetchResults();
  }, [activeTab]);

  const fetchSettings = async () => {
    const { data } = await supabase.from('dj_contest_settings').select('*').eq('id', 1).single();
    if (data) setSettings(data);
  };

  const fetchParticipants = async () => {
    const { data } = await supabase.from('dj_participants').select('*').order('display_order');
    if (data) setParticipants(data);
  };

  const fetchResults = async () => {
    const { data } = await supabase.from('dj_contest_results').select('*').order('total_votes', { ascending: false });
    if (data) setResults(data);
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    const { error } = await supabase.from('dj_contest_settings').update({
      contest_title: settings.contest_title,
      contest_description: settings.contest_description,
      current_phase: settings.current_phase,
      voting_open: settings.voting_open,
      results_public: settings.results_public,
      winner_id: settings.winner_id,
    }).eq('id', 1);
    setLoading(false);
    if (error) toast.error('Erro ao salvar config: ' + error.message);
    else toast.success('Configurações salvas!');
  };

  const saveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert tech_sheet string back to JSON if needed
    let tech_sheet = editingParticipant.tech_sheet;
    if (typeof tech_sheet === 'string') {
      try {
        tech_sheet = JSON.parse(tech_sheet);
      } catch (err) {
        tech_sheet = {};
      }
    }

    const payload = {
      name: editingParticipant.name,
      photo_url: editingParticipant.photo_url,
      set_url: editingParticipant.set_url,
      bio: editingParticipant.bio,
      phase: editingParticipant.phase || 'semifinal',
      is_active: editingParticipant.is_active ?? true,
      display_order: editingParticipant.display_order || 0,
      tech_sheet
    };

    let error;
    if (editingParticipant.id) {
      const res = await supabase.from('dj_participants').update(payload).eq('id', editingParticipant.id);
      error = res.error;
    } else {
      const res = await supabase.from('dj_participants').insert([payload]);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      toast.error('Erro ao salvar: ' + error.message);
    } else {
      toast.success('Participante salvo!');
      setIsEditingParticipant(false);
      fetchParticipants();
    }
  };

  const deleteParticipant = async (id: string) => {
    if (!window.confirm('Tem certeza? Isso apagará todos os votos deste participante em cascata!')) return;
    const { error } = await supabase.from('dj_participants').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Apagado com sucesso.');
      fetchParticipants();
    }
  };

  const handleExportCSV = async () => {
    if (!settings) return;
    const { data, error } = await supabase.from('dj_votes').select('*').eq('phase', settings.current_phase);
    if (error) {
      toast.error('Erro ao buscar votos: ' + error.message);
      return;
    }
    
    const csvRows = ['id,participant_id,voter_name,voter_email,phase,created_at'];
    data.forEach(v => {
      csvRows.push(`${v.id},${v.participant_id},"${v.voter_name}","${v.voter_email}",${v.phase},${v.created_at}`);
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `votos_${settings.current_phase}_${new Date().getTime()}.csv`;
    a.click();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab('participants')}
          className={`flex-1 py-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'participants' 
              ? 'border-[#E91E8C] text-[#E91E8C] bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          Participantes
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'settings' 
              ? 'border-[#E91E8C] text-[#E91E8C] bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          Configurações
        </button>
        <button 
          onClick={() => setActiveTab('results')}
          className={`flex-1 py-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'results' 
              ? 'border-[#E91E8C] text-[#E91E8C] bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          Apuração
        </button>
      </div>

      <div className="p-8">
        {/* Tab 1: Participantes */}
        {activeTab === 'participants' && (
          <div>
            {!isEditingParticipant ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Gerenciar DJs</h3>
                  <button 
                    onClick={() => { setEditingParticipant({ is_active: true, phase: 'semifinal', display_order: 0, tech_sheet: '{}' }); setIsEditingParticipant(true); }}
                    className="bg-[#E91E8C] hover:bg-[#d01577] text-white px-4 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Adicionar DJ
                  </button>
                </div>
                
                <div className="grid gap-3">
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg transition-all hover:bg-slate-100/30">
                      {p.photo_url ? (
                        <img src={p.photo_url} alt="" className="w-12 h-12 rounded-full object-cover shadow-inner" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-base leading-tight">{p.name}</h4>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wide inline-block mt-1 ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {p.phase} {p.is_active ? '' : '(Inativo)'}
                        </span>
                      </div>
                      <button onClick={() => { setEditingParticipant({...p, tech_sheet: JSON.stringify(p.tech_sheet, null, 2)}); setIsEditingParticipant(true); }} className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button onClick={() => deleteParticipant(p.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                  {participants.length === 0 && <p className="text-slate-400 text-center py-6 text-sm">Nenhum participante cadastrado ainda.</p>}
                </div>
              </>
            ) : (
              <form onSubmit={saveParticipant} className="space-y-4 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">{editingParticipant.id ? 'Editar Participante' : 'Novo Participante'}</h3>
                  <button type="button" onClick={() => setIsEditingParticipant(false)} className="text-slate-400 hover:text-slate-700 text-sm font-semibold">Voltar</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Nome</label>
                    <input required value={editingParticipant.name || ''} onChange={e => setEditingParticipant({...editingParticipant, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Fase</label>
                    <select value={editingParticipant.phase || 'semifinal'} onChange={e => setEditingParticipant({...editingParticipant, phase: e.target.value as any})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]">
                      <option value="semifinal">Semifinal</option>
                      <option value="final">Final</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">URL da Foto (Supabase Storage)</label>
                    <input value={editingParticipant.photo_url || ''} onChange={e => setEditingParticipant({...editingParticipant, photo_url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">URL do Set (Soundcloud/Youtube/Mixcloud)</label>
                    <input value={editingParticipant.set_url || ''} onChange={e => setEditingParticipant({...editingParticipant, set_url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Mini Bio</label>
                    <textarea value={editingParticipant.bio || ''} onChange={e => setEditingParticipant({...editingParticipant, bio: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={3}></textarea>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Ficha Técnica (JSON) ex: {"{\"cidade\": \"SP\"}"}</label>
                    <textarea value={editingParticipant.tech_sheet as string || '{}'} onChange={e => setEditingParticipant({...editingParticipant, tech_sheet: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 font-mono text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={3}></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Ordem de Exibição</label>
                    <input type="number" value={editingParticipant.display_order || 0} onChange={e => setEditingParticipant({...editingParticipant, display_order: Number(e.target.value)})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" />
                  </div>
                  <div className="flex items-center mt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={editingParticipant.is_active ?? true} onChange={e => setEditingParticipant({...editingParticipant, is_active: e.target.checked})} className="w-5 h-5 accent-[#E91E8C] rounded border-slate-300" />
                      <span className="text-slate-700 text-sm font-semibold">Ativo (Exibir no site)</span>
                    </label>
                  </div>
                </div>

                <button disabled={loading} type="submit" className="w-full bg-[#E91E8C] hover:bg-[#d01577] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 transition-colors shadow-sm">
                  {loading ? 'Salvando...' : <><Save className="w-5 h-5"/> Salvar Participante</>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Configurações */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={saveSettings} className="space-y-6 max-w-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Configurações do Concurso</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Título do Concurso</label>
                <input required value={settings.contest_title} onChange={e => setSettings({...settings, contest_title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Descrição</label>
                <textarea value={settings.contest_description || ''} onChange={e => setSettings({...settings, contest_description: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={2}></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Fase Atual</label>
                <select value={settings.current_phase} onChange={e => setSettings({...settings, current_phase: e.target.value as any})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]">
                  <option value="semifinal">Semifinal</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Vencedor Final</label>
                <select value={settings.winner_id || ''} onChange={e => setSettings({...settings, winner_id: e.target.value || null})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]">
                  <option value="">-- Ninguém (Em andamento) --</option>
                  {participants.filter(p => p.phase === 'final').map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={settings.voting_open} onChange={e => setSettings({...settings, voting_open: e.target.checked})} className="w-5 h-5 accent-[#E91E8C] rounded border-slate-300" />
                <span className="font-bold text-slate-700">Votação Aberta (Permitir votos no site)</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={settings.results_public} onChange={e => setSettings({...settings, results_public: e.target.checked})} className="w-5 h-5 accent-[#E91E8C] rounded border-slate-300" />
                <span className="font-bold text-slate-700">Exibir Vencedor no Site (Finaliza Concurso)</span>
              </label>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#E91E8C] hover:bg-[#d01577] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-sm">
              {loading ? 'Salvando...' : <><Save className="w-5 h-5"/> Salvar Configurações</>}
            </button>
          </form>
        )}

        {/* Tab 3: Apuração */}
        {activeTab === 'results' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                Apuração em Tempo Real <span className="bg-red-500 animate-pulse w-2 h-2 rounded-full inline-block"></span>
              </h3>
              <div className="flex gap-2">
                <button onClick={fetchResults} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm border border-slate-200 font-semibold transition-colors">
                  Atualizar
                </button>
                <button onClick={handleExportCSV} className="bg-[#E91E8C] hover:bg-[#d01577] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> CSV ({settings?.current_phase})
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Participante</th>
                    <th className="p-4">Fase</th>
                    <th className="p-4 text-right">Votos Auditados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {results.filter(r => r.phase === settings?.current_phase).map((r, i) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-base text-[#E91E8C]">{i + 1}º</td>
                      <td className="p-4 flex items-center gap-3">
                        {r.photo_url ? (
                          <img src={r.photo_url} className="w-8 h-8 rounded-full object-cover shadow-inner" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <ImageIcon className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <span className="font-bold text-slate-900">{r.name}</span>
                      </td>
                      <td className="p-4 text-sm text-slate-500 uppercase font-semibold">{r.phase}</td>
                      <td className="p-4 text-right font-mono font-bold text-lg text-slate-900">{r.total_votes}</td>
                    </tr>
                  ))}
                  {results.filter(r => r.phase === settings?.current_phase).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Nenhum voto contabilizado ainda nesta fase.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <p className="text-slate-400 text-xs mt-4">
              Nota: Os resultados listados acima são retornados através de uma View protegida do banco. O acesso é exclusivo para a Role Authenticated. O acesso anônimo falhará (RLS ativado).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { contestSupabase as supabase, uploadImage } from '@/lib/supabase';
import { toast } from 'sonner';
import type { DJParticipant, DJContestSettings, JuryCode } from '@/hooks/useDJContest';
import { Download, Plus, Save, Trash2, Edit2, ImageIcon, Copy, KeyRound, RefreshCw, Check, X } from 'lucide-react';

// Código legível sem caracteres ambíguos (sem I/O/0/1)
function generateJuryCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `QM-${out}`;
}

export function AdminDJContest() {
  const [activeTab, setActiveTab] = useState<'participants' | 'settings' | 'results' | 'home' | 'jury'>('participants');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [juryCodes, setJuryCodes] = useState<JuryCode[]>([]);
  const [newJurorName, setNewJurorName] = useState('');
  const [editingJurorId, setEditingJurorId] = useState<string | null>(null);
  const [editingJurorName, setEditingJurorName] = useState('');
  
  // States
  const [participants, setParticipants] = useState<DJParticipant[]>([]);
  const [settings, setSettings] = useState<DJContestSettings | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Forms
  const [isEditingParticipant, setIsEditingParticipant] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Partial<DJParticipant>>({});

  useEffect(() => {
    fetchSettings();
    if (activeTab === 'participants') fetchParticipants();
    if (activeTab === 'results') fetchResults();
    if (activeTab === 'jury') fetchJuryCodes();
  }, [activeTab]);

  const fetchJuryCodes = async () => {
    const { data, error } = await supabase.from('dj_jury_codes').select('*').order('voter_name');
    if (error) toast.error('Erro ao carregar jurados: ' + error.message);
    else if (data) setJuryCodes(data);
  };

  const addJuror = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newJurorName.trim();
    if (!name) return;
    const { error } = await supabase.from('dj_jury_codes').insert([{
      voter_name: name,
      code: generateJuryCode(),
      phase: 'final',
    }]);
    if (error) toast.error('Erro ao adicionar: ' + error.message);
    else {
      toast.success(`Código gerado para ${name}!`);
      setNewJurorName('');
      fetchJuryCodes();
    }
  };

  const deleteJuror = async (juror: JuryCode) => {
    const msg = juror.used_at
      ? `${juror.voter_name} JÁ VOTOU. Remover o registro dele da lista? O voto continua contabilizado na apuração.`
      : `Remover o código de ${juror.voter_name}? O link enviado a ele deixa de funcionar.`;
    if (!window.confirm(msg)) return;
    const { error } = await supabase.from('dj_jury_codes').delete().eq('id', juror.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Removido.');
      fetchJuryCodes();
    }
  };

  const regenerateJurorCode = async (juror: JuryCode) => {
    if (juror.used_at) {
      toast.error('Este jurado já votou — não é possível gerar novo código.');
      return;
    }
    if (!window.confirm(`Gerar NOVO código para ${juror.voter_name}? O código e o link antigos param de funcionar na hora.`)) return;
    const { error } = await supabase.from('dj_jury_codes').update({ code: generateJuryCode() }).eq('id', juror.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`Novo código gerado para ${juror.voter_name}!`);
      fetchJuryCodes();
    }
  };

  const renameJuror = async (id: string) => {
    const name = editingJurorName.trim();
    if (!name) return;
    const { error } = await supabase.from('dj_jury_codes').update({ voter_name: name }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Nome atualizado.');
      setEditingJurorId(null);
      fetchJuryCodes();
    }
  };

  const copyText = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    toast.success(msg);
  };

  // Link com o código embutido — jurado abre e vota direto
  const juryVoteLink = (code: string) =>
    `${window.location.origin}/dj-contest?codigo=${encodeURIComponent(code)}`;

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
      vote_success_message: settings.vote_success_message,
      final_jury_only: settings.final_jury_only,
    }).eq('id', 1);
    setLoading(false);
    if (error) toast.error('Erro ao salvar config: ' + error.message);
    else toast.success('Configurações salvas!');
  };

  const saveHomeBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    const { error } = await supabase.from('dj_contest_settings').update({
      home_banner_enabled: settings.home_banner_enabled,
      home_banner_title: settings.home_banner_title,
      home_banner_text: settings.home_banner_text,
      home_banner_image_url: settings.home_banner_image_url,
      home_banner_button_label: settings.home_banner_button_label,
      home_banner_button_link: settings.home_banner_button_link,
    }).eq('id', 1);
    setLoading(false);
    if (error) toast.error('Erro ao salvar banner: ' + error.message);
    else toast.success('Banner da Home salvo!');
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    try {
      setUploadingBanner(true);
      const publicUrl = await uploadImage(file, 'dj-contest-banner');
      setSettings({ ...settings, home_banner_image_url: publicUrl });
      toast.success('Imagem enviada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao enviar imagem: ' + err.message);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingImage(true);
      const publicUrl = await uploadImage(file, 'djs');
      setEditingParticipant(prev => ({ ...prev, photo_url: publicUrl }));
      toast.success('Foto enviada com sucesso!');
    } catch (err: any) {
      toast.error('Erro ao enviar foto: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const saveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // tech_sheet is built dynamically from separate fields in the UI state
    const tech_sheet = editingParticipant.tech_sheet || {};

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
    
    const csvRows = ['id,participant_id,voter_name,voter_email,voter_cpf,phase,created_at'];
    data.forEach(v => {
      csvRows.push(`${v.id},${v.participant_id},"${v.voter_name}","${v.voter_email}","${v.voter_cpf || ''}",${v.phase},${v.created_at}`);
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
        <button
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'home'
              ? 'border-[#E91E8C] text-[#E91E8C] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          Banner Home
        </button>
        <button
          onClick={() => setActiveTab('jury')}
          className={`flex-1 py-4 px-6 font-bold text-sm transition-all border-b-2 ${
            activeTab === 'jury'
              ? 'border-[#E91E8C] text-[#E91E8C] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
          }`}
        >
          Jurados
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
                    onClick={() => { setEditingParticipant({ is_active: true, phase: 'semifinal', display_order: 0, tech_sheet: {} }); setIsEditingParticipant(true); }}
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
                      <button onClick={() => { setEditingParticipant({ ...p, tech_sheet: p.tech_sheet || {} }); setIsEditingParticipant(true); }} className="p-2 text-slate-400 hover:text-slate-700 transition-colors">
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
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Foto do DJ</label>
                    <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                      {editingParticipant.photo_url ? (
                        <img src={editingParticipant.photo_url} alt="Preview" className="w-20 h-20 rounded-full object-cover border border-slate-200 shadow-sm" />
                      ) : (
                        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center border border-slate-300">
                          <ImageIcon className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handlePhotoUpload} 
                          className="hidden" 
                          id="dj-photo-upload" 
                          disabled={uploadingImage}
                        />
                        <label 
                          htmlFor="dj-photo-upload"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer select-none transition-colors shadow-sm"
                        >
                          {uploadingImage ? 'Enviando Imagem...' : 'Fazer Upload da Foto'}
                        </label>
                        <p className="text-[10px] text-slate-400 mt-2">Formatos aceitos: JPG, PNG, WEBP. Tamanho máximo recomendado: 5MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Link do Set (Soundcloud/Youtube/Mixcloud)</label>
                    <input value={editingParticipant.set_url || ''} onChange={e => setEditingParticipant({...editingParticipant, set_url: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" placeholder="https://soundcloud.com/..." />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Mini Bio</label>
                    <textarea value={editingParticipant.bio || ''} onChange={e => setEditingParticipant({...editingParticipant, bio: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={3} placeholder="Breve apresentação sobre o DJ..."></textarea>
                  </div>

                  {/* Ficha Técnica Simplificada - Removido o JSON cru */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Cidade / Estado</label>
                    <input 
                      value={editingParticipant.tech_sheet?.cidade || ''} 
                      onChange={e => setEditingParticipant({
                        ...editingParticipant, 
                        tech_sheet: { ...editingParticipant.tech_sheet, cidade: e.target.value }
                      })} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" 
                      placeholder="Ex: Rio de Janeiro - RJ"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Gênero / Estilo Musical</label>
                    <input 
                      value={editingParticipant.tech_sheet?.genero || ''} 
                      onChange={e => setEditingParticipant({
                        ...editingParticipant, 
                        tech_sheet: { ...editingParticipant.tech_sheet, genero: e.target.value }
                      })} 
                      className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" 
                      placeholder="Ex: House / Tech House"
                    />
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

                <button disabled={loading || uploadingImage} type="submit" className="w-full bg-[#E91E8C] hover:bg-[#d01577] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 mt-4 transition-colors shadow-sm disabled:opacity-50">
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
              <div className="col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Mensagem Após o Voto</label>
                <textarea value={settings.vote_success_message || ''} onChange={e => setSettings({...settings, vote_success_message: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={2} placeholder="Voto computado com sucesso! 🎧"></textarea>
                <p className="text-[11px] text-slate-400 mt-1">Exibida na notificação de confirmação quando a pessoa vota.</p>
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

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={settings.final_jury_only ?? false} onChange={e => setSettings({...settings, final_jury_only: e.target.checked})} className="w-5 h-5 accent-[#E91E8C] rounded border-slate-300" />
                <span className="font-bold text-slate-700">Final restrita a jurados (voto por código — aba Jurados)</span>
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

        {/* Tab 4: Banner da Home */}
        {activeTab === 'home' && settings && (
          <form onSubmit={saveHomeBanner} className="space-y-6 max-w-2xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Banner de Divulgação na Home</h3>
              <p className="text-slate-500 text-sm">Container exibido na página inicial, entre "Próximas Experiências" e a seção Fica Mais Party.</p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none p-5 bg-slate-50 border border-slate-200 rounded-xl">
              <input type="checkbox" checked={settings.home_banner_enabled ?? true} onChange={e => setSettings({...settings, home_banner_enabled: e.target.checked})} className="w-5 h-5 accent-[#E91E8C] rounded border-slate-300" />
              <span className="font-bold text-slate-700">Exibir banner na Home</span>
            </label>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Título</label>
              <input value={settings.home_banner_title || ''} onChange={e => setSettings({...settings, home_banner_title: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" placeholder="QUERO MAIS DJ CONTEST" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Corpo do Texto</label>
              <textarea value={settings.home_banner_text || ''} onChange={e => setSettings({...settings, home_banner_text: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" rows={3} placeholder="Quem merece a vaga na final? Vote agora e ajude a decidir os finalistas!"></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Imagem de Fundo</label>
              <div className="flex items-center gap-4 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                {settings.home_banner_image_url ? (
                  <img src={settings.home_banner_image_url} alt="Preview" className="w-28 h-20 rounded-lg object-cover border border-slate-200 shadow-sm" />
                ) : (
                  <div className="w-28 h-20 bg-slate-200 rounded-lg flex items-center justify-center border border-slate-300">
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div className="flex-1">
                  <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" id="banner-image-upload" disabled={uploadingBanner} />
                  <label htmlFor="banner-image-upload" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer select-none transition-colors shadow-sm">
                    {uploadingBanner ? 'Enviando Imagem...' : 'Fazer Upload da Imagem'}
                  </label>
                  {settings.home_banner_image_url && (
                    <button type="button" onClick={() => setSettings({...settings, home_banner_image_url: null})} className="ml-3 text-xs font-semibold text-red-500 hover:text-red-700">Remover</button>
                  )}
                  <p className="text-[10px] text-slate-400 mt-2">Recomendado: imagem horizontal (JPG, PNG, WEBP). A imagem aparece escurecida atrás do texto.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Texto do Botão</label>
                <input value={settings.home_banner_button_label || ''} onChange={e => setSettings({...settings, home_banner_button_label: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" placeholder="Vote agora" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Link do Botão</label>
                <input value={settings.home_banner_button_link || ''} onChange={e => setSettings({...settings, home_banner_button_link: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]" placeholder="/dj-contest" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 -mt-2">Use <code className="text-slate-500">/dj-contest</code> para a página de votação interna, ou uma URL completa (https://...) para link externo.</p>

            <button disabled={loading || uploadingBanner} type="submit" className="w-full bg-[#E91E8C] hover:bg-[#d01577] text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-colors shadow-sm disabled:opacity-50">
              {loading ? 'Salvando...' : <><Save className="w-5 h-5"/> Salvar Banner</>}
            </button>
          </form>
        )}

        {/* Tab 5: Jurados */}
        {activeTab === 'jury' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#E91E8C]" /> Jurados da Final
              </h3>
              <p className="text-slate-500 text-sm mt-1">
                Cada jurado recebe um código de uso único — vale exatamente 1 voto na final.
                Ative "Final restrita a jurados" na aba Configurações para exigir o código no site.
              </p>
            </div>

            <form onSubmit={addJuror} className="flex gap-3 mb-6">
              <input
                value={newJurorName}
                onChange={e => setNewJurorName(e.target.value)}
                placeholder="Nome do jurado"
                className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#E91E8C] focus:border-[#E91E8C]"
              />
              <button type="submit" className="bg-[#E91E8C] hover:bg-[#d01577] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Gerar Código
              </button>
            </form>

            {juryCodes.length > 0 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={() => copyText(
                    juryCodes.map(j => `${j.voter_name}\n${juryVoteLink(j.code)}`).join('\n\n'),
                    'Lista completa copiada (nome + link de votação)!'
                  )}
                  className="text-xs font-bold text-[#E91E8C] hover:underline flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar lista completa (nome + link de votação)
                </button>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="p-4">Jurado</th>
                    <th className="p-4">Código</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {juryCodes.map(j => (
                    <tr key={j.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {editingJurorId === j.id ? (
                          <span className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={editingJurorName}
                              onChange={e => setEditingJurorName(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); renameJuror(j.id); } if (e.key === 'Escape') setEditingJurorId(null); }}
                              className="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-[#E91E8C] w-full max-w-[220px]"
                            />
                            <button onClick={() => renameJuror(j.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Salvar nome">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingJurorId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded" title="Cancelar">
                              <X className="w-4 h-4" />
                            </button>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {j.voter_name}
                            <button
                              onClick={() => { setEditingJurorId(j.id); setEditingJurorName(j.voter_name); }}
                              className="p-1 text-slate-300 hover:text-slate-600 transition-colors"
                              title="Editar nome"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-[#E91E8C] tracking-wider">{j.code}</span>
                      </td>
                      <td className="p-4">
                        {j.used_at ? (
                          <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-green-100 text-green-700">Votou</span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full font-bold uppercase bg-slate-100 text-slate-500">Pendente</span>
                        )}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => copyText(juryVoteLink(j.code), `Link de votação de ${j.voter_name} copiado!`)}
                          className="text-xs font-bold text-[#E91E8C] hover:bg-[#E91E8C]/10 border border-[#E91E8C]/30 px-3 py-1.5 rounded-lg mr-1 transition-colors"
                          title="Copiar link de votação com o código embutido"
                        >
                          Copiar Link
                        </button>
                        <button onClick={() => copyText(j.code, `Código de ${j.voter_name} copiado!`)} className="p-2 text-slate-400 hover:text-slate-700 transition-colors" title="Copiar só o código">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => regenerateJurorCode(j)}
                          disabled={!!j.used_at}
                          className="p-2 text-slate-400 hover:text-[#E91E8C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title={j.used_at ? 'Já votou — código não pode ser trocado' : 'Gerar novo código (o antigo para de funcionar)'}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteJuror(j)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Remover jurado">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {juryCodes.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 text-sm">Nenhum jurado cadastrado ainda.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

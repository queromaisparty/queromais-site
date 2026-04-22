import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Calendar as CalendarIcon, Clock, Moon, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

export function AdminFicaMais() {
  const { ficaMaisParty, updateFicaMaisParty, galleryAlbums } = useData();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    showInHome: false,
    isActivePage: false,
    manifestoCurto: '',
    manifestoCompleto: '',
    heroTitle: '',
    heroCta: '',
    heroCtaLink: '',
    homeMedia: '',
    pageMedia: '',
    galleryAlbumId: ''
  });

  const [upcomingDates, setUpcomingDates] = useState<{ id: string; date: string; time: string }[]>([]);

  useEffect(() => {
    if (ficaMaisParty) {
      setFormData({
        showInHome: ficaMaisParty.showInHome ?? true,
        isActivePage: ficaMaisParty.isActivePage ?? true,
        manifestoCurto: ficaMaisParty.manifestoCurto?.pt || '',
        manifestoCompleto: ficaMaisParty.manifestoCompleto?.pt || '',
        heroTitle: ficaMaisParty.heroTitle?.pt || '',
        heroCta: ficaMaisParty.heroCta?.pt || '',
        heroCtaLink: ficaMaisParty.heroCtaLink || '',
        homeMedia: ficaMaisParty.homeMedia || '',
        pageMedia: ficaMaisParty.pageMedia || '',
        galleryAlbumId: ficaMaisParty.galleryAlbumId || '',
      });
      setUpcomingDates(ficaMaisParty.upcomingDates || []);
    }
  }, [ficaMaisParty]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateFicaMaisParty({
        showInHome: formData.showInHome,
        isActivePage: formData.isActivePage,
        manifestoCurto: { pt: formData.manifestoCurto, en: formData.manifestoCurto, es: formData.manifestoCurto },
        manifestoCompleto: { pt: formData.manifestoCompleto, en: formData.manifestoCompleto, es: formData.manifestoCompleto },
        heroTitle: { pt: formData.heroTitle, en: formData.heroTitle, es: formData.heroTitle },
        heroCta: { pt: formData.heroCta, en: formData.heroCta, es: formData.heroCta },
        heroCtaLink: formData.heroCtaLink,
        homeMedia: formData.homeMedia,
        pageMedia: formData.pageMedia,
        galleryAlbumId: formData.galleryAlbumId,
        upcomingDates: upcomingDates
      });
      toast.success('Alterações da Fica Mais salvas com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar as configurações.');
    } finally {
      setIsLoading(false);
    }
  };

  const addDate = () => {
    setUpcomingDates([...upcomingDates, { id: Date.now().toString(), date: '', time: '' }]);
  };

  const removeDate = (id: string) => {
    setUpcomingDates(upcomingDates.filter((d) => d.id !== id));
  };

  const updateDate = (id: string, field: 'date' | 'time', value: string) => {
    setUpcomingDates(
      upcomingDates.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  };

  return (
    <div className="p-8 pb-32">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-[#1A1A2E]">
            <Moon className="w-6 h-6 text-[#8B5CF6]" />
            Fica Mais Party
            <Sparkles className="w-4 h-4 text-[#E91E8C]" />
          </h2>
          <p className="text-[#9CA3AF] mt-1 text-sm">
            Gerencie o Manifesto e toda a essência da Fica Mais (Textos e Imagens).
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#1A1A2E] text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : (
            <>
              <Save className="w-4 h-4" />
              Salvar Alterações
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Definitions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Módulos Visíveis</h3>
            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.showInHome}
                  onChange={(e) => setFormData({ ...formData, showInHome: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]" 
                />
                <span className="text-sm font-medium text-[#1A1A2E]">Mostrar na Home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActivePage}
                  onChange={(e) => setFormData({ ...formData, isActivePage: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#8B5CF6] focus:ring-[#8B5CF6]" 
                />
                <span className="text-sm font-medium text-[#1A1A2E]">Página Ativa (/fica-mais)</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Textos Principais (PT-BR)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Topo (Hero)</label>
                <input
                  type="text"
                  value={formData.heroTitle}
                  onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                  placeholder="Ex: A MAIOR DAY PARTY..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texto do Botão Hero</label>
                <input
                  type="text"
                  value={formData.heroCta}
                  onChange={(e) => setFormData({ ...formData, heroCta: e.target.value })}
                  placeholder="Ex: GARANTA SEU INGRESSO"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Link do Botão Hero</label>
              <input
                type="text"
                value={formData.heroCtaLink}
                onChange={(e) => setFormData({ ...formData, heroCtaLink: e.target.value })}
                placeholder="Ex: https://ingressos..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Manifesto Resumido (Home)</label>
              <textarea
                value={formData.manifestoCurto}
                onChange={(e) => setFormData({ ...formData, manifestoCurto: e.target.value })}
                rows={3}
                placeholder="Ex: A festa continua quando o sol nasce..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manifesto Completo (Página Própria)</label>
              <textarea
                value={formData.manifestoCompleto}
                onChange={(e) => setFormData({ ...formData, manifestoCompleto: e.target.value })}
                rows={6}
                placeholder="Texto longo exibido na página Fica Mais Party."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Galeria "Vibes / AM"</h3>
            <p className="text-xs text-gray-500 mb-4">
              Selecione um álbum previamente cadastrado no módulo Galeria para ser exibido na página da Fica Mais Party.
            </p>
            <select
              value={formData.galleryAlbumId}
              onChange={(e) => setFormData({ ...formData, galleryAlbumId: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Nenhum álbum selecionado (exibirá estilo padrão)</option>
              {galleryAlbums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title.pt} ({album.year})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Mídias Formato Link</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Banner (Home) URL</label>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {formData.homeMedia ? (
                    <img src={formData.homeMedia} alt="Home" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={formData.homeMedia}
                  onChange={(e) => setFormData({ ...formData, homeMedia: e.target.value })}
                  placeholder="https://suaimagem..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem Banner (Interna) URL</label>
              <div className="flex gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {formData.pageMedia ? (
                    <img src={formData.pageMedia} alt="Page" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={formData.pageMedia}
                  onChange={(e) => setFormData({ ...formData, pageMedia: e.target.value })}
                  placeholder="https://suaimagem..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E8ED]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1A1A2E]">Próximas Datas</h3>
              <button
                onClick={addDate}
                className="w-8 h-8 rounded-full bg-[#1A1A2E]/5 hover:bg-[#1A1A2E]/10 flex items-center justify-center text-[#1A1A2E] transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {upcomingDates.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Nenhuma data agendada.
                </div>
              ) : (
                upcomingDates.map((d) => (
                  <div key={d.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 group">
                    <button
                      onClick={() => removeDate(d.id)}
                      className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-1">
                          <CalendarIcon className="w-3 h-3" /> Data
                        </label>
                        <input
                          type="date"
                          value={d.date}
                          onChange={(e) => updateDate(d.id, 'date', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" /> Horário
                        </label>
                        <input
                          type="time"
                          value={d.time}
                          onChange={(e) => updateDate(d.id, 'time', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

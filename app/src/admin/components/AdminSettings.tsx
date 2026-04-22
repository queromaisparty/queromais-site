import { useState, useEffect } from 'react';
import { Save, Globe, Palette, Share2, Search, Plus, Trash2, Check, Video } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { uploadVideo } from '@/lib/supabase';

type Tab = 'identity' | 'social' | 'seo' | 'hero';

export function AdminSettings() {
  const { siteConfig, updateSiteConfig, contactInfo, updateContactInfo } = useData();
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [saving, setSaving] = useState(false);

  // ── Identidade ──
  const [siteName, setSiteName] = useState(siteConfig.siteName?.pt || '');
  const [siteDesc, setSiteDesc] = useState(siteConfig.siteDescription?.pt || '');
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primaryColor || 'var(--primary-color, #E91E8C)');
  const [secondaryColor, setSecondaryColor] = useState(siteConfig.secondaryColor || '#8B5CF6');

  // ── Contato ──
  const [email, setEmail] = useState(contactInfo.email || '');
  const [phone, setPhone] = useState(contactInfo.phone || '');
  const [whatsapp, setWhatsapp] = useState(contactInfo.whatsapp || '');
  const [instagram, setInstagram] = useState(contactInfo.instagram || '');
  const [address, setAddress] = useState(contactInfo.address || '');

  // ── Social Links ──
  const [socialLinks, setSocialLinks] = useState<Array<{platform: string; url: string}>>(
    siteConfig.socialLinks || []
  );

  // ── SEO ──
  const [seoTitle, setSeoTitle] = useState(siteConfig.seo?.title?.pt || '');
  const [seoDesc, setSeoDesc] = useState(siteConfig.seo?.description?.pt || '');
  const [seoKeywords, setSeoKeywords] = useState(siteConfig.seo?.keywords || '');
  const [ogImage, setOgImage] = useState(siteConfig.seo?.ogImage || '');

  // ── Hero ──
  const [heroActive, setHeroActive] = useState(siteConfig.hero?.active ?? true);
  const [heroDesktopUrl, setHeroDesktopUrl] = useState(siteConfig.hero?.desktop?.url || '');
  const [heroDesktopUpload, setHeroDesktopUpload] = useState(siteConfig.hero?.desktop?.upload || '');
  const [heroMobileUrl, setHeroMobileUrl] = useState(siteConfig.hero?.mobile?.url || '');
  const [heroMobileUpload, setHeroMobileUpload] = useState(siteConfig.hero?.mobile?.upload || '');
  const [heroFallback, setHeroFallback] = useState(siteConfig.hero?.fallbackImage || '');

  useEffect(() => {
    // Identidade
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSiteName(siteConfig.siteName?.pt || '');
    setSiteDesc(siteConfig.siteDescription?.pt || '');
    setPrimaryColor(siteConfig.primaryColor || 'var(--primary-color, #E91E8C)');
    setSecondaryColor(siteConfig.secondaryColor || '#8B5CF6');

    // Contato
    setEmail(contactInfo.email || '');
    setPhone(contactInfo.phone || '');
    setWhatsapp(contactInfo.whatsapp || '');
    setInstagram(contactInfo.instagram || '');
    setAddress(contactInfo.address || '');

    // Social Links
    setSocialLinks(siteConfig.socialLinks || []);

    // SEO
    setSeoTitle(siteConfig.seo?.title?.pt || '');
    setSeoDesc(siteConfig.seo?.description?.pt || '');
    setSeoKeywords(siteConfig.seo?.keywords || '');
    setOgImage(siteConfig.seo?.ogImage || '');

    // Hero
    setHeroActive(siteConfig.hero?.active ?? true);
    setHeroDesktopUrl(siteConfig.hero?.desktop?.url || '');
    setHeroDesktopUpload(siteConfig.hero?.desktop?.upload || '');
    setHeroMobileUrl(siteConfig.hero?.mobile?.url || '');
    setHeroMobileUpload(siteConfig.hero?.mobile?.upload || '');
    setHeroFallback(siteConfig.hero?.fallbackImage || '');
  }, [siteConfig, contactInfo]);

  const handleVideoUpload = async (file: File | undefined, cb: (url: string) => void) => {
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error('O arquivo excede o limite de 8MB. Comprima antes de enviar.');
      return;
    }
    if (!file.type.startsWith('video/')) {
      toast.error('Arquivo inválido. Envie apenas vídeos.');
      return;
    }
    setSaving(true);
    try {
      const url = await uploadVideo(file, 'hero');
      cb(url);
      toast.success('Vídeo carregado com sucesso!');
    } catch {
      toast.error('Falha no upload do vídeo.');
    }
    setSaving(false);
  };

  const handleSaveIdentity = async () => {
    setSaving(true);
    try {
      updateSiteConfig({
        siteName: { pt: siteName, en: siteName, es: siteName },
        siteDescription: { pt: siteDesc, en: siteDesc, es: siteDesc },
        primaryColor,
        secondaryColor,
      });
      updateContactInfo({ email, phone, whatsapp, instagram, address });
      toast.success('Identidade atualizada com sucesso!');
    } catch {
      toast.error('Erro ao salvar configurações.');
    }
    setSaving(false);
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      updateSiteConfig({ socialLinks });
      toast.success('Redes sociais atualizadas!');
    } catch {
      toast.error('Erro ao salvar configurações.');
    }
    setSaving(false);
  };

  const handleSaveSeo = async () => {
    setSaving(true);
    try {
      updateSiteConfig({
        seo: {
          title: { pt: seoTitle, en: seoTitle, es: seoTitle },
          description: { pt: seoDesc, en: seoDesc, es: seoDesc },
          keywords: seoKeywords,
          ogImage,
        },
      });
      toast.success('Configurações de SEO atualizadas!');
    } catch {
      toast.error('Erro ao salvar SEO.');
    }
    setSaving(false);
  };

  const handleSaveHero = async () => {
    setSaving(true);
    try {
      updateSiteConfig({
        hero: {
          active: heroActive,
          desktop: { url: heroDesktopUrl, upload: heroDesktopUpload },
          mobile: { url: heroMobileUrl, upload: heroMobileUpload },
          fallbackImage: heroFallback,
        },
      });
      toast.success('Configurações do Hero Banner atualizadas!');
    } catch {
      toast.error('Erro ao salvar configuração do Hero.');
    }
    setSaving(false);
  };

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, { platform: '', url: '' }]);
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    setSocialLinks(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link));
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(prev => prev.filter((_, i) => i !== index));
  };

  const tabs: { id: Tab; label: string; icon: typeof Globe }[] = [
    { id: 'identity', label: 'Identidade', icon: Globe },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'seo', label: 'SEO & Buscadores', icon: Search },
    { id: 'hero', label: 'Hero Banner', icon: Video as any },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações Globais</h1>
        <p className="text-sm md:text-base text-slate-500 mt-1">
          Gerencie o motor do site: design central, links externos, banners e presença no Google.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl w-fit mb-8 shadow-sm gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Identidade & Contato ── */}
      {activeTab === 'identity' && (
        <div className="space-y-6 max-w-3xl">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
              <Globe className="w-5 h-5 text-admin-accent" /> Identidade Visual da Marca
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Nome do Site</label>
                <input 
                  type="text" 
                  value={siteName} 
                  onChange={e => setSiteName(e.target.value)} 
                  placeholder="Ex: Quero Mais" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Slogan / Descrição Curta</label>
                <textarea 
                  value={siteDesc} 
                  onChange={e => setSiteDesc(e.target.value)} 
                  placeholder="Experiências inesquecíveis..." 
                  rows={2} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all resize-none" 
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cor Primária (HEX)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)} 
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-0" 
                      title="Cor primária" 
                    />
                    <input 
                      type="text" 
                      value={primaryColor} 
                      onChange={e => setPrimaryColor(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-admin-accent uppercase" 
                      placeholder="#E91E8C" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cor Secundária (HEX)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={secondaryColor} 
                      onChange={e => setSecondaryColor(e.target.value)} 
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer overflow-hidden p-0" 
                      title="Cor secundária" 
                    />
                    <input 
                      type="text" 
                      value={secondaryColor} 
                      onChange={e => setSecondaryColor(e.target.value)} 
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-admin-accent uppercase" 
                      placeholder="#8B5CF6" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
              <Palette className="w-5 h-5 text-admin-accent" /> Informações de Rodapé & Contato
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">E-mail Público</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@site.com" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Telefone Fixo</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(21) 1234-5678" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">WhatsApp Geral</label>
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(21) 99999-9999" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Instagram Central</label>
                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@queromais" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
              </div>
              
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Endereço Físico Base</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rio de Janeiro, RJ" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveIdentity}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-admin-accent hover:brightness-110 text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {saving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? 'Configuração Salva!' : 'Salvar Identidade Global'}
          </button>
        </div>
      )}

      {/* ── Redes Sociais ── */}
      {activeTab === 'social' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <Share2 className="w-5 h-5 text-admin-accent" /> Canais Oficiais
              </h3>
              <button
                onClick={addSocialLink}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold rounded-lg transition-colors border border-slate-200"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar Link
              </button>
            </div>

            {socialLinks.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center">
                <Share2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Nenhum canal social adicionado à lista mestre do site.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl p-3 transition-colors group">
                    <select
                      value={link.platform}
                      onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                      className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white shrink-0 w-36 md:w-48 focus:outline-none focus:border-admin-accent font-medium text-slate-700"
                      title="Plataforma"
                    >
                      <option value="">Selecione...</option>
                      <option value="instagram">Instagram</option>
                      <option value="spotify">Spotify</option>
                      <option value="soundcloud">SoundCloud</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">X / Twitter</option>
                    </select>
                    
                    <input
                      type="url"
                      value={link.url}
                      onChange={e => updateSocialLink(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-admin-accent"
                    />
                    
                    <button
                      onClick={() => removeSocialLink(i)}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg transition-all"
                      title="Excluir link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSaveSocial}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-admin-accent hover:brightness-110 text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {saving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? 'Configuração Salva!' : 'Salvar Redes Sociais'}
          </button>
        </div>
      )}

      {/* ── SEO ── */}
      {activeTab === 'seo' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
              <Search className="w-5 h-5 text-admin-accent" /> Meta Otimização (Google & Compartilhamento)
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Título Principal do Site</label>
                  <span className={`text-xs ${seoTitle.length > 60 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>{seoTitle.length}/60</span>
                </div>
                <input 
                  type="text" 
                  value={seoTitle} 
                  onChange={e => setSeoTitle(e.target.value)} 
                  placeholder="Quero Mais Day Party | A Experiência" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all font-medium" 
                />
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Descrição Global (Snippet)</label>
                  <span className={`text-xs ${seoDesc.length > 160 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>{seoDesc.length}/160</span>
                </div>
                <textarea 
                  value={seoDesc} 
                  onChange={e => setSeoDesc(e.target.value)} 
                  placeholder="O lugar que transforma as suas noites e dias. Compre seu ingresso..." 
                  rows={3} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all resize-none" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tags / Palavras-chave</label>
                <input 
                  type="text" 
                  value={seoKeywords} 
                  onChange={e => setSeoKeywords(e.target.value)} 
                  placeholder="festa, eletrônica, balada, RJ" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Capa do Compartilhamento (OG Image URL)</label>
                <input 
                  type="url" 
                  value={ogImage} 
                  onChange={e => setOgImage(e.target.value)} 
                  placeholder="https://sua-empresa.com/og-cover.jpg" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" 
                />
                {ogImage && (
                  <div className="mt-4 p-2 bg-slate-50 border border-slate-200 rounded-lg max-w-sm">
                    <img src={ogImage} alt="Preview Capa Compartilhamento" className="w-full aspect-video object-cover rounded-md" />
                  </div>
                )}
              </div>

              {/* SERP Simulator */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Simulação no Google</h4>
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold shrink-0">QM</div>
                    <div>
                      <p className="text-sm text-slate-800 font-medium leading-none">Quero Mais Party</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">https://queromaisparty.com.br</p>
                    </div>
                  </div>
                  <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer leading-tight mb-1">
                    {seoTitle || 'Título Otimizado do Site'}
                  </h3>
                  <p className="text-sm text-[#4d5156] line-clamp-2 leading-relaxed">
                    {seoDesc || 'Forneça uma meta description atrativa para exibir aqui. Isso define se as pessoas vão clicar no resultado do Google ou não.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSeo}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-lg bg-admin-accent hover:brightness-110 text-white font-semibold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-sm active:scale-[0.98]"
          >
            {saving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saving ? 'Configuração Salva!' : 'Salvar Indexação SEO'}
          </button>
        </div>
      )}

      {/* ── Hero Banner ── */}
      {activeTab === 'hero' && (
        <div className="space-y-6 max-w-4xl">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm gap-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900">
                <Video className="w-5 h-5 text-admin-accent" /> Painel de Entrada (Hero Video)
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-lg">Liga ou desliga o vídeo de fundo cinematográfico que aparece assim que o visitante abre o site público.</p>
            </div>
            
            <label className="relative inline-flex items-center justify-center cursor-pointer p-1 rounded-full bg-slate-50 border border-slate-200 shrink-0">
              <input type="checkbox" checked={heroActive} onChange={e => setHeroActive(e.target.checked)} className="sr-only peer" />
              <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-accent shrink-0 shadow-inner"></div>
              <span className="ml-3 text-sm font-bold text-slate-700 mr-2 uppercase tracking-wide">
                {heroActive ? 'Ativado' : 'Oculto'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Desktop Setting */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Mídia para Desktop</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Formato ideal: 16:9 • MP4</p>
                </div>
                {heroDesktopUpload && (
                  <button onClick={() => setHeroDesktopUpload('')} className="px-3 py-1.5 text-xs font-bold leading-none bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md transition-colors shrink-0 whitespace-nowrap">
                    Remover Video
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                {heroDesktopUpload ? (
                  <div className="w-full aspect-video rounded-lg bg-slate-900 overflow-hidden relative shadow-inner ring-1 ring-slate-200">
                    <video src={heroDesktopUpload} className="w-full h-full object-cover" controls loop muted />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 pb-2 pt-6 px-3 text-[10px] uppercase tracking-wider font-bold text-white flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Video Nativo Carregado
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Opção 1: Upload de Arquivo</label>
                      <input type="file" accept="video/mp4,video/webm" onChange={e => handleVideoUpload(e.target.files?.[0], setHeroDesktopUpload)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-admin-accent file:text-white hover:file:brightness-110 cursor-pointer" />
                      <p className="mt-2 text-[10px] text-slate-400">Limite de 8MB. Compacte antes de enviar.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase">ou</span>
                      <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Opção 2: Link de Vídeo / CDN</label>
                      <input type="text" value={heroDesktopUrl} onChange={e => setHeroDesktopUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-admin-accent transition-all" />
                    </div>
                    
                    {heroDesktopUrl && (
                      <div className="w-full aspect-video rounded-lg bg-slate-900 overflow-hidden relative shadow-inner ring-1 ring-slate-200 opacity-90 mt-4">
                        <video src={heroDesktopUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 pb-2 pt-6 px-3 text-[10px] uppercase tracking-wider font-bold text-white flex gap-1.5 items-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Lendo Video Externo
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Setting */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-base text-slate-900">Mídia para Mobile</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">Formato ideal: 9:16 (Vertical)</p>
                </div>
                {heroMobileUpload && (
                  <button onClick={() => setHeroMobileUpload('')} className="px-3 py-1.5 text-xs font-bold leading-none bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-md transition-colors shrink-0 whitespace-nowrap">
                    Remover Video
                  </button>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                {heroMobileUpload ? (
                  <div className="w-full max-w-[220px] aspect-[9/16] mx-auto rounded-lg bg-slate-900 overflow-hidden relative shadow-inner ring-1 ring-slate-200">
                    <video src={heroMobileUpload} className="w-full h-full object-cover" controls loop muted />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 pb-2 pt-6 px-3 text-[10px] uppercase tracking-wider font-bold text-white flex gap-1.5 items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Video Nativo
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Opção 1: Upload de Arquivo</label>
                      <input type="file" accept="video/mp4,video/webm" onChange={e => handleVideoUpload(e.target.files?.[0], setHeroMobileUpload)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-admin-accent file:text-white hover:file:brightness-110 cursor-pointer" />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-slate-200"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase">ou</span>
                      <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Opção 2: Link de Vídeo / CDN</label>
                      <input type="text" value={heroMobileUrl} onChange={e => setHeroMobileUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-admin-accent transition-all" />
                    </div>
                    
                    {heroMobileUrl && (
                      <div className="w-full max-w-[180px] aspect-[9/16] mx-auto rounded-lg bg-slate-900 overflow-hidden relative shadow-inner ring-1 ring-slate-200 opacity-90 mt-4">
                        <video src={heroMobileUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 pb-2 pt-6 px-3 text-[10px] uppercase tracking-wider font-bold text-white flex gap-1.5 items-center justify-center">
                           <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Exibindo
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fallback Image */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
             <div className="mb-4 space-y-1">
               <h3 className="font-bold text-base text-slate-900">Imagem de Cortina Estratégica (Poster Fallback)</h3>
               <p className="text-sm text-slate-500">Crucial para o iPhone em modo economia ou redes lentas. Será exibida enquanto o vídeo não inicia.</p>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6 items-start">
               <input type="text" value={heroFallback} onChange={e => setHeroFallback(e.target.value)} placeholder="URL da foto..." className="w-full md:flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-admin-accent/20 focus:border-admin-accent transition-all" />
               
               {heroFallback && (
                  <div className="w-full md:w-64 shrink-0 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-video shadow-sm relative">
                    <img src={heroFallback} alt="Fallback Preview" className="w-full h-full object-cover" />
                  </div>
               )}
             </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSaveHero}
              disabled={saving}
              className="flex items-center justify-center w-full sm:w-auto gap-2 px-10 py-4 rounded-lg bg-admin-accent hover:brightness-110 text-white font-bold text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md active:scale-[0.98]"
            >
              {saving ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saving ? 'Aplicado com Êxito!' : 'Salvar Experiência Visual do Site'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

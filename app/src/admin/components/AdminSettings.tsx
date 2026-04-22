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
  const [primaryColor, setPrimaryColor] = useState(siteConfig.primaryColor || '#E91E8C');
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
    setPrimaryColor(siteConfig.primaryColor || '#E91E8C');
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
      toast.success('Identidade atualizada!');
    } catch {
      toast.error('Erro ao salvar.');
    }
    setSaving(false);
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      updateSiteConfig({ socialLinks });
      toast.success('Redes sociais atualizadas!');
    } catch {
      toast.error('Erro ao salvar.');
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
      toast.success('SEO atualizado!');
    } catch {
      toast.error('Erro ao salvar.');
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
      toast.success('Configurações do Hero atualizadas!');
    } catch {
      toast.error('Erro ao salvar Hero.');
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
    { id: 'identity', label: 'Identidade & Contato', icon: Globe },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'hero', label: 'Hero Banner', icon: Video as any },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Configurações</h2>
        <p className="text-sm mt-1" style={{ color: '#9CA3AF' }}>
          Dados globais do site: nome, contato, redes sociais, SEO, cores.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b pb-4" style={{ borderColor: '#E8E8ED' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-qm-magenta text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Identidade & Contato ── */}
      {activeTab === 'identity' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E8E8ED' }}>
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1A1A2E' }}>
              <Globe className="w-5 h-5 text-qm-magenta" /> Identidade do Site
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome do Site</label>
              <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} placeholder="Quero Mais" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta transition-colors" style={{ borderColor: '#E8E8ED' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Descrição Curta</label>
              <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)} placeholder="Experiências que marcam" rows={2} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta transition-colors resize-none" style={{ borderColor: '#E8E8ED' }} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cor Primária</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: '#E8E8ED' }} title="Cor primária" />
                  <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1 border rounded-xl px-3 py-2 text-sm font-mono" style={{ borderColor: '#E8E8ED' }} placeholder="var(--primary-color)" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Cor Secundária</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor: '#E8E8ED' }} title="Cor secundária" />
                  <input type="text" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="flex-1 border rounded-xl px-3 py-2 text-sm font-mono" style={{ borderColor: '#E8E8ED' }} placeholder="#8B5CF6" />
                </div>
              </div>
            </div>
            {/* Preview cores */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider" style={{ background: primaryColor }}>
                Primária
              </div>
              <div className="flex-1 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold uppercase tracking-wider" style={{ background: secondaryColor }}>
                Secundária
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E8E8ED' }}>
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1A1A2E' }}>
              <Palette className="w-5 h-5 text-qm-magenta" /> Dados de Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@site.com" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(21) 1234-5678" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp</label>
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(21) 972596991" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Instagram</label>
                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@usuario" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Endereço / Cidade</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Rio de Janeiro, RJ" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
            </div>
          </div>

          <button
            onClick={handleSaveIdentity}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary-color)' }}
          >
            {saving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvo!' : 'Salvar Identidade & Contato'}
          </button>
        </div>
      )}

      {/* ── Redes Sociais ── */}
      {activeTab === 'social' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E8E8ED' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1A1A2E' }}>
                <Share2 className="w-5 h-5 text-qm-magenta" /> Links de Redes Sociais
              </h3>
              <button
                onClick={addSocialLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-qm-magenta text-white text-xs font-bold rounded-lg hover:bg-qm-magenta-dark transition-colors"
              >
                <Plus className="w-3 h-3" /> Adicionar
              </button>
            </div>

            {socialLinks.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Nenhum link adicionado. Use o botão acima para começar.</p>
            ) : (
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <select
                      value={link.platform}
                      onChange={e => updateSocialLink(i, 'platform', e.target.value)}
                      className="border rounded-lg px-3 py-2 text-sm bg-white shrink-0 w-36"
                      style={{ borderColor: '#E8E8ED' }}
                      title="Plataforma"
                    >
                      <option value="">Plataforma</option>
                      <option value="instagram">Instagram</option>
                      <option value="spotify">Spotify</option>
                      <option value="soundcloud">SoundCloud</option>
                      <option value="youtube">YouTube</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter / X</option>
                    </select>
                    <input
                      type="url"
                      value={link.url}
                      onChange={e => updateSocialLink(i, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-qm-magenta"
                      style={{ borderColor: '#E8E8ED' }}
                    />
                    <button
                      onClick={() => removeSocialLink(i)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover link"
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary-color)' }}
          >
            {saving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvo!' : 'Salvar Redes Sociais'}
          </button>
        </div>
      )}

      {/* ── SEO ── */}
      {activeTab === 'seo' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: '#E8E8ED' }}>
            <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#1A1A2E' }}>
              <Search className="w-5 h-5 text-qm-magenta" /> Otimização para Buscadores
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Título do Site (Meta Title)</label>
              <input type="text" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder="Quero Mais Day Party" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              <p className="text-xs text-gray-400 mt-1">{seoTitle.length}/60 caracteres recomendados</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Meta Description</label>
              <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} placeholder="Descrição do site para o Google..." rows={3} className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta resize-none" style={{ borderColor: '#E8E8ED' }} />
              <p className="text-xs text-gray-400 mt-1">{seoDesc.length}/160 caracteres recomendados</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Palavras-chave</label>
              <input type="text" value={seoKeywords} onChange={e => setSeoKeywords(e.target.value)} placeholder="festa, day party, rio de janeiro, eletrônica" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">OG Image (URL da imagem de compartilhamento)</label>
              <input type="url" value={ogImage} onChange={e => setOgImage(e.target.value)} placeholder="https://...og-image.jpg" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-qm-magenta" style={{ borderColor: '#E8E8ED' }} />
              {ogImage && (
                <img src={ogImage} alt="OG Preview" className="mt-2 w-full max-w-xs rounded-xl border object-cover aspect-video" style={{ borderColor: '#E8E8ED' }} />
              )}
            </div>

            {/* Preview Google */}
            <div className="bg-gray-50 rounded-xl p-4 border" style={{ borderColor: '#E8E8ED' }}>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Preview no Google</p>
              <p className="text-blue-700 text-lg font-medium leading-tight">{seoTitle || 'Título do Site'}</p>
              <p className="text-green-700 text-xs mt-1">queromaisparty.com.br</p>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{seoDesc || 'Descrição do site para mecanismos de busca...'}</p>
            </div>
          </div>

          <button
            onClick={handleSaveSeo}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary-color)' }}
          >
            {saving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvo!' : 'Salvar SEO'}
          </button>
        </div>
      )}

      {/* ── Hero Banner ── */}
      {activeTab === 'hero' && (
        <div className="space-y-6 max-w-2xl">
          {/* Toggle Geral */}
          <div className="bg-white rounded-2xl border p-6 flex items-center justify-between" style={{ borderColor: '#E8E8ED' }}>
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-900">
                <Video className="w-5 h-5 text-qm-magenta" /> Hero Ativo
              </h3>
              <p className="text-sm text-gray-500 mt-1">Habilita ou esconde a seção inteira do Hero na página inicial.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={heroActive} onChange={e => setHeroActive(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-qm-magenta"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Bloco Desktop */}
            <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E8E8ED' }}>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-md text-gray-900">Desktop (16:9)</h3>
                {heroDesktopUpload && (
                  <button onClick={() => setHeroDesktopUpload('')} className="p-1.5 text-xs bg-red-50 text-red-500 rounded-lg shrink-0">Remover Upload</button>
                )}
              </div>
              
              {heroDesktopUpload ? (
                <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative">
                  <video src={heroDesktopUpload} className="w-full h-full object-cover" controls loop muted />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white">Vídeo por Upload (Prioritário)</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Upload Direto (Máx 8MB)</label>
                    <input type="file" accept="video/mp4,video/webm" onChange={e => handleVideoUpload(e.target.files?.[0], setHeroDesktopUpload)} className="w-full border rounded-lg px-3 py-2 text-xs" style={{ borderColor: '#E8E8ED' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ou usar URL Externa/CDN</label>
                    <input type="text" value={heroDesktopUrl} onChange={e => setHeroDesktopUrl(e.target.value)} placeholder="/hero-scroll.mp4 ou https://..." className="w-full border rounded-lg px-3 py-2 text-sm focus:border-qm-magenta outline-none" style={{ borderColor: '#E8E8ED' }} />
                  </div>
                  {heroDesktopUrl && (
                    <div className="w-full aspect-video rounded-xl bg-black overflow-hidden relative opacity-80">
                      <video src={heroDesktopUrl} className="w-full h-full object-cover" autoPlay loop muted />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white">Vídeo por URL</div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bloco Mobile */}
            <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E8E8ED' }}>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-md text-gray-900">Mobile (9:16)</h3>
                {heroMobileUpload && (
                  <button onClick={() => setHeroMobileUpload('')} className="p-1.5 text-xs bg-red-50 text-red-500 rounded-lg shrink-0">Remover Upload</button>
                )}
              </div>
              
              {heroMobileUpload ? (
                <div className="w-full aspect-[9/16] max-h-64 mx-auto rounded-xl bg-black overflow-hidden relative">
                  <video src={heroMobileUpload} className="w-full h-full object-cover" controls loop muted />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white text-center">Vídeo por Upload</div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Upload Direto (Máx 8MB)</label>
                    <input type="file" accept="video/mp4,video/webm" onChange={e => handleVideoUpload(e.target.files?.[0], setHeroMobileUpload)} className="w-full border rounded-lg px-3 py-2 text-xs" style={{ borderColor: '#E8E8ED' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Ou usar URL Externa/CDN</label>
                    <input type="text" value={heroMobileUrl} onChange={e => setHeroMobileUrl(e.target.value)} placeholder="/videoversaomobile.mp4" className="w-full border rounded-lg px-3 py-2 text-sm focus:border-qm-magenta outline-none" style={{ borderColor: '#E8E8ED' }} />
                  </div>
                  {heroMobileUrl && (
                    <div className="w-full aspect-[9/16] max-h-48 mx-auto rounded-xl bg-black overflow-hidden relative opacity-80">
                      <video src={heroMobileUrl} className="w-full h-full object-cover" autoPlay loop muted />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[10px] text-white text-center">Vídeo por URL</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#E8E8ED' }}>
             <h3 className="font-bold text-md text-gray-900">Imagem de Fallback (Poster)</h3>
             <p className="text-xs text-gray-500">Exibida em redes fracas, modo de energia do iPhone ou quando o vídeo estiver carregando.</p>
             <input type="text" value={heroFallback} onChange={e => setHeroFallback(e.target.value)} placeholder="/hero-poster.jpg" className="w-full border rounded-lg px-4 py-3 text-sm focus:border-qm-magenta outline-none" style={{ borderColor: '#E8E8ED' }} />
             {heroFallback && <img src={heroFallback} alt="Fallback Preview" className="w-full max-w-sm rounded-xl aspect-video object-cover" />}
          </div>

          <button
            onClick={handleSaveHero}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-colors disabled:opacity-50"
            style={{ background: 'var(--primary-color)' }}
          >
            {saving ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? 'Salvo!' : 'Salvar Hero'}
          </button>
        </div>
      )}
    </div>
  );
}

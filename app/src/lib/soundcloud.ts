export interface SoundCloudOEmbed {
  version: number;
  type: string;
  provider_name: string;
  provider_url: string;
  height: number;
  width: string | number;
  title: string;
  description: string;
  thumbnail_url: string;
  html: string;
  author_name: string;
  author_url: string;
}

export async function fetchSoundCloudOEmbed(url: string): Promise<SoundCloudOEmbed> {
  // O endpoint oEmbed oficial do SoundCloud.
  // Muitas vezes funciona direto via frontend, pois eles costumam permitir CORS.
  const oembedUrl = `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(url)}`;
  
  try {
    const res = await fetch(oembedUrl);
    
    if (!res.ok) {
      throw new Error(`Erro na API SoundCloud: ${res.statusText}`);
    }
    
    const data = await res.json();
    return data as SoundCloudOEmbed;
  } catch (error) {
    console.error('Erro ao buscar metadados do SoundCloud:', error);
    
    // Tenta fallback com JSONP se houver erro de CORS (opcional, aqui não usaremos como instruído a evitar, 
    // mas mantemos o aviso que CORS pode ser um limitador caso eles fechem).
    throw new Error('Não foi possível importar os dados. Verifique a URL ou tente manualmente.');
  }
}

/**
 * Valida o HTML recebido do oEmbed para garantir que é seguro renderizar.
 * Bloqueia scripts, atributos suspeitos e recria o iframe de forma higienizada.
 */
export function sanitizeSoundCloudIframe(html: string): string | null {
  if (!html || typeof html !== 'string') return null;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (!iframe) return null; // Sem iframe, bloqueado

    const src = iframe.getAttribute('src');
    
    // Validar rigidamente se a origem é w.soundcloud.com/player
    if (!src || !src.startsWith('https://w.soundcloud.com/player/')) {
      return null;
    }

    // Recria o iframe completamente do zero, jogando fora o original.
    // Isso garante que não tem nenhum atributo onload, onclick ou malicioso escondido.
    return `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="${src}"></iframe>`;
  } catch (error) {
    console.error('Erro de validação do iframe:', error);
    return null;
  }
}

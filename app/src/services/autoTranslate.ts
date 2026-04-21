/**
 * autoTranslate.ts
 * Tradução automática PT-BR → EN / ES via Google Translate API pública.
 * Sem necessidade de API key. Uso interno (admin).
 * Fallback: retorna o texto original nos 3 idiomas se falhar.
 */

export interface TranslatableContent {
  pt: string;
  en: string;
  es: string;
}

async function translateOne(text: string, target: 'en' | 'es'): Promise<string> {
  if (!text.trim()) return '';
  try {
    const url =
      `https://translate.googleapis.com/translate_a/single` +
      `?client=gtx&sl=pt&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('translate error');
    const data = await res.json();
    // Formato: [[["translated","original",null,null,...],...],...]
    const segments: string[][] = data[0];
    return segments.map((s) => s[0]).join('');
  } catch {
    return text; // fallback: retorna o texto original
  }
}

/**
 * Traduz um texto PT-BR para EN e ES automaticamente.
 * @param text Texto em português
 * @returns objeto { pt, en, es }
 */
export async function autoTranslate(text: string): Promise<TranslatableContent> {
  if (!text.trim()) return { pt: '', en: '', es: '' };

  const [en, es] = await Promise.all([
    translateOne(text, 'en'),
    translateOne(text, 'es'),
  ]);

  return { pt: text, en, es };
}

/**
 * Versão síncrona — retorna PT em todos os idiomas sem chamar API.
 * Útil quando offline ou quando tradução não é crítica.
 */
export function fallbackTranslate(text: string): TranslatableContent {
  return { pt: text, en: text, es: text };
}

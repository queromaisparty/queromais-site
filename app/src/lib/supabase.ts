import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase: variáveis de ambiente não configuradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ── Projeto Supabase dedicado ao DJ Contest ──────────────────
// A votação mora num projeto separado (cota de uso isolada do site).
// Sem as envs configuradas, cai no projeto principal — nada quebra.
const contestUrl = import.meta.env.VITE_CONTEST_SUPABASE_URL as string | undefined;
const contestAnonKey = import.meta.env.VITE_CONTEST_SUPABASE_ANON_KEY as string | undefined;

export const hasContestProject = Boolean(contestUrl && contestAnonKey);

export const contestSupabase = hasContestProject
  ? createClient(contestUrl!, contestAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : supabase;

/**
 * Testa a conexão com o Supabase.
 * Retorna true se conectado, false caso contrário.
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('site_config').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = tabela não existe ainda — conexão OK mas sem tabela
      console.warn('⚠️ Supabase conectado, mas a tabela não existe:', error.message);
      return true; // conexão OK
    }
    console.log('✅ Supabase conectado com sucesso!');
    return true;
  } catch (err) {
    console.error('❌ Erro ao conectar com Supabase:', err);
    return false;
  }
}

// Cache de 30 dias no CDN/navegador — reduz egress do Supabase em visitas recorrentes
const CACHE_CONTROL_30_DIAS = String(60 * 60 * 24 * 30);

/**
 * Comprime uma imagem no navegador antes do upload:
 * redimensiona para no máximo 1600px (lado maior) e converte para WEBP ~80%.
 * GIFs (animados) e SVGs são enviados sem alteração.
 * Se a compressão falhar por qualquer motivo, retorna o arquivo original.
 */
async function compressImage(file: File, maxSize = 1600, quality = 0.8): Promise<File> {
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    if (!blob) return file;

    // Só usa a versão comprimida se realmente ficou menor
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], newName, { type: 'image/webp' });
  } catch (err) {
    console.warn('⚠️ Compressão de imagem falhou, enviando original:', err);
    return file;
  }
}

// ── Cloudinary (imagens) ─────────────────────────────────────
// Imagens são servidas pelo CDN do Cloudinary para não consumir
// egress do Supabase. Cloud name e preset unsigned são públicos
// por design (upload direto do browser, sem segredo).
const CLOUDINARY_CLOUD_NAME = 'qsabwf5z';
const CLOUDINARY_UPLOAD_PRESET = 'queromais_site';

/**
 * Faz upload de uma imagem para o Cloudinary (CDN externo).
 * Comprime no browser (max 1600px, WEBP) antes de enviar e retorna
 * URL com f_auto/q_auto (Cloudinary entrega o melhor formato por dispositivo).
 * Assinatura mantida — todos os módulos do admin continuam iguais.
 */
export async function uploadImage(file: File, folder = 'geral'): Promise<string> {
  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append('file', compressed);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', `site/${folder}`);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || `Erro no upload (HTTP ${res.status})`);
  }

  const data = await res.json();
  // Injeta f_auto,q_auto na URL: otimização automática de formato e qualidade
  return (data.secure_url as string).replace('/image/upload/', '/image/upload/f_auto,q_auto/');
}

export async function uploadVideo(file: File, folder = 'hero'): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'mp4';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('site-images')
    .upload(filename, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: CACHE_CONTROL_30_DIAS,
    });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('site-images').getPublicUrl(filename);
  return data.publicUrl;
}

export type { SupabaseClient } from '@supabase/supabase-js';
export default supabase;

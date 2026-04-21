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

/**
 * Faz upload de uma imagem para o bucket 'site-images' no Supabase Storage.
 * O bucket deve existir e ser público no painel do Supabase.
 * Retorna a URL pública do arquivo.
 */
export async function uploadImage(file: File, folder = 'geral'): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage
    .from('site-images')
    .upload(filename, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('site-images').getPublicUrl(filename);
  return data.publicUrl;
}

export type { SupabaseClient } from '@supabase/supabase-js';
export default supabase;

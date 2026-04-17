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

export type { SupabaseClient } from '@supabase/supabase-js';
export default supabase;

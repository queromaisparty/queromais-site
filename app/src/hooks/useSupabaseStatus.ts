import { useState, useEffect } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';

type ConnectionStatus = 'checking' | 'connected' | 'error' | 'no-key';

export function useSupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    // Se a key ainda é o placeholder, não testa
    if (!anonKey || anonKey === 'SUBSTITUA_PELA_ANON_KEY_PUBLICA') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus('no-key');
      setError('Anon key não configurada. Configure o .env com VITE_SUPABASE_ANON_KEY.');
      return;
    }

    testSupabaseConnection()
      .then((ok) => {
        setStatus(ok ? 'connected' : 'error');
        if (!ok) setError('Falha ao conectar com o Supabase.');
      })
      .catch((err) => {
        setStatus('error');
        setError(String(err));
      });
  }, []);

  return { status, error };
}

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface FounderProfile {
  id: string;
  eyebrow: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  photoPath: string;
  photoAlt: string;
  isActive: boolean;
  sortOrder: number;
}

const defaultFounder: FounderProfile = {
  id: '',
  eyebrow: 'Founder & Creative Director',
  name: 'LUCAS BORGES',
  role: 'Founder & Creative Director — QUERO MAIS GROUP',
  bio: '',
  photoUrl: '',
  photoPath: '',
  photoAlt: 'Lucas Borges, Founder & Creative Director da QUERO MAIS GROUP',
  isActive: true,
  sortOrder: 1,
};

function snakeToCamel(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc: any, key) => {
    const camel = key.replace(/([-_][a-z])/g, g => g.toUpperCase().replace('-', '').replace('_', ''));
    acc[camel] = obj[key];
    return acc;
  }, {});
}

function camelToSnake(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.keys(obj).reduce((acc: any, key) => {
    const snake = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    acc[snake] = obj[key] === undefined ? null : obj[key];
    return acc;
  }, {});
}

export function useFounderProfile() {
  const [founder, setFounder] = useState<FounderProfile>(defaultFounder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('about_founder_profile')
          .select('*')
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();
        if (data && mounted && !error) {
          setFounder(snakeToCamel(data) as FounderProfile);
        }
      } catch (e) {
        console.warn('useFounderProfile: tabela pode não existir ainda', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const updateFounder = useCallback(async (data: Partial<FounderProfile>) => {
    setFounder(prev => {
      const merged = { ...prev, ...data };
      // Salvar no banco
      if (prev.id) {
        const dbPayload = camelToSnake(data);
        supabase
          .from('about_founder_profile')
          .update(dbPayload)
          .eq('id', prev.id)
          .then(({ error }) => {
            if (error) console.error('updateFounder:', error);
          });
      }
      return merged;
    });
  }, []);

  return { founder, loading, updateFounder };
}

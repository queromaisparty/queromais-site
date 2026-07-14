import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface DJParticipant {
  id: string;
  name: string;
  photo_url: string | null;
  set_url: string | null;
  set_type: 'link' | 'upload';
  bio: string | null;
  tech_sheet: any;
  phase: 'semifinal' | 'final';
  is_active: boolean;
  display_order: number;
}

export interface DJContestSettings {
  id: number;
  contest_title: string;
  contest_description: string | null;
  current_phase: 'semifinal' | 'final';
  voting_open: boolean;
  voting_starts_at: string | null;
  voting_ends_at: string | null;
  results_reveal_at: string | null;
  results_public: boolean;
  winner_id: string | null;
  home_banner_enabled: boolean;
  home_banner_title: string | null;
  home_banner_text: string | null;
  home_banner_image_url: string | null;
  home_banner_button_label: string | null;
  home_banner_button_link: string | null;
  vote_success_message: string | null;
}

export function useDJContest() {
  const [settings, setSettings] = useState<DJContestSettings | null>(null);
  const [participants, setParticipants] = useState<DJParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContestData = async () => {
    try {
      setLoading(true);
      // 1. Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('dj_contest_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
      } else if (settingsData) {
        setSettings(settingsData);
      }

      // 2. Active Participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('dj_participants')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (participantsError) {
        console.error('Error fetching participants:', participantsError);
      } else if (participantsData) {
        setParticipants(participantsData);
      }
    } catch (err) {
      console.error('Unexpected error fetching contest data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContestData();
  }, []);

  const submitVote = async (participantId: string, name: string, email: string) => {
    if (!settings) return { success: false, message: 'Configurações indisponíveis.' };
    
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { error } = await supabase.from('dj_votes').insert([{
        participant_id: participantId,
        voter_name: name,
        voter_email: normalizedEmail,
        phase: settings.current_phase,
        user_agent: navigator.userAgent
      }]);

      if (error) {
        if (error.code === '23505') {
          return { success: false, message: 'Este e-mail já votou nesta fase. Cada e-mail pode votar apenas uma vez.' };
        }
        return { success: false, message: 'Erro ao processar voto.' };
      }

      return { success: true, message: settings.vote_success_message || 'Voto computado com sucesso! 🎧' };

    } catch (err: any) {
      return { success: false, message: 'Erro de conexão: ' + err.message };
    }
  };

  return {
    settings,
    participants,
    loading,
    submitVote,
    refetch: fetchContestData
  };
}

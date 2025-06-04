import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

interface GlobalSettings {
  company_name: string;
  industry_address: string;
  legal_address: string;
  contact_phone: string;
  contact_email: string;
  form_target_email: string;
  meta_title: {
    et: string;
    en: string;
  };
  meta_description: {
    et: string;
    en: string;
  };
}

const defaultSettings: GlobalSettings = {
  company_name: '',
  industry_address: '',
  legal_address: '',
  contact_phone: '',
  contact_email: '',
  form_target_email: '',
  meta_title: {
    et: '',
    en: ''
  },
  meta_description: {
    et: '',
    en: ''
  }
};

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global_settings')
        .maybeSingle();

      if (fetchError) throw fetchError;

      setSettings(data?.value as GlobalSettings || defaultSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<GlobalSettings>) => {
    try {
      setError(null);

      const updatedSettings = { ...settings, ...newSettings };

      const { error: upsertError } = await supabase
        .from('settings')
        .upsert({
          key: 'global_settings',
          value: updatedSettings
        }, {
          onConflict: 'key'
        });

      if (upsertError) throw upsertError;

      setSettings(updatedSettings);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      return false;
    }
  };

  useEffect(() => {
    fetchSettings();

    const channel = supabase
      .channel('settings_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'settings',
        filter: `key=eq.global_settings`
      }, fetchSettings)
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return {
    settings,
    isLoading,
    error,
    updateSettings
  };
}
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Section = Database['public']['Tables']['sections']['Row'];
type Translation = Database['public']['Tables']['translations']['Row'];
type Image = Database['public']['Tables']['images']['Row'];

export interface ContentData {
  translations: Record<string, { et: string; en: string }>;
  images: Record<string, { url: string; alt_text: string | null }>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTranslation: (key: string, lang: 'et' | 'en', value: string) => Promise<void>;
  updateImage: (key: string, url: string, alt_text?: string) => Promise<void>;
  saveChanges: () => Promise<void>;
}

export function useContent(sectionKey: string): ContentData {
  const [translations, setTranslations] = useState<Record<string, { et: string; en: string }>>({});
  const [images, setImages] = useState<Record<string, { url: string; alt_text: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<{
    translations: Record<string, { et?: string; en?: string }>;
    images: Record<string, { url?: string; alt_text?: string | null }>;
  }>({
    translations: {},
    images: {},
  });

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get section ID
      const { data: sectionData, error: sectionError } = await supabase
        .from('sections')
        .select('id')
        .eq('key', sectionKey)
        .single();

      if (sectionError) throw sectionError;

      // Get translations
      const { data: translationsData, error: translationsError } = await supabase
        .from('translations')
        .select('*')
        .eq('section_id', sectionData.id);

      if (translationsError) throw translationsError;

      // Get images
      const { data: imagesData, error: imagesError } = await supabase
        .from('images')
        .select('*')
        .eq('section_id', sectionData.id);

      if (imagesError) throw imagesError;

      // Process translations
      const translationsMap = translationsData.reduce((acc, item) => ({
        ...acc,
        [item.key]: { et: item.et || '', en: item.en || '' }
      }), {});

      // Process images
      const imagesMap = imagesData.reduce((acc, item) => ({
        ...acc,
        [item.key]: { url: item.url, alt_text: item.alt_text }
      }), {});

      setTranslations(translationsMap);
      setImages(imagesMap);
      setPendingChanges({ translations: {}, images: {} });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = async (key: string, lang: 'et' | 'en', value: string) => {
    try {
      setPendingChanges(prev => ({
        ...prev,
        translations: {
          ...prev.translations,
          [key]: {
            ...prev.translations[key],
            [lang]: value
          }
        }
      }));

      setTranslations(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value
        }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update translation');
    }
  };

  const updateImage = async (key: string, url: string, alt_text?: string) => {
    try {
      setPendingChanges(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [key]: { url, alt_text: alt_text || null }
        }
      }));

      setImages(prev => ({
        ...prev,
        [key]: { url, alt_text: alt_text || null }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
    }
  };

  const saveChanges = async () => {
    try {
      const { data: sectionData } = await supabase
        .from('sections')
        .select('id')
        .eq('key', sectionKey)
        .single();

      if (!sectionData) throw new Error('Section not found');

      // Save translations
      for (const [key, value] of Object.entries(pendingChanges.translations)) {
        const { error } = await supabase
          .from('translations')
          .upsert({
            section_id: sectionData.id,
            key,
            ...value
          }, {
            onConflict: 'section_id,key'
          });

        if (error) throw error;
      }

      // Save images
      for (const [key, value] of Object.entries(pendingChanges.images)) {
        const { error } = await supabase
          .from('images')
          .upsert({
            section_id: sectionData.id,
            key,
            ...value
          }, {
            onConflict: 'section_id,key'
          });

        if (error) throw error;
      }

      // Reset pending changes
      setPendingChanges({ translations: {}, images: {} });
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  return {
    translations,
    images,
    isLoading,
    error,
    refetch: fetchContent,
    updateTranslation,
    updateImage,
    saveChanges
  };
}
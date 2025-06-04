import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
}

export function useContent(sectionKey: string): ContentData {
  const { i18n } = useTranslation();
  const [translations, setTranslations] = useState<Record<string, { et: string; en: string }>>({});
  const [images, setImages] = useState<Record<string, { url: string; alt_text: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);

  const getOrCreateSection = async (key: string) => {
    try {
      const { data: existingSection, error: fetchError } = await supabase
        .from('sections')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (existingSection) {
        setSectionId(existingSection.id);
        return existingSection;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      const { data: newSection, error: insertError } = await supabase
        .from('sections')
        .insert({ key })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setSectionId(newSection.id);
      return newSection;
    } catch (error) {
      console.error('Error in getOrCreateSection:', error);
      throw error;
    }
  };

  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sectionData = await getOrCreateSection(sectionKey);

      if (!sectionData) {
        setTranslations({});
        setImages({});
        return;
      }

      const [translationsResponse, imagesResponse] = await Promise.all([
        supabase
          .from('translations')
          .select('*')
          .eq('section_id', sectionData.id),
        supabase
          .from('images')
          .select('*')
          .eq('section_id', sectionData.id)
      ]);

      if (translationsResponse.error) throw translationsResponse.error;
      if (imagesResponse.error) throw imagesResponse.error;

      const translationsMap = translationsResponse.data.reduce((acc, item) => ({
        ...acc,
        [item.key]: { 
          et: item.et || '', 
          en: item.en || '' 
        }
      }), {});

      const imagesMap = imagesResponse.data.reduce((acc, item) => ({
        ...acc,
        [item.key]: { 
          url: item.url, 
          alt_text: item.alt_text 
        }
      }), {});

      setTranslations(translationsMap);
      setImages(imagesMap);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error in fetchContent:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey]);

  const updateTranslation = async (key: string, lang: 'et' | 'en', value: string) => {
    if (!sectionId) {
      throw new Error('Section ID not found');
    }

    try {
      setTranslations(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value
        }
      }));

      const { error } = await supabase
        .from('translations')
        .upsert({
          section_id: sectionId,
          key,
          [lang]: value
        }, {
          onConflict: 'section_id,key'
        });

      if (error) throw error;
    } catch (err) {
      await fetchContent();
      const errorMessage = err instanceof Error ? err.message : 'Failed to update translation';
      console.error('Error in updateTranslation:', err);
      throw new Error(errorMessage);
    }
  };

  const updateImage = async (key: string, url: string, alt_text?: string) => {
    if (!sectionId) {
      throw new Error('Section ID not found');
    }

    try {
      setImages(prev => ({
        ...prev,
        [key]: { url, alt_text: alt_text || null }
      }));

      const { error } = await supabase
        .from('images')
        .upsert({
          section_id: sectionId,
          key,
          url,
          alt_text: alt_text || null
        }, {
          onConflict: 'section_id,key'
        });

      if (error) throw error;
    } catch (err) {
      await fetchContent();
      const errorMessage = err instanceof Error ? err.message : 'Failed to update image';
      console.error('Error in updateImage:', err);
      throw new Error(errorMessage);
    }
  };

  // Fetch content when section key or language changes
  useEffect(() => {
    fetchContent();
  }, [fetchContent, i18n.language]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!sectionId) return;

    const channel = supabase
      .channel(`content_changes_${sectionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'translations',
        filter: `section_id=eq.${sectionId}`
      }, () => {
        console.log('Translation change detected, refreshing content...');
        fetchContent();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'images',
        filter: `section_id=eq.${sectionId}`
      }, () => {
        console.log('Image change detected, refreshing content...');
        fetchContent();
      })
      .subscribe((status) => {
        console.log(`Subscription status for section ${sectionId}:`, status);
      });

    return () => {
      console.log(`Unsubscribing from section ${sectionId} changes...`);
      channel.unsubscribe();
    };
  }, [sectionId, fetchContent]);

  return {
    translations,
    images,
    isLoading,
    error,
    refetch: fetchContent,
    updateTranslation,
    updateImage
  };
}
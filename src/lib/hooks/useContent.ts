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
}

export function useContent(sectionKey: string): ContentData {
  const [translations, setTranslations] = useState<Record<string, { et: string; en: string }>>({});
  const [images, setImages] = useState<Record<string, { url: string; alt_text: string | null }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);

  const getOrCreateSection = async (key: string) => {
    try {
      // Try to get the section first
      const { data: existingSection, error: fetchError } = await supabase
        .from('sections')
        .select('id')
        .eq('key', key)
        .maybeSingle();

      if (fetchError) throw fetchError;

      // If section exists, return it
      if (existingSection) {
        setSectionId(existingSection.id);
        return existingSection;
      }

      // Check if user is authenticated before creating a new section
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Return null for unauthenticated users
        return null;
      }

      // If user is authenticated and section doesn't exist, create it
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

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get or create section
      const sectionData = await getOrCreateSection(sectionKey);

      // If no section data (unauthenticated user), set empty data
      if (!sectionData) {
        setTranslations({});
        setImages({});
        return;
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in fetchContent:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTranslation = async (key: string, lang: 'et' | 'en', value: string) => {
    if (!sectionId) {
      throw new Error('Section ID not found');
    }

    try {
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

      // Update local state immediately for better UX
      setTranslations(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [lang]: value
        }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update translation');
      console.error('Error in updateTranslation:', err);
      throw err;
    }
  };

  const updateImage = async (key: string, url: string, alt_text?: string) => {
    if (!sectionId) {
      throw new Error('Section ID not found');
    }

    try {
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

      // Update local state immediately for better UX
      setImages(prev => ({
        ...prev,
        [key]: { url, alt_text: alt_text || null }
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      console.error('Error in updateImage:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContent();

    // Set up real-time subscriptions only if we have a section ID
    if (sectionId) {
      const channel = supabase
        .channel(`content_changes_${sectionId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'translations',
          filter: `section_id=eq.${sectionId}`
        }, fetchContent)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'images',
          filter: `section_id=eq.${sectionId}`
        }, fetchContent)
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [sectionId]); // Only re-run when sectionId changes

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
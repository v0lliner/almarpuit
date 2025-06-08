import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';

export interface ProductRequirement {
  id: string;
  section_id: string;
  title_et: string;
  title_en: string;
  items: Array<{ et: string; en: string }>;
  created_at: string;
  updated_at: string;
}

export interface ProductRequirementsData {
  requirement: ProductRequirement | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateRequirement: (updates: Partial<ProductRequirement>) => Promise<void>;
  addItem: (item: { et: string; en: string }) => Promise<void>;
  updateItem: (index: number, item: { et: string; en: string }) => Promise<void>;
  removeItem: (index: number) => Promise<void>;
  reorderItems: (items: Array<{ et: string; en: string }>) => Promise<void>;
}

export function useProductRequirements(sectionKey: string): ProductRequirementsData {
  const [requirement, setRequirement] = useState<ProductRequirement | null>(null);
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

  const fetchRequirement = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sectionData = await getOrCreateSection(sectionKey);
      if (!sectionData) {
        setRequirement(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('product_requirements')
        .select('*')
        .eq('section_id', sectionData.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      setRequirement(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error in fetchRequirement:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey]);

  const updateRequirement = async (updates: Partial<ProductRequirement>) => {
    if (!sectionId) throw new Error('Section ID not found');

    try {
      if (requirement) {
        const { error } = await supabase
          .from('product_requirements')
          .update(updates)
          .eq('id', requirement.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('product_requirements')
          .insert({
            section_id: sectionId,
            title_et: '',
            title_en: '',
            items: [],
            ...updates
          });

        if (error) throw error;
      }

      await fetchRequirement();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update requirement';
      console.error('Error in updateRequirement:', err);
      throw new Error(errorMessage);
    }
  };

  const addItem = async (item: { et: string; en: string }) => {
    if (!requirement) throw new Error('No requirement found');

    try {
      const newItems = [...requirement.items, item];
      await updateRequirement({ items: newItems });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item';
      console.error('Error in addItem:', err);
      throw new Error(errorMessage);
    }
  };

  const updateItem = async (index: number, item: { et: string; en: string }) => {
    if (!requirement) throw new Error('No requirement found');

    try {
      const newItems = [...requirement.items];
      newItems[index] = item;
      await updateRequirement({ items: newItems });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      console.error('Error in updateItem:', err);
      throw new Error(errorMessage);
    }
  };

  const removeItem = async (index: number) => {
    if (!requirement) throw new Error('No requirement found');

    try {
      const newItems = requirement.items.filter((_, i) => i !== index);
      await updateRequirement({ items: newItems });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      console.error('Error in removeItem:', err);
      throw new Error(errorMessage);
    }
  };

  const reorderItems = async (items: Array<{ et: string; en: string }>) => {
    try {
      await updateRequirement({ items });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder items';
      console.error('Error in reorderItems:', err);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchRequirement();
  }, [fetchRequirement]);

  useEffect(() => {
    if (!sectionId) return;

    const channel = supabase
      .channel(`product_requirements_${sectionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'product_requirements',
        filter: `section_id=eq.${sectionId}`
      }, () => {
        console.log('Product requirements change detected, refreshing...');
        fetchRequirement();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [sectionId, fetchRequirement]);

  return {
    requirement,
    isLoading,
    error,
    refetch: fetchRequirement,
    updateRequirement,
    addItem,
    updateItem,
    removeItem,
    reorderItems
  };
}
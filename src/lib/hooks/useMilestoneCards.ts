import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';

export interface MilestoneCard {
  id: string;
  section_id: string;
  year_number: string;
  description_et: string;
  description_en: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface MilestoneCardsData {
  cards: MilestoneCard[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCard: (card: Omit<MilestoneCard, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCard: (id: string, updates: Partial<MilestoneCard>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  reorderCards: (cards: MilestoneCard[]) => Promise<void>;
}

export function useMilestoneCards(sectionKey: string): MilestoneCardsData {
  const [cards, setCards] = useState<MilestoneCard[]>([]);
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

  const fetchCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const sectionData = await getOrCreateSection(sectionKey);
      if (!sectionData) {
        setCards([]);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('milestone_cards')
        .select('*')
        .eq('section_id', sectionData.id)
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;

      setCards(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error in fetchCards:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sectionKey]);

  const createCard = async (card: Omit<MilestoneCard, 'id' | 'created_at' | 'updated_at'>) => {
    if (!sectionId) throw new Error('Section ID not found');

    try {
      const { error } = await supabase
        .from('milestone_cards')
        .insert(card);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create card';
      console.error('Error in createCard:', err);
      throw new Error(errorMessage);
    }
  };

  const updateCard = async (id: string, updates: Partial<MilestoneCard>) => {
    try {
      const { error } = await supabase
        .from('milestone_cards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update card';
      console.error('Error in updateCard:', err);
      throw new Error(errorMessage);
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('milestone_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchCards();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete card';
      console.error('Error in deleteCard:', err);
      throw new Error(errorMessage);
    }
  };

  const reorderCards = async (reorderedCards: MilestoneCard[]) => {
    try {
      const updates = reorderedCards.map((card, index) => ({
        id: card.id,
        sort_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('milestone_cards')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      await fetchCards();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder cards';
      console.error('Error in reorderCards:', err);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  useEffect(() => {
    if (!sectionId) return;

    const channel = supabase
      .channel(`milestone_cards_${sectionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'milestone_cards',
        filter: `section_id=eq.${sectionId}`
      }, () => {
        console.log('Milestone cards change detected, refreshing...');
        fetchCards();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [sectionId, fetchCards]);

  return {
    cards,
    isLoading,
    error,
    refetch: fetchCards,
    createCard,
    updateCard,
    deleteCard,
    reorderCards
  };
}
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useContent } from '../../../lib/hooks/useContent';
import { useMilestoneCards } from '../../../lib/hooks/useMilestoneCards';
import { supabase } from '../../../lib/supabase';
import { Loader2, Upload, X, Check, Plus, Trash2, GripVertical } from 'lucide-react';

export default function AboutSection() {
  const {
    translations,
    images,
    isLoading: contentLoading,
    error: contentError,
    updateTranslation,
    updateImage,
    refetch
  } = useContent('about');

  const {
    cards,
    isLoading: cardsLoading,
    error: cardsError,
    createCard,
    updateCard,
    deleteCard,
    reorderCards
  } = useMilestoneCards('about');

  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    year_number: '',
    description_et: '',
    description_en: ''
  });
  const [showAddCard, setShowAddCard] = useState(false);

  const handleTranslationChange = async (key: string, lang: 'et' | 'en', value: string) => {
    try {
      await updateTranslation(key, lang, value);
    } catch (err) {
      setFormError('Tõlke salvestamine ebaõnnestus');
      console.error('Translation update error:', err);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Fail on liiga suur. Maksimaalne suurus on 5MB');
      return;
    }

    try {
      setIsSaving(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `about/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      await updateImage('background', publicUrl);
      await refetch();
      
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    } catch (err) {
      setFormError('Pildi üleslaadimine ebaõnnestus');
      console.error('Image upload error:', err);
    } finally {
      setIsSaving(false);
    }
  }, [updateImage, refetch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleSaveAll = async () => {
    try {
      setSaveStatus('saving');
      await refetch();
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      setSaveStatus('error');
      setFormError('Muudatuste salvestamine ebaõnnestus');
      console.error('Save error:', err);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.year_number || !newCard.description_et || !newCard.description_en) {
      setFormError('Kõik väljad on kohustuslikud');
      return;
    }

    try {
      await createCard({
        section_id: '', // Will be set by the hook
        year_number: newCard.year_number,
        description_et: newCard.description_et,
        description_en: newCard.description_en,
        sort_order: cards.length + 1
      });
      
      setNewCard({ year_number: '', description_et: '', description_en: '' });
      setShowAddCard(false);
      setFormError(null);
    } catch (err) {
      setFormError('Kaardi lisamine ebaõnnestus');
      console.error('Add card error:', err);
    }
  };

  const handleUpdateCard = async (id: string, field: string, value: string) => {
    try {
      await updateCard(id, { [field]: value });
    } catch (err) {
      setFormError('Kaardi uuendamine ebaõnnestus');
      console.error('Update card error:', err);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Kas oled kindel, et soovid selle kaardi kustutada?')) return;

    try {
      await deleteCard(id);
    } catch (err) {
      setFormError('Kaardi kustutamine ebaõnnestus');
      console.error('Delete card error:', err);
    }
  };

  if (contentLoading || cardsLoading) {
    return <div>Laadimine...</div>;
  }

  if (contentError || cardsError) {
    return <div className="text-red-600">{contentError || cardsError}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-forest-800">Meist sektsioon</h2>
        <button
          onClick={handleSaveAll}
          disabled={saveStatus === 'saving'}
          className={`px-4 py-2 rounded-md font-medium flex items-center space-x-2 ${
            saveStatus === 'saving' 
              ? 'bg-forest-400 cursor-not-allowed' 
              : saveStatus === 'success'
              ? 'bg-green-500 text-white'
              : saveStatus === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-forest-600 text-white hover:bg-forest-700'
          }`}
        >
          {saveStatus === 'saving' && <Loader2 className="w-5 h-5 animate-spin" />}
          {saveStatus === 'success' && <Check className="w-5 h-5" />}
          {saveStatus === 'error' && <X className="w-5 h-5" />}
          <span>
            {saveStatus === 'saving' 
              ? 'Salvestamine...' 
              : saveStatus === 'success'
              ? 'Salvestatud!'
              : saveStatus === 'error'
              ? 'Viga!'
              : 'Salvesta muudatused'}
          </span>
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-lg font-medium mb-2">Pealkiri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.title?.et || ''}
                  onChange={(e) => handleTranslationChange('title', 'et', e.target.value)}
                  placeholder="Sisesta pealkiri eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.title?.en || ''}
                  onChange={(e) => handleTranslationChange('title', 'en', e.target.value)}
                  placeholder="Enter title in English"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>
            <h3 className="text-lg font-medium mb-2">Põhisisu</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-40"
                  value={translations.content?.et || ''}
                  onChange={(e) => handleTranslationChange('content', 'et', e.target.value)}
                  placeholder="Sisesta põhisisu eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-40"
                  value={translations.content?.en || ''}
                  onChange={(e) => handleTranslationChange('content', 'en', e.target.value)}
                  placeholder="Enter main content in English"
                />
              </div>
            </div>
          </div>

          {/* Milestone Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Verstapostid</h3>
              <button
                onClick={() => setShowAddCard(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700"
              >
                <Plus className="w-4 h-4" />
                <span>Lisa uus kaart</span>
              </button>
            </div>

            {/* Add New Card Form */}
            {showAddCard && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h4 className="font-medium mb-3">Lisa uus verstapost</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aasta/Number
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={newCard.year_number}
                      onChange={(e) => setNewCard({ ...newCard, year_number: e.target.value })}
                      placeholder="nt. 2006"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kirjeldus (ET)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={newCard.description_et}
                      onChange={(e) => setNewCard({ ...newCard, description_et: e.target.value })}
                      placeholder="nt. Asutatud"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kirjeldus (EN)
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={newCard.description_en}
                      onChange={(e) => setNewCard({ ...newCard, description_en: e.target.value })}
                      placeholder="e.g. Founded"
                    />
                  </div>
                </div>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={handleAddCard}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Lisa
                  </button>
                  <button
                    onClick={() => {
                      setShowAddCard(false);
                      setNewCard({ year_number: '', description_et: '', description_en: '' });
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Tühista
                  </button>
                </div>
              </div>
            )}

            {/* Existing Cards */}
            <div className="space-y-4">
              {cards.map((card) => (
                <div key={card.id} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <h4 className="font-medium">Verstapost #{card.sort_order}</h4>
                    </div>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aasta/Number
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={card.year_number}
                        onChange={(e) => handleUpdateCard(card.id, 'year_number', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kirjeldus (ET)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={card.description_et}
                        onChange={(e) => handleUpdateCard(card.id, 'description_et', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kirjeldus (EN)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md"
                        value={card.description_en}
                        onChange={(e) => handleUpdateCard(card.id, 'description_en', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Background Image */}
          <div>
            <h3 className="text-lg font-medium mb-2">Taustapilt</h3>
            
            {/* Image Preview */}
            {images.background?.url && (
              <div className="relative mb-4">
                <img
                  src={images.background.url}
                  alt={images.background.alt_text || ''}
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  onClick={() => updateImage('background', '')}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-forest-500 bg-forest-50'
                  : 'border-gray-300 hover:border-forest-400'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Lohista pilt siia või klõpsa valimiseks
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Lubatud: JPG, PNG, WebP. Max: 5MB
              </p>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-forest-600 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Üleslaadimine: {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            {/* Alt Text Input */}
            <input
              type="text"
              className="w-full p-2 border rounded-md mt-4"
              value={images.background?.alt_text || ''}
              onChange={(e) => updateImage('background', images.background?.url || '', e.target.value)}
              placeholder="Pildi kirjeldus (alt text)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
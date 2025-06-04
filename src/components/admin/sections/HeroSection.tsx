import { useState, useCallback } from 'react';
import { useContent } from '../../../lib/hooks/useContent';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function HeroSection() {
  const {
    translations,
    images,
    isLoading,
    error,
    updateTranslation,
    updateImage,
    saveChanges
  } = useContent('hero');

  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleTranslationChange = async (key: string, lang: 'et' | 'en', value: string) => {
    await updateTranslation(key, lang, value);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await saveChanges();
    } catch (error) {
      console.error('Salvestamine ebaõnnestus:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleImageUpload(file);
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      setIsSaving(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          },
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      await updateImage('background', publicUrl, file.name);
    } catch (error) {
      console.error('Pildi üleslaadimine ebaõnnestus:', error);
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  if (isLoading) {
    return <div>Laadimine...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-forest-800">Avalehe sektsioon</h2>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="px-4 py-2 bg-forest-600 text-white rounded-md hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Salvestamine...' : 'Salvesta muudatused'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-lg font-medium mb-2">Pealkiri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <textarea
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
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.title?.en || ''}
                  onChange={(e) => handleTranslationChange('title', 'en', e.target.value)}
                  placeholder="Enter title in English"
                />
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <h3 className="text-lg font-medium mb-2">Alampealkiri</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.subtitle?.et || ''}
                  onChange={(e) => handleTranslationChange('subtitle', 'et', e.target.value)}
                  placeholder="Sisesta alampealkiri eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.subtitle?.en || ''}
                  onChange={(e) => handleTranslationChange('subtitle', 'en', e.target.value)}
                  placeholder="Enter subtitle in English"
                />
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <h3 className="text-lg font-medium mb-2">Tegevusnupp</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.cta?.et || ''}
                  onChange={(e) => handleTranslationChange('cta', 'et', e.target.value)}
                  placeholder="Sisesta nupu tekst eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.cta?.en || ''}
                  onChange={(e) => handleTranslationChange('cta', 'en', e.target.value)}
                  placeholder="Enter button text in English"
                />
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <h3 className="text-lg font-medium mb-2">Taustapilt</h3>
            <div
              className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                dragActive ? 'border-forest-500 bg-forest-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {images.background?.url ? (
                <div className="space-y-4">
                  <div className="relative aspect-video">
                    <img
                      src={images.background.url}
                      alt={images.background.alt_text || ''}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      onClick={() => updateImage('background', '', '')}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={images.background.alt_text || ''}
                    onChange={(e) => updateImage('background', images.background.url, e.target.value)}
                    placeholder="Pildi kirjeldus"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-semibold text-forest-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-forest-600 focus-within:ring-offset-2 hover:text-forest-500"
                    >
                      <span>Lae pilt üles</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">või lohista siia</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF kuni 10MB
                  </p>
                </div>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-forest-600 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="mt-4 text-forest-600">Muudatuste salvestamine...</div>
        )}
      </div>
    </div>
  );
}
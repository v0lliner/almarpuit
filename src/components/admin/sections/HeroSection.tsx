import { useState } from 'react';
import { useContent } from '../../../lib/hooks/useContent';

export default function HeroSection() {
  const {
    translations,
    images,
    isLoading,
    error,
    updateTranslation,
    updateImage
  } = useContent('hero');

  const [isSaving, setIsSaving] = useState(false);

  const handleTranslationChange = async (key: string, lang: 'et' | 'en', value: string) => {
    setIsSaving(true);
    await updateTranslation(key, lang, value);
    setIsSaving(false);
  };

  const handleImageChange = async (key: string, url: string, alt_text?: string) => {
    setIsSaving(true);
    await updateImage(key, url, alt_text);
    setIsSaving(false);
  };

  if (isLoading) {
    return <div>Laadimine...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-forest-800">Avalehe sektsioon</h2>

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
            <div className="space-y-2">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={images.background?.url || ''}
                onChange={(e) => handleImageChange('background', e.target.value)}
                placeholder="Pildi URL"
              />
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={images.background?.alt_text || ''}
                onChange={(e) => handleImageChange('background', images.background?.url || '', e.target.value)}
                placeholder="Pildi kirjeldus"
              />
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
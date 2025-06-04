import { useState } from 'react';
import { useContent } from '../../../lib/hooks/useContent';

export default function AboutSection() {
  const {
    translations,
    images,
    isLoading,
    error,
    updateTranslation,
    updateImage
  } = useContent('about');

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-forest-800">About Section</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Main Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estonian
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-40"
                  value={translations.description?.et || ''}
                  onChange={(e) => handleTranslationChange('description', 'et', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-40"
                  value={translations.description?.en || ''}
                  onChange={(e) => handleTranslationChange('description', 'en', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div>
            <h3 className="text-lg font-medium mb-2">Background Image</h3>
            <div className="space-y-2">
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={images.background?.url || ''}
                onChange={(e) => handleImageChange('background', e.target.value)}
                placeholder="Image URL"
              />
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={images.background?.alt_text || ''}
                onChange={(e) => handleImageChange('background', images.background?.url || '', e.target.value)}
                placeholder="Alt text"
              />
            </div>
          </div>

          {/* Company History */}
          <div>
            <h3 className="text-lg font-medium mb-2">Company History</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estonian
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-32"
                  value={translations.history?.et || ''}
                  onChange={(e) => handleTranslationChange('history', 'et', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  English
                </label>
                <textarea
                  className="w-full p-2 border rounded-md h-32"
                  value={translations.history?.en || ''}
                  onChange={(e) => handleTranslationChange('history', 'en', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {isSaving && (
          <div className="mt-4 text-forest-600">Saving changes...</div>
        )}
      </div>
    </div>
  );
}
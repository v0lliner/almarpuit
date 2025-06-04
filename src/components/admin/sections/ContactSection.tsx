import { useState } from 'react';
import { useContent } from '../../../lib/hooks/useContent';
import { Loader2, X, Check } from 'lucide-react';

export default function ContactSection() {
  const {
    translations,
    isLoading,
    error,
    updateTranslation,
    refetch
  } = useContent('contact');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const handleTranslationChange = async (key: string, lang: 'et' | 'en', value: string) => {
    try {
      await updateTranslation(key, lang, value);
    } catch (err) {
      setFormError('Tõlke salvestamine ebaõnnestus');
      console.error('Translation update error:', err);
    }
  };

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

  if (isLoading) {
    return <div>Laadimine...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-forest-800">Kontakt</h2>
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
          {/* Business Address */}
          <div>
            <h3 className="text-lg font-medium mb-2">Tööstuse aadress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.businessAddress?.et || ''}
                  onChange={(e) => handleTranslationChange('businessAddress', 'et', e.target.value)}
                  placeholder="Sisesta tööstuse aadress eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.businessAddress?.en || ''}
                  onChange={(e) => handleTranslationChange('businessAddress', 'en', e.target.value)}
                  placeholder="Enter business address in English"
                />
              </div>
            </div>
          </div>

          {/* Legal Address */}
          <div>
            <h3 className="text-lg font-medium mb-2">Juriidiline aadress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Eesti keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.legalAddress?.et || ''}
                  onChange={(e) => handleTranslationChange('legalAddress', 'et', e.target.value)}
                  placeholder="Sisesta juriidiline aadress eesti keeles"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inglise keeles
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={translations.legalAddress?.en || ''}
                  onChange={(e) => handleTranslationChange('legalAddress', 'en', e.target.value)}
                  placeholder="Enter legal address in English"
                />
              </div>
            </div>
          </div>

          {/* Contact Person 1 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Kontaktisik 1 (Margus)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nimi
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact1Name?.et || ''}
                  onChange={(e) => handleTranslationChange('contact1Name', 'et', e.target.value)}
                  placeholder="Sisesta nimi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact1Phone?.et || ''}
                  onChange={(e) => handleTranslationChange('contact1Phone', 'et', e.target.value)}
                  placeholder="Sisesta telefon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact1Email?.et || ''}
                  onChange={(e) => handleTranslationChange('contact1Email', 'et', e.target.value)}
                  placeholder="Sisesta e-post"
                />
              </div>
            </div>
          </div>

          {/* Contact Person 2 */}
          <div>
            <h3 className="text-lg font-medium mb-2">Kontaktisik 2 (Siim)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nimi
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact2Name?.et || ''}
                  onChange={(e) => handleTranslationChange('contact2Name', 'et', e.target.value)}
                  placeholder="Sisesta nimi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact2Phone?.et || ''}
                  onChange={(e) => handleTranslationChange('contact2Phone', 'et', e.target.value)}
                  placeholder="Sisesta telefon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-post
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-md"
                  value={translations.contact2Email?.et || ''}
                  onChange={(e) => handleTranslationChange('contact2Email', 'et', e.target.value)}
                  placeholder="Sisesta e-post"
                />
              </div>
            </div>
          </div>

          {/* Maps Embed Code */}
          <div>
            <h3 className="text-lg font-medium mb-2">Google Maps kood</h3>
            <textarea
              className="w-full p-2 border rounded-md h-32 font-mono text-sm"
              value={translations.mapsEmbed?.et || ''}
              onChange={(e) => handleTranslationChange('mapsEmbed', 'et', e.target.value)}
              placeholder="Sisesta Google Maps iframe kood"
            />
          </div>

          {/* Contact Form Labels */}
          <div>
            <h3 className="text-lg font-medium mb-2">Kontaktvormi sildid</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Eesti keeles</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nimi
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelName?.et || ''}
                      onChange={(e) => handleTranslationChange('formLabelName', 'et', e.target.value)}
                      placeholder="Sisesta sildi tekst"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-post
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelEmail?.et || ''}
                      onChange={(e) => handleTranslationChange('formLabelEmail', 'et', e.target.value)}
                      placeholder="Sisesta sildi tekst"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sõnum
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelMessage?.et || ''}
                      onChange={(e) => handleTranslationChange('formLabelMessage', 'et', e.target.value)}
                      placeholder="Sisesta sildi tekst"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Saada nupp
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelSubmit?.et || ''}
                      onChange={(e) => handleTranslationChange('formLabelSubmit', 'et', e.target.value)}
                      placeholder="Sisesta nupu tekst"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Inglise keeles</h4>
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelName?.en || ''}
                      onChange={(e) => handleTranslationChange('formLabelName', 'en', e.target.value)}
                      placeholder="Enter label text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelEmail?.en || ''}
                      onChange={(e) => handleTranslationChange('formLabelEmail', 'en', e.target.value)}
                      placeholder="Enter label text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelMessage?.en || ''}
                      onChange={(e) => handleTranslationChange('formLabelMessage', 'en', e.target.value)}
                      placeholder="Enter label text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submit button
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={translations.formLabelSubmit?.en || ''}
                      onChange={(e) => handleTranslationChange('formLabelSubmit', 'en', e.target.value)}
                      placeholder="Enter button text"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Email */}
          <div>
            <h3 className="text-lg font-medium mb-2">Teavituste e-post</h3>
            <input
              type="email"
              className="w-full p-2 border rounded-md"
              value={translations.notificationEmail?.et || ''}
              onChange={(e) => handleTranslationChange('notificationEmail', 'et', e.target.value)}
              placeholder="Sisesta e-posti aadress kuhu saadetakse kontaktvormi teavitused"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
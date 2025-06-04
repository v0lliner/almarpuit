import { useState } from 'react';
import { useGlobalSettings } from '../../../lib/hooks/useGlobalSettings';
import { Loader2, Check, X } from 'lucide-react';

export default function SettingsSection() {
  const { settings, isLoading, error, updateSettings } = useGlobalSettings();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus('saving');
    setFormError(null);

    const formData = new FormData(e.currentTarget);
    const newSettings = {
      company_name: formData.get('company_name') as string,
      industry_address: formData.get('industry_address') as string,
      legal_address: formData.get('legal_address') as string,
      contact_phone: formData.get('contact_phone') as string,
      contact_email: formData.get('contact_email') as string,
      form_target_email: formData.get('form_target_email') as string,
      meta_title: {
        et: formData.get('meta_title_et') as string,
        en: formData.get('meta_title_en') as string,
      },
      meta_description: {
        et: formData.get('meta_description_et') as string,
        en: formData.get('meta_description_en') as string,
      },
    };

    try {
      const success = await updateSettings(newSettings);
      setSaveStatus(success ? 'success' : 'error');
      if (success) {
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
    } catch (err) {
      setSaveStatus('error');
      setFormError('Failed to save settings');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-forest-800">Üldised seaded</h2>
        <button
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ettevõtte info</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                Ettevõtte nimi
              </label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                defaultValue={settings?.company_name}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
              />
            </div>

            <div>
              <label htmlFor="industry_address" className="block text-sm font-medium text-gray-700">
                Tööstuse aadress
              </label>
              <input
                type="text"
                id="industry_address"
                name="industry_address"
                defaultValue={settings?.industry_address}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
              />
            </div>

            <div>
              <label htmlFor="legal_address" className="block text-sm font-medium text-gray-700">
                Juriidiline aadress
              </label>
              <input
                type="text"
                id="legal_address"
                name="legal_address"
                defaultValue={settings?.legal_address}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                Kontakttelefon
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                defaultValue={settings?.contact_phone}
                required
                pattern="^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                Kontakt e-post
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                defaultValue={settings?.contact_email}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Form Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktvormi seaded</h3>
          <div>
            <label htmlFor="form_target_email" className="block text-sm font-medium text-gray-700">
              Kontaktvormi e-post
            </label>
            <input
              type="email"
              id="form_target_email"
              name="form_target_email"
              defaultValue={settings?.form_target_email}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              E-posti aadress, kuhu saadetakse kontaktvormi teavitused
            </p>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO seaded</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta pealkiri
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="meta_title_et" className="block text-sm text-gray-500 mb-1">
                    Eesti keeles
                  </label>
                  <input
                    type="text"
                    id="meta_title_et"
                    name="meta_title_et"
                    defaultValue={settings?.meta_title?.et}
                    maxLength={60}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label htmlFor="meta_title_en" className="block text-sm text-gray-500 mb-1">
                    Inglise keeles
                  </label>
                  <input
                    type="text"
                    id="meta_title_en"
                    name="meta_title_en"
                    defaultValue={settings?.meta_title?.en}
                    maxLength={60}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Kuvatakse brauseri vahelehel ja otsingumootorite tulemustes (max 60 tähemärki)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta kirjeldus
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="meta_description_et" className="block text-sm text-gray-500 mb-1">
                    Eesti keeles
                  </label>
                  <textarea
                    id="meta_description_et"
                    name="meta_description_et"
                    defaultValue={settings?.meta_description?.et}
                    maxLength={160}
                    required
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label htmlFor="meta_description_en" className="block text-sm text-gray-500 mb-1">
                    Inglise keeles
                  </label>
                  <textarea
                    id="meta_description_en"
                    name="meta_description_en"
                    defaultValue={settings?.meta_description?.en}
                    maxLength={160}
                    required
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-forest-500 focus:ring-forest-500"
                  />
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Kuvatakse otsingumootorite tulemustes (max 160 tähemärki)
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
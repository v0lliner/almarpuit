import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContent } from '../../lib/hooks/useContent';
import AnimatedSection from '../AnimatedSection';
import Button from '../Button';
import { Phone, Mail, MapPin, AlertCircle, Check, Loader2 } from 'lucide-react';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { translations, isLoading } = useContent('contact');
  const currentLang = i18n.language;
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  if (isLoading) {
    return (
      <div className="section flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('idle');
    
    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <AnimatedSection id="contact" className="bg-stone-100" animation="slide-up">
      <h2 className="section-title">{translations.title?.[currentLang] || t('contact.title')}</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">
              {translations.businessAddressTitle?.[currentLang] || t('contact.industryAddress')}
            </h3>
            <div className="flex items-start mb-4">
              <MapPin className="text-forest-600 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
              <p>{translations.businessAddress?.[currentLang] || t('contact.industryAddressValue')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">
              {translations.legalAddressTitle?.[currentLang] || t('contact.legalAddress')}
            </h3>
            <div className="flex items-start mb-4">
              <MapPin className="text-forest-600 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
              <p>{translations.legalAddress?.[currentLang] || t('contact.legalAddressValue')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">
              {translations.contactTitle?.[currentLang] || t('contact.contactPerson')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>{translations.contact1Name?.[currentLang]}: {translations.contact1Phone?.[currentLang]}</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>{translations.contact1Email?.[currentLang]}</p>
              </div>
              <div className="flex items-center">
                <Phone className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>{translations.contact2Name?.[currentLang]}: {translations.contact2Phone?.[currentLang]}</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>{translations.contact2Email?.[currentLang]}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {/* Map */}
          <div className="h-[400px] bg-stone-200 rounded-lg overflow-hidden shadow-md mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2086.7636245466996!2d27.657347716291172!3d57.984764381216796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46ea969add6e98ed%3A0x2d0c559cee36630e!2sTobrokam%C3%A4e%2C%20Mikitam%C3%A4e%2C%2064301%20P%C3%B5lva%20maakond!5e0!3m2!1set!2see!4v1651234567890!5m2!1set!2see"
              className="w-full h-full border-0"
              style={{ filter: 'contrast(1.2) saturate(1.1)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OÜ Almar Puit location"
            />
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">
              {translations.formTitle?.[currentLang] || t('contact.title')}
            </h3>
            
            {formStatus === 'success' ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-700">{translations.formSuccess?.[currentLang] || t('contact.formSuccess')}</p>
                </div>
              </div>
            ) : formStatus === 'error' ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{translations.formError?.[currentLang] || t('contact.formError')}</p>
                </div>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                  {translations.formLabelName?.[currentLang] || t('contact.formName')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                  {translations.formLabelEmail?.[currentLang] || t('contact.formEmail')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">
                  {translations.formLabelMessage?.[currentLang] || t('contact.formMessage')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                ></textarea>
              </div>
              <Button 
                type="submit" 
                variant="primary"
                className="w-full"
              >
                {translations.formLabelSubmit?.[currentLang] || t('contact.formSubmit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Contact;
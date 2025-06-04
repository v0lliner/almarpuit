import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '../AnimatedSection';
import Button from '../Button';
import { Phone, Mail, MapPin, AlertCircle, Check } from 'lucide-react';

const Contact = () => {
  const { t } = useTranslation();
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    setTimeout(() => {
      // In a real app, you'd send the form data to a server
      setFormStatus(Math.random() > 0.2 ? 'success' : 'error');
      
      if (formStatus === 'success') {
        setFormData({ name: '', email: '', message: '' });
      }
    }, 1000);
  };

  return (
    <AnimatedSection id="contact" className="bg-stone-100" animation="slide-up">
      <h2 className="section-title">{t('contact.title')}</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">{t('contact.industryAddress')}</h3>
            <div className="flex items-start mb-4">
              <MapPin className="text-forest-600 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
              <p>{t('contact.industryAddressValue')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">{t('contact.legalAddress')}</h3>
            <div className="flex items-start mb-4">
              <MapPin className="text-forest-600 mt-1 mr-3 h-5 w-5 flex-shrink-0" />
              <p>{t('contact.legalAddressValue')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">{t('contact.contactPerson')}</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>Margus Alver: +372 51 07 463</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>info@almarpuit.ee</p>
              </div>
              <div className="flex items-center">
                <Phone className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>Siim Alver: +372 5330 4845</p>
              </div>
              <div className="flex items-center">
                <Mail className="text-forest-600 mr-3 h-5 w-5 flex-shrink-0" />
                <p>siim@almarpuit.ee</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          {/* Map */}
          <div className="h-64 bg-stone-200 rounded-lg overflow-hidden shadow-md mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2086.7636245466996!2d27.657347716291172!3d57.984764381216796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46ea969add6e98ed%3A0x2d0c559cee36630e!2sTobrokam%C3%A4e%2C%20Mikitam%C3%A4e%2C%2064301%20P%C3%B5lva%20maakond!5e0!3m2!1set!2see!4v1651234567890!5m2!1set!2see"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="OÜ Almar Puit location"
            ></iframe>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-forest-800">{t('contact.title')}</h3>
            
            {formStatus === 'success' ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-700">{t('contact.formSuccess')}</p>
                </div>
              </div>
            ) : formStatus === 'error' ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-red-700">{t('contact.formError')}</p>
                </div>
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">
                  {t('contact.formName')}
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
                  {t('contact.formEmail')}
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
                  {t('contact.formMessage')}
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
                {t('contact.formSubmit')}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Contact;
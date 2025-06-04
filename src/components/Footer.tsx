import { useTranslation } from 'react-i18next';
import { Link as ScrollLink } from 'react-scroll';
import { TreePine, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useGlobalSettings } from '../lib/hooks/useGlobalSettings';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { settings, isLoading } = useGlobalSettings();
  const currentYear = new Date().getFullYear();
  const currentLang = i18n.language;

  const navItems = [
    { key: 'hero', label: t('header.home') },
    { key: 'about', label: t('header.about') },
    { key: 'products', label: t('header.products') },
    { key: 'woodPurchase', label: t('header.woodPurchase') },
    { key: 'contact', label: t('header.contact') },
  ];

  return (
    <footer className="bg-forest-800 text-forest-100 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <TreePine className="h-8 w-8 text-forest-300 mr-3" />
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  {settings.company_name || 'OÜ Almar Puit'}
                </h3>
                <p className="text-forest-200 text-sm">Est. 2006</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-forest-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-forest-200 mb-1">
                    {t('contact.industryAddress')}:
                  </p>
                  <p className="text-forest-100">
                    {settings.industry_address}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-forest-300 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-forest-200 mb-1">
                    {t('contact.legalAddress')}:
                  </p>
                  <p className="text-forest-100">
                    {settings.legal_address}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="w-5 h-5 text-forest-300 mr-3 flex-shrink-0" />
                <a 
                  href={`tel:${settings.contact_phone}`}
                  className="text-forest-100 hover:text-white transition-colors"
                >
                  {settings.contact_phone}
                </a>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 text-forest-300 mr-3 flex-shrink-0" />
                <a 
                  href={`mailto:${settings.contact_email}`}
                  className="text-forest-100 hover:text-white transition-colors"
                >
                  {settings.contact_email}
                </a>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {t('header.navigation')}
            </h4>
            <nav className="space-y-3">
              {navItems.map((item) => (
                <ScrollLink
                  key={item.key}
                  to={item.key}
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="flex items-center text-forest-100 hover:text-white transition-colors cursor-pointer group"
                >
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </ScrollLink>
              ))}
            </nav>
          </div>

          {/* SEO Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {t('footer.about')}
            </h4>
            <div className="space-y-4">
              <p className="text-forest-100">
                {settings.meta_description?.[currentLang]}
              </p>
              <div className="pt-4 border-t border-forest-700">
                <p className="text-sm text-forest-300">
                  {settings.meta_title?.[currentLang]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-forest-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-forest-300 text-sm text-center md:text-left">
              © {currentYear} {settings.company_name || 'OÜ Almar Puit'}. {t('footer.copyright')}
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <button
                onClick={() => i18n.changeLanguage(currentLang === 'et' ? 'en' : 'et')}
                className="text-sm text-forest-300 hover:text-white transition-colors"
              >
                {currentLang === 'et' ? 'English' : 'Eesti'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
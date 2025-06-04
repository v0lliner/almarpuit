import { useTranslation } from 'react-i18next';
import { TreePine, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest-800 text-forest-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <TreePine className="h-8 w-8 text-forest-300 mr-3" />
            <div>
              <h3 className="font-heading text-xl font-bold text-white">OÜ Almar Puit</h3>
              <p className="text-forest-200 text-sm">Est. 2006</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="h-10 w-10 rounded-full bg-forest-700 flex items-center justify-center text-white hover:bg-forest-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="h-10 w-10 rounded-full bg-forest-700 flex items-center justify-center text-white hover:bg-forest-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-forest-700 pt-6">
          <p className="text-center text-forest-300">
            © {currentYear} OÜ Almar Puit. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { useTranslation } from 'react-i18next';
import { useContent } from '../../lib/hooks/useContent';
import AnimatedSection from '../AnimatedSection';
import Button from '../Button';
import { TreeDeciduousIcon, Loader2 } from 'lucide-react';

const WoodPurchase = () => {
  const { t, i18n } = useTranslation();
  const { translations, images, isLoading } = useContent('woodPurchase');
  const currentLang = i18n.language;

  if (isLoading) {
    return (
      <div className="section flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  return (
    <AnimatedSection id="woodPurchase" animation="slide-up">
      <div 
        className="bg-forest-700 text-white rounded-lg shadow-xl p-8 md:p-12 relative overflow-hidden"
        style={{
          backgroundImage: images.background?.url 
            ? `linear-gradient(rgba(47, 79, 51, 0.8), rgba(47, 79, 51, 0.8)), url("${images.background.url}")` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <TreeDeciduousIcon className="text-white h-48 w-48 absolute top-0 right-0 transform -translate-y-1/4 translate-x-1/4" />
          <TreeDeciduousIcon className="text-white h-36 w-36 absolute bottom-0 left-10 transform translate-y-1/4" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
            {translations.title?.[currentLang] || t('woodPurchase.title')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-forest-50 text-lg leading-relaxed mb-6">
                {translations.content?.[currentLang] || t('woodPurchase.description')}
              </p>
              <Button 
                to="contact" 
                variant="secondary" 
                className="mt-4"
              >
                {translations.cta?.[currentLang] || t('woodPurchase.cta')}
              </Button>
            </div>
            
            <div className="bg-forest-600/60 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">
                {t('woodPurchase.lookingFor.title')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>{t('woodPurchase.lookingFor.items.birchPaper')}</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>{t('woodPurchase.lookingFor.items.heatingWood3m')}</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>{t('woodPurchase.lookingFor.items.limitedLogs')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default WoodPurchase;
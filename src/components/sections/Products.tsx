import { useTranslation } from 'react-i18next';
import { useContent } from '../../lib/hooks/useContent';
import AnimatedSection from '../AnimatedSection';
import { Flame, Thermometer, Loader2 } from 'lucide-react';

const Products = () => {
  const { t, i18n } = useTranslation();
  const { translations, images, isLoading } = useContent('products');
  const currentLang = i18n.language;

  if (isLoading) {
    return (
      <div className="section flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  return (
    <AnimatedSection id="products" className="bg-stone-100" animation="slide-up">
      <h2 className="section-title">{translations.title?.[currentLang] || t('products.title')}</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Fireplace Wood */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="h-64 overflow-hidden">
            <img
              src={images.fireplaceWoodImage?.url || "https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg?auto=compress&cs=tinysrgb&w=1600"}
              alt={images.fireplaceWoodImage?.alt_text || "Fireplace wood"}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Flame className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-2xl font-bold text-forest-800">
                {translations.fireplaceWoodTitle?.[currentLang] || t('products.fireplaceWood.title')}
              </h3>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {translations.fireplaceWoodDescription?.[currentLang] || t('products.fireplaceWood.description')}
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              {(translations.fireplaceWoodFeatures?.[currentLang] || '').split('\n').map((feature, index) => (
                <div key={index} className="bg-forest-50 p-3 rounded-md text-center">
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Heating Wood */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="h-64 overflow-hidden">
            <img
              src={images.heatingWoodImage?.url || "https://images.pexels.com/photos/5965528/pexels-photo-5965528.jpeg?auto=compress&cs=tinysrgb&w=1600"}
              alt={images.heatingWoodImage?.alt_text || "Heating wood"}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Thermometer className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-2xl font-bold text-forest-800">
                {translations.heatingWoodTitle?.[currentLang] || t('products.heatingWood.title')}
              </h3>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {translations.heatingWoodDescription?.[currentLang] || t('products.heatingWood.description')}
            </p>
            
            <div className="mt-6 flex flex-col space-y-2">
              {(translations.heatingWoodFeatures?.[currentLang] || '').split('\n').map((feature, index) => (
                <div key={index} className="bg-forest-50 p-3 rounded-md">
                  <span className="font-medium">✓ {feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Products;
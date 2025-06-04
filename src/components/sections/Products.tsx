import { useTranslation } from 'react-i18next';
import AnimatedSection from '../AnimatedSection';
import { Flame, Thermometer } from 'lucide-react';

const Products = () => {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="products" className="bg-stone-100" animation="slide-up">
      <h2 className="section-title">{t('products.title')}</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        {/* Fireplace Wood */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="h-64 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Fireplace wood"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Flame className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-2xl font-bold text-forest-800">{t('products.fireplaceWood.title')}</h3>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {t('products.fireplaceWood.description')}
            </p>
            
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-forest-50 p-3 rounded-md text-center">
                <span className="font-medium">30 cm</span>
              </div>
              <div className="bg-forest-50 p-3 rounded-md text-center">
                <span className="font-medium">25 cm</span>
              </div>
              <div className="bg-forest-50 p-3 rounded-md text-center">
                <span className="font-medium">40L</span>
              </div>
              <div className="bg-forest-50 p-3 rounded-md text-center">
                <span className="font-medium">2 m³</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Heating Wood */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="h-64 overflow-hidden">
            <img
              src="https://images.pexels.com/photos/5965528/pexels-photo-5965528.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Heating wood"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Thermometer className="w-6 h-6 text-amber-600 mr-3" />
              <h3 className="text-2xl font-bold text-forest-800">{t('products.heatingWood.title')}</h3>
            </div>
            <p className="text-stone-700 leading-relaxed">
              {t('products.heatingWood.description')}
            </p>
            
            <div className="mt-6 flex flex-col space-y-2">
              <div className="bg-forest-50 p-3 rounded-md">
                <span className="font-medium">✓ {t('products.heatingWood.title')} - Ahi/Pliit</span>
              </div>
              <div className="bg-forest-50 p-3 rounded-md">
                <span className="font-medium">✓ Kohandatav pikkus</span>
              </div>
              <div className="bg-forest-50 p-3 rounded-md">
                <span className="font-medium">✓ Aastaringne kättesaadavus</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default Products;
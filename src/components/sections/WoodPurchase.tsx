import { useTranslation } from 'react-i18next';
import AnimatedSection from '../AnimatedSection';
import Button from '../Button';
import { TreeDeciduousIcon } from 'lucide-react';

const WoodPurchase = () => {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="woodPurchase" animation="slide-up">
      <div className="bg-forest-700 text-white rounded-lg shadow-xl p-8 md:p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <TreeDeciduousIcon className="text-white h-48 w-48 absolute top-0 right-0 transform -translate-y-1/4 translate-x-1/4" />
          <TreeDeciduousIcon className="text-white h-36 w-36 absolute bottom-0 left-10 transform translate-y-1/4" />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">{t('woodPurchase.title')}</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-forest-50 text-lg leading-relaxed mb-6">
                {t('woodPurchase.description')}
              </p>
              <Button 
                to="contact" 
                variant="secondary" 
                className="mt-4"
              >
                {t('woodPurchase.cta')}
              </Button>
            </div>
            
            <div className="bg-forest-600/60 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-white">Otsime:</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>Kasepaberipuud</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>3m küttepuud</span>
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-amber-400 rounded-full mr-2"></span>
                  <span>Piiratud koguses palki</span>
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
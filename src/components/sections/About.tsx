import { useTranslation } from 'react-i18next';
import { useContent } from '../../lib/hooks/useContent';
import { useMilestoneCards } from '../../lib/hooks/useMilestoneCards';
import AnimatedSection from '../AnimatedSection';
import { Loader2 } from 'lucide-react';

const About = () => {
  const { t, i18n } = useTranslation();
  const { translations, images, isLoading: contentLoading } = useContent('about');
  const { cards, isLoading: cardsLoading } = useMilestoneCards('about');
  const currentLang = i18n.language;

  if (contentLoading || cardsLoading) {
    return (
      <div className="section flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-forest-600 animate-spin" />
      </div>
    );
  }

  return (
    <AnimatedSection id="about" animation="slide-up">
      <div 
        className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8)), url("${images.background?.url || 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1600'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="section-title">{translations.title?.[currentLang] || t('about.title')}</h2>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed">
            {translations.content?.[currentLang] || t('about.description')}
          </p>
          
          <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
            {cards.length > 0 ? (
              cards.map((card) => (
                <div key={card.id} className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
                  <p className="font-heading text-xl text-forest-700 mb-2">
                    {card.year_number}
                  </p>
                  <p className="text-forest-600">
                    {currentLang === 'et' ? card.description_et : card.description_en}
                  </p>
                </div>
              ))
            ) : (
              // Fallback to translation files if no cards in database
              <>
                <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
                  <p className="font-heading text-xl text-forest-700 mb-2">
                    {t('about.stats.founded.year')}
                  </p>
                  <p className="text-forest-600">
                    {t('about.stats.founded.label')}
                  </p>
                </div>
                
                <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
                  <p className="font-heading text-xl text-forest-700 mb-2">
                    {t('about.stats.supported.organization')}
                  </p>
                  <p className="text-forest-600">
                    {t('about.stats.supported.label')}
                  </p>
                </div>
                
                <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
                  <p className="font-heading text-xl text-forest-700 mb-2">
                    {t('about.stats.location.region')}
                  </p>
                  <p className="text-forest-600">
                    {t('about.stats.location.label')}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default About;
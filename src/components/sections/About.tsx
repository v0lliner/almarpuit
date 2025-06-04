import { useTranslation } from 'react-i18next';
import AnimatedSection from '../AnimatedSection';

const About = () => {
  const { t } = useTranslation();

  return (
    <AnimatedSection id="about" animation="slide-up">
      <div 
        className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.8)), url("https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h2 className="section-title">{t('about.title')}</h2>
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed">
            {t('about.description')}
          </p>
          
          <div className="mt-10 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
              <p className="font-heading text-xl text-forest-700 mb-2">2006</p>
              <p className="text-forest-600">Asutatud</p>
            </div>
            
            <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
              <p className="font-heading text-xl text-forest-700 mb-2">PRIA</p>
              <p className="text-forest-600">Toetatud</p>
            </div>
            
            <div className="bg-forest-50 border border-forest-100 p-6 rounded-lg flex-1 shadow-sm">
              <p className="font-heading text-xl text-forest-700 mb-2">Kagu-Eesti</p>
              <p className="text-forest-600">Asukoht</p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default About;
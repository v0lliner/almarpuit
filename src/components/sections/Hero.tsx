import { useTranslation } from 'react-i18next';
import Button from '../Button';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: 'url("https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=1600")',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-800/40 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto drop-shadow-md">
          {t('hero.subtitle')}
        </p>
        <Button 
          to="products"
          variant="primary"
          className="text-lg px-8 py-4"
        >
          {t('hero.cta')}
        </Button>
      </div>
    </section>
  );
};

export default Hero;
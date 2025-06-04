import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  isScrolled: boolean;
}

const LanguageSwitcher = ({ isScrolled }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'et' ? 'en' : 'et';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className={`px-3 py-1 rounded-md border-2 font-medium text-sm transition-colors ${
        isScrolled 
          ? 'border-forest-600 text-forest-700 hover:bg-forest-50' 
          : 'border-white text-white hover:bg-white/10'
      }`}
    >
      {currentLanguage === 'et' ? 'EN' : 'ET'}
    </button>
  );
};

export default LanguageSwitcher;
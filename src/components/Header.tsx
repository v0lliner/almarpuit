import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as ScrollLink } from 'react-scroll';
import { Menu, X, TreePine } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { key: 'hero', label: t('header.home') },
    { key: 'about', label: t('header.about') },
    { key: 'products', label: t('header.products') },
    { key: 'woodPurchase', label: t('header.woodPurchase') },
    { key: 'contact', label: t('header.contact') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <TreePine className="h-8 w-8 text-forest-700 mr-2" />
            <span className="font-heading text-xl font-bold text-forest-800">Almar Puit</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <ScrollLink
                key={item.key}
                to={item.key}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className={`cursor-pointer font-medium hover:text-forest-600 transition-colors ${
                  isScrolled ? 'text-forest-800' : 'text-white'
                }`}
              >
                {item.label}
              </ScrollLink>
            ))}
            <LanguageSwitcher isScrolled={isScrolled} />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher isScrolled={isScrolled} />
            <button 
              onClick={toggleMenu}
              className="ml-4 p-1 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-forest-800' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-forest-800' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden ${
            isMenuOpen 
              ? 'max-h-screen opacity-100 visible' 
              : 'max-h-0 opacity-0 invisible'
          } transition-all duration-300 overflow-hidden`}
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => (
              <ScrollLink
                key={item.key}
                to={item.key}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                onClick={closeMenu}
                className="block py-2 px-4 text-forest-800 hover:bg-forest-50 rounded-md font-medium cursor-pointer"
              >
                {item.label}
              </ScrollLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
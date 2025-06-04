import { Routes, Route } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import ProductsSection from './sections/ProductsSection';
import WoodPurchaseSection from './sections/WoodPurchaseSection';
import ContactSection from './sections/ContactSection';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Töölaud</div>} />
      <Route path="/hero" element={<HeroSection />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/products" element={<ProductsSection />} />
      <Route path="/wood-purchase" element={<WoodPurchaseSection />} />
      <Route path="/contact" element={<ContactSection />} />
      <Route path="*" element={<div>Lehte ei leitud</div>} />
    </Routes>
  );
}
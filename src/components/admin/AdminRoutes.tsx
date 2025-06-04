import { Routes, Route } from 'react-router-dom';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>Dashboard</div>} />
      <Route path="/hero" element={<HeroSection />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}
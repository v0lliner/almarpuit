import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Products from './components/sections/Products';
import WoodPurchase from './components/sections/WoodPurchase';
import Contact from './components/sections/Contact';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import './App.css';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="font-sans">
              <Header />
              <main>
                <Hero />
                <About />
                <Products />
                <WoodPurchase />
                <Contact />
              </main>
              <Footer />
            </div>
          }
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
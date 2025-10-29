import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Features from './components/Features';
import HardwareSpec from './components/HardwareSpec';
import Pricing from './components/Pricing';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import ImageGallery from './components/ImageGallery';

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleSelectProduct = (productName: string) => {
    setSelectedProduct(productName);
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="bg-dark-bg text-gray-200 font-sans antialiased relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <Partners />
          <Features />
          <HardwareSpec onSelectProduct={handleSelectProduct} />
          <ImageGallery />
          <Pricing />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;

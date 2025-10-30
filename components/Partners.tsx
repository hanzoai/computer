
import React from 'react';

const HanzoAILogo = () => (
    <div className="flex items-center space-x-2">
        <span className="text-3xl font-bold text-gray-400">Hanzo<span className="text-secondary">.</span>AI</span>
    </div>
);

const NvidiaInceptionLogo = () => (
    <div className="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="316.2 33.8 630.2 118.2" className="h-10 w-auto fill-[#76B900]">
            <path d="M578.2 34v118h33.3V34h-33.3zm-262-.2v118.1h33.6V60.2l26.2.1c8.6 0 14.6 2.1 18.7 6.5 5.3 5.6 7.4 14.7 7.4 31.2v53.9h32.6V86.7c0-46.6-29.7-52.9-58.7-52.9h-59.8zm315.7.2v118h54c28.8 0 38.2-4.8 48.3-15.5 7.2-7.5 11.8-24.1 11.8-42.2 0-16.6-3.9-31.4-10.8-40.6C723 37.2 705.2 34 678.6 34h-46.7zm33 25.6h14.3c20.8 0 34.2 9.3 34.2 33.5s-13.4 33.6-34.2 33.6h-14.3V59.6zM530.2 34l-27.8 93.5L475.8 34h-36l38 118h48l38.4-118h-34zm231.4 118h33.3V34h-33.3v118zM855 34l-46.5 117.9h32.8l7.4-20.9h55l7 20.8h35.7L899.5 34H855zm21.6 21.5l20.2 55.2h-41l20.8-55.2z"/>
        </svg>
        <span className="text-3xl font-bold text-gray-400">NVIDIA Inception</span>
    </div>
);


const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 opacity-60">
          <HanzoAILogo />
          <div className="h-10 w-px bg-gray-700 hidden md:block"></div>
          <NvidiaInceptionLogo />
        </div>
      </div>
    </section>
  );
};

export default Partners;

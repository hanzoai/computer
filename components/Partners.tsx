
import React from 'react';

const HanzoAILogo = () => (
    <div className="flex items-center space-x-3">
        <img src="/hanzo-h-white.svg" alt="Hanzo" className="h-10 w-auto opacity-60" />
        <span className="text-3xl font-bold text-gray-400">Hanzo AI</span>
    </div>
);

const NvidiaInceptionLogo = () => (
    <div className="flex items-center justify-center">
        <img src="/nvidia-inception-simple.svg" alt="NVIDIA Inception Program" className="h-16 w-auto opacity-60" />
    </div>
);

const TechstarsLogo = () => (
    <div className="flex items-center justify-center">
        <img src="/techstars-white.svg" alt="Techstars" className="h-8 w-auto opacity-60" />
    </div>
);


const Partners: React.FC = () => {
  return (
    <section className="py-12 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16">
          <HanzoAILogo />
          <div className="h-10 w-px bg-gray-700 hidden md:block"></div>
          <NvidiaInceptionLogo />
          <div className="h-10 w-px bg-gray-700 hidden md:block"></div>
          <TechstarsLogo />
        </div>
      </div>
    </section>
  );
};

export default Partners;

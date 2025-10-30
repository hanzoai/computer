
import React from 'react';

const HanzoAILogo = () => (
    <div className="flex items-center space-x-2">
        <span className="text-3xl font-bold text-gray-400">Hanzo<span className="text-secondary">.</span>AI</span>
    </div>
);

const NvidiaInceptionLogo = () => (
    <div className="flex items-center justify-center">
        <img src="/nvidia-inception-logo.png" alt="NVIDIA Inception Program" className="h-12 w-auto opacity-60" />
    </div>
);

const TechstarsLogo = () => (
    <div className="flex items-center justify-center">
        <img src="/techstars-logo.png" alt="Techstars" className="h-12 w-auto opacity-60" />
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

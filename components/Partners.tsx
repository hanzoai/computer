
import React from 'react';

const HanzoAILogo = () => (
    <div className="flex items-center space-x-2">
        <span className="text-3xl font-bold text-gray-400">Hanzo<span className="text-secondary">.</span>AI</span>
    </div>
);

const NvidiaInceptionLogo = () => (
    <div className="flex items-center space-x-3">
        <svg width="24" height="24" viewBox="0 0 108 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto"><path d="M103.571 52.8856L99.4286 56.4V19.6L103.571 23.1144V52.8856ZM95.1429 60.1144L82.1429 71.4856V4.5144L95.1429 15.8856V60.1144ZM77.8571 75.8L61.1429 61.8286V14.1714L77.8571 0.2V75.8ZM4.42857 23.1144L8.57143 19.6V56.4L4.42857 52.8856V23.1144ZM12.8571 15.8856L25.8571 4.5144V71.4856L12.8571 60.1144V15.8856ZM30.1429 0.2L46.8571 14.1714V61.8286L30.1429 75.8V0.2ZM54 26.9144L48.8571 31.3714V44.6286L54 49.0856L59.1429 44.6286V31.3714L54 26.9144Z" fill="#76B900"></path></svg>
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


import React from 'react';

const NvidiaInceptionLogo = () => (
    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm border border-dark-border px-4 py-2 rounded-full">
        <svg width="24" height="24" viewBox="0 0 108 76" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto"><path d="M103.571 52.8856L99.4286 56.4V19.6L103.571 23.1144V52.8856ZM95.1429 60.1144L82.1429 71.4856V4.5144L95.1429 15.8856V60.1144ZM77.8571 75.8L61.1429 61.8286V14.1714L77.8571 0.2V75.8ZM4.42857 23.1144L8.57143 19.6V56.4L4.42857 52.8856V23.1144ZM12.8571 15.8856L25.8571 4.5144V71.4856L12.8571 60.1144V15.8856ZM30.1429 0.2L46.8571 14.1714V61.8286L30.1429 75.8V0.2ZM54 26.9144L48.8571 31.3714V44.6286L54 49.0856L59.1429 44.6286V31.3714L54 26.9144Z" fill="#76B900"></path></svg>
        <span className="text-gray-300 text-sm font-medium">NVIDIA Inception Partner</span>
    </div>
)

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-24 pb-12 relative overflow-hidden">
        <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{backgroundImage: "url('/nvidia-dgx-superpod.jpg')"}}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg/80 to-dark-bg"></div>

        <div className="container mx-auto px-6 text-center relative z-10 animate-fade-in-up">
            <div className="flex justify-center mb-6">
                <NvidiaInceptionLogo />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
                AI Supercomputing 
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                On Your Terms
                </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-10">
                Your portal to the world's most powerful AI hardware. Rent, buy, or co-locate NVIDIA DGX systems, H100s, and H200s, all managed by the experts at <span className="text-white font-medium">Hanzo.AI</span>.
            </p>
            <div className="flex justify-center items-center space-x-4">
                <a href="#pricing" className="bg-primary text-black font-bold py-4 px-10 rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 text-lg">
                    Get Started
                </a>
                <a href="#hardware" className="border border-dark-border text-white font-medium py-4 px-10 rounded-lg hover:bg-white/10 transition-all duration-300 text-lg">
                    View Hardware
                </a>
            </div>
        </div>
    </section>
  );
};

export default Hero;
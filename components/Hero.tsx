
import React from 'react';

const PartnerLogos = () => (
    <div className="flex items-center justify-center gap-6 flex-wrap">
        <div className="bg-black/30 backdrop-blur-sm border border-dark-border px-4 py-2 rounded-lg">
            <img src="/nvidia-inception-logo.png" alt="NVIDIA Inception Program" className="h-8 w-auto" />
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-dark-border px-4 py-2 rounded-lg">
            <img src="/techstars-logo.png" alt="Techstars" className="h-8 w-auto" />
        </div>
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
                <PartnerLogos />
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

import React, { useState, useEffect } from 'react';

const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg viewBox="0 0 67 67" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
        <path d="M22.21 67V44.6369H0V67H22.21Z" fill="currentColor"></path>
        <path d="M0 44.6369L22.21 46.8285V44.6369H0Z" fill="currentColor" opacity="0.7"></path>
        <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" fill="currentColor"></path>
        <path d="M22.21 0H0V22.3184H22.21V0Z" fill="currentColor"></path>
        <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" fill="currentColor"></path>
        <path d="M66.6753 22.3185L44.5098 20.0822V22.3185H66.6753Z" fill="currentColor" opacity="0.7"></path>
        <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" fill="currentColor"></path>
    </svg>
    <div className="text-xl font-bold tracking-wider">
        <span className="text-white">Hanzo</span>
        <span className="text-primary">.</span>
        <span className="text-gray-400">Computer</span>
    </div>
  </div>
);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#hardware', label: 'Hardware' },
    { href: '#pricing', label: 'Pricing' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-bg/80 backdrop-blur-lg border-b border-dark-border' : 'bg-transparent'}`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home" aria-label="Hanzo.Computer Home">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-300">
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
            <a href="#contact" className="hidden sm:inline-block bg-primary text-black font-bold py-2 px-6 rounded-md hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
                Request Access
            </a>
            <button
              className="md:hidden text-white z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
              )}
            </button>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-dark-card transition-all duration-300 ease-in-out transform ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="flex flex-col items-center space-y-4 py-6">
             {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-300 text-lg" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a href="#contact" className="w-11/12 text-center bg-primary text-black font-bold py-3 px-6 rounded-md hover:bg-primary-dark transition-all duration-300 transform hover:scale-105" onClick={() => setIsMenuOpen(false)}>
                  Request Access
              </a>
          </div>
      </div>
    </header>
  );
};

export default Header;

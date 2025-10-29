import React from 'react';

const images = [
  { src: 'https://images.nvidia.com/aem-dam/Solutions/Data-Center/dgx-superpod/dgx-superpod-liquid-cooled-d.jpg', alt: 'NVIDIA DGX SuperPOD' },
  { src: 'https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/grace-cpu-superchip/grace-cpu-superchip-d.png', alt: 'NVIDIA Grace CPU Superchip' },
  { src: 'https://nvidianews.nvidia.com/media/509012/israel-1-supercomputer-dgx-superpod.jpg', alt: 'Datacenter aisle with NVIDIA hardware' },
  { src: 'https://www.nvidia.com/content/dam/en-zz/Solutions/geforce/ada-lovelace-architecture/rtx-40-series-dlss-3-article-hero-d.jpg', alt: 'Abstract visualization of AI network' },
  { src: 'https://www.nvidia.com/content/dam/en-zz/Solutions/drive/thor/drive-thor-soc-3qtr-d.jpg', alt: 'NVIDIA DRIVE Thor SoC' },
  { src: 'https://images.nvidia.com/aem-dam/Solutions/omniverse/omniverse-enterprise-og-1200x630.jpg', alt: 'Digital twin of Earth with data streams' },
];

const ImageGallery: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Inside the AI Revolution</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">A glimpse into the technology powering the future, from silicon to supercomputers.</p>
        </div>
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg break-inside-avoid">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300" 
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;

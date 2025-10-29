
import React from 'react';

const hardware = [
    {
        category: 'The Universal AI System',
        name: 'NVIDIA DGX H100',
        description: 'The universal system for all AI workloads. DGX H100 is the foundational block of DGX SuperPODs, providing the power to train massive models at scale.',
        imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/dgx-h100/dgx-h100-system-3qtr-d.png',
        stats: [
          { value: '8x', label: 'NVIDIA H100 GPUs' },
          { value: '640 GB', label: 'Total GPU Memory' },
          { value: '32 PFLOPS', label: 'FP8 AI Performance' },
          { value: '2x', label: 'Intel Xeon Platinum CPUs' },
          { value: '4x', label: 'NVSwitch' },
          { value: '30TB', label: 'NVMe SSD' },
        ]
    },
    {
        category: 'The Generative AI Engine',
        name: 'NVIDIA H200 GPU',
        description: 'The H200 is the first GPU to offer HBM3e, delivering 141GB of memory at 4.8 terabytes per second to handle massive datasets for generative AI and HPC.',
        imageUrl: 'https://nvidianews.nvidia.com/media/854894/nvidia-h200-gpu.jpg',
        stats: [
            { value: '141 GB', label: 'HBM3e Memory' },
            { value: '4.8 TB/s', label: 'Memory Bandwidth' },
            { value: '97 TFLOPS', label: 'FP64 Performance' },
            { value: '4 PFLOPS', label: 'FP8 AI Performance' },
            { value: 'Hopper', label: 'Architecture' },
            { value: '900 GB/s', label: 'NVLink C2C' },
        ]
    },
    {
        category: 'The AI Workhorse',
        name: 'NVIDIA H100 GPU',
        description: 'The NVIDIA H100 Tensor Core GPU delivers unprecedented performance, scalability, and security for every data center, accelerating workloads from enterprise AI to HPC.',
        imageUrl: 'https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/h100/nvidia-h100-pcie-800x450-d.jpg',
        stats: [
            { value: '80 GB', label: 'HBM3 Memory' },
            { value: '3.35 TB/s', label: 'Memory Bandwidth' },
            { value: '67 TFLOPS', label: 'FP64 Performance' },
            { value: '2 PFLOPS', label: 'FP8 AI Performance' },
            { value: 'Hopper', label: 'Architecture' },
            { value: 'PCIe Gen5', label: 'System Interface' },
        ]
    },
];

const Stat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <div className="text-center">
        <p className="text-2xl md:text-3xl font-bold text-primary">{value}</p>
        <p className="text-gray-400 text-sm mt-1">{label}</p>
    </div>
);

const HardwareCard: React.FC<{ item: typeof hardware[0], onSelectProduct: (name: string) => void }> = ({ item, onSelectProduct }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl overflow-hidden flex flex-col">
        <div className="bg-black p-4">
            <img src={item.imageUrl} alt={item.name} className="w-full h-80 object-contain aspect-video" />
        </div>
        <div className="p-8 flex-grow flex flex-col">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">{item.category}</span>
            <h3 className="text-3xl font-bold text-white mt-2 mb-4">{item.name}</h3>
            <p className="text-gray-400 mb-6 flex-grow">{item.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-dark-border">
                {item.stats.map(stat => <Stat key={stat.label} {...stat} />)}
            </div>
            <div className="mt-8">
                <button 
                  onClick={() => onSelectProduct(item.name)} 
                  className="w-full bg-primary text-black font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                >
                  Request Access
                </button>
            </div>
        </div>
    </div>
);


const HardwareSpec: React.FC<{ onSelectProduct: (name: string) => void }> = ({ onSelectProduct }) => {
  return (
    <section id="hardware" className="py-20 md:py-28 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Explore Our Hardware Fleet</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Access the most powerful and sought-after AI accelerators on the market.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-6xl mx-auto">
            {hardware.map(item => <HardwareCard key={item.name} item={item} onSelectProduct={onSelectProduct} />)}
        </div>
      </div>
    </section>
  );
};

export default HardwareSpec;
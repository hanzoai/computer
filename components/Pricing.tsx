
import React from 'react';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const PricingCard: React.FC<{ plan: any }> = ({ plan }) => (
    <div className={`relative border rounded-xl p-8 flex flex-col ${plan.popular ? 'border-primary' : 'border-dark-border bg-dark-card'}`}>
      {plan.popular && <span className="absolute -top-3.5 left-8 bg-primary text-black text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>}
      <h3 className="text-2xl font-bold text-white mt-2">{plan.name}</h3>
      <p className="text-gray-400 mt-2 mb-6 flex-grow">{plan.description}</p>
      <div className="mb-6">
        <span className="text-5xl font-extrabold text-white">{plan.price}</span>
        <span className="text-gray-400 ml-2">{plan.period}</span>
      </div>
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="text-primary mt-1 mr-3 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <a href="#contact" className={`mt-auto w-full text-center font-bold py-3 px-6 rounded-lg transition-all duration-300 ${plan.popular ? 'bg-primary text-black hover:bg-primary-dark' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        {plan.cta}
      </a>
    </div>
)

const plans = [
    {
        name: 'DGX Spark',
        price: '$4,000',
        period: 'One-Time Setup',
        description: 'Perfect for startups and researchers to kickstart projects on a powerful, dedicated DGX instance.',
        features: [
            'Dedicated DGX Instance',
            '100 Hours Compute Included',
            '2 TB NVMe Storage',
            'Pre-configured AI Stack',
            'Community & Docs Support',
        ],
        cta: 'Request Access',
        popular: true,
    },
    {
        name: 'GPU On-Demand',
        price: 'Usage-Based',
        period: '',
        description: 'Flexible access to raw H100 and H200 GPU power. Pay only for what you use, billed per hour.',
        features: [
            'Access to H100 & H200 GPUs',
            'Scale from 1 to 100s of GPUs',
            'Persistent Storage Options',
            'Ideal for Inference & Fine-tuning',
            'Priority Email Support',
        ],
        cta: 'Get Started'
    },
    {
        name: 'Enterprise & Resale',
        price: 'Custom',
        period: '',
        description: 'For large-scale deployments, custom SuperPODs, and hardware resale partnerships.',
        features: [
            'Dedicated DGX SuperPODs',
            'Hardware Procurement & Resale',
            'Custom Networking & Security',
            '24/7 Dedicated Support SLA',
            'Managed Services by Hanzo.AI',
        ],
        cta: 'Contact Sales'
    }
]

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white">No Subscriptions. Just Compute.</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">Choose the right amount of power for your needs. No hidden fees, no monthly commitments.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => <PricingCard key={index} plan={plan} />)}
        </div>
      </div>
    </section>
  );
};

export default Pricing;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    priceValue: number;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular?: boolean;
    purchaseMethod: 'stripe' | 'sales';
    salesLink?: string;
  };
}

const PricingCard: React.FC<PricingCardProps> = ({ plan }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAction = () => {
    if (plan.purchaseMethod === 'stripe') {
      // Add to cart and show feedback
      addItem({
        id: plan.id,
        name: plan.name,
        price: plan.priceValue,
        description: plan.description,
        purchaseMethod: 'stripe',
        image: '/nvidia-dgx-spark-and-nvidia-dgx-station.jpg',
      });
      setAdded(true);
      setTimeout(() => {
        navigate('/cart');
      }, 800);
    } else if (plan.salesLink) {
      // Open sales link
      window.open(plan.salesLink, '_blank');
    }
  };

  return (
    <div className={`relative border rounded-xl p-8 flex flex-col ${plan.popular ? 'border-primary' : 'border-dark-border bg-dark-card'}`}>
      {plan.popular && (
        <div className="absolute -top-3.5 left-8 flex gap-2">
          <span className="bg-primary text-black text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>
          {plan.purchaseMethod === 'stripe' && (
            <span className="bg-green-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Buy Now
            </span>
          )}
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mt-2">{plan.name}</h3>
      <p className="text-gray-400 mt-2 mb-6 flex-grow">{plan.description}</p>
      <div className="mb-6">
        <span className="text-5xl font-extrabold text-white">{plan.price}</span>
        <span className="text-gray-400 ml-2">{plan.period}</span>
      </div>

      {plan.purchaseMethod === 'stripe' && (
        <>
          <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-primary font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pay with Credit Card (Stripe)
            </p>
          </div>
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-sm text-amber-400 font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Limited Supply - Max 5 per order
            </p>
          </div>
        </>
      )}

      {plan.purchaseMethod === 'sales' && (
        <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
          <p className="text-sm text-secondary font-semibold flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {plan.id === 'cloud-compute' ? 'Visit Hanzo Cloud' : 'Contact Sales Required'}
          </p>
        </div>
      )}

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="text-primary mt-1 mr-3 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={handleAction}
        disabled={added}
        className={`mt-auto w-full text-center font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
          added
            ? 'bg-green-500 text-white cursor-default'
            : plan.popular
            ? 'bg-primary text-black hover:bg-primary-dark'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {added ? (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart!
          </>
        ) : (
          plan.cta
        )}
      </button>
    </div>
  );
}

const plans = [
    {
        id: 'dgx-spark',
        name: 'DGX Spark',
        price: '$4,000',
        priceValue: 4000,
        period: 'One-Time Setup',
        description: 'Perfect for startups and researchers to kickstart projects on a powerful, dedicated DGX instance.',
        features: [
            'Dedicated DGX Instance',
            '100 Hours Compute Included',
            '2 TB NVMe Storage',
            'Pre-configured AI Stack',
            'Community & Docs Support',
        ],
        cta: 'Add to Cart',
        popular: true,
        purchaseMethod: 'stripe' as const,
    },
    {
        id: 'cloud-compute',
        name: 'Cloud Compute',
        price: 'Usage-Based',
        priceValue: 0,
        period: '',
        description: 'Need on-demand GPU access? Check out Hanzo Cloud for flexible, pay-as-you-go H100 and H200 GPU compute.',
        features: [
            'Access to H100 & H200 GPUs',
            'Scale from 1 to 100s of GPUs',
            'Pay only for what you use',
            'Ideal for Inference & Fine-tuning',
            'Full Hanzo.AI Cloud Platform',
        ],
        cta: 'Visit Hanzo Cloud',
        purchaseMethod: 'sales' as const,
        salesLink: 'https://hanzo.ai',
    },
    {
        id: 'enterprise-resale',
        name: 'Enterprise & Resale',
        price: 'Custom',
        priceValue: 0,
        period: '',
        description: 'For large-scale deployments, custom SuperPODs, and hardware resale partnerships.',
        features: [
            'Dedicated DGX SuperPODs',
            'Hardware Procurement & Resale',
            'Custom Networking & Security',
            '24/7 Dedicated Support SLA',
            'Managed Services by Hanzo.AI',
        ],
        cta: 'Contact Sales',
        purchaseMethod: 'sales' as const,
        salesLink: 'https://hanzo.ai/contact',
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

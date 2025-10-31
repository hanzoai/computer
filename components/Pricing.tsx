
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../src/context/CartContext';

const CheckIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

// Toggle switch component
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  leftLabel: string;
  rightLabel: string;
}> = ({ enabled, onChange, leftLabel, rightLabel }) => (
  <div className="flex items-center justify-center gap-3">
    <span className={`text-sm font-medium ${!enabled ? 'text-white' : 'text-gray-500'}`}>
      {leftLabel}
    </span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-primary' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
    <span className={`text-sm font-medium ${enabled ? 'text-white' : 'text-gray-500'}`}>
      {rightLabel}
    </span>
  </div>
);

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: string;
    priceValue: number;
    leasePrice?: string;
    leasePriceValue?: number;
    period: string;
    description: string;
    features: string[];
    leaseFeatures?: string[];
    cta: string;
    popular?: boolean;
    mostPopularLease?: boolean;
    purchaseMethod: 'stripe' | 'sales';
    salesLink?: string;
  };
  isLeaseMode: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isLeaseMode }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const currentPrice = isLeaseMode && plan.leasePrice ? plan.leasePrice : plan.price;
  const currentPriceValue = isLeaseMode && plan.leasePriceValue ? plan.leasePriceValue : plan.priceValue;
  const currentPeriod = isLeaseMode && plan.leasePrice ? 'per month' : plan.period;
  const currentFeatures = isLeaseMode && plan.leaseFeatures ? plan.leaseFeatures : plan.features;
  const isPopular = isLeaseMode ? plan.mostPopularLease : plan.popular;

  const handleAction = () => {
    if (plan.purchaseMethod === 'stripe') {
      // Add to cart and show feedback
      addItem({
        id: isLeaseMode ? `${plan.id}-lease` : plan.id,
        name: plan.name,
        price: currentPriceValue,
        description: plan.description,
        purchaseMethod: 'stripe',
        image: '/nvidia-dgx-spark-and-nvidia-dgx-station.jpg',
        subscriptionType: isLeaseMode ? 'monthly' : 'one-time',
        interval: isLeaseMode ? 'monthly' : undefined,
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
    <div className={`relative border rounded-xl p-8 flex flex-col ${isPopular ? 'border-primary' : 'border-dark-border bg-dark-card'}`}>
      {(isPopular || (isLeaseMode && plan.leasePrice)) && (
        <div className="absolute -top-3.5 left-8 flex gap-2">
          {isPopular && (
            <span className="bg-primary text-black text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>
          )}
          {isLeaseMode && plan.leasePrice && (
            <span className="bg-purple-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Monthly</span>
          )}
          {plan.purchaseMethod === 'stripe' && !isLeaseMode && (
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
        <span className="text-5xl font-extrabold text-white">{currentPrice}</span>
        <span className="text-gray-400 ml-2">{currentPeriod}</span>
      </div>

      {plan.purchaseMethod === 'stripe' && (
        <>
          <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-primary font-semibold flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {isLeaseMode ? 'Monthly Subscription (Auto-renew)' : 'Pay with Credit Card (Stripe)'}
            </p>
          </div>
          {isLeaseMode ? (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400 font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                1-month minimum • Cancel anytime
              </p>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-400 font-semibold flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Limited Supply - Max 5 per order
              </p>
            </div>
          )}
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
        {currentFeatures.map((feature: string, index: number) => (
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

const gpuPlans = [
    {
        id: 'dgx-spark',
        name: 'DGX Spark',
        price: '$4,000',
        priceValue: 4000,
        leasePrice: '$1,200',
        leasePriceValue: 1200,
        period: 'One-Time Setup',
        description: 'Perfect for startups and researchers to kickstart projects on a powerful, dedicated DGX instance.',
        features: [
            'Dedicated DGX Instance',
            '100 Hours Compute Included',
            '2 TB NVMe Storage',
            'Pre-configured AI Stack',
            'Community & Docs Support',
        ],
        leaseFeatures: [
            'Dedicated DGX Instance',
            'Unlimited Monthly Compute',
            '2 TB NVMe Storage',
            'Pre-configured AI Stack',
            '24/7 Support Included',
            'Automatic Hardware Upgrades',
            'Cancel Anytime',
            'Flexible Scaling Options',
        ],
        cta: 'Add to Cart',
        popular: true,
        mostPopularLease: true,
        purchaseMethod: 'stripe' as const,
    },
    {
        id: 'h100-single',
        name: 'H100 Single GPU',
        price: '$2,500',
        priceValue: 2500,
        leasePrice: '$800',
        leasePriceValue: 800,
        period: 'One-Time Purchase',
        description: 'Single NVIDIA H100 GPU for AI workloads and development.',
        features: [
            'Single H100 80GB GPU',
            '80 GB HBM3 Memory',
            '3.35 TB/s Memory Bandwidth',
            'FP8 Tensor Core Support',
            'Basic Support',
        ],
        leaseFeatures: [
            'Single H100 80GB GPU',
            '80 GB HBM3 Memory',
            '3.35 TB/s Memory Bandwidth',
            'FP8 Tensor Core Support',
            '24/7 Support Included',
            'Automatic Upgrades',
            'Cancel Anytime',
        ],
        cta: 'Add to Cart',
        purchaseMethod: 'stripe' as const,
    },
    {
        id: 'h100-bundle',
        name: 'H100 8x Bundle',
        price: '$18,000',
        priceValue: 18000,
        leasePrice: '$5,500',
        leasePriceValue: 5500,
        period: 'One-Time Purchase',
        description: '8x NVIDIA H100 GPUs with NVLink interconnect for large-scale training.',
        features: [
            '8x H100 80GB GPUs',
            '640 GB Total HBM3',
            'NVLink 4.0 Interconnect',
            'Scale-up Performance',
            'Priority Support',
        ],
        leaseFeatures: [
            '8x H100 80GB GPUs',
            '640 GB Total HBM3',
            'NVLink 4.0 Interconnect',
            'Scale-up Performance',
            '24/7 Priority Support',
            'Automatic Upgrades',
            'Cancel Anytime',
            'Dedicated Account Manager',
        ],
        cta: 'Add to Cart',
        purchaseMethod: 'stripe' as const,
    },
    {
        id: 'h200-single',
        name: 'H200 Single GPU',
        price: '$3,200',
        priceValue: 3200,
        leasePrice: '$1,000',
        leasePriceValue: 1000,
        period: 'One-Time Purchase',
        description: 'Latest NVIDIA H200 GPU with 141GB memory for cutting-edge AI.',
        features: [
            'Single H200 141GB GPU',
            '141 GB HBM3e Memory',
            '4.8 TB/s Memory Bandwidth',
            'Next-Gen Architecture',
            'Basic Support',
        ],
        leaseFeatures: [
            'Single H200 141GB GPU',
            '141 GB HBM3e Memory',
            '4.8 TB/s Memory Bandwidth',
            'Next-Gen Architecture',
            '24/7 Support Included',
            'Automatic Upgrades',
            'Cancel Anytime',
        ],
        cta: 'Add to Cart',
        purchaseMethod: 'stripe' as const,
    },
    {
        id: 'h200-bundle',
        name: 'H200 8x Bundle',
        price: '$23,000',
        priceValue: 23000,
        leasePrice: '$7,000',
        leasePriceValue: 7000,
        period: 'One-Time Purchase',
        description: '8x NVIDIA H200 GPUs for the most demanding AI workloads.',
        features: [
            '8x H200 141GB GPUs',
            '1.128 TB Total HBM3e',
            'NVLink 4.0 Interconnect',
            'Ultimate Performance',
            'Priority Support',
        ],
        leaseFeatures: [
            '8x H200 141GB GPUs',
            '1.128 TB Total HBM3e',
            'NVLink 4.0 Interconnect',
            'Ultimate Performance',
            '24/7 Priority Support',
            'Automatic Upgrades',
            'Cancel Anytime',
            'Dedicated Account Manager',
            'SLA Guarantees',
        ],
        cta: 'Add to Cart',
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
  const [isLeaseMode, setIsLeaseMode] = useState(false);

  // Filter to show GPU plans in lease mode, all plans in buy mode
  const displayPlans = isLeaseMode
    ? gpuPlans.filter(plan => plan.leasePrice) // Only show plans with lease options
    : [...gpuPlans.slice(0, 1), ...gpuPlans.slice(5)]; // Show DGX Spark + cloud/enterprise options

  return (
    <section id="pricing" className="py-20 md:py-28 bg-dark-bg">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            {isLeaseMode ? 'Flexible GPU Leasing' : 'No Subscriptions. Just Compute.'}
          </h2>

          {/* Toggle Switch */}
          <div className="mb-6">
            <ToggleSwitch
              enabled={isLeaseMode}
              onChange={setIsLeaseMode}
              leftLabel="Buy"
              rightLabel="Lease Monthly"
            />
          </div>

          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            {isLeaseMode
              ? 'Lease powerful GPUs with monthly subscriptions. Cancel anytime, scale as needed.'
              : 'Choose the right amount of power for your needs. No hidden fees, no monthly commitments.'}
          </p>

          {isLeaseMode && (
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-primary/20 border border-purple-500/30 rounded-full">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-semibold text-white">Save up to 30% with annual commitment</span>
            </div>
          )}
        </div>

        <div className={`grid gap-8 max-w-7xl mx-auto ${
          isLeaseMode
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {displayPlans.map((plan, index) => (
            <PricingCard key={`${plan.id}-${isLeaseMode ? 'lease' : 'buy'}`} plan={plan} isLeaseMode={isLeaseMode} />
          ))}
        </div>

        {/* FAQ Section for Leasing */}
        {isLeaseMode && (
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Leasing FAQ</h3>
            <div className="space-y-6">
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">How does GPU leasing work?</h4>
                <p className="text-gray-400">
                  GPU leasing provides you with dedicated access to powerful GPUs on a monthly subscription basis.
                  You get the same performance as owned hardware without the upfront cost. Billing is automatic
                  each month, and you can cancel or modify your subscription at any time with 30 days notice.
                </p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">What's included in the monthly lease?</h4>
                <p className="text-gray-400">
                  All monthly leases include 24/7 support, automatic hardware upgrades when new models become
                  available, unlimited compute hours, and dedicated resources. You also get priority access to
                  new GPU models and can scale your resources up or down as needed.
                </p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">Can I switch between leasing and buying?</h4>
                <p className="text-gray-400">
                  Yes! You can start with a monthly lease and later choose to purchase the hardware with a
                  buyout option. We also offer lease-to-own programs where a portion of your monthly payments
                  goes toward ownership. Contact sales for custom arrangements.
                </p>
              </div>
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">What are the payment terms?</h4>
                <p className="text-gray-400">
                  Monthly leases require a valid credit card and are billed automatically each month.
                  There's a 1-month minimum commitment. For enterprise customers, we offer NET 30 terms
                  and custom billing arrangements. Annual prepayment unlocks up to 30% discount.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Pricing;

// components/Pricing/PricingSection.jsx
import React from 'react';
import PricingCard from '../landingPage/PricingCard';

const PricingSection = () => {
  const plans = [
    {
      plan: 'Starter',
      price: 29,
      period: 'month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 50 employees',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ]
    },
    {
      plan: 'Professional',
      price: 79,
      period: 'month',
      description: 'Advanced features for growing companies',
      features: [
        'Up to 500 employees',
        'Advanced analytics & AI insights',
        'Priority support',
        'Custom integrations',
        'Advanced reporting',
        'Performance management',
        'Automated workflows'
      ],
      highlighted: true
    },
    {
      plan: 'Enterprise',
      price: 199,
      period: 'month',
      description: 'Complete solution for large organizations',
      features: [
        'Unlimited employees',
        'Full AI & blockchain features',
        '24/7 dedicated support',
        'Custom development',
        'White-label options',
        'Advanced security',
        'Multi-region deployment',
        'Custom SLA'
      ],
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">
            <span className="text-gradient">Simple, Transparent</span>
            <br />
            Pricing
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </p>
          
          {/* Pricing Toggle */}
          <div className="inline-flex items-center bg-slate-800 p-1 rounded-xl">
            <button className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
              Monthly
            </button>
            <button className="px-6 py-2 text-sm font-medium text-slate-400 hover:text-white rounded-lg">
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-8">
            Need a custom solution? <a href="#contact" className="text-blue-400 hover:text-blue-300">Contact our sales team</a>
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <span>✓ 14-day free trial</span>
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
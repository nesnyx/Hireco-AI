
import PricingCard from '../landingPage/PricingCard';

const PricingSection = () => {
  const plans = [
    {
      plan: 'Free Tier',
      price: 'Free',
      description: 'Perfect for trial and testing',
      features: [
        'Max 10 CVs Screening',
        'Basic analytics',
       
        'Basic reporting'
      ]
    },
    {
      plan: 'Starter',
      price: 45000,
      description: 'Perfect for small teams getting started',
      features: [
        'Max 50 CVs Screening',
        'Basic analytics',
        // 'Integration API',
        // 'Comparing Candidates',
        'Basic reporting'
      ]
    },
    
    // {
    //   plan: 'Professional',
    //   price: 79,
    //   period: 'month',
    //   description: 'Advanced features for growing companies',
    //   features: [
    //     'Up to 500 employees',
    //     'Advanced analytics & AI insights',
    //     'Priority support',
    //     'Custom integrations',
    //     'Advanced reporting',
    //     'Performance management',
    //     'Automated workflows'
    //   ],
    //   highlighted: true,
    //   buttonText: 'Coming Soon'
    // },
    // {
    //   plan: 'Enterprise',
    //   price: 199,
    //   period: 'month',
    //   description: 'Complete solution for large organizations',
    //   features: [
    //     'Unlimited employees',
    //     'Full AI & blockchain features',
    //     '24/7 dedicated support',
    //     'Custom development',
    //     'White-label options',
    //     'Advanced security',
    //     'Multi-region deployment',
    //     'Custom SLA'
    //   ],
    //   buttonText: 'Coming Soon'
    // }
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
        </div>

        {/* Pricing Cards */}
        <div className="flex justify-center items-center gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-8">
            Need a custom solution? <a href="http://wa.me/6282157704435" target='_blank' className="text-blue-400 hover:text-blue-300">Contact our sales team</a>
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
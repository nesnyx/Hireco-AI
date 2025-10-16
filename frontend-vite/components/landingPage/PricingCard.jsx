// components/Pricing/PricingCard.jsx
import React from 'react';
import Button from '../landingPage/UI/Button';
import { Check, Star } from 'lucide-react';
import GlowCard from '../landingPage/UI/GlowCard';

const PricingCard = ({ plan, price, period, description, features, highlighted = false, buttonText = 'Get Started' }) => {
  return (
    <div className={`relative ${highlighted ? 'transform scale-105' : ''}`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 mb-5">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold flex items-center">
            <Star className="w-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}
      
      <GlowCard className={`h-full ${highlighted ? 'glow-effect' : ''}`}>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{plan}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-slate-400">/{period}</span>
          </div>
          <p className="text-slate-400">{description}</p>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-slate-300">{feature}</span>
            </li>
          ))}
        </ul>

        <Button 
          variant={highlighted ? 'primary' : 'outline'} 
          className="w-full"
          size="lg"
          href={"/admin/login"}
        >
          {buttonText}
        </Button>
      </GlowCard>
    </div>
  );
};

export default PricingCard;
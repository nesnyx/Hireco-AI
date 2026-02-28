// components/UI/GlowCard.jsx
import React from 'react';

const GlowCard = ({ children, className = '', hover = true }:any) => {
  return (
    <div className={`gradient-border ${hover ? 'hover:glow-effect' : ''} transition-all duration-300 ${className}`}>
      <div className="gradient-border-content p-6">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
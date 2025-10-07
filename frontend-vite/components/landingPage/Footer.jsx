// components/Layout/Footer.jsx
import React from 'react';
import { TrendingUp, Twitter, Linkedin, Github, Mail } from 'lucide-react';


const Footer = () => {
  const links = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Integrations', href: '#integrations' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Press', href: '#press' }
    ],
    resources: [
      { label: 'Documentation', href: '#docs' },
      { label: 'API Reference', href: '#api' },
      { label: 'Help Center', href: '#help' },
      { label: 'Status', href: '#status' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'GDPR', href: '#gdpr' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#twitter', label: 'Twitter' },
    { icon: Linkedin, href: '#linkedin', label: 'LinkedIn' },
    { icon: Github, href: '#github', label: 'GitHub' },
    { icon: Mail, href: '#email', label: 'Email' }
  ];

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient">HRCrypto</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Revolutionary HR management platform powered by AI and secured by blockchain technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, categoryLinks]) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4 capitalize">{category}</h3>
              <ul className="space-y-2">
                {categoryLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 HRCrypto. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
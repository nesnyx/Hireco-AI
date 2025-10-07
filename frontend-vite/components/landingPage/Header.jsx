// components/Layout/Header.jsx
import React, { useState } from 'react';
import { Menu, X, TrendingUp } from 'lucide-react';
import Button from '../landingPage/UI/Button'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'About', href: '#about' },
        { label: 'Contact', href: '#contact' },
    ];

    return (
        <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gradient">HRCrypto</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Button variant="ghost">Sign In</Button>
                        <Button variant="primary">Get Started</Button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 py-4 border-t border-slate-800">
                        <nav className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className="text-slate-300 hover:text-white transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
                                <Button variant="ghost" className="w-full">Sign In</Button>
                                <Button variant="primary" className="w-full">Get Started</Button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
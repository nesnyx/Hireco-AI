// components/Hero/HeroSection.jsx
import React from 'react';
import Button from '../landingPage/UI/Button';
import AnimatedStats from '../landingPage/AnimatedStats';
import { Play, Users, TrendingUp, Award, Clock } from 'lucide-react';

const HeroSection = () => {
    const stats = [
        { icon: Users, value: 50000, suffix: '+', label: 'Active Users' },
        { icon: TrendingUp, value: 98, suffix: '%', label: 'Satisfaction Rate' },
        { icon: Award, value: 15000, suffix: '+', label: 'Awards Given' },
        { icon: Clock, value: 99.9, suffix: '%', label: 'Uptime' }
    ];

    return (
        <section className="pt-32 pb-20 crypto-grid">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-4xl mx-auto">
                    {/* Hero Badge */}
                    <div className="inline-flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300 mb-8 fade-in-up">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        🚀 Now supporting 50,000+ companies worldwide
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <span className="text-gradient">Revolutionary</span>
                        <br />
                        HR Management
                        <br />
                        <span className="text-gradient">Platform</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.4s' }}>
                        Transform your workforce management with AI-powered analytics, blockchain-secured data,
                        and real-time performance insights that drive results.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <Button size="xl" variant="primary" className="w-full sm:w-auto">
                            Start Free Trial
                        </Button>
                        <Button size="xl" variant="outline" className="w-full sm:w-auto">
                            <Play className="w-5 h-5 mr-2" />
                            Watch Demo
                        </Button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 fade-in-up" style={{ animationDelay: '0.8s' }}>
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-slate-700">
                                            <Icon className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">
                                        <AnimatedStats end={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="text-slate-400 text-sm">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Hero Image/Dashboard Preview */}
                <div className="mt-20 fade-in-up" style={{ animationDelay: '1s' }}>
                    <div className="relative max-w-6xl mx-auto">
                        <div className="gradient-border glow-effect">
                            <div className="gradient-border-content p-8">
                                <div className="bg-slate-800 rounded-lg aspect-video flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 floating-animation">
                                            <TrendingUp className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Dashboard Preview</h3>
                                        <p className="text-slate-400">Interactive demo coming soon</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
// components/Features/FeaturesSection.jsx
import React from 'react';
import FeatureCard from '../landingPage/FeatureCard';
import {
    Users,
    TrendingUp,
    CheckCircle,
    Shield,
    Clock,
    DollarSign,
    Award,
    Brain,
    Globe,
    Zap
} from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        // {
        //     icon: Users,
        //     title: 'Employee Management',
        //     description: 'Comprehensive employee lifecycle management with advanced analytics.',
        //     features: [
        //         'Performance analytics',
        //         'Automated onboarding',
        //         'Skills mapping & development'
        //     ]
        // },
        // {
        //     icon: TrendingUp,
        //     title: 'Performance Analytics',
        //     description: 'Data-driven insights to improve workforce productivity and engagement.',
        //     features: [
        //         'Predictive performance modeling',
        //         'Team efficiency dashboards',
        //         'KPI-based benchmarking'
        //     ]
        // },
        {
            icon: CheckCircle,
            title: 'Ease to use',
            description: 'Just drop your data into the app and start using it. No coding required.',
            features: [
                'Intuitive drag-and-drop interface',
                'Pre-built templates',
                'One-click data import/export'
            ]
        }
        ,
        {
            icon: Brain,
            title: 'AI Recruitment',
            description: 'Intelligent hiring with automated candidate analysis and scoring.',
            features: [
                'Resume parsing & semantic understanding',
                'AI-based scoring & ranking',

                'Bias-free decision support'
            ]
        }
    ];

    const highlights = [
        { icon: Globe, title: '5+ Countries', description: 'Global compliance coverage' },
        { icon: Zap, title: '40% Uptime', description: 'Enterprise reliability' },
        
    ];

    return (
        <section id="features" className="py-20">
            <div className="container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6">
                        <span className="text-gradient">Powerful Features</span>
                        <br />
                        for Modern HR Teams
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Simple tool for screening and ranking candidates using AI, helping you
                        identify the best talent quickly and efficiently.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Highlights */}
                <div className="grid md:grid-cols-2 gap-8">
                    {highlights.map((highlight, index) => {
                        const Icon = highlight.icon;
                        return (
                            <div key={index} className="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700">
                                <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl inline-flex mb-4">
                                    <Icon className="h-8 w-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{highlight.title}</h3>
                                <p className="text-slate-400">{highlight.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
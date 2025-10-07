// components/Features/FeaturesSection.jsx
import React from 'react';
import FeatureCard from '../landingPage/FeatureCard';
import {
    Users,
    TrendingUp,
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
        {
            icon: Users,
            title: 'Employee Management',
            description: 'Comprehensive employee lifecycle management with advanced analytics.',
            features: [
                'Real-time employee tracking',
                'Performance analytics',
                'Automated onboarding',
                'Skills mapping & development'
            ]
        },
        {
            icon: TrendingUp,
            title: 'Performance Analytics',
            description: 'AI-powered insights to optimize your workforce performance.',
            features: [
                'Predictive performance modeling',
                'Real-time KPI monitoring',
                'Custom dashboards',
                'Benchmarking & comparisons'
            ]
        },
        {
            icon: Shield,
            title: 'Blockchain Security',
            description: 'Enterprise-grade security with blockchain-verified data integrity.',
            features: [
                'Immutable employee records',
                'Cryptographic data protection',
                'Decentralized verification',
                'GDPR compliant storage'
            ]
        },
        {
            icon: Clock,
            title: 'Time Management',
            description: 'Smart time tracking with automated attendance and scheduling.',
            features: [
                'Biometric integration',
                'Automated timesheets',
                'Flexible scheduling',
                'Overtime calculations'
            ]
        },
        {
            icon: DollarSign,
            title: 'Payroll Automation',
            description: 'Streamlined payroll processing with compliance management.',
            features: [
                'Multi-currency support',
                'Tax calculations',
                'Benefits management',
                'Compliance reporting'
            ]
        },
        {
            icon: Brain,
            title: 'AI Recruitment',
            description: 'Intelligent hiring with AI-powered candidate matching.',
            features: [
                'Resume parsing & ranking',
                'Skill-based matching',
                'Interview scheduling',
                'Bias-free selection'
            ]
        }
    ];

    const highlights = [
        { icon: Globe, title: '50+ Countries', description: 'Global compliance coverage' },
        { icon: Zap, title: '99.9% Uptime', description: 'Enterprise reliability' },
        { icon: Award, title: 'ISO Certified', description: 'Security & quality standards' }
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
                        Everything you need to manage, analyze, and optimize your workforce
                        in one comprehensive platform.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>

                {/* Highlights */}
                <div className="grid md:grid-cols-3 gap-8">
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
// components/Dashboard/MetricsCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricsCard = ({ title, value, change, changeType, icon: Icon, gradient }) => {
    const isPositive = changeType === 'positive';

    return (
        <div className="gradient-border">
            <div className="gradient-border-content">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${gradient}`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        <span>{change}</span>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
                    <p className="text-gray-400 text-sm">{title}</p>
                </div>

                <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${gradient} transition-all duration-300`}
                        style={{ width: '65%' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default MetricsCard;
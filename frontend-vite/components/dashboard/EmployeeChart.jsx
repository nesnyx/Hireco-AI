// components/Dashboard/EmployeeChart.jsx
import React from 'react';
import { MoreVertical } from 'lucide-react';

const EmployeeChart = () => {
    const chartData = [
        { month: 'Jan', employees: 45, performance: 78 },
        { month: 'Feb', employees: 52, performance: 82 },
        { month: 'Mar', employees: 48, performance: 75 },
        { month: 'Apr', employees: 61, performance: 88 },
        { month: 'May', employees: 55, performance: 85 },
        { month: 'Jun', employees: 67, performance: 92 },
    ];

    const maxEmployees = Math.max(...chartData.map(d => d.employees));

    return (
        <div className="gradient-border">
            <div className="gradient-border-content">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Employee Growth</h2>
                    <button className="text-gray-400 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    {chartData.map((data, index) => (
                        <div key={data.month} className="flex items-center space-x-4">
                            <div className="w-8 text-sm text-gray-400">{data.month}</div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-300">Employees: {data.employees}</span>
                                    <span className="text-sm text-blue-400">Performance: {data.performance}%</span>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                                            style={{ width: `${(data.employees / maxEmployees) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                                            style={{ width: `${data.performance}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeChart;
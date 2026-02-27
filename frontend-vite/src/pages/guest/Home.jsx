// App.jsx
import React from 'react';
import Header from '../../components/dashboard/Header';
import Sidebar from '../../components/dashboard/Sidebar';
import MetricsCard from '../../components/dashboard/MetricsCard';
import EmployeeChart from '../../components/dashboard/EmployeeChart';
import RecentActivities from "../../components/dashboard/RecentActivities";
import TopPerformers from '../../components/dashboard/TopPerformers';
import { Users, TrendingUp, DollarSign, Calendar, Clock, Award } from 'lucide-react';

function Home() {
    const metrics = [
        {
            title: 'Total Employees',
            value: '1,247',
            change: '+12.5%',
            changeType: 'positive',
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Avg Performance',
            value: '87.3%',
            change: '+5.2%',
            changeType: 'positive',
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            title: 'Monthly Payroll',
            value: '$2.4M',
            change: '+8.1%',
            changeType: 'positive',
            icon: DollarSign,
            gradient: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Attendance Rate',
            value: '94.2%',
            change: '-1.3%',
            changeType: 'negative',
            icon: Calendar,
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Avg Work Hours',
            value: '42.5h',
            change: '+2.8%',
            changeType: 'positive',
            icon: Clock,
            gradient: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'Awards Given',
            value: '156',
            change: '+25.4%',
            changeType: 'positive',
            icon: Award,
            gradient: 'from-pink-500 to-rose-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 crypto-grid">
            <div className="flex">
                <Sidebar />
                <div className="flex-1">
                    <Header />
                    <main className="p-6">
                        {/* Hero Section */}
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                                HR Analytics Dashboard
                            </h1>
                            <p className="text-gray-400">Real-time insights into your workforce performance</p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {metrics.map((metric, index) => (
                                <MetricsCard
                                    key={index}
                                    title={metric.title}
                                    value={metric.value}
                                    change={metric.change}
                                    changeType={metric.changeType}
                                    icon={metric.icon}
                                    gradient={metric.gradient}
                                />
                            ))}
                        </div>

                        {/* Charts and Activities Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <EmployeeChart />
                            <RecentActivities />
                        </div>

                        {/* Top Performers */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                            <TopPerformers />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Home;
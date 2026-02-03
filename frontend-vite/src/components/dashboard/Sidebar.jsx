// components/Layout/Sidebar.jsx
import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Calendar,
    DollarSign,
    Settings,
    BarChart3,
    UserCheck,
    Clock,
    Award
} from 'lucide-react';

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'employees', label: 'Employees', icon: Users },
        { id: 'performance', label: 'Performance', icon: TrendingUp },
        { id: 'attendance', label: 'Attendance', icon: UserCheck },
        { id: 'payroll', label: 'Payroll', icon: DollarSign },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'timeoff', label: 'Time Off', icon: Clock },
        { id: 'awards', label: 'Awards', icon: Award },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-gray-800 border-r border-gray-700 h-screen">
            <div className="p-6">
                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeItem === item.id
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white glow-effect'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>


        </aside>
    );
};

export default Sidebar;
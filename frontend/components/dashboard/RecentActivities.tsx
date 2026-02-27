// components/Dashboard/RecentActivities.jsx
import React from 'react';
import { Clock, User, Award, Calendar, DollarSign } from 'lucide-react';

const RecentActivities = () => {
    const activities = [
        {
            id: 1,
            type: 'join',
            user: 'Sarah Johnson',
            action: 'joined the team',
            time: '2 hours ago',
            icon: User,
            color: 'from-green-500 to-blue-500'
        },
        {
            id: 2,
            type: 'award',
            user: 'Mike Chen',
            action: 'received Employee of the Month',
            time: '4 hours ago',
            icon: Award,
            color: 'from-yellow-500 to-orange-500'
        },
        {
            id: 3,
            type: 'meeting',
            user: 'Team Alpha',
            action: 'scheduled team meeting',
            time: '6 hours ago',
            icon: Calendar,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 4,
            type: 'payroll',
            user: 'HR System',
            action: 'processed monthly payroll',
            time: '1 day ago',
            icon: DollarSign,
            color: 'from-blue-500 to-cyan-500'
        },
    ];

    return (
        <div className="gradient-border">
            <div className="gradient-border-content">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Activities</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>Live feed</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {activities.map((activity) => {
                        const Icon = activity.icon;
                        return (
                            <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                                <div className={`p-2 rounded-lg bg-linear-to-r ${activity.color}`}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white text-sm">
                                        <span className="font-semibold">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-gray-400 text-xs">{activity.time}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="w-full mt-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors">
                    View All Activities
                </button>
            </div>
        </div>
    );
};

export default RecentActivities;
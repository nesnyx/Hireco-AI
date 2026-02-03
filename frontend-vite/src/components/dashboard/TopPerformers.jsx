// components/Dashboard/TopPerformers.jsx
import React from 'react';
import { Crown, TrendingUp, Star } from 'lucide-react';

const TopPerformers = () => {
  const performers = [
    {
      id: 1,
      name: 'Alex Rodriguez',
      role: 'Senior Developer',
      score: 98.5,
      change: '+2.3%',
      avatar: '/api/placeholder/40/40',
      rank: 1
    },
    {
      id: 2,
      name: 'Emma Watson',
      role: 'Product Manager',
      score: 96.8,
      change: '+1.8%',
      avatar: '/api/placeholder/40/40',
      rank: 2
    },
    {
      id: 3,
      name: 'James Wilson',
      role: 'UI/UX Designer',
      score: 94.2,
      change: '+3.1%',
      avatar: '/api/placeholder/40/40',
      rank: 3
    },
    {
      id: 4,
      name: 'Lisa Park',
      role: 'Marketing Lead',
      score: 92.7,
      change: '+0.9%',
      avatar: '/api/placeholder/40/40',
      rank: 4
    },
  ];

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-400" />;
    if (rank <= 3) return <Star className="h-4 w-4 text-gray-400" />;
    return <span className="text-sm text-gray-500">#{rank}</span>;
  };

  const getRankGradient = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500';
    if (rank === 2) return 'from-gray-400 to-gray-600';
    if (rank === 3) return 'from-amber-600 to-yellow-700';
    return 'from-gray-600 to-gray-800';
  };

  return (
    <div className="gradient-border">
      <div className="gradient-border-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Top Performers</h2>
          <div className="flex items-center space-x-2 text-sm text-green-400">
            <TrendingUp className="h-4 w-4" />
            <span>This Month</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {performers.map((performer) => (
            <div key={performer.id} className="flex items-center space-x-4 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-colors">
              <div className={`p-2 rounded-full bg-gradient-to-r ${getRankGradient(performer.rank)}`}>
                {getRankIcon(performer.rank)}
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {performer.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{performer.name}</h3>
                <p className="text-gray-400 text-xs">{performer.role}</p>
              </div>
              
              <div className="text-right">
                <div className="text-white font-bold text-lg">{performer.score}</div>
                <div className="text-green-400 text-xs flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {performer.change}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default TopPerformers;
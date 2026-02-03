
import { Bell, Search, User, TrendingUp } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            HRCrypto
                        </h1>
                    </div>
                    <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Live</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <span>Last updated: 2 min ago</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                        <Bell className="h-5 w-5" />
                        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    </button>
                    <button className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                        <User className="h-5 w-5" />
                        <span className="hidden md:block">Admin</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
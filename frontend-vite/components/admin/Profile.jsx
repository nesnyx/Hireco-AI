import { useState } from 'react';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaEdit,
    FaSave,
    FaTimes,
    FaCamera,
    FaShieldAlt,
    FaBell,
    FaKey
} from 'react-icons/fa';

export default function Profile({ profile }) {
    const avatar = "https://avatar.iran.liara.run/public/49"; // Placeholder avatar URL
    const detailProfile = JSON.parse(profile?.profile)

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);

    const handleEdit = () => {
        setEditedProfile(profile);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setProfile(editedProfile);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEditedProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
        { id: 'notifications', label: 'Notifications', icon: FaBell }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
                    <p className="text-slate-400">Manage your profile and account preferences</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-1">
                <div className="flex space-x-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="text-center">
                        <div className="relative inline-block mb-6">
                            <img
                                src={avatar}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-slate-600"
                            />
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                                <FaCamera className="w-3 h-3 text-white" />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{profile.email}</h3>
                        <p className="text-blue-400 mb-2">{profile.role}</p>
                        <p className="text-slate-400 text-sm mb-4">{profile.department}</p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-center space-x-2 text-slate-400">
                                <FaCalendarAlt className="w-3 h-3" />
                                <span>Joined {profile.joined}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl">
                            <div className="flex justify-between items-center p-6 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <FaEdit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </button>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleCancel}
                                            className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                            <span>Cancel</span>
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isLoading}
                                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                                        >
                                            <FaSave className="w-4 h-4" />
                                            <span>{isLoading ? 'Saving...' : 'Save'}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <FaUser className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">{detailProfile.full_name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Job Role
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile.role}
                                                onChange={(e) => handleInputChange('role', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <FaShieldAlt className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">{profile.role}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email Address
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedProfile.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <FaEnvelope className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">{profile.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Phone Number
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedProfile.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <FaPhone className="w-4 h-4 text-slate-400" />
                                                <span className="text-white">{profile.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Department
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile.department}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                                <span className="text-white">{profile.department}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Location
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedProfile.location}
                                                onChange={(e) => handleInputChange('location', e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        ) : (
                                            <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-xl">
                                                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-white">{profile.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Bio
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            value={editedProfile.bio}
                                            onChange={(e) => handleInputChange('bio', e.target.value)}
                                            rows="4"
                                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    ) : (
                                        <div className="p-4 bg-slate-700 rounded-xl">
                                            <p className="text-white leading-relaxed">{profile.bio}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                                <p className="text-slate-400 text-sm mt-1">Manage your password and security preferences</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <FaKey className="w-5 h-5 text-blue-400" />
                                            <div className="text-left">
                                                <p className="text-white font-medium">Change Password</p>
                                                <p className="text-slate-400 text-sm">Update your account password</p>
                                            </div>
                                        </div>
                                        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <FaShieldAlt className="w-5 h-5 text-green-400" />
                                            <div className="text-left">
                                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                                <p className="text-slate-400 text-sm">Enable 2FA for extra security</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-green-400 text-sm">Enabled</span>
                                            <div className="w-5 h-3 bg-green-600 rounded-full relative">
                                                <div className="w-2 h-2 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-slate-800 border border-slate-700 rounded-xl">
                            <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                                <p className="text-slate-400 text-sm mt-1">Choose what notifications you want to receive</p>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { title: 'New Applications', desc: 'Get notified when someone applies for your jobs', enabled: true },
                                    { title: 'Email Updates', desc: 'Receive email summaries of your activity', enabled: false },
                                    { title: 'System Updates', desc: 'Important updates about the platform', enabled: true },
                                    { title: 'Marketing Messages', desc: 'Promotional content and tips', enabled: false }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-xl">
                                        <div>
                                            <p className="text-white font-medium">{item.title}</p>
                                            <p className="text-slate-400 text-sm">{item.desc}</p>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-slate-600'
                                            }`}>
                                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                                                }`}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

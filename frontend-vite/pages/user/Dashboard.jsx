import React, { useState, useEffect } from 'react';
import { applyJob, getAllJobs } from '../../src/api';
import { DateTime } from "luxon";
import {
    FaBriefcase,
    FaSearch,
    FaMapMarkerAlt,
    FaClock,
    FaPaperPlane,
    FaUpload,
    FaFilePdf,
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaRocket,
    FaBuilding,
    FaStar,
    FaSignOutAlt,
    FaChevronDown
} from 'react-icons/fa';

export default function JobDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telp: '',
        job_id: null,
        file: null,
    });
    const [errors, setErrors] = useState({});
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getAllJobs();
                if (response.status === false) {
                    alert("Terjadi Kesalahan");
                }
                setJobs(response.result);
            } catch (error) {
                console.log(error);
            }
        };
        fetchJobs();
    }, []);

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.clear();
            window.location.href = '/';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData((prev) => ({ ...prev, file }));
            setErrors((prev) => ({ ...prev, file: '' }));
        } else {
            setErrors((prev) => ({ ...prev, file: 'Please upload a PDF file' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.telp.trim()) newErrors.telp = 'Phone is required';
        if (!formData.file) newErrors.file = 'Resume is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('telp', formData.telp);
        formDataToSend.append('file', formData.file);
        formDataToSend.append('job_id', selectedJob.id);

        try {
            setIsLoading(true);
            const response = await applyJob(formDataToSend);
            alert('Application submitted successfully!');
            console.log(response);

            setIsModalOpen(false);
            setFormData({ name: '', email: '', telp: '', file: null, job_id: null });
            window.location.reload();
        } catch (error) {
            alert('Failed to submit application.');
            window.location.reload();
        } finally {
            setIsLoading(false);
        }
    };

    const openApplyModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
        setFormData({ name: '', email: '', telp: '', file: null, job_id: null });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-700 shadow-xl sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center glow-effect">
                                <span className="text-xl font-bold text-white">H</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Job Dashboard</h1>
                                <p className="text-slate-400">Discover your next career opportunity</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Search Bar */}
                            <div className="relative w-80">
                                <input
                                    type="text"
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-11 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <FaSearch className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-3 transition-colors"
                                >
                                    <img
                                        src="https://avatar.iran.liara.run/public/49"
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border-2 border-slate-600"
                                    />
                                    <div className="text-left hidden sm:block">
                                        <p className="text-white text-sm font-medium">John Doe</p>
                                        <p className="text-slate-400 text-xs">Job Seeker</p>
                                    </div>
                                    <FaChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-700">
                                            <p className="text-white font-medium">John Doe</p>
                                            <p className="text-slate-400 text-sm">john.doe@example.com</p>
                                        </div>

                                        <button className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-3">
                                            <FaUser className="h-4 w-4" />
                                            <span>My Profile</span>
                                        </button>

                                        <button className="w-full text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-3">
                                            <FaPaperPlane className="h-4 w-4" />
                                            <span>My Applications</span>
                                        </button>

                                        <div className="border-t border-slate-700 mt-2 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center space-x-3"
                                            >
                                                <FaSignOutAlt className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Click outside to close dropdown */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowUserMenu(false)}
                ></div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 crypto-grid opacity-20"></div>

                    <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <FaRocket className="h-6 w-6 text-yellow-300" />
                                <span className="text-yellow-300 font-medium">New Opportunities</span>
                            </div>
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Get New Opportunities from
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                                    Top Companies!
                                </span>
                            </h2>
                            <p className="text-lg text-blue-100 mb-6 max-w-2xl">
                                Find your dream job with our curated list of high-demand roles from industry-leading companies.
                            </p>
                            <button className="bg-white text-slate-900 px-8 py-3 rounded-xl hover:bg-slate-100 transition-all duration-200 font-semibold flex items-center space-x-2 hover:scale-105">
                                <FaSearch className="h-4 w-4" />
                                <span>Explore Jobs</span>
                            </button>
                        </div>

                        <div className="w-60 h-60 flex-shrink-0 relative">
                            <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                                <div className="text-center">
                                    <FaBriefcase className="h-16 w-16 text-white mx-auto mb-4" />
                                    <p className="text-white font-semibold">Find Your Dream Job</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Available Jobs</p>
                                <p className="text-2xl font-bold text-white mt-1">{jobs.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                <FaBriefcase className="h-6 w-6 text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">Companies</p>
                                <p className="text-2xl font-bold text-white mt-1">{new Set(jobs.map(job => job.company || 'Hireco')).size}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                                <FaBuilding className="h-6 w-6 text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 font-medium">This Week</p>
                                <p className="text-2xl font-bold text-white mt-1">
                                    {jobs.filter(job => {
                                        const jobDate = new Date(job.created_at);
                                        const oneWeekAgo = new Date();
                                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                        return jobDate >= oneWeekAgo;
                                    }).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                                <FaStar className="h-6 w-6 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Section */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Explore Jobs</h2>
                            <p className="text-slate-400">
                                {searchTerm ?
                                    `Found ${filteredJobs.length} jobs matching "${searchTerm}"` :
                                    `${jobs.length} available positions`
                                }
                            </p>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2 transition-colors">
                            <span>View All</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div key={job.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-750 transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
                                    {/* Job Image */}
                                    <div className="h-48 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
                                        <div className="absolute inset-0 crypto-grid opacity-20"></div>
                                        <div className="relative h-full flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <FaBriefcase className="h-12 w-12 mx-auto mb-2" />
                                                <p className="font-semibold text-lg">{job.position}</p>
                                            </div>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                New
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-400 transition-colors">
                                                {job.position}
                                            </h3>
                                            <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                                                {job.description}
                                            </p>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <FaBuilding className="h-3 w-3 text-slate-500" />
                                                <span className="text-blue-400 text-sm font-medium">{job.title}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <FaClock className="h-3 w-3" />
                                                <span>Posted {DateTime.fromISO(job.created_at).toFormat('MMM dd')}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => openApplyModal(job)}
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 glow-effect group-hover:scale-105"
                                        >
                                            <FaPaperPlane className="h-4 w-4" />
                                            <span>Apply Now</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
                                        <FaBriefcase className="h-10 w-10 text-slate-500" />
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-xl font-semibold">No jobs found</p>
                                        <p className="text-slate-500 mt-1">
                                            {searchTerm ? "Try adjusting your search criteria" : "Check back later for new opportunities"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Application Modal - keeping the same as before */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <FaPaperPlane className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Apply for Position</h3>
                                    <p className="text-slate-400">{selectedJob?.title}</p>
                                </div>
                            </div>
                            <button
                                onClick={resetModal}
                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-11 bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 ${errors.name ? 'border-red-500' : 'border-slate-700'
                                                    }`}
                                                placeholder="Enter your full name"
                                            />
                                            <FaUser className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        </div>
                                        {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 pl-11 bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 ${errors.email ? 'border-red-500' : 'border-slate-700'
                                                    }`}
                                                placeholder="Enter your email"
                                            />
                                            <FaEnvelope className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                        </div>
                                        {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="telp"
                                            value={formData.telp}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 pl-11 bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500 ${errors.telp ? 'border-red-500' : 'border-slate-700'
                                                }`}
                                            placeholder="Enter your phone number"
                                        />
                                        <FaPhone className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                                    </div>
                                    {errors.telp && <p className="text-red-400 text-xs mt-2">{errors.telp}</p>}
                                </div>

                                {/* Resume Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Upload Resume (PDF)
                                    </label>
                                    <div
                                        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${errors.file
                                            ? 'border-red-500 bg-red-500/5'
                                            : 'border-slate-600 hover:border-blue-500 bg-slate-800 hover:bg-slate-750'
                                            }`}
                                        onClick={() => document.getElementById('resume-upload').click()}
                                    >
                                        <input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <div className="flex flex-col items-center">
                                            {formData.file ? (
                                                <>
                                                    <FaFilePdf className="h-12 w-12 text-red-500 mb-4" />
                                                    <p className="text-white font-medium mb-1">{formData.file.name}</p>
                                                    <p className="text-slate-400 text-sm">Click to change file</p>
                                                </>
                                            ) : (
                                                <>
                                                    <FaUpload className="h-12 w-12 text-slate-400 mb-4" />
                                                    <p className="text-white font-medium mb-1">Drop your resume here</p>
                                                    <p className="text-slate-400 text-sm">
                                                        or <span className="text-blue-400 hover:text-blue-300">browse files</span>
                                                    </p>
                                                    <p className="text-slate-500 text-xs mt-2">PDF format only</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {errors.file && <p className="text-red-400 text-xs mt-2">{errors.file}</p>}
                                </div>

                                {/* Buttons */}
                                <div className="flex space-x-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetModal}
                                        disabled={isLoading}
                                        className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 glow-effect disabled:shadow-none flex items-center justify-center space-x-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                <span>Submitting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaPaperPlane className="h-4 w-4" />
                                                <span>Submit Application</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

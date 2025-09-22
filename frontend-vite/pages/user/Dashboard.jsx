import React, { useState, useEffect } from 'react';
import { applyJob, getAllJobs } from '../../src/api';
import { DateTime } from "luxon";
export default function JobDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telp: '',
        job_id:null,
        file: null,
    });
    const [errors, setErrors] = useState({});

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getAllJobs()
                if (response.status === false) {
                    alert("Terjadi Kesalahan")
                }
                setJobs(response.result)
            } catch (error) {
                console.log(error)
            }
        }
        fetchJobs()
    }, [])


    // Handle form change
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
            setFormData((prev) => ({ ...prev, file })); // pastikan 'file' bukan 'resume'
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
            const response = await applyJob(formDataToSend); // panggil API
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
            window.location.reload();
        }
    };
    const openApplyModal = (job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Job Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-600 hover:text-gray-900 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h4l-4-4h-2a3 3 0 00-3 3v2m-4 0H3m4 0V9.6a2 2 0 012-2h4a2 2 0 012 2V17" />
                            </svg>
                        </button>
                        <img src="https://avatar.iran.liara.run/public/49" alt="Profile" className="w-8 h-8 rounded-full" />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Get New Opportunities from Top Companies!</h2>
                            <p className="text-lg opacity-90 mb-4">Find your dream job with our curated list of high-demand roles.</p>
                            <button className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition">
                                See Now
                            </button>
                        </div>
                        <div className="w-40 h-40 md:w-60 md:h-60 flex-shrink-0">
                            <img src="https://placehold.co/300x300/6366f1/ffffff?text=Hireco" alt="Hireco" className="rounded-lg object-cover" />
                        </div>
                    </div>
                </div>

                {/* Explore Jobs */}
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Explore Jobs</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All →</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition cursor-pointer group">
                                    <img src={"https://placehold.co/300x200/6366f1/ffffff?text=" + job.position} alt={job.title} className="w-full h-40 object-cover rounded-t-lg" />
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900">{job.position}</h3>
                                        <p className="text-sm text-gray-600">{job.description}</p>
                                        <p className="text-sm text-green-600 font-medium">{job.title}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-xs text-gray-500">PostedAt {DateTime.fromISO(job.created_at).toFormat('MMM dd, HH:mm')}</span>
                                            <button
                                                onClick={() => openApplyModal(job)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium group-hover:underline"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No Data
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Modal Apply Job */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsModalOpen(false)} // Tutup jika klik di luar modal
                >
                    <div
                        className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()} // Cegah close saat klik di dalam modal
                    >
                        {/* Header dengan tombol close */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Apply for {selectedJob?.title}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 transition"
                                aria-label="Close modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                {/* Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        name="telp"
                                        value={formData.telp}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.telp ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter your phone number"
                                    />
                                    {errors.telp && <p className="text-red-500 text-xs mt-1">{errors.telp}</p>}
                                </div>

                                {/* Resume Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Resume (PDF)</label>
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${errors.file ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'
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
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-sm text-gray-600">
                                                Drag and drop your file here or<br />
                                                <span className="text-blue-600 hover:underline cursor-pointer">Select from Device</span>
                                            </p>
                                            {formData.file && (
                                                <p className="text-sm text-gray-500 mt-2">Selected: {formData.file.name}</p>
                                            )}
                                        </div>
                                    </div>
                                    {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                                </div>



                                {/* Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className={`flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 transition ${isLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
                                            }`}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-1 bg-blue-600 text-white py-2 rounded-md transition ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-700'
                                            }`}
                                    >
                                        {isLoading ? 'Mohon tunggu...' : 'Submit Application'}
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
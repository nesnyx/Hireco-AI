import { useState, useEffect } from "react";
import { createJob, deleteJob, getJobByHr, updateJob } from "../../integration/api";
import { 
    FaTrash, 
    FaEdit, 
    FaPlus, 
    FaBriefcase, 
    FaUsers, 
    FaEye, 
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle
} from 'react-icons/fa';

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewDetails, setIsViewDetails] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        position: '',
        criteria: '',
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [jobToUpdate, setJobToUpdate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getJobByHr();
                setJobs(response.result || []);
            } catch (error) {
                console.log("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    // Filter jobs based on search
    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.criteria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewJob((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setNewJob({
            title: '',
            description: '',
            position: '',
            criteria: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newJob.title || !newJob.description || !newJob.position || !newJob.criteria) {
            alert("All fields are required!");
            return;
        }

        setIsLoading(true);
        try {
            const jobToAdd = await createJob({
                title: newJob.title,
                description: newJob.description,
                position: newJob.position,
                criteria: newJob.criteria,
            });

            if (jobToAdd.status === false) {
                alert("Terjadi Kesalahan Menambahkan Job Baru");
            } else {
                alert("Berhasil Menambahkan Job Baru");
                resetForm();
                setIsModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert("Error creating job");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const jobToAdd = await updateJob({
                job_id: jobToUpdate.id,
                title: newJob.title,
                description: newJob.description,
                position: newJob.position,
                criteria: newJob.criteria,
            });

            if (jobToAdd.status === false) {
                alert("Terjadi Kesalahan Update Job");
            } else {
                alert("Berhasil Update Job");
                resetForm();
                setIsUpdateModalOpen(false);
                window.location.reload();
            }
        } catch (error) {
            alert("Error updating job");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateClick = (job) => {
        setJobToUpdate(job);
        setNewJob({
            title: job.title,
            description: job.description,
            position: job.position,
            criteria: job.criteria,
        });
        setIsUpdateModalOpen(true);
    };

    const handleViewDetailClick = (job) => {
        setJobToUpdate(job);
        setNewJob({
            title: job.title,
            description: job.description,
            position: job.position,
            criteria: job.criteria,
        });
        setIsViewDetails(true);
    };

    const confirmDelete = async () => {
        setIsLoading(true);
        try {
            const deleteJobWithID = await deleteJob(jobToDelete.id);
            if (deleteJobWithID.status === false) {
                alert(`Gagal Menghapus Job "${jobToDelete.title}"`);
                return;
            }
            alert(`Job "${jobToDelete.title}" telah dihapus.`);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Gagal menghapus job.");
        } finally {
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
            setIsLoading(false);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Management</h1>
                    <p className="text-slate-400">Create and manage your job postings</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={() => {
                            resetForm();
                            setIsModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 glow-effect hover:scale-105 flex items-center space-x-2"
                    >
                        <FaPlus className="h-4 w-4" />
                        <span>Create Job</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Jobs</p>
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
                            <p className="text-sm text-slate-400 font-medium">Total Applicants</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                            <FaUsers className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Avg Applicants</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {jobs.length > 0 ? 
                                    Math.round(jobs.reduce((acc, job) => acc + (job.applicant_count || 0), 0) / jobs.length) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:bg-slate-750 transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                        <FaBriefcase className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="bg-green-900/30 border border-green-500/30 rounded-full px-2 py-1">
                                            <div className="flex items-center space-x-1">
                                                <FaCheckCircle className="w-3 h-3 text-green-400" />
                                                <span className="text-xs font-medium text-green-400">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{job.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                                    {job.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-full">
                                        <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                        {job.position}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1.5 bg-purple-900/30 border border-purple-500/30 text-purple-400 text-xs font-medium rounded-full">
                                        <FaClock className="h-3 w-3 mr-1" />
                                        {job.criteria}
                                    </span>
                                </div>

                                <button 
                                    onClick={() => handleViewDetailClick(job)} 
                                    className="text-blue-400 text-sm font-medium hover:text-blue-300 transition cursor-pointer flex items-center space-x-1"
                                >
                                    <FaEye className="w-3 h-3" />
                                    <span>View Details</span>
                                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-700 p-4 bg-slate-750 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FaUsers className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-400">
                                        {job.applicant_count || 0} applicants
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handleUpdateClick(job)}
                                        className="text-blue-400 hover:text-blue-300 transition duration-150 p-2 hover:bg-slate-700 rounded-lg"
                                        title="Edit Job"
                                    >
                                        <FaEdit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(job)}
                                        className="text-red-400 hover:text-red-300 transition duration-150 p-2 hover:bg-slate-700 rounded-lg"
                                        title="Delete Job"
                                    >
                                        <FaTrash className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="xl:col-span-3 md:col-span-2 col-span-1 text-center py-16">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
                                <FaBriefcase className="h-10 w-10 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-slate-300 text-xl font-semibold">No jobs found</p>
                                <p className="text-slate-500 mt-1">
                                    {searchTerm ? "Try adjusting your search criteria" : "Create your first job posting to get started"}
                                </p>
                            </div>
                            {!searchTerm && (
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(true);
                                    }}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 glow-effect flex items-center space-x-2 mt-4"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    <span>Create Your First Job</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white">Create New Job</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newJob.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Senior Frontend Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={newJob.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Describe the job responsibilities and requirements..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Position Type</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={newJob.position}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Full-time, Remote, Hybrid"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Required Skills</label>
                                    <input
                                        type="text"
                                        name="criteria"
                                        value={newJob.criteria}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. React, TypeScript, Node.js"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-semibold transition-all duration-200 glow-effect disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create Job'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Job Modal */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white">Update Job</h3>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newJob.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Senior Frontend Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={newJob.description}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Describe the job responsibilities and requirements..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Position Type</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={newJob.position}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. Full-time, Remote, Hybrid"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Required Skills</label>
                                    <input
                                        type="text"
                                        name="criteria"
                                        value={newJob.criteria}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="e.g. React, TypeScript, Node.js"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-semibold transition-all duration-200 glow-effect disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        'Update Job'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="h-8 w-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                            <p className="text-slate-400">
                                Are you sure you want to delete the job{' '}
                                <span className="font-semibold text-white">"{jobToDelete?.title}"</span>?{' '}
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl text-white font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Deleting...
                                    </span>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {isViewDetails && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <h3 className="text-xl font-bold text-white">Job Details</h3>
                            <button
                                onClick={() => setIsViewDetails(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                        <FaBriefcase className="h-8 w-8 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold text-white mb-2">{newJob.title}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center px-3 py-1 bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-full">
                                                <FaMapMarkerAlt className="h-3 w-3 mr-1" />
                                                {newJob.position}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 bg-purple-900/30 border border-purple-500/30 text-purple-400 text-sm font-medium rounded-full">
                                                <FaClock className="h-3 w-3 mr-1" />
                                                {newJob.criteria}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h5 className="text-lg font-semibold text-white mb-4 flex items-center">
                                    <svg className="h-5 w-5 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Job Description
                                </h5>
                                <p className="text-slate-300 leading-relaxed">{newJob.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                                        <FaMapMarkerAlt className="h-4 w-4 mr-2 text-slate-400" />
                                        Position Type
                                    </h5>
                                    <p className="text-slate-300">{newJob.position}</p>
                                </div>

                                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                    <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                                        <svg className="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Required Skills
                                    </h5>
                                    <p className="text-slate-300">{newJob.criteria}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

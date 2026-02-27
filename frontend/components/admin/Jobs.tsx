"use client";

import { useState, useEffect } from "react";

import {
    FaTrash, FaEdit, FaPlus, FaBriefcase, FaUsers,
    FaEye, FaMapMarkerAlt, FaClock, FaCheckCircle, FaSearch
} from 'react-icons/fa';


import useJobStore from "../../store/jobStore";
import { DetailJobModal } from "../job/DetailModal";
import { DeleteJobModal } from "../job/DeleteModal";

export default function Jobs() {
    // 1. Zustand Store
    const { data, loading, error, findAll, createJob, deleteJob, editJob } = useJobStore();
    
    // 2. UI States
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // 3. Data States
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        position: '',
        criteria: '',
    });

    useEffect(() => {
        findAll();
    }, [findAll]);

    // 4. Handlers
    const handleInputChange = (e : any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openCreateModal = () => {
        setSelectedJob(null);
        setFormData({ title: '', description: '', position: '', criteria: '' });
        setIsFormModalOpen(true);
    };

    const openEditModal = (job : any) => {
        setSelectedJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            position: job.position,
            criteria: job.criteria,
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        let res;
        if (selectedJob) {
            res = await editJob(selectedJob.id,formData.title, formData.position, formData.description, formData.criteria  );
        } else {
            res = await createJob(formData.title, formData.position, formData.description, formData.criteria);
        }

        if (res.status !== "error") {
            setIsFormModalOpen(false)
        } else {
            alert("Operation failed!");
        }
    };

    const confirmDelete = async () => {
        const res = await deleteJob(selectedJob.id);
        if (res.status !== false) {
            setIsDeleteModalOpen(false);
            setSelectedJob(null);
        }
    };

    const filteredJobs = data.filter((job:any) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Management</h1>
                    <p className="text-slate-400">Create and manage your job postings</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <FaSearch className="absolute right-4 top-4 text-slate-500" />
                    </div>

                    <button
                        onClick={openCreateModal}
                        className="bg-linear-to-r from-blue-600 to-purple-600 hover:scale-105 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20"
                    >
                        <FaPlus /> <span>Create Job</span>
                    </button>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Jobs" value={data.length} icon={<FaBriefcase />} color="blue" />
                <StatCard
                    title="Total Applicants"
                    value={data.reduce((acc:any, j:any) => acc + (j.applicant_count || 0), 0)}
                    icon={<FaUsers />}
                    color="green"
                />
                <StatCard title="Active Status" value="Online" icon={<FaCheckCircle />} color="purple" />
            </div>

            {/* --- JOBS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job : any) => (
                        <div key={job.id} className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition-all flex flex-col group">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><FaBriefcase /></div>
                                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20 uppercase font-bold tracking-tighter">Active</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{job.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-4">{job.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md flex items-center"><FaMapMarkerAlt className="mr-1" /> {job.position}</span>
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md flex items-center"><FaClock className="mr-1" /> {job.criteria}</span>
                                </div>

                                <button
                                    onClick={() => { setSelectedJob(job); setIsDetailModalOpen(true); }}
                                    className="text-blue-400 text-sm font-semibold flex items-center hover:underline"
                                >
                                    <FaEye className="mr-2" /> View Details
                                </button>
                            </div>

                            <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-medium">{job.applicant_count || 0} Applicants</span>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(job)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"><FaEdit /></button>
                                    <button onClick={() => { setSelectedJob(job); setIsDeleteModalOpen(true); }} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><FaTrash /></button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
                        No jobs found.
                    </div>
                )}
            </div>

            {/* --- MODALS --- */}
            {isFormModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between">
                            <h3 className="text-xl font-bold text-white">{selectedJob ? 'Edit Job' : 'Create New Job'}</h3>
                            <button onClick={() => setIsFormModalOpen(false)} className="text-slate-500 hover:text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <FormInput label="Job Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Senior Dev" required />
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Position" name="position" value={formData.position} onChange={handleInputChange} placeholder="Remote / Hybrid" required />
                                <FormInput label="Criteria/Skills" name="criteria" value={formData.criteria} onChange={handleInputChange} placeholder="React, Node.js" required />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsFormModalOpen(false)} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-semibold">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                                    {loading ? 'Processing...' : selectedJob ? 'Update Job' : 'Post Job'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDetailModalOpen && <DetailJobModal job={selectedJob} onClose={() => setIsDetailModalOpen(false)} />}
            {isDeleteModalOpen && <DeleteJobModal job={selectedJob} isLoading={loading} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />}
        </div>
    );
}

// --- HELPER COMPONENTS (Bisa dipindah ke file lain) ---

function StatCard({ title, value, icon, color } : any) {
    const colors : any = {
        blue: "from-blue-600/20 to-blue-400/5 text-blue-400 border-blue-500/20",
        green: "from-green-600/20 to-green-400/5 text-green-400 border-green-500/20",
        purple: "from-purple-600/20 to-purple-400/5 text-purple-400 border-purple-500/20",
    };
    return (
        <div className={`bg-linear-to-br ${colors[color]} border rounded-2xl p-6`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm font-medium opacity-70">{title}</p>
                    <p className="text-3xl font-bold mt-1 text-white">{value}</p>
                </div>
                <div className="text-2xl opacity-80">{icon}</div>
            </div>
        </div>
    );
}

function FormInput({ label, ...props } : any) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
            <input {...props} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
    );
}
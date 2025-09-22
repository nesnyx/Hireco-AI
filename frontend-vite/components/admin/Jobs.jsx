import { useState, useEffect } from "react";
import { createJob, deleteJob, getJobByHr, updateJob } from "../../src/api";
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from "react-icons/fa";
export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        position: '',
        criteria: '',
    });

    // State untuk modal delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [jobToUpdate, setJobToUpdate] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewJob((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newJob.title || !newJob.description || !newJob.position || !newJob.criteria) {
            alert("All fields are required!");
            return;
        }

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
        }
        window.location.reload();
        setIsModalOpen(false);
    };


    const handleUpdate = async (e) => {
        e.preventDefault();

        const jobToAdd = await updateJob({
            job_id: jobToUpdate.id,
            title: newJob.title,
            description: newJob.description,
            position: newJob.position,
            criteria: newJob.criteria,
        });

        if (jobToAdd.status === false) {
            alert("Terjadi Kesalahan Update Job Baru");
        } else {
            alert("Berhasil Update Job ");
        }
        window.location.reload();
        setIsUpdateModalOpen(false);
    };

    // 🔴 Handle delete: buka modal
    const handleDeleteClick = (job) => {
        setJobToDelete(job);
        setIsDeleteModalOpen(true);
    };

    // 🔴 Handle update: buka modal
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

    // 🔴 Konfirmasi hapus
    const confirmDelete = async () => {
        try {
            const deleteJobWithID = await deleteJob(jobToDelete.id);
            if (deleteJobWithID.status === false) {
                alert(`Gagal Menghapus Job "${jobToDelete.title}"`);
                return;
            }
            alert(`Job "${jobToDelete.title}" akan dihapus.`);
            window.location.reload(); // Ganti dengan fetch ulang jika punya API delete
        } catch (error) {
            console.error("Error deleting job:", error);
            alert("Gagal menghapus job.");
        } finally {
            setIsDeleteModalOpen(false);
            setJobToDelete(null);
        }
    };

    // 🔴 Batalkan delete
    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Job
                </button>
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1 min-h-[340px] flex flex-col"
                        >
                            <div className="p-6 flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {job.position}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 text-xs font-medium rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {job.criteria}
                                    </span>
                                </div>

                                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition cursor-pointer">
                                    View Details →
                                </button>
                            </div>

                            <div className="border-t border-gray-100 p-4 bg-gray-50 flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                    <span>{job.applicant_count || 0} applicants</span>
                                </div>
                                <button
                                    onClick={() => handleDeleteClick(job)}
                                    className="text-red-500 hover:text-red-700 transition duration-150 flex items-center justify-center"
                                    title="Delete Job"
                                >
                                    <FaTrash className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleUpdateClick(job)}
                                    className="text-blue-500 hover:text-red-700 transition duration-150 flex items-center justify-center"
                                    title="Delete Job"
                                >
                                    <FaEdit className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="lg:col-span-3 md:col-span-2 col-span-1 text-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No Data Jobs</p>
                    </div>
                )}
            </div>

            {/* ✅ Modal Tambah Job (Tetap seperti semula) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                        <h3 className="text-xl font-bold mb-4">Create New Job</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newJob.title}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={newJob.description}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe the job responsibilities..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={newJob.position}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. Full-time, Freelance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Criteria</label>
                                    <input
                                        type="text"
                                        name="criteria"
                                        value={newJob.criteria}
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. React, TypeScript"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Create Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 🔴 Modal Konfirmasi Delete */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete the job <strong>"{jobToDelete.position} - {jobToDelete?.title}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* ✅ Modal Tambah Job (Tetap seperti semula) */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                        <h3 className="text-xl font-bold mb-4">Update Job</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newJob.title}           
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        value={newJob.description}    
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Describe the job responsibilities..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input
                                        type="text"
                                        name="position"
                                        value={newJob.position}        
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. Full-time, Freelance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Criteria</label>
                                    <input
                                        type="text"
                                        name="criteria"
                                        value={newJob.criteria}        
                                        onChange={handleChange}
                                        required
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g. React, TypeScript"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    Update Job
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
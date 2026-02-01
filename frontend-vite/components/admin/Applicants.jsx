import { useEffect, useState } from "react";
import { deleteApplicantByID, downloadPDF, getApplicantByHR } from "../../src/api";
import { DateTime } from "luxon";
import { FaFilePdf, FaEye, FaTrash, FaUser, FaEnvelope, FaPhone, FaCalendar, FaStar } from "react-icons/fa";

export default function Applicant() {
    const [applicant, setApplicant] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [deleteApplicant, setDeleteApplicant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchApplicant = async () => {
            try {
                const response = await getApplicantByHR();
                setApplicant(response.result || []);
            } catch (error) {
                console.log("Error fetching applicants:", error);
            }
        };
        fetchApplicant();
    }, []);

    // Filter applicants based on search
    const filteredApplicants = applicant.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDetailClick = (app) => {
        setSelectedApplicant(app);
        setIsOpenDetail(true);
    };

    const handleDeleteClick = (app) => {
        setDeleteApplicant(app);
        setIsOpenDelete(true);
    };

    const closeModal = () => {
        setIsOpenDetail(false);
        setSelectedApplicant(null);
    };

    const closeModalDelete = () => {
        setIsOpenDelete(false);
        setDeleteApplicant(null);
    };

    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            const deleteApplicantReq = await deleteApplicantByID(deleteApplicant.id);
            if (deleteApplicantReq.status === false) {
                alert(`Gagal Menghapus Applicant`);
                return;
            }
            alert(`Applicant "${deleteApplicant.name}" telah dihapus.`);
            window.location.reload();
        } catch (error) {
            console.error("Error deleting applicant:", error);
            alert("Gagal menghapus applicant.");
        } finally {
            setIsOpenDelete(false);
            setDeleteApplicant(null);
        }
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-500/30" };
        if (score >= 60) return { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-500/30" };
        if (score >= 40) return { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-500/30" };
        return { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-500/30" };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applicant Management</h1>
                    <p className="text-slate-400">Manage and review job applicants</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg className="absolute right-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Applicants</p>
                            <p className="text-2xl font-bold text-white mt-1">{applicant.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                            <FaUser className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">High Scores (≥80)</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {applicant.filter(app => app.score >= 80).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                            <FaStar className="h-6 w-6 text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Average Score</p>
                            <p className="text-2xl font-bold text-white mt-1">
                                {applicant.length > 0 ? 
                                    Math.round(applicant.reduce((acc, app) => acc + app.score, 0) / applicant.length) : 0}
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

            {/* Applicants Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">Applicant List</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-700 border-b border-slate-600">
                            <tr>
                                <th className="px-6 py-4 text-left font-medium text-slate-300">Applicant</th>
                                <th className="px-6 py-4 text-left font-medium text-slate-300">Contact</th>
                                <th className="px-6 py-4 text-left font-medium text-slate-300">Score</th>
                                <th className="px-6 py-4 text-left font-medium text-slate-300">Applied Date</th>
                                <th className="px-6 py-4 text-center font-medium text-slate-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredApplicants.length > 0 ? (
                                filteredApplicants.map((reg, index) => {
                                    const scoreBadge = getScoreBadge(reg.score);
                                    return (
                                        <tr key={index} className="hover:bg-slate-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={`https://avatar.iran.liara.run/public/${reg.id}`}
                                                        alt={reg.name}
                                                        className="w-10 h-10 rounded-full border-2 border-slate-600"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-white">{reg.name}</p>
                                                        <p className="text-xs text-slate-400">ID: {reg.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center space-x-2">
                                                        <FaEnvelope className="w-3 h-3 text-slate-400" />
                                                        <span className="text-white text-sm">{reg.email}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <FaPhone className="w-3 h-3 text-slate-400" />
                                                        <span className="text-slate-400 text-sm">{reg.telp}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`${scoreBadge.bg} ${scoreBadge.border} ${scoreBadge.text} rounded-full px-3 py-1 border inline-flex items-center space-x-2`}>
                                                    <FaStar className="w-3 h-3" />
                                                    <span className="font-semibold">{reg.score}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <FaCalendar className="w-3 h-3 text-slate-400" />
                                                    <span className="text-slate-300">
                                                        {DateTime.fromISO(reg.created_at).toFormat('MMM dd, HH:mm')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => handleDetailClick(reg)}
                                                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm transition-colors flex items-center space-x-2"
                                                    >
                                                        <FaEye className="w-3 h-3" />
                                                        <span>Detail</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(reg)}
                                                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm transition-colors flex items-center space-x-2"
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                        <span>Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12">
                                        <div className="flex flex-col items-center space-y-3">
                                            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                                                <FaUser className="w-8 h-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 font-medium">No applicants found</p>
                                            <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {isOpenDetail && selectedApplicant && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <FaUser className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Applicant Profile</h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-lg"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={`https://avatar.iran.liara.run/public/${selectedApplicant.id}`}
                                        alt={selectedApplicant.name}
                                        className="w-20 h-20 rounded-full border-4 border-slate-600"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-bold text-white mb-2">{selectedApplicant.name}</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <FaEnvelope className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-300">{selectedApplicant.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FaPhone className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-300">{selectedApplicant.telp}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <FaCalendar className="w-4 h-4 text-slate-400" />
                                                <span className="text-slate-400">
                                                    Applied on {DateTime.fromISO(selectedApplicant.created_at).toFormat('MMM dd, yyyy')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {(() => {
                                            const scoreBadge = getScoreBadge(selectedApplicant.score);
                                            return (
                                                <div className={`${scoreBadge.bg} ${scoreBadge.border} ${scoreBadge.text} rounded-xl px-4 py-2 border`}>
                                                    <div className="text-center">
                                                        <p className="text-2xl font-bold">{selectedApplicant.score}</p>
                                                        <p className="text-sm opacity-75">/ 100</p>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h5 className="text-lg font-semibold text-white mb-4">AI Analysis Summary</h5>
                                <p className="text-slate-300 leading-relaxed">
                                    {selectedApplicant.explanation}
                                </p>
                            </div>

                            {/* Score Breakdown */}
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h5 className="text-lg font-semibold text-white mb-6">Score Breakdown</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { key: 'experience', label: 'Experience', data: JSON.parse(selectedApplicant.experience) },
                                        { key: 'hard_skill', label: 'Hard Skills', data: JSON.parse(selectedApplicant.hard_skill) },
                                        { key: 'presentation_quality', label: 'Presentation', data: JSON.parse(selectedApplicant.presentation_quality) }
                                    ].map((item) => {
                                        const scoreBadge = getScoreBadge(item.data.score);
                                        return (
                                            <div key={item.key} className="bg-slate-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h6 className="font-medium text-white">{item.label}</h6>
                                                    <div className={`${scoreBadge.bg} ${scoreBadge.border} ${scoreBadge.text} rounded-full px-2 py-1 border text-sm font-semibold`}>
                                                        {item.data.score}
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 text-sm">{item.data.feedback}</p>
                                                {item.data.issues && (
                                                    <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                                                        <p className="text-yellow-400 text-xs font-medium mb-1">Notes:</p>
                                                        <p className="text-slate-400 text-xs">{item.data.issues}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* CV File */}
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                                <h5 className="text-lg font-semibold text-white mb-4">CV Document</h5>
                                <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                                    <div className="w-12 h-12 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center justify-center">
                                        <FaFilePdf className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <button 
                                            onClick={() => {
                                                const filePath = selectedApplicant.filename;
                                                const parts = filePath.split('/');
                                                const fileName = parts[parts.length - 1];
                                                downloadPDF(fileName);
                                            }}
                                            className="font-medium text-blue-400 hover:text-blue-300 transition-colors hover:underline"
                                        >
                                            {selectedApplicant.filename.split('/').pop()}
                                        </button>
                                        <p className="text-slate-400 text-sm">Click to download CV</p>
                                    </div>
                                    <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isOpenDelete && deleteApplicant && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaTrash className="h-8 w-8 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                            <p className="text-slate-400">
                                Are you sure you want to delete applicant{' '}
                                <span className="font-semibold text-white">"{deleteApplicant.name}"</span>?{' '}
                                This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={closeModalDelete}
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
        </div>
    );
}

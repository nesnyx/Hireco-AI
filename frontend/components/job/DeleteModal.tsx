import { FaTrash } from "react-icons/fa";


export function DeleteJobModal({ job, onClose, onConfirm, isLoading }:any) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaTrash className="text-red-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Delete Job Posting?</h3>
                    <p className="text-slate-400 mb-6">
                        Are you sure you want to delete <span className="text-white font-semibold">"{job?.title}"</span>? 
                        This action will also remove all associated applicant data.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors">Cancel</button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isLoading}
                        className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
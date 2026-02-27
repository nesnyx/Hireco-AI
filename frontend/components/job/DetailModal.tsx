import { FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";


export function DetailJobModal({ job, onClose } : any) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-900/90 backdrop-blur-md">
                    <h3 className="text-2xl font-bold text-white">Job Details</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Job Title</label>
                        <p className="text-2xl font-semibold text-white mt-1">{job?.title}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <label className="text-xs text-slate-500 uppercase">Position Type</label>
                            <p className="text-white font-medium flex items-center mt-1"><FaMapMarkerAlt className="mr-2 text-blue-500"/> {job?.position}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <label className="text-xs text-slate-500 uppercase">Requirements</label>
                            <p className="text-white font-medium flex items-center mt-1"><FaCheckCircle className="mr-2 text-green-500"/> {job?.criteria}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-blue-400 uppercase tracking-widest">Full Description</label>
                        <div className="mt-3 text-slate-300 leading-relaxed bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 whitespace-pre-line">
                            {job?.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
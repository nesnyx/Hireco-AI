import { useEffect, useState, useMemo } from "react";
import { downloadPDF } from "../../integration/api";
import { DateTime } from "luxon";
import { FaFilePdf, FaEye, FaTrash, FaUser, FaEnvelope, FaPhone, FaCalendar, FaStar } from "react-icons/fa";
import useApplicantStore from "../../store/applicantStore";
import { DetailModal } from "../applicant/DetailModal";
import { DeleteModal } from "../applicant/DeleteModal";
import useCreditStore from "../../store/creditStore";

export default function Applicant() {
    const { data, findAll, removeApplicant } = useApplicantStore();
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        findAll();
        const intervalId = setInterval(() => {
            findAll();
        }, 5000); 

        return () => {
            clearInterval(intervalId);
        };
    }, [findAll]);

    const stats = useMemo(() => {
        const total = data?.length || 0;
        const highScores = data?.filter(app => app.score >= 80).length || 0;
        const avg = total > 0 ? Math.round(data.reduce((acc, app) => acc + (app.score || 0), 0) / total) : 0;
        return { total, highScores, avg };
    }, [data]);

    const confirmDelete = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        const result = await removeApplicant(deleteTarget.id);

        if (result.success) {
            alert(`Applicant "${deleteTarget.name}" berhasil dihapus.`);
            setDeleteTarget(null);
        } else {
            alert(result.message);
        }
        setIsDeleting(false);
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-500/30" };
        if (score >= 60) return { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-500/30" };
        if (score >= 40) return { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-500/30" };
        return { bg: "bg-red-900/30", text: "text-red-400", border: "border-red-500/30" };
    };

    const safeParse = (str) => {
        try { return JSON.parse(str); }
        catch (e) { return { score: 0, feedback: "", issues: "" }; }
    };

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Applicant Management</h1>
                    <p className="text-slate-400">Manage and review job applicants</p>
                </div>

                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Applicants" value={stats.total} icon={<FaUser />} color="blue" />
                <StatCard title="High Scores (≥80)" value={stats.highScores} icon={<FaStar />} color="green" />
                <StatCard title="Average Score" value={stats.avg} icon={<FaStar />} color="purple" isChart />
            </div>

            {/* Table */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-700 text-slate-300">
                            <tr>
                                <th className="px-6 py-4 text-left">Applicant</th>
                                <th className="px-6 py-4 text-left">Contact</th>
                                <th className="px-6 py-4 text-left">Score</th>
                                <th className="px-6 py-4 text-left">Applied Date</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {data.length > 0 ? (
                                data.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <img src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Mason`} className="w-10 h-10 rounded-full border border-slate-600" alt="avatar" />
                                                <div>
                                                    <p className="font-semibold text-white">{reg.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {reg.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <div className="flex flex-col">
                                                <span>{reg.email}</span>
                                                <span className="text-xs text-slate-500">{reg.telp}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge score={reg.score} config={getScoreBadge(reg.score)} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {DateTime.fromISO(reg.created_at).toFormat('MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            <p className="text-green-400">{reg.status}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => setSelectedApplicant(reg)} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"><FaEye /></button>
                                                <button onClick={() => setDeleteTarget(reg)} className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="py-20 text-center text-slate-500">No applicants found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedApplicant && (
                <DetailModal
                    app={selectedApplicant}
                    onClose={() => setSelectedApplicant(null)}
                    getScoreBadge={getScoreBadge}
                    safeParse={safeParse}
                />
            )}

            {deleteTarget && (
                <DeleteModal
                    app={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                    isLoading={isDeleting}
                />
            )}
        </div>
    );
}

// Sub-components untuk keterbacaan
function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-400">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-${color}-500/30 bg-${color}-500/10 text-${color}-400`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function Badge({ score, config }) {
    return (
        <div className={`${config.bg} ${config.border} ${config.text} rounded-full px-3 py-1 border inline-flex items-center space-x-2`}>
            <FaStar className="w-3 h-3" />
            <span className="font-semibold">{score}</span>
        </div>
    );
}
import { useEffect, useState } from "react";
import { getApplicantByHR, getJobByHr } from "../../integration/api";
import { BriefcaseBusiness,User2Icon, Calendar,FileUser } from 'lucide-react';

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [applicant, setApplicant] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusColor = (score) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-blue-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-gray-500";
    };

    const getStatusBadge = (score) => {
        if (score >= 80) return { bg: "bg-green-900/30", text: "text-green-400", border: "border-green-500/30" };
        if (score >= 60) return { bg: "bg-blue-900/30", text: "text-blue-400", border: "border-blue-500/30" };
        if (score >= 40) return { bg: "bg-yellow-900/30", text: "text-yellow-400", border: "border-yellow-500/30" };
        return { bg: "bg-gray-900/30", text: "text-gray-400", border: "border-gray-500/30" };
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [jobsResponse, applicantsResponse] = await Promise.all([
                    getJobByHr(),
                    getApplicantByHR()
                ]);

                setJobs(jobsResponse.result || []);
                setApplicant(applicantsResponse.result || []);
            } catch (error) {
                console.log("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Welcome back! Here's your HR overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Jobs */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Jobs</p>
                            <p className="text-3xl font-bold text-white mt-2">{jobs.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-linear-to-r from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                           <BriefcaseBusiness className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="text-green-400 text-sm font-medium">Active positions</span>
                    </div>
                </div>

                {/* Total Applicants */}
                {/* <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Total Applicants</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {jobs.length > 0 ? jobs.reduce((acc, job) => acc + job.applicant_count, 0) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                            <User2Icon className="h-6 w-6 text-purple-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="text-blue-400 text-sm font-medium">All time</span>
                    </div>
                </div> */}

                {/* Average Score */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">Avg Score</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {applicant.length > 0 ?
                                    Math.round(applicant.reduce((acc, app) => acc + app.score, 0) / applicant.length) : 0}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-linear-to-r from-green-600/20 to-emerald-600/20 rounded-xl flex items-center justify-center border border-green-500/30">
                            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="text-green-400 text-sm font-medium">Quality candidates</span>
                    </div>
                </div>

                {/* This Month */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 font-medium">This Month</p>
                            <p className="text-3xl font-bold text-white mt-2">
                                {applicant.filter(app => {
                                    const appDate = new Date(app.created_at);
                                    const now = new Date();
                                    return appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-linear-to-r from-orange-600/20 to-red-600/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                            <Calendar className="h-6 w-6 text-orange-400" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        <span className="text-orange-400 text-sm font-medium">New applications</span>
                    </div>
                </div>
            </div>

            {/* Top Jobs & Recent Applicants */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Jobs */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Top Jobs</h3>
                        <div className="text-slate-400">
                            <BriefcaseBusiness className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.length > 0 ? (
                            jobs.slice(0, 5).map((job, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-semibold text-white text-sm">{job.position}</p>
                                        <p className="text-xs text-slate-400 mt-1">{job.title}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="bg-blue-900/30 border border-blue-500/30 rounded-full px-3 py-1">
                                            <p className="text-sm font-medium text-blue-400">{job.applicant_count} applicants</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400">No jobs available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Applicants */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">Recent Applicants</h3>
                        <div className="text-slate-400">
                            <FileUser className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {applicant.length > 0 ? (
                            applicant.slice(0, 5).map((app, idx) => {
                                const statusBadge = getStatusBadge(app.score);
                                return (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                                        <div className="flex items-center space-x-3 flex-1">
                                            <img
                                                src={`https://avatar.iran.liara.run/public/${(idx + 1) * 7}`}
                                                alt={app.name}
                                                className="w-10 h-10 rounded-full border-2 border-slate-600"
                                            />
                                            <div>
                                                <p className="font-semibold text-white text-sm">{app.name}</p>
                                                <p className="text-xs text-slate-400">{app.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className={`${statusBadge.bg} ${statusBadge.border} ${statusBadge.text} rounded-full px-3 py-1 border`}>
                                                <span className="text-sm font-medium">{app.score}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400">No applicants yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 glow-effect hover:scale-105">
                        + Create Job
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                        View All Applicants
                    </button>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-slate-500 px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                        Generate Report
                    </button>
                </div>
            </div> */}
        </div>
    );
}
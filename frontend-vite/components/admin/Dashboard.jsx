import { useEffect, useState } from "react";
import { getApplicantByHR, getJobByHr } from "../../src/api";


export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [applicant, setApplicant] = useState([]);

    const getStatusColor = (score) => {
        if (score >= 80) return "bg-green-500";
        if (score >= 60) return "bg-blue-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-gray-500";
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {

                const response = await getJobByHr();
                setJobs(response.result || []);
            } catch (error) {
                console.log("Error fetching jobs:", error);
            }
        };

        const fetchApplicant = async () => {
            try {
                const response = await getApplicantByHR();
                setApplicant(response.result || []);
            } catch (error) {
                console.log("Error fetching applicants:", error);
            }
        };
        fetchApplicant();
        fetchJobs();
    }, []);
    return (
        <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Jobs</p>
                            <p className="text-2xl font-bold">{jobs.length}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Applicants</p>
                            <p className="text-2xl font-bold">{jobs.length > 0 ? jobs.reduce((acc, job) => acc + job.applicant_count, 0) : 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>
                </div>


            </div>

            {/* Top 5 Jobs & Applicants */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Top Jobs</h3>
                    <ul className="space-y-3">
                        {jobs.slice(0, 5).map((job, idx) => (
                            <li key={idx} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                <div>
                                    <p className="font-medium">{job.position}</p>
                                    <p className="text-xs text-gray-500">{job.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">{job.applicant_count} Applicants</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Recent Applicants</h3>
                    <ul className="space-y-3">
                        {applicant.length > 0 ? (
                            applicant.slice(0, 5).map((app, idx) => (
                                <li key={idx} className="flex items-center justify-between p-3 border-b last:border-b-0">
                                    <div>
                                        <p className="font-medium">{app.name}</p>
                                        <p className="text-xs text-gray-500">{app.email}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`w-2 h-2 rounded-full ${getStatusColor(app.score)} mr-2`}></span>
                                        <span className={`w-2 h-2 rounded-full  mr-2`}>{app.score}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div className="font-medium text-gray-500 text-center">No Data</div>
                        )}
                    </ul>
                </div>
            </div>

            {/* Hiring Trend */}

        </div>
    );
}
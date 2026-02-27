"use client";

import React, { useState, useEffect } from 'react';
import { FiX, FiDownload, FiStar, FiChevronRight } from 'react-icons/fi';

// --- DUMMY DATA ---
// Ganti ini dengan data dari API call Anda.
// Strukturnya dirancang untuk mendukung heatmap dan modal.
const dummyCandidates = [
    {
        id: 1,
        name: 'Ahmad Syafii',
        overallScore: 92,
        avatar: 'https://i.pravatar.cc/150?u=ahmad',
        summary: 'Kandidat yang sangat kuat dengan pengalaman solid di Golang dan arsitektur cloud. Sedikit kelemahan pada skill frontend.',
        cvFileUrl: '/path/to/cv_ahmad.pdf',
        criteriaScores: [
            { criterion: 'Pengalaman Golang', score: 95, detail: 'Memiliki 5 tahun pengalaman produksi dengan Go, termasuk pengembangan API performa tinggi.' },
            { criterion: 'Keahlian PostgreSQL', score: 90, detail: 'Sangat mahir dalam optimasi query dan desain skema database.' },
            { criterion: 'Arsitektur Microservices', score: 88, detail: 'Berpengalaman dalam memecah monolit menjadi microservices dan mengelolanya.' },
            { criterion: 'Pengalaman Cloud (AWS)', score: 93, detail: 'Menguasai layanan AWS seperti EC2, S3, Lambda, dan RDS.' },
            { criterion: 'Skill Frontend', score: 65, detail: 'Memiliki pemahaman dasar React, namun bukan keahlian utamanya.' },
        ],
    },
    {
        id: 2,
        name: 'Citra Wijayanti',
        overallScore: 85,
        avatar: 'https://i.pravatar.cc/150?u=citra',
        summary: 'Full-stack developer yang seimbang dengan kekuatan utama di microservices dan keahlian frontend yang baik.',
        cvFileUrl: '/path/to/cv_citra.pdf',
        criteriaScores: [
            { criterion: 'Pengalaman Golang', score: 80, detail: 'Menggunakan Golang selama 2 tahun di proyek sebelumnya.' },
            { criterion: 'Keahlian PostgreSQL', score: 85, detail: 'Mampu merancang dan mengelola database untuk aplikasi skala menengah.' },
            { criterion: 'Arsitektur Microservices', score: 92, detail: 'Sangat memahami pola komunikasi antar service dan orkestrasi.' },
            { criterion: 'Pengalaman Cloud (AWS)', score: 82, detail: 'Familiar dengan deployment aplikasi ke AWS.' },
            { criterion: 'Skill Frontend', score: 88, detail: 'Mahir menggunakan React & TypeScript untuk membangun UI yang kompleks.' },
        ],
    },
    {
        id: 3,
        name: 'Budi Santoso',
        overallScore: 78,
        avatar: 'https://i.pravatar.cc/150?u=budi',
        summary: 'Developer junior-menengah dengan potensi besar. Kuat di dasar-dasar Golang tetapi butuh pengalaman lebih di arsitektur cloud.',
        cvFileUrl: '/path/to/cv_budi.pdf',
        criteriaScores: [
            { criterion: 'Pengalaman Golang', score: 84, detail: 'Memiliki 1.5 tahun pengalaman, sangat antusias dan cepat belajar.' },
            { criterion: 'Keahlian PostgreSQL', score: 80, detail: 'Paham dasar-dasar SQL dan ORM dengan baik.' },
            { criterion: 'Arsitektur Microservices', score: 70, detail: 'Baru mempelajari konsep dan belum ada pengalaman implementasi langsung.' },
            { criterion: 'Pengalaman Cloud (AWS)', score: 65, detail: 'Pernah menggunakan beberapa layanan AWS dalam proyek pribadi.' },
            { criterion: 'Skill Frontend', score: 75, detail: 'Cukup familiar dengan Vue.js.' },
        ],
    },
];


// --- Helper Functions untuk Warna ---
const getScoreColor = (score : number) => {
    if (score >= 90) return { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' };
    if (score >= 75) return { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30' };
    if (score >= 60) return { bg: 'bg-orange-500/20', text: 'text-orange-300', border: 'border-orange-500/30' };
    return { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30' };
};

const getOverallScoreColor = (score : number) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 75) return 'bg-yellow-500 text-slate-900';
    if (score >= 60) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
};


// --- Komponen Modal ---
const CandidateDetailModal = ({ candidate, onClose } : any) => {
    if (!candidate) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
                onClick={e => e.stopPropagation()} // Mencegah modal tertutup saat diklik di dalam
            >
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">{candidate.name}</h2>
                            <div className={`mt-1 text-sm font-bold px-3 py-1 rounded-full inline-block ${getOverallScoreColor(candidate.overallScore)}`}>
                                Skor Keseluruhan: {candidate.overallScore} / 100
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <FiX size={28} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-indigo-300 mb-2">Ringkasan Analisis AI</h3>
                        <p className="text-slate-300">{candidate.summary}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-indigo-300 mb-3">Rincian Skor Berdasarkan Kriteria</h3>
                        <div className="space-y-3">
                            {candidate.criteriaScores.map(({ criterion, score, detail } :any) => {
                                const colors = getScoreColor(score);
                                return (
                                    <div key={criterion} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-slate-200">{criterion}</p>
                                            <p className={`font-bold text-lg ${colors.text}`}>{score}</p>
                                        </div>
                                        <p className={`mt-1 text-sm ${colors.text}/80`}>{detail}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <a
                            href={candidate.cvFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold py-2 px-5 rounded-lg"
                        >
                            <FiDownload /> Lihat CV Asli
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Komponen Halaman Utama ---
const ComparingPage = () => {
    const [candidates, setCandidates] = useState<any>([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    // Ambil data kandidat saat komponen dimuat
    useEffect(() => {
        // Di sini Anda akan melakukan fetch ke API
        // Untuk sekarang, kita gunakan dummy data
        setCandidates(dummyCandidates);
    }, []);

    if (candidates.length === 0) {
        return <div className="p-8 text-slate-400">Memuat data kandidat...</div>;
    }

    // Ambil daftar kriteria dari kandidat pertama (asumsi semua sama)
    const criteriaHeaders = candidates[0].criteriaScores.map((c:any) => c.criterion);

    return (
        <div className="p-8 text-white w-full min-h-full bg-slate-900">
            <h1 className="text-3xl font-bold">Perbandingan Kandidat</h1>
            <p className="text-slate-400 mt-2">
                Analisis perbandingan kandidat berdasarkan kriteria. Klik pada kandidat untuk melihat rincian.
            </p>

            {/* Heatmap Comparison Table */}
            <div className="mt-8 overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="grid gap-px" style={{ gridTemplateColumns: `minmax(250px, 1.5fr) repeat(${criteriaHeaders.length}, minmax(150px, 1fr))` }}>
                        {/* Header */}
                        <div className="bg-slate-800 p-4 font-semibold rounded-tl-lg">Kandidat</div>
                        {criteriaHeaders.map((header:any) => (
                            <div key={header} className="bg-slate-800 p-4 font-semibold text-center">{header}</div>
                        ))}

                        {/* Body - Baris Kandidat */}
                        {candidates.map((candidate:any) => (
                            <React.Fragment key={candidate.id}>
                                <div
                                    className="bg-slate-800/50 p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-700/50 transition-colors"
                                    onClick={() => setSelectedCandidate(candidate)}
                                >
                                    <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-white">{candidate.name}</p>
                                        <p className="text-sm text-slate-400">Skor: {candidate.overallScore}</p>
                                    </div>
                                </div>
                                {candidate.criteriaScores.map(({ criterion, score }:any) => {
                                    const colors = getScoreColor(score);
                                    return (
                                        <div
                                            key={criterion}
                                            className={`flex items-center justify-center p-4 cursor-pointer hover:bg-slate-700/50 transition-colors ${colors.bg}`}
                                            onClick={() => setSelectedCandidate(candidate)}
                                        >
                                            <span className={`font-bold text-lg ${colors.text}`}>{score}</span>
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal yang akan muncul */}
            {selectedCandidate && (
                <CandidateDetailModal
                    candidate={selectedCandidate}
                    onClose={() => setSelectedCandidate(null)}
                />
            )}
        </div>
    );
};

export default ComparingPage;
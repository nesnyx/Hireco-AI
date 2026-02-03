import React, { useState, useCallback, useEffect } from 'react';
import { FiUploadCloud, FiFileText, FiX, FiChevronsRight, FiBriefcase, FiType } from 'react-icons/fi';
import { getJobByHr } from '../../integration/api';
const FileUploads = () => {
    // --- STATE MANAGEMENT ---
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' atau 'criteria'
    const [showUploader, setShowUploader] = useState(false);

    // State untuk Tab "Profil Jabatan"
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [isLoadingJobs, setIsLoadingJobs] = useState(true);
    const [jobError, setJobError] = useState(null);
    const [error, setError] = useState(null)
    // State untuk Tab "Kriteria Langsung"
    const [criteriaText, setCriteriaText] = useState('');

    // State untuk Upload File
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- DATA FETCHING ---
    useEffect(() => {
        // Hanya fetch jobs jika tab 'profile' aktif
        if (activeTab === 'profile') {
            const fetchJobs = async () => {
                setIsLoadingJobs(true);
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi API call
                    console.log("Fetching jobs from API...");
                    const dummyJobs = await getJobByHr();
                    console.log("Response from API:", dummyJobs);

                    // handle both single object and array response
                    if (Array.isArray(dummyJobs.result)) {
                        setJobs(dummyJobs.result);
                    } else if (dummyJobs && typeof dummyJobs === "object") {
                        setJobs([dummyJobs.result]);
                    } else {
                        setJobs([]);
                    }
                    setError(null);
                } catch (err) {
                    console.log("Error fetching jobs:", err);
                    setJobError('Gagal memuat profil pekerjaan.');
                } finally {
                    setIsLoadingJobs(false);
                }
            };
            fetchJobs();
        }
    }, [activeTab]);

    // --- HANDLER & LOGIC ---
    const resetState = () => {
        setFiles([]);
        setShowUploader(false);
        setSelectedJobId('');
        setCriteriaText('');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        resetState();
    };

    const handleJobSelect = (jobId) => {
        setSelectedJobId(jobId);
        setFiles([]);
        setShowUploader(jobId !== '');
    };

    const handleCriteriaSubmit = () => {
        if (criteriaText.trim().length > 10) { // Validasi sederhana
            setShowUploader(true);
        } else {
            alert("Harap isi kriteria dengan lebih detail.");
        }
    };

    const handleProcessBatch = async () => {
        setIsProcessing(true);
        const formData = new FormData();

        // Logika cerdas untuk menentukan payload berdasarkan tab aktif
        if (activeTab === 'profile') {
            if (!selectedJobId) {
                alert("Sesi tidak valid, harap pilih profil kembali.");
                setIsProcessing(false);
                return;
            }
            formData.append('job_id', selectedJobId);
        } else if (activeTab === 'criteria') {
            if (criteriaText.trim().length <= 10) {
                alert("Kriteria tidak valid.");
                setIsProcessing(false);
                return;
            }
            formData.append('criteria_text', criteriaText);
        }

        files.forEach(file => {
            formData.append('files', file);
        });

        console.log(`Mengirim ${files.length} file...`);
        console.log("Payload yang akan dikirim:", Object.fromEntries(formData));

        // SIMULASI PROSES UPLOAD
        await new Promise(resolve => setTimeout(resolve, 100));
        alert(`PROSES SELESAI (Simulasi): ${files.length} CV telah dianalisis. Lihat hasil di console.`);

        setIsProcessing(false);
    };

    // Handler utilitas lainnya (drag/drop, format size, dll.)
    const handleFiles = (newFiles) => setFiles(prev => [...prev, ...Array.from(newFiles)]);
    const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }, []);
    const handleFileSelect = (e) => handleFiles(e.target.files);
    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="p-8 text-white w-full min-h-full bg-slate-900">
            <h1 className="text-3xl font-bold">Analisis & Perbandingan CV Massal</h1>
            <p className="text-slate-400 mt-2">Gunakan profil tersimpan untuk konsistensi atau kriteria langsung untuk fleksibilitas.</p>

            {/* --- LANGKAH 1: PEMILIHAN METODE --- */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Langkah 1: Pilih Metode Screening</h2>
                {/* Tab Navigator */}
                <div className="flex bg-slate-800 p-1 rounded-lg max-w-md">
                    <button onClick={() => handleTabChange('profile')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${activeTab === 'profile' ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
                        Berdasarkan Profil
                    </button>
                    <button onClick={() => handleTabChange('criteria')} className={`w-1/2 p-2 rounded-md font-semibold transition-colors ${activeTab === 'criteria' ? 'bg-indigo-600' : 'hover:bg-slate-700'}`}>
                        Kriteria Langsung
                    </button>
                </div>

                {/* Konten Tab */}
                <div className="mt-6 p-6 bg-slate-800/50 rounded-lg border border-slate-700">
                    {activeTab === 'profile' && (
                        <div>
                            <label htmlFor="job-select" className="block text-slate-300 mb-2 font-medium">Pilih profil jabatan yang sudah tersimpan:</label>
                            {isLoadingJobs ? <p>Memuat profil...</p> : jobError ? <p className="text-red-400">{jobError}</p> : (
                                <select id="job-select" value={selectedJobId} onChange={(e) => handleJobSelect(e.target.value)} className="w-full md:w-2/3 bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500">
                                    <option value="" disabled>-- Pilih Posisi --</option>
                                    {jobs.length > 0 ? (jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)) : (
                                        <option disabled={true}>Tidak tersedia</option>
                                    )}
                                </select>
                            )}
                        </div>
                    )}
                    {activeTab === 'criteria' && (
                        <div>
                            <label htmlFor="criteria-text" className="block text-slate-300 mb-2 font-medium">Tempel deskripsi pekerjaan atau tulis kriteria yang dicari:</label>
                            <textarea id="criteria-text" value={criteriaText} onChange={(e) => setCriteriaText(e.target.value)} rows="8" className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Contoh: Backend Engineer, 3-5 tahun pengalaman, mahir Golang, PostgreSQL, dan arsitektur microservices..."></textarea>
                            <button onClick={handleCriteriaSubmit} disabled={!criteriaText.trim()} className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold py-2 px-5 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed">
                                Lanjutkan ke Upload <FiChevronsRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- LANGKAH 2: UPLOAD FILE --- */}
            {showUploader && (
                <div className="mt-10 animate-fade-in">
                    <h2 className="text-xl font-semibold mb-4">Langkah 2: Upload CV Pelamar</h2>
                    <div className={`p-10 border-2 border-dashed rounded-xl text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-600 hover:border-slate-500'}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <input type="file" id="fileUpload" multiple className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx" />
                        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                            <FiUploadCloud className="text-5xl text-slate-400" />
                            <p className="mt-4 text-lg font-semibold"><span className="text-indigo-400">Klik untuk upload</span> atau tarik dan lepas file</p>
                            <p className="text-sm text-slate-500 mt-1">Mendukung format: PDF, DOC, DOCX</p>
                        </label>
                    </div>

                    {files.length > 0 && (
                        <div className="mt-8 animate-fade-in">
                            <h3 className="text-lg font-semibold mb-3">Daftar File Siap Proses ({files.length})</h3>
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-4 overflow-hidden"><FiFileText className="text-2xl text-slate-400 flex-shrink-0" />
                                            <div className="overflow-hidden"><p className="font-medium text-slate-200 truncate">{file.name}</p><p className="text-xs text-slate-500">{formatFileSize(file.size)}</p></div>
                                        </div>
                                        <button onClick={() => removeFile(index)} className="p-1 rounded-full hover:bg-slate-700 ml-4"><FiX className="text-xl text-slate-500 hover:text-red-500" /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-end">
                                <button onClick={handleProcessBatch} disabled={files.length === 0 || isProcessing} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transition-colors font-bold text-lg py-3 px-8 rounded-lg disabled:bg-slate-600 disabled:cursor-not-allowed">
                                    {isProcessing ? 'Memproses...' : `Analisis ${files.length} CV Sekarang`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileUploads;
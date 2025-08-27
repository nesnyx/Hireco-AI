import { useEffect, useState } from "react";
import { deleteApplicantByID, downloadPDF, getApplicantByHR } from "../../src/api";
import { DateTime } from "luxon";
import { FaFilePdf } from "react-icons/fa6";

export default function Applicant() {
    const [applicant, setApplicant] = useState([]);
    const [isOpenDetail, setIsOpenDetail] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [deleteApplicant, setDeleteApplicant] = useState(null);

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

    // Handle detail click
    const handleDetailClick = (app) => {
        setSelectedApplicant(app);
        setIsOpenDetail(true);
    };

    const handleDeleteClick = (app) => {
        setDeleteApplicant(app);
        setIsOpenDelete(true)
    };

    // Close modal
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
            const deleteApplicantReq = await deleteApplicantByID(deleteApplicant.id);
            if (deleteApplicantReq.status === false) {
                alert(`Gagal Menghapus Applicant"`);
                return;
            }
            alert(`Applicant "${deleteApplicant.name}" telah dihapus.`);
            window.location.reload(); // Ganti dengan fetch ulang jika punya API delete
        } catch (error) {
            console.error("Error deleting applicant:", error);
            alert("Gagal menghapus applicant.");
        } finally {
            setIsOpenDelete(false);
            setApplicant(null);
        }
    };
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Applicant List</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="px-6 py-3 font-medium text-gray-700">Name</th>
                            <th className="px-6 py-3 font-medium text-gray-700">Telp</th>
                            <th className="px-6 py-3 font-medium text-gray-700">Email</th>
                            <th className="px-6 py-3 font-medium text-gray-700">Score</th>
                            <th className="px-6 py-3 font-medium text-gray-700">Date</th>
                            <th className="px-6 py-3 font-medium text-gray-700">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicant.length > 0 ? (
                            applicant.map((reg, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="px-6 py-4">{reg.name}</td>
                                    <td className="px-6 py-4">{reg.telp}</td>
                                    <td className="px-6 py-4">{reg.email}</td>
                                    <td className="px-6 py-4">
                                        {reg.score < 50 ? (
                                            <p className="px-4 py-2 w-fit text-white font-bold bg-red-700 rounded-md">{reg.score}</p>
                                        ) : (
                                            <p className="px-4 py-2 w-fit text-white font-bold bg-green-700 rounded-md">{reg.score}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{DateTime.fromISO(reg.created_at).toFormat('MMM dd, HH:mm')}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDetailClick(reg)}
                                            className="bg-blue-600 px-4 py-2 rounded-md text-white cursor-pointer text-sm mx-4"
                                        >
                                            Detail
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteClick(reg)
                                            }
                                            className="bg-red-600 px-4 py-2 rounded-md text-white cursor-pointer text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    No Data Applicant
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail */}
            {isOpenDetail && selectedApplicant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b">
                            <div className="flex items-center space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <h3 className="font-semibold text-gray-800">Applicant Profile</h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="flex items-start space-x-4">
                                <img
                                    src={`https://avatar.iran.liara.run/public/${selectedApplicant.id}`}
                                    alt={selectedApplicant.name}
                                    className="w-16 h-16 rounded-full"
                                />
                                <div>
                                    <h4 className="text-lg font-semibold">{selectedApplicant.name}</h4>
                                    <p className="text-gray-600">{selectedApplicant.email}</p>
                                    <p className="text-gray-600">{selectedApplicant.telp}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Applied on {DateTime.fromISO(selectedApplicant.created_at).toFormat('MMM dd, yyyy')}
                                    </p>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-700">Score:</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedApplicant.score >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {selectedApplicant.score} / 100
                                </span>
                            </div>

                            {/* Call Intelligence (Deskripsi) */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-start space-x-3">

                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Explanation - Summary</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {selectedApplicant.explanation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Scoring Applicant (Participants) */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Score Applicant</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <p className="text-sm font-medium">Experience</p>
                                                <p className="text-xs text-gray-500">Experience</p>
                                            </div>
                                        </div>
                                        {JSON.parse(selectedApplicant.experience).score > 50 ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                {JSON.parse(selectedApplicant.experience).score}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                {JSON.parse(selectedApplicant.experience).score}
                                            </span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <p className="text-sm font-medium">Presentation Quality</p>
                                                <p className="text-xs text-gray-500">Presentation Quality</p>
                                            </div>
                                        </div>
                                        {JSON.parse(selectedApplicant.presentation_quality).score > 50 ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                {JSON.parse(selectedApplicant.presentation_quality).score}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                {JSON.parse(selectedApplicant.presentation_quality).score}
                                            </span>
                                        )}
                                        <div className="flex items-center space-x-2">
                                            <div>
                                                <p className="text-sm font-medium">Hard Skil</p>
                                                <p className="text-xs text-gray-500">Hard Skill</p>
                                            </div>
                                        </div>
                                        {JSON.parse(selectedApplicant.hard_skill).score > 50 ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                                {JSON.parse(selectedApplicant.hard_skill).score}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                {JSON.parse(selectedApplicant.hard_skill).score}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-green-700 mb-3 mt-4">Details Explanation Score</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-start space-x-3">

                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700">Experience</p>
                                                        <p className="text-sm text-gray-900 mt-1">
                                                            {JSON.parse(selectedApplicant.experience).feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3 mt-6">

                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700">Hard Skill</p>
                                                        <p className="text-sm text-gray-900 mt-1">
                                                            {JSON.parse(selectedApplicant.hard_skill).feedback}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start space-x-3 mt-6">

                                                    <div>
                                                        <p className="text-sm font-medium text-blue-700">Presentation Quality</p>
                                                        <p className="text-sm text-gray-900 mt-1">
                                                            {JSON.parse(selectedApplicant.presentation_quality).feedback || "None"}
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-3">
                                                            Note:
                                                        </p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {JSON.parse(selectedApplicant.presentation_quality).issues || "None"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Linked Records */}
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-3">File PDF CV</h5>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8  rounded-full flex items-center justify-center">
                                        <FaFilePdf />
                                    </div>
                                    <div>
                                        <div>
                                            <button onClick={() => {
                                                const filePath = selectedApplicant.filename
                                                const parts = filePath.split('/');
                                                const fileName = parts[parts.length - 1];
                                                downloadPDF(fileName)
                                                window.location.reload();
                                            }} className="text-sm font-medium cursor-pointer hover:underline translate-0.5">{selectedApplicant.filename}</button>
                                        </div>
                                        <p className="text-xs text-gray-500">Job CV</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {isOpenDelete && deleteApplicant && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete the applicant <strong>"{deleteApplicant.name}"</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={closeModalDelete}
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
        </div>
    );
}
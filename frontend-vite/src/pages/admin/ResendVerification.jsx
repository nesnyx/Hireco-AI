import { useState } from "react";


export default function ResendVerification() {
    const [email, setEmail] = useState('');
    const handleSubmit = () => {

    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                <>
                    <h1 className="text-2xl font-bold text-yellow-500 mb-3">
                        Verification 
                    </h1>
                   form
                    <button
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Kirim Ulang Email
                    </button>
                </>
            </div>
        </div>
    )
}
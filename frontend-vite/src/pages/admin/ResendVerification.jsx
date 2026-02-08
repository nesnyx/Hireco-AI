import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ResendVerification() {
    return (
        <>
            <h1 className="text-2xl font-bold text-yellow-500 mb-3">
                ⏰ Link Kadaluarsa
            </h1>
            <p className="text-gray-600 mb-6">
                Link verifikasi sudah tidak berlaku.
            </p>
            <Link
                to="/resend-verification"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
                Kirim Ulang Email
            </Link>
        </>
    )
}
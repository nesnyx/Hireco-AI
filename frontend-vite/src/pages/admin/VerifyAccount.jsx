import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("error");

  useEffect(() => {
    const s = searchParams.get("status");
    if (["success", "expired", "invalid"].includes(s)) {
      setStatus(s);
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              ✅ Verifikasi Berhasil
            </h1>
            <p className="text-gray-600 mb-6">
              Akun kamu sudah aktif. Silakan login.
            </p>
            <Link
              to="/admin/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Login
            </Link>
          </>
        )}

        {status === "expired" && (
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
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              ❌ Link Tidak Valid
            </h1>
            <p className="text-gray-600">
              Link verifikasi tidak ditemukan atau sudah digunakan.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              ⚠️ Terjadi Kesalahan
            </h1>
            <p className="text-gray-600">
              Silakan coba lagi nanti.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

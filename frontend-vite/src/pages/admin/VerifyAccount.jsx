import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authentication } from "../../integration/auth";

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'expired', 'invalid', 'error'
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }
      try {
        await authentication.verifyEmailToken(token);
        setStatus("success");
      } catch (error) {
        const errorMsg = error.response?.data?.data?.msg
        if (errorMsg === "expired") {
          setStatus("expired");
        } else if (errorMsg === "not_found") {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
      }
    };

    verifyToken();
  }, [token]);

  const handleResendVerification = async () => {
    try {
      await authentication.resendVerification(token);
      alert("Email verifikasi baru telah dikirim!");
      navigate("/admin/login");
    } catch (error) {
      alert("Gagal mengirim ulang email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">

        {/* STATE: LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Sedang memverifikasi akun kamu...</p>
          </div>
        )}

        {/* STATE: SUCCESS */}
        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-3">
              ✅ Verifikasi Berhasil
            </h1>
            <p className="text-gray-600 mb-6">
              Akun kamu sudah aktif. Silakan login untuk melanjutkan.
            </p>
            <Link
              to="/admin/login"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Login Sekarang
            </Link>
          </>
        )}

        {/* STATE: EXPIRED */}
        {status === "expired" && (
          <>
            <h1 className="text-2xl font-bold text-yellow-500 mb-3">
              ⏰ Link Kadaluarsa
            </h1>
            <p className="text-gray-600 mb-6">
              Maaf, link verifikasi ini sudah tidak berlaku karena batas waktu habis.
            </p>
            <button
              onClick={handleResendVerification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Kirim Link Baru
            </button>
          </>
        )}

        {/* STATE: INVALID */}
        {status === "invalid" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              ❌ Link Tidak Valid
            </h1>
            <p className="text-gray-600 mb-6">
              Link verifikasi tidak ditemukan atau sudah pernah digunakan sebelumnya.
            </p>
            <Link to="/admin/register" className="text-blue-600 hover:underline">
              Daftar akun baru
            </Link>
          </>
        )}

        {/* STATE: ERROR */}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-3">
              ⚠️ Terjadi Kesalahan
            </h1>
            <p className="text-gray-600">
              Sistem sedang mengalami gangguan. Silakan coba beberapa saat lagi.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
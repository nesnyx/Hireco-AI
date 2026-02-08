import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { authentication } from "../../integration/auth";

const CustomAlert = ({ type, title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const variants = {
    success: "border-emerald-500 bg-white text-emerald-800 shadow-emerald-200",
    error: "border-red-500 bg-white text-red-800 shadow-red-200",
    warning: "border-amber-500 bg-white text-amber-800 shadow-amber-200",
    info: "border-blue-500 bg-white text-blue-800 shadow-blue-200"
  };

  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-start p-4 border-l-4 rounded shadow-lg min-w-[300px] animate-in slide-in-from-right-5 ${variants[type]}`}>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100">✕</button>
    </div>
  );
};

export default function VerifyAccount() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
  const navigate = useNavigate();
  
  // useRef untuk mencegah double call di React Strict Mode
  const hasCalledProvider = useRef(false);

  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      // Cegah eksekusi 2x
      if (hasCalledProvider.current) return;
      
      if (!token) {
        setStatus("invalid");
        return;
      }

      hasCalledProvider.current = true;

      try {
        const res = await authentication.verifyEmailToken(token);
        
        // DEBUGGING: Cek apa isi res sebenarnya di console browser
        console.log("Response Backend:", res.data);

        const msg = res?.data?.data?.msg;

        if (msg === "usage") {
          setStatus("success");
        } else if (msg === "expired") {
          setStatus("expired");
        } else if (msg === "not_found") {
          setStatus("invalid");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification Error:", error);
        // Cek jika error dari axios/backend juga mengirimkan status tertentu
        const errorMsg = error.response?.data?.data?.msg;
        if (errorMsg === "not_found") setStatus("invalid");
        else setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  const handleResendVerification = async () => {
    try {
      await authentication.resendVerification(token);
      setAlert({ show: true, type: 'success', message: 'Email verifikasi baru telah dikirim!' });
      // Beri jeda sedikit agar user bisa baca alert sebelum pindah
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Gagal mengirim ulang email.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      {alert.show && (
        <CustomAlert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert({ ...alert, show: false })} 
        />
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center transition-all">
        
        {/* STATE: LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium tracking-tight">Memproses verifikasi...</p>
          </div>
        )}

        {/* STATE: SUCCESS */}
        {status === "success" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Verifikasi Berhasil</h1>
            <p className="text-gray-500 mb-6 text-sm">Akun kamu sudah aktif. Sekarang kamu bisa mengakses semua fitur.</p>
            <Link to="/admin/login" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
              Login Sekarang
            </Link>
          </div>
        )}

        {/* STATE: EXPIRED */}
        {status === "expired" && (
          <div className="animate-in fade-in zoom-in duration-500">
             <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⏰</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Link Kadaluarsa</h1>
            <p className="text-gray-500 mb-6 text-sm">Maaf, batas waktu verifikasi telah habis (expired).</p>
            <button onClick={handleResendVerification} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-200">
              Kirim Ulang Link
            </button>
          </div>
        )}

        {/* STATE: INVALID / NOT FOUND */}
        {(status === "invalid") && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✕</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Link Tidak Valid</h1>
            <p className="text-gray-500 mb-6 text-sm">Link verifikasi tidak ditemukan atau sudah pernah digunakan.</p>
            <Link to="/admin/login" className="inline-block text-blue-600 font-semibold hover:underline">
              Daftar akun baru saja
            </Link>
          </div>
        )}

        {/* STATE: ERROR */}
        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-3">Terjadi Kesalahan</h1>
            <p className="text-gray-500 text-sm">Sistem kami sedang sibuk. Silakan coba muat ulang halaman ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
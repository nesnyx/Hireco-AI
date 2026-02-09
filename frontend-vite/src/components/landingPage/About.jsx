
import { Target, Users, Zap, ShieldCheck, Rocket, ChevronRight } from 'lucide-react';
import Header from './Header';

const AboutPage = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen overflow-hidden">
       
      {/* --- HERO SECTION --- */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
         <Header/>
        {/* Decorative Blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Halo, Saya Aris Bara <br />
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Hireco lahir dari visi untuk mendobrak batasan tradisional dalam rekrutmen. Kami menggabungkan AI cerdas dengan antarmuka yang intuitif untuk efisiensi maksimal.
          </p>
        </div>
      </section>

      {/* --- VISION & MISSION (Grid) --- */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors group">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
            <p className="text-slate-400 leading-relaxed">
              Menyediakan platform rekrutmen yang tidak hanya memproses data, tetapi memahami potensi. Kami ingin setiap perusahaan mendapatkan kandidat yang tepat tanpa harus membuang ribuan jam kerja manual.
            </p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-3xl hover:border-purple-500/50 transition-colors group">
            <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Nilai Kami</h3>
            <p className="text-slate-400 leading-relaxed">
              Integritas, Transparansi, dan Inovasi. Kami percaya bahwa teknologi harus melayani manusia, bukan sebaliknya. Itulah mengapa algoritma kami dirancang untuk objektivitas penuh.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHY HIRECO? (Core Features) --- */}
      <section className="py-20 px-6 bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kenapa Memilih Hireco?</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap />, title: "Super Cepat", desc: "Proses seleksi ribuan CV dalam hitungan detik." },
              { icon: <ShieldCheck />, title: "Terpercaya", desc: "Data dienkripsi dengan standar keamanan industri." },
              { icon: <Rocket />, title: "Smart AI", desc: "Algoritma matching yang terus belajar." },
              { icon: <ChevronRight />, title: "Scalable", desc: "Siap digunakan dari startup hingga enterprise." },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 text-center group">
                <div className="inline-flex w-14 h-14 bg-slate-800 border border-slate-700 rounded-full items-center justify-center mb-6 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-[3rem] p-10 md:p-16 text-center relative shadow-2xl shadow-blue-500/20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Mengubah Cara Anda Merekrut?</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan perusahaan yang telah mengotomatisasi seleksi mereka dengan Hireco.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
              Coba Sekarang
            </button>
            <button className="bg-transparent border border-white/30 backdrop-blur-md px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
      
      {/* --- FOOTER SIMPLIFIED --- */}
      <footer className="py-10 text-center text-slate-500 border-t border-slate-900">
        <p>© 2026 Hireco Ecosystem. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;
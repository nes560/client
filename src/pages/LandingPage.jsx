import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- IMPORT LOGO BARU ---
// Pastikan file gambar sudah disimpan di folder src/assets/
import logoImage from '../assets/logo.png';

const LandingPage = () => {
  const navigate = useNavigate();
  
  // 1. REF UNTUK SCROLLING
  const testimonialRef = useRef(null);

  // Fungsi untuk scroll halus ke bagian testimoni
  const scrollToTestimonials = () => {
    testimonialRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Data Dummy Testimoni
  const testimonials = [
    {
      id: 1,
      name: "Rina Wati",
      role: "Ibu Rumah Tangga",
      review: "Awalnya ragu, tapi ternyata Pak Budi (Tukang Listrik) kerjanya sangat rapi dan sopan. Lampu ruang tamu yang konslet langsung beres dalam 30 menit!",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina"
    },
    {
      id: 2,
      name: "Dimas Anggara",
      role: "Pemilik Cafe",
      review: "Pesan jasa service AC lewat HandyMan cepet banget. Teknisi datang tepat waktu dan transparan soal harga. Sangat recommended buat yang butuh mendadak.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dimas"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      role: "Expat di Jakarta",
      review: "Very helpful app! Finding a reliable plumber was hard, but Kang Asep fixed my leaking pipe professionally. No hidden fees.",
      rating: 4,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    }
  ];

  // Data Keunggulan
  const features = [
    {
        icon: "⚡",
        title: "Respon Cepat",
        desc: "Butuh darurat? Mitra kami siap datang dalam waktu kurang dari 60 menit setelah pemesanan dikonfirmasi."
    },
    {
        icon: "🛡️",
        title: "Mitra Terverifikasi",
        desc: "Setiap tukang telah melalui proses seleksi ketat, cek latar belakang, dan uji kompetensi keahlian."
    },
    {
        icon: "🏷️",
        title: "Harga Transparan",
        desc: "Tidak ada biaya tersembunyi. Estimasi harga diberikan di awal sebelum pengerjaan dimulai."
    }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-800 relative bg-slate-900 overflow-x-hidden">
      
      {/* Background Image Fixed */}
      <div className="fixed inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1581578731117-104f8a74695b?q=80&w=1000&auto=format&fit=crop" 
            alt="Background" 
            className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/90 to-slate-900"></div>
      </div>

      {/* === NAVBAR === */}
      <nav className="relative z-20 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        
        {/* --- BAGIAN LOGO DIUBAH --- */}
        <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <img 
                src={logoImage} 
                alt="HandyMan Logo" 
                className="h-14 md:h-20 w-auto object-contain drop-shadow-lg" // Mengatur tinggi logo agar pas
            />
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/login')} 
                className="px-6 py-2.5 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-blue-900 transition backdrop-blur-sm"
            >
                Masuk
            </button>
        </div>
      </nav>

      {/* === HERO SECTION === */}
      <header className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center pb-20 mt-[-4rem]">
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-blue-300 text-sm font-medium mb-8 animate-fade-in-up shadow-xl">
            🏆 Platform Jasa Tukang #1 Terpercaya
        </div>

        <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-5xl drop-shadow-2xl">
            Cari Tukang Profesional? <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Semudah Klik Tombol</span>
        </h1>

        <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Tak perlu bingung saat AC mati atau pipa bocor. Kami menghubungkan Anda dengan teknisi ahli yang telah terverifikasi.
        </p>

        {/* Tombol Aksi Hero */}
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <button 
                onClick={() => navigate('/register')} 
                className="px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-blue-600/40 hover:bg-blue-500 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
                Daftar Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>

            <button 
                onClick={scrollToTestimonials} 
                className="px-8 py-4 bg-white/5 text-white border border-white/20 font-bold text-lg rounded-xl backdrop-blur-md hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
            >
                Lihat Bukti Nyata
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform"><path d="m6 9 6 6 6-6"/></svg>
            </button>
        </div>
      </header>


      {/* === KEUNGGULAN SECTION === */}
      <section className="relative z-10 py-20 px-6 bg-slate-800/50 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">Keunggulan Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Mengapa Memilih HandyMan?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-slate-700/50 p-8 rounded-3xl border border-white/5 hover:bg-slate-700 hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-16 h-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-slate-300 mb-4">Masih ragu dengan kualitas kami?</p>
                <button 
                    onClick={scrollToTestimonials} 
                    className="inline-flex items-center gap-2 text-blue-400 font-bold hover:text-blue-300 transition border-b border-blue-400/30 pb-1 hover:border-blue-300"
                >
                    Baca pengalaman pengguna lain di bawah ini
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
            </div>
        </div>
      </section>


      {/* === TESTIMONIAL SECTION === */}
      <section 
        ref={testimonialRef} 
        className="relative z-10 bg-white py-20 px-6 rounded-t-[3rem] shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.3)] mt-[-2rem]"
      >
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 pt-8">
                <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Testimoni Pengguna</span>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-800">Apa Kata Mereka?</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
                    Review jujur dari pengguna yang telah merasakan kemudahan mencari jasa tukang profesional.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                        <div className="flex gap-1 mb-4 text-amber-400">
                            {[...Array(item.rating)].map((_, i) => (
                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ))}
                        </div>
                        <p className="text-slate-600 italic mb-6 leading-relaxed">"{item.review}"</p>
                        <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                            <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full bg-white shadow-sm" />
                            <div>
                                <h4 className="font-bold text-slate-900">{item.name}</h4>
                                <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA Akhir */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Rumah Rusak? Jangan Panik!</h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">Selesaikan masalah rumah Anda hari ini juga dengan bantuan ahli.</p>
                    <button 
                        onClick={() => navigate('/register')} 
                        className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition shadow-lg"
                    >
                        Pesan Tukang Sekarang
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
            </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 text-center text-slate-500 text-sm border-t border-slate-100">
        &copy; 2024 HandyMan Indonesia. All rights reserved.
      </footer>

    </div>
  );
};

export default LandingPage;
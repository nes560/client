import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; // ✅ Pastikan Footer di-import

const LayananDetail = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  // === DATABASE LAYANAN ===
  const services = {
    listrik: {
      title: "Instalasi & Perbaikan Listrik",
      desc: "Jangan ambil risiko dengan arus pendek! Mitra ahli listrik kami bersertifikat dan siap menangani korsleting, pasang instalasi baru, hingga perbaikan panel.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
      price: "Mulai Rp 50.000 / titik",
      features: ["Teknisi Bersertifikat K3", "Garansi Perbaikan 30 Hari", "Peralatan Standar SNI", "Datang dalam 1 Jam"]
    },
    pipa: {
      title: "Ahli Pipa & Saluran Air",
      desc: "WC mampet? Keran bocor? Atau ingin pasang toren air baru? Serahkan pada ahlinya agar rumah Anda bebas banjir dan bau tak sedap.",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop",
      price: "Mulai Rp 75.000 / perbaikan",
      features: ["Alat Deteksi Kebocoran Canggih", "Bebas Bongkar (Jika Memungkinkan)", "Bersih & Rapi", "Layanan Darurat 24 Jam"]
    },
    cat: {
      title: "Jasa Pengecatan Profesional",
      desc: "Ubah suasana rumah Anda dengan sentuhan warna baru. Kami melayani cat interior, eksterior, hingga pengecatan dekoratif dengan hasil rapi dan tahan lama.",
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop",
      price: "Mulai Rp 35.000 / meter",
      features: ["Bebas Konsultasi Warna", "Termasuk Perbaikan Tembok Retak", "Jaminan Cat Tidak Belang", "Pengerjaan Tepat Waktu"]
    },
    ac: {
      title: "Service & Cuci AC",
      desc: "AC tidak dingin atau bocor? Jangan biarkan tagihan listrik membengkak. Cuci AC berkala bikin udara lebih sehat dan hemat energi.",
      image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?q=80&w=1170&auto=format&fit=crop",
      price: "Mulai Rp 65.000 / unit",
      features: ["Garansi Dingin", "Isi Freon Berkualitas", "Teknisi Jujur & Sopan", "Anti Bocor Air"]
    }
  };

  const data = services[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">Layanan Tidak Ditemukan</h2>
        <button onClick={() => navigate('/beranda')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition">Kembali ke Beranda</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Navbar Transparan (Floating Back Button) */}
      <div className="fixed top-0 w-full z-50 p-4 md:p-6 flex justify-between items-center pointer-events-none">
        <button onClick={() => navigate(-1)} className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-105 active:scale-95 text-slate-700 transition-all border border-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Hero Image Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
         <img src={data.image} alt={data.title} className="w-full h-full object-cover animate-in fade-in zoom-in duration-700" />
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-16 md:pb-24">
            <div className="max-w-4xl mx-auto">
                <span className="bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white mb-4 inline-block shadow-lg shadow-blue-900/20">
                    Layanan Premium
                </span>
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-sm max-w-2xl">
                    {data.title}
                </h1>
            </div>
         </div>
      </div>

      {/* Konten Detail (Floating Card) */}
      <div className="relative z-10 -mt-10 md:-mt-20 px-4 md:px-6 pb-32">
        <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-100 pb-8">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wide">Estimasi Biaya</p>
                    <p className="text-2xl md:text-3xl font-bold text-slate-800">{data.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                    <span className="text-amber-500 text-lg">★</span>
                    <span className="font-bold text-amber-700">4.8</span>
                    <span className="text-amber-600/60 text-sm font-medium border-l border-amber-200 pl-2 ml-1">1.2k Ulasan</span>
                </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-10">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    Tentang Layanan
                </h3>
                <p className="text-slate-600 leading-relaxed text-base md:text-lg">
                    {data.desc}
                </p>
            </div>

            {/* Keunggulan Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    Kenapa Memilih Kami?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.features.map((item, index) => (
                        <div key={index} className="group flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                            <div className="w-8 h-8 rounded-full bg-white text-green-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <span className="text-slate-700 font-medium text-sm group-hover:text-slate-900">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* Footer di Halaman Detail */}
      <div className="pb-32 md:pb-24">
         <Footer variant="light" />
      </div>

      {/* === STICKY BOTTOM ACTION BAR === */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between gap-6">
            <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Pembayaran</p>
                <p className="font-bold text-xl text-slate-800">Menyesuaikan</p>
            </div>
            
            <button 
                onClick={() => navigate('/pesanan')} 
                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all active:scale-[0.98] flex justify-center items-center gap-3 text-lg"
            >
                <span>Pesan Sekarang</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
         </div>
      </div>

    </div>
  );
};

export default LayananDetail;
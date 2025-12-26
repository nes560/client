import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
      // Image baru diganti di sini (menunjukkan teknisi sedang mencuci unit indoor)
      image: "https://plus.unsplash.com/premium_photo-1682126012378-859ca7a9f4cf?q=80&w=1170&auto=format&fit=crop",
      price: "Mulai Rp 65.000 / unit",
      features: ["Garansi Dingin", "Isi Freon Berkualitas", "Teknisi Jujur & Sopan", "Anti Bocor Air"]
    }
  };

  const data = services[slug];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl font-bold text-slate-800">Layanan Tidak Ditemukan</h2>
        <button onClick={() => navigate('/beranda')} className="mt-4 text-blue-600 font-bold hover:underline">Kembali ke Beranda</button>
      </div>
    );
  }

  // Fungsi saat tombol pesan diklik
  const handlePesan = () => {
    // Opsional: Kita bisa kirim data kategori otomatis ke halaman pesanan (jika mau canggih)
    // Untuk sekarang, kita arahkan saja langsung
    navigate('/pesanan');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32 md:pb-0">
      
      {/* Navbar Transparan (Tombol Back) */}
      <div className="fixed top-0 w-full z-50 p-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md hover:bg-white text-slate-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 w-full">
         <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
         <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full max-w-7xl mx-auto">
            <span className="bg-blue-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide mb-2 inline-block">Layanan Premium</span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{data.title}</h1>
         </div>
      </div>

      {/* Konten Detail */}
      <div className="max-w-4xl mx-auto px-6 py-8 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-slate-100">
            
            {/* Harga & Rating */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-6">
                <div>
                    <p className="text-sm text-slate-500 mb-1">Estimasi Harga</p>
                    <p className="text-2xl font-bold text-blue-600">{data.price}</p>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-lg">
                        <span>⭐ 4.8</span>
                        <span className="text-slate-400 text-sm font-normal">(1.2k Ulasan)</span>
                    </div>
                </div>
            </div>

            {/* Deskripsi */}
            <h3 className="text-lg font-bold text-slate-800 mb-3">Deskripsi Layanan</h3>
            <p className="text-slate-600 leading-relaxed mb-8">{data.desc}</p>

            {/* Keunggulan (Grid) */}
            <h3 className="text-lg font-bold text-slate-800 mb-4">Kenapa Memilih Kami?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.features.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                        <span className="text-slate-700 font-medium text-sm">{item}</span>
                    </div>
                ))}
            </div>

        </div>
      </div>

      {/* === TOMBOL PESAN (Sticky Bottom) === */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 md:p-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
         <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="hidden md:block">
                <p className="text-xs text-slate-500">Total Pembayaran</p>
                <p className="font-bold text-xl text-slate-800">Menyesuaikan</p>
            </div>
            
            {/* TOMBOL YANG MENGARAH KE /pesanan */}
            <button 
                onClick={handlePesan} 
                className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98] flex justify-center items-center gap-2"
            >
                Pesan Jasa Sekarang
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
         </div>
      </div>

    </div>
  );
};

export default LayananDetail;
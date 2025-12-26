import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Star, MapPin, Clock, Wrench, ChevronRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast'; 

// --- KOMPONEN SKELETON (LOADING MOBILE) ---
const BerandaSkeleton = () => (
    <div className="p-6 md:p-0 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
            <div className="space-y-2">
                <div className="h-3 w-24 bg-slate-200 rounded"></div>
                <div className="h-5 w-40 bg-slate-200 rounded"></div>
            </div>
        </div>
        {/* Card Saldo Skeleton */}
        <div className="h-48 w-full bg-slate-200 rounded-3xl"></div>
        {/* Card Job Skeleton */}
        <div className="h-40 w-full bg-slate-200 rounded-3xl"></div>
    </div>
);

const TukangBeranda = () => {
  const navigate = useNavigate();
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  const [user, setUser] = useState({ nama_depan: 'Mitra', nama_belakang: '' });
  const [activeJob, setActiveJob] = useState(null);
  const [stats, setStats] = useState({
      income: 0,
      totalOrders: 0,
      rating: 4.9 
  });
  const [loading, setLoading] = useState(true);

  // Format Rupiah Helper
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    // A. Cek Sesi Login
    try {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (session) {
            setUser(session);
        } else {
            navigate('/login');
        }
    } catch (e) {
        console.error("Gagal load sesi", e);
    }

    // B. Ambil Data Pesanan dari API
    const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/pesanan`);
            const result = await response.json();

            if (result.success) {
                const allOrders = result.data;

                // 1. LOGIKA PEKERJAAN AKTIF
                const currentJob = allOrders
                    .filter(o => o.status === 'Diproses')
                    .sort((a, b) => b.id - a.id)[0];
                
                setActiveJob(currentJob || null);

                // 2. LOGIKA STATISTIK
                const completedOrders = allOrders.filter(o => o.status === 'Selesai');
                const totalIncome = completedOrders.reduce((acc, curr) => acc + (curr.harga || 50000), 0);

                setStats(prev => ({
                    ...prev,
                    income: totalIncome,
                    totalOrders: allOrders.length
                }));
            }
        } catch (error) {
            console.error("Gagal ambil data:", error);
            toast.error("Gagal memuat data beranda");
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="pb-24 md:pb-0">
      
      {/* Jika Loading, Tampilkan Skeleton */}
      {loading ? (
          <BerandaSkeleton />
      ) : (
          <div className="animate-fade-in">
              {/* HEADER MOBILE */}
              <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:p-0 flex justify-between items-center sticky top-0 md:static z-30 border-b border-slate-100 md:border-none md:mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full p-0.5 border-2 border-blue-500 overflow-hidden">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                            alt="Profil" 
                            className="w-full h-full bg-slate-200 object-cover" 
                        />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Selamat Bekerja,</p>
                        <h2 className="text-lg font-bold text-slate-800 leading-tight capitalize">{user.nama_depan} {user.nama_belakang}</h2>
                    </div>
                </div>
              </div>

              <div className="p-6 md:p-0 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                
                {/* KARTU SALDO & STATISTIK */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-blue-100 text-xs font-medium mb-1">Pendapatan (Selesai)</p>
                                <h1 className="text-3xl font-bold tracking-tight">{formatRupiah(stats.income)}</h1>
                            </div>
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Wallet className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] text-blue-100 mb-1">Total Order</p>
                                <p className="font-bold text-lg">{stats.totalOrders}</p>
                            </div>
                            <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                                <p className="text-[10px] text-blue-100 mb-1">Rating</p>
                                <p className="font-bold text-lg flex items-center gap-1">
                                    {stats.rating} <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BAGIAN PEKERJAAN AKTIF */}
                <div>
                    <h3 className="font-bold text-slate-800 mb-3">Pekerjaan Aktif</h3>
                    
                    {activeJob ? (
                        // JIKA ADA JOB AKTIF
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative hover:shadow-md transition">
                            <span className="absolute top-5 right-5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase animate-pulse">
                                Sedang Jalan
                            </span>
                            
                            <div className="flex gap-4 mb-5">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 shrink-0">
                                    <Wrench size={24} />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <h4 className="font-bold text-slate-800 text-sm truncate">{activeJob.kategori_jasa}</h4>
                                    
                                    {/* ✅ IMPLEMENTASI INTEGRASI PETA DI SINI */}
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeJob.alamat)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 mt-1 flex items-center gap-1 hover:underline cursor-pointer bg-blue-50 w-fit px-2 py-1 rounded-lg"
                                        title="Buka lokasi di Google Maps"
                                    >
                                        <MapPin size={12} className="shrink-0" /> 
                                        <span className="truncate max-w-[150px]">{activeJob.alamat}</span>
                                        <span className="text-[10px] font-bold ml-1">↗</span>
                                    </a>

                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Clock size={12} className="shrink-0" /> 
                                        <span>{new Date(activeJob.created_at).toLocaleDateString()}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button 
                                    onClick={() => navigate('/tukang/orderan')}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                >
                                    Detail
                                </button>
                                <button 
                                    onClick={() => navigate('/tukang/orderan')}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition"
                                >
                                    Selesaikan
                                </button>
                            </div>
                        </div>
                    ) : (
                        // JIKA TIDAK ADA JOB AKTIF
                        <div className="flex flex-col items-center justify-center text-center py-8 bg-white border border-dashed border-slate-200 rounded-3xl">
                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <Briefcase size={20} className="text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400">Tidak ada pekerjaan aktif</p>
                            <p className="text-xs text-slate-400 mt-1">Cek tab Orderan Baru</p>
                            
                            <button 
                                onClick={() => navigate('/tukang/orderan')}
                                className="mt-4 px-5 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition"
                            >
                                Cari Orderan
                            </button>
                        </div>
                    )}
                </div>

              </div>

              {/* Section Bawah */}
              <div className="px-6 md:px-0 mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Ringkasan Cepat</h3>
                    <button onClick={() => navigate('/tukang/orderan')} className="text-xs text-blue-600 font-bold hover:underline flex items-center">
                        Lihat Semua <ChevronRight size={14}/>
                    </button>
                </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default TukangBeranda;
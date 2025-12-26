import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Wallet, Star, CheckCircle, MapPin, 
  Power, Bell, Clock, ThumbsUp 
} from 'lucide-react';

// ❌ HAPUS IMPORT SIDEBAR & BOTTOMNAV KARENA SUDAH ADA DI LAYOUT
// import Sidebar from '../../components/Sidebar'; <--- HAPUS
// import BottomNav from '../../components/BottomNav'; <--- HAPUS

import Footer from '../../components/Footer'; 
import { API_URL } from '../../utils/api'; 

const TukangBeranda = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('baru'); 
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState(null);
  
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  // ... (Logika useEffect Fetch Data TETAP SAMA, tidak perlu diubah) ...
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user_session'));
    if (!session) {
        navigate('/login');
        return;
    }
    setUser(session);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/pesanan`); 
            const result = await response.json();
            if (result.success) {
                const myOrders = result.data.filter(o => o.id_tukang === session.id);
                const formattedOrders = myOrders.map(o => ({
                    id: o.id,
                    customer: o.nama_pelanggan || "Pelanggan", 
                    address: o.alamat || "Lokasi tidak tersedia",
                    problem: o.keluhan || "Detail pekerjaan belum diisi",
                    price: `Rp ${parseInt(o.harga || 0).toLocaleString('id-ID')}`,
                    time: new Date(o.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
                    status: o.status, 
                    rating: o.rating ? parseInt(o.rating) : 0, 
                    ulasan: o.ulasan || "" 
                }));
                setOrders(formattedOrders);
            }
        } catch (error) {
            console.error("Gagal ambil pesanan:", error);
            toast.error("Gagal memuat data pesanan");
        } finally {
            setLoading(false);
        }
    };
    fetchOrders();
  }, [navigate]);

  // ... (Logika Stats & Handler TETAP SAMA) ...
  const stats = [
    { label: 'Pendapatan', value: 'Rp 150rb', icon: Wallet, color: 'bg-green-100 text-green-600' },
    { label: 'Rating', value: '4.8', icon: Star, color: 'bg-amber-100 text-amber-600' },
    { label: 'Selesai', value: `${orders.filter(o => o.status === 'selesai').length} Job`, icon: CheckCircle, color: 'bg-blue-100 text-blue-600' },
  ];
  const filteredOrders = orders.filter(o => o.status === activeTab);
  const handleStatusToggle = () => {
    setIsOnline(!isOnline);
    toast.success(isOnline ? "Mode Istirahat (Offline)" : "Anda Online! Siap terima order.");
  };

  if (!user || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Memuat Dashboard...</div>;

  return (
    // ❌ HAPUS STRUKTUR FLEX SIDEBAR LAMA
    // Cukup gunakan div container biasa karena Layout yang mengatur wrapper-nya
    <div className="animate-fade-in pb-24 md:pb-8"> 
      
        {/* HEADER */}
        <div className="bg-white p-6 md:p-8 border-b border-slate-100 sticky top-0 z-30 shadow-sm md:shadow-none">
           <div className="flex justify-between items-start">
              <div>
                 <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Area Kerja: Malang Kota</p>
                 <h1 className="text-2xl font-bold text-slate-800">
                    Semangat Pagi, <span className="text-blue-600">{user.nama_depan}! 🛠️</span>
                 </h1>
                 <p className="text-sm text-slate-500 mt-1">Spesialis: {user.keahlian || 'Umum'}</p>
              </div>

              <button 
                onClick={handleStatusToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm border ${
                  isOnline ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                <Power size={16} />
                {isOnline ? 'Siap Kerja' : 'Offline'}
              </button>
           </div>

           <div className="grid grid-cols-3 gap-4 mt-8">
              {stats.map((stat, idx) => (
                 <div key={idx} className="bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
                    <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
                       <stat.icon size={20} />
                    </div>
                    <div>
                       <p className="text-slate-400 text-[10px] font-bold uppercase">{stat.label}</p>
                       <p className="text-sm md:text-xl font-bold text-slate-800 whitespace-nowrap">{stat.value}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* KONTEN UTAMA */}
        <div className="p-6 md:p-8">
           
           {/* Tab Navigasi */}
           <div className="flex gap-2 mb-6 bg-slate-200 p-1 rounded-xl w-fit overflow-x-auto">
              <TabButton active={activeTab === 'baru'} onClick={()=>setActiveTab('baru')} label="Baru" count={orders.filter(o=>o.status==='baru').length} />
              <TabButton active={activeTab === 'aktif'} onClick={()=>setActiveTab('aktif')} label="Proses" count={orders.filter(o=>o.status==='aktif').length} />
              <TabButton active={activeTab === 'selesai'} onClick={()=>setActiveTab('selesai')} label="Riwayat" />
           </div>

           {/* List Pesanan */}
           <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                 filteredOrders.map((job) => (
                    // ... (Kode Mapping Card Order TETAP SAMA) ...
                    <div key={job.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex gap-3 items-center">
                             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold uppercase">
                                {job.customer.charAt(0)}
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-800">{job.customer}</h3>
                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                   <Clock size={12}/> {job.time}
                                </p>
                             </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${job.status === 'selesai' ? 'bg-slate-100 text-slate-500' : 'bg-green-50 text-green-700 border-green-100'}`}>
                              {job.status === 'selesai' ? 'Selesai' : job.price}
                          </span>
                       </div>

                       <div className="space-y-2 mb-5">
                          <div className="flex items-start gap-2 text-sm text-slate-600">
                             <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                             <span className="font-medium">{job.address}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                             <Bell size={16} className="text-amber-500 mt-0.5 shrink-0" />
                             <span>"{job.problem}"</span>
                          </div>
                       </div>

                       {/* Ulasan */}
                       {job.status === 'selesai' && job.rating > 0 ? (
                           <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-4">
                               <div className="flex items-center gap-2 mb-2">
                                   <div className="flex text-amber-500">
                                       {[...Array(5)].map((_, i) => (
                                           <Star key={i} size={16} fill={i < job.rating ? "currentColor" : "none"} className={i < job.rating ? "" : "text-amber-200"} />
                                       ))}
                                   </div>
                                   <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">{job.rating}/5</span>
                               </div>
                               <p className="text-sm text-slate-700 italic">"{job.ulasan || "Tidak ada ulasan."}"</p>
                           </div>
                       ) : job.status === 'selesai' ? (
                           <p className="text-xs text-slate-400 italic text-center mt-2">Belum ada ulasan.</p>
                       ) : null}

                       {/* Tombol Aksi */}
                       {job.status !== 'selesai' && (
                           <div className="grid grid-cols-2 gap-3 mt-4">
                              <button className="py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition">Abaikan</button>
                              <button className="py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                                 {job.status === 'baru' ? 'Terima Job' : 'Selesaikan'}
                              </button>
                           </div>
                       )}
                    </div>
                 ))
              ) : (
                 <div className="text-center py-20 opacity-50">
                    <div className="bg-slate-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} className="text-slate-400"/>
                    </div>
                    <p className="font-bold text-slate-600">Tidak ada pesanan di tab ini.</p>
                 </div>
              )}
           </div>
        </div>

        <div className="mt-8 px-6">
            <Footer variant="light" />
        </div>
        
        {/* ❌ TIDAK ADA BOTTOM NAV DI SINI LAGI */}
    </div>
  );
};

// Komponen TabButton tetap sama
const TabButton = ({ active, onClick, label, count }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
       active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
    }`}
  >
    {label}
    {count > 0 && <span className={`px-1.5 py-0.5 rounded text-[10px] ${active ? 'bg-blue-100' : 'bg-slate-300 text-white'}`}>{count}</span>}
  </button>
);

export default TukangBeranda;
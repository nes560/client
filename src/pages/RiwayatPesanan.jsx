import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Wrench, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import ReviewModal from '../components/ReviewModal'; // Import Modal tadi

const RiwayatPesanan = () => {
  const navigate = useNavigate();
  const API_URL = "https://backend-sigma-nine-12.vercel.app/api";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Review
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fungsi Fetch Data
  const fetchHistory = async () => {
    try {
        const userSession = JSON.parse(localStorage.getItem('user_session'));
        if (!userSession) return navigate('/login');

        const response = await fetch(`${API_URL}/pesanan`); // Di real app, filter by user_id di backend
        const result = await response.json();

        if (result.success) {
            // Filter pesanan milik user ini saja
            const myOrders = result.data.filter(
                // Sesuaikan logika filter ini dengan struktur database Anda
                // Misal filter berdasarkan nama atau ID user
                item => item.nama_user === `${userSession.nama_depan} ${userSession.nama_belakang}` || item.user_id === userSession.id
            );
            
            // Urutkan dari yang terbaru
            setOrders(myOrders.sort((a, b) => b.id - a.id));
        }
    } catch (error) {
        console.error(error);
        toast.error("Gagal memuat riwayat");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [navigate]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen md:flex font-sans text-slate-800 bg-slate-50">
      <Sidebar activeView="riwayat" />

      <main className="flex-1 pb-24 md:pb-0 p-6">
        <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>

        {loading ? (
            <div className="text-center py-10 text-slate-400">Memuat data...</div>
        ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-bold">Belum ada pesanan</p>
                <button onClick={() => navigate('/pesanan')} className="text-blue-600 text-sm mt-2 hover:underline">Buat Pesanan Baru</button>
            </div>
        ) : (
            <div className="space-y-4">
                {orders.map((item) => (
                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider 
                                    ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 
                                      item.status === 'Diproses' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                    {item.status}
                                </span>
                                <span className="text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                                <Wrench size={18} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">{item.kategori_jasa}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{item.deskripsi_masalah}</p>
                                
                                {/* TOMBOL BERI ULASAN (Hanya jika Selesai & Belum Review) */}
                                {item.status === 'Selesai' && !item.rating && (
                                    <button 
                                        onClick={() => {
                                            setSelectedOrderId(item.id);
                                            setShowModal(true);
                                        }}
                                        className="mt-3 w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-lg text-xs transition flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={14} /> Beri Ulasan & Rating
                                    </button>
                                )}

                                {/* JIKA SUDAH REVIEW */}
                                {item.rating > 0 && (
                                    <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                                        ⭐ Anda memberi {item.rating} Bintang
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </main>

      {/* Render Modal jika showModal true */}
      {showModal && (
        <ReviewModal 
            orderId={selectedOrderId}
            onClose={() => setShowModal(false)}
            onSuccess={fetchHistory} // Refresh list setelah review
        />
      )}

      <BottomNav />
    </div>
  );
};

export default RiwayatPesanan;
import React, { useState, useEffect } from 'react';
import { MapPin, Check, X, Calendar, User } from 'lucide-react'; // Pastikan install lucide-react

const TukangOrderan = () => {
  // 1. URL Railway (Hardcoded agar pasti jalan)
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH ORDERS
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pesanan`);
      const result = await response.json();
      
      if (result.success) {
        // --- LOGIKA FILTER PENTING ---
        // Kita harus mencocokkan status Database dengan Tab Frontend
        const filtered = result.data.filter(o => {
            const dbStatus = o.status; // Contoh: 'Menunggu Konfirmasi', 'Diproses', 'Selesai'
            
            if (activeTab === 'pending') {
                return dbStatus === 'Menunggu Konfirmasi';
            } else if (activeTab === 'proses') {
                return dbStatus === 'Diproses' || dbStatus === 'Sedang Diproses';
            } else if (activeTab === 'selesai') {
                return dbStatus === 'Selesai' || dbStatus === 'Dibatalkan';
            }
            return false;
        });
        
        // Urutkan dari yang terbaru (ID terbesar)
        setOrders(filtered.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      console.error("Gagal ambil order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // UPDATE STATUS
  // newStatus harus sesuai kata-kata di Database: 'Diproses', 'Selesai', 'Dibatalkan'
  const handleUpdateStatus = async (id, newStatus) => {
    const confirmMessage = newStatus === 'Diproses' ? "Terima pekerjaan ini?" : 
                           newStatus === 'Selesai' ? "Selesaikan pekerjaan ini?" : 
                           "Tolak pekerjaan ini?";
                           
    if(!window.confirm(confirmMessage)) return;

    try {
        const response = await fetch(`${API_URL}/pesanan/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await response.json();
        
        if(result.success) {
            alert('Status berhasil diperbarui!');
            fetchOrders(); // Refresh data otomatis
        }
    } catch(err) {
        alert('Gagal update status. Cek koneksi internet.');
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full flex flex-col bg-slate-50 min-h-screen">
       {/* HEADER */}
       <div className="px-6 pt-6 pb-4 bg-white md:bg-transparent md:px-0">
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Orderan</h1>
          <p className="text-sm text-slate-500">Kelola pekerjaan masuk di sini</p>
       </div>

       {/* TABS */}
       <div className="bg-white px-4 border-b border-slate-200 sticky top-0 z-20 flex justify-around md:justify-start md:gap-8 md:px-0 md:bg-transparent shadow-sm md:shadow-none">
          {['pending', 'proses', 'selesai'].map(status => (
              <button 
                key={status}
                onClick={() => setActiveTab(status)}
                className={`py-4 text-sm transition flex-1 md:flex-none text-center md:text-left relative ${activeTab === status ? 'text-orange-600 font-bold border-b-2 border-orange-600' : 'text-slate-500 font-medium'}`}
              >
                  {status === 'pending' ? 'Baru Masuk' : status === 'proses' ? 'Sedang Proses' : 'Riwayat'}
              </button>
          ))}
       </div>

       {/* LIST CONTENT */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4 md:p-0 md:mt-4">
          {loading ? (
              <div className="text-center py-10 text-slate-400">Memuat data...</div>
          ) : orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white mx-4">
                  <p>Tidak ada orderan di tab ini.</p>
                  {activeTab === 'pending' && <p className="text-xs mt-1">Orderan baru akan muncul di sini.</p>}
              </div>
          ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                  {orders.map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                          
                          {/* Foto Masalah (Jika Ada) */}
                          {order.foto_masalah && (
                             <div className="mb-3 rounded-lg overflow-hidden h-32 bg-slate-100 relative group">
                                <img 
                                    src={`${API_URL}/../uploads/${order.foto_masalah}`} 
                                    alt="Kerusakan" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {e.target.style.display='none'}} // Sembunyikan jika gambar rusak
                                />
                             </div>
                          )}
                          
                          <div className="flex justify-between mb-2 items-center">
                              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-blue-100">
                                {order.kategori_jasa}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                  <Calendar size={10} />
                                  <span>{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                              </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                <User size={12}/>
                             </div>
                             <h3 className="font-bold text-slate-800 text-sm">{order.nama_user}</h3>
                          </div>

                          <p className="text-xs text-slate-600 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                            "{order.deskripsi_masalah}"
                          </p>
                          
                          <p className="text-xs text-slate-500 mb-4 flex items-start gap-1">
                              <MapPin size={12} className="text-red-500 mt-0.5 shrink-0"/> 
                              <span>{order.alamat || "Alamat tidak tersedia"}</span>
                          </p>

                          {/* ACTION BUTTONS BERDASARKAN TAB */}
                          <div className="flex gap-2 pt-3 border-t border-slate-50">
                              {activeTab === 'pending' && (
                                  <>
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'Diproses')} 
                                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-orange-600 shadow-md shadow-orange-100"
                                    >
                                        Terima Job
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(order.id, 'Dibatalkan')} 
                                        className="w-20 bg-white text-red-500 border border-red-200 py-2 rounded-lg text-xs font-bold hover:bg-red-50"
                                    >
                                        Tolak
                                    </button>
                                  </>
                              )}
                              
                              {activeTab === 'proses' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(order.id, 'Selesai')} 
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700 shadow-md shadow-green-100 flex items-center justify-center gap-2"
                                  >
                                    <Check size={14}/> Tandai Selesai
                                  </button>
                              )}
                              
                              {activeTab === 'selesai' && (
                                  <div className={`w-full text-center text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1 ${order.status === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                      {order.status === 'Selesai' ? <><Check size={14}/> Selesai</> : <><X size={14}/> Dibatalkan</>}
                                  </div>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          )}
       </div>
    </div>
  );
};

export default TukangOrderan;
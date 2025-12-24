import React, { useState, useEffect } from 'react';
import { API_URL } from '../../utils/api';
import { MapPin, Calendar, Check, X, QrCode } from 'lucide-react';

const TukangOrderan = () => {
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
        // Filter di frontend berdasarkan tab
        const filtered = result.data.filter(o => (o.status || 'pending').toLowerCase() === activeTab);
        setOrders(filtered);
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
  const handleUpdateStatus = async (id, newStatus) => {
    if(!window.confirm(`Ubah status menjadi ${newStatus}?`)) return;

    try {
        const response = await fetch(`${API_URL}/pesanan/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        const result = await response.json();
        if(result.success) {
            alert('Sukses!');
            fetchOrders(); // Refresh data
        }
    } catch(err) {
        alert('Gagal update status');
    }
  };

  return (
    <div className="pb-24 md:pb-0 h-full flex flex-col">
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
                className={`py-4 text-sm transition flex-1 md:flex-none text-center md:text-left relative ${activeTab === status ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'text-slate-500 font-medium'}`}
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
              <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                  Tidak ada orderan di tab ini.
              </div>
          ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map(order => (
                      <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                          {/* Foto Masalah */}
                          {order.foto_masalah && (
                             <img src={`${API_URL}/../uploads/${order.foto_masalah}`} alt="Kerusakan" className="w-full h-32 object-cover rounded-lg mb-3 bg-slate-100"/>
                          )}
                          
                          <div className="flex justify-between mb-2">
                              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{order.kategori_jasa}</span>
                              <span className="text-[10px] text-slate-400">{new Date(order.created_at || Date.now()).toLocaleDateString()}</span>
                          </div>

                          <h3 className="font-bold text-slate-800 text-sm">{order.nama_user}</h3>
                          <p className="text-xs text-slate-500 mb-3 line-clamp-2">"{order.deskripsi_masalah}"</p>
                          <p className="text-xs text-slate-600 mb-3 flex items-center gap-1">
                              <MapPin size={12} className="text-red-400"/> {order.alamat}
                          </p>

                          {/* ACTION BUTTONS */}
                          <div className="flex gap-2 pt-2 border-t border-slate-50">
                              {activeTab === 'pending' && (
                                  <>
                                    <button onClick={() => handleUpdateStatus(order.id, 'proses')} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-700">Terima</button>
                                    <button onClick={() => handleUpdateStatus(order.id, 'ditolak')} className="flex-1 bg-red-50 text-red-500 border border-red-100 py-2 rounded-lg text-xs font-bold">Tolak</button>
                                  </>
                              )}
                              {activeTab === 'proses' && (
                                  <button onClick={() => handleUpdateStatus(order.id, 'selesai')} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700">Selesaikan Pekerjaan</button>
                              )}
                              {activeTab === 'selesai' && (
                                  <div className="w-full text-center text-green-600 text-xs font-bold py-2 bg-green-50 rounded-lg flex items-center justify-center gap-1">
                                      <Check size={14}/> Selesai
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
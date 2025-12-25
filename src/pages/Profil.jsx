import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, LogOut, User, MapPin } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';

const Profil = () => {
  const navigate = useNavigate();
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  // State User & Tampilan (Logic sama persis dengan Tukang)
  const [user, setUser] = useState({
      id: '', nama_depan: '', nama_belakang: '', email: '', alamat: ''
  });
  const [view, setView] = useState('menu'); // 'menu' | 'edit'
  const [loading, setLoading] = useState(false);

  // 1. Load Data
  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (sessionStr) {
       setUser(JSON.parse(sessionStr));
    } else {
       navigate('/login');
    }
  }, [navigate]);

  // 2. Fungsi Logout
  const handleLogout = () => {
    if(window.confirm("Yakin ingin keluar aplikasi?")) {
        localStorage.removeItem('user_session');
        navigate('/login');
    }
  };

  // 3. Fungsi Update Profil
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nama_depan: user.nama_depan,
                nama_belakang: user.nama_belakang,
                email: user.email,
                alamat: user.alamat
            })
        });
        const result = await response.json();
        if(result.success) {
            alert("✅ Profil berhasil disimpan!");
            localStorage.setItem('user_session', JSON.stringify(result.user));
            setUser(result.user);
            setView('menu'); // Kembali ke menu utama
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (err) {
        alert("Gagal koneksi server");
    } finally {
        setLoading(false);
    }
  };

  // --- TAMPILAN 1: EDIT PROFIL (Putih Bersih) ---
  if (view === 'edit') {
      return (
        <div className="max-w-7xl mx-auto min-h-screen font-sans text-slate-800 bg-slate-50 relative md:flex">
             <Sidebar activeView="profil" />
             <main className="flex-1 min-h-screen p-4 md:p-8">
                
                <div className="flex items-center gap-2 mb-6">
                    <button onClick={()=>setView('menu')} className="p-2 hover:bg-white rounded-full transition">
                        <ArrowLeft size={24} className="text-slate-700"/>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Edit Profil</h1>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 max-w-lg">
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Depan</label>
                                <input type="text" value={user.nama_depan} onChange={e=>setUser({...user, nama_depan: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500"/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Belakang</label>
                                <input type="text" value={user.nama_belakang} onChange={e=>setUser({...user, nama_belakang: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500"/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            <input type="email" value={user.email} onChange={e=>setUser({...user, email: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Lengkap</label>
                            <textarea rows="3" value={user.alamat || ''} onChange={e=>setUser({...user, alamat: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-blue-500"></textarea>
                        </div>
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition mt-4">
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </div>
             </main>
             <BottomNav setView={() => {}} />
        </div>
      );
  }

  // --- TAMPILAN UTAMA: MENU LIST (Gaya Tukang) ---
  return (
    <div className="max-w-7xl mx-auto min-h-screen font-sans text-slate-800 bg-slate-50 relative md:flex">
       <Sidebar activeView="profil" />

       <main className="flex-1 min-h-screen p-4 md:p-8 pb-24 md:pb-8">
           <div className="px-2 pt-4 pb-6">
              <h1 className="text-2xl font-bold text-slate-800">Akun Saya</h1>
           </div>

           {/* Kartu Profil Simple */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6 max-w-lg">
                <div className="p-6 flex items-center gap-4 border-b border-slate-50">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                        className="w-16 h-16 rounded-full bg-blue-50" 
                        alt="Profil"
                    />
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 capitalize">{user.nama_depan} {user.nama_belakang}</h2>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded mt-1 inline-block">Pelanggan Setia</span>
                    </div>
                </div>

                {/* List Menu (Persis Tukang) */}
                <div className="divide-y divide-slate-50">
                    <MenuItem label="Kelola Profil" onClick={() => setView('edit')} />
                    
                    {/* Pelanggan biasanya melihat Riwayat Pesanan, bukan Saldo */}
                    <MenuItem label="Riwayat Pesanan Saya" onClick={() => navigate('/riwayat-pesanan')} />
                    
                    <div className="bg-slate-50 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Pengaturan</div>
                    
                    <MenuItem label="Notifikasi" onClick={() => alert("Tidak ada notifikasi")} />
                    <MenuItem label="Pusat Bantuan" onClick={() => alert("Chat Admin untuk bantuan")} />
                    
                    {/* Logout di dalam List */}
                    <button onClick={handleLogout} className="w-full flex justify-between items-center px-6 py-4 hover:bg-red-50 transition text-red-500 text-sm font-bold text-left group">
                        <div className="flex items-center gap-3">
                            <LogOut size={18} /> Keluar Aplikasi
                        </div>
                    </button>
                </div>
           </div>
           
           <p className="text-center text-xs text-slate-400 mt-6 max-w-lg">Versi Aplikasi 1.0.5</p>
       </main>

       <BottomNav setView={() => navigate('/')} />
    </div>
  );
};

// Komponen Item Menu (Reusable)
const MenuItem = ({ label, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center px-6 py-4 hover:bg-slate-50 transition text-slate-700 text-sm font-medium text-left">
        {label}
        <ChevronRight size={16} className="text-slate-300"/>
    </button>
);

export default Profil;
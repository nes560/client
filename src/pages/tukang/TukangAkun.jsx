import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TukangAkun = () => {
  const navigate = useNavigate();
  // URL Backend
  const API_URL = "https://backend-sigma-nine-12.vercel.app/api";

  // State untuk Data User & Tampilan
  const [user, setUser] = useState({
      id: '', nama_depan: 'User', nama_belakang: '', email: '', alamat: '', tipe_pengguna: 'tukang'
  });
  const [view, setView] = useState('menu'); // 'menu' | 'edit' | 'bank'
  const [loading, setLoading] = useState(false);

  // 1. Load Data User dari LocalStorage
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
    if(window.confirm("Keluar dari aplikasi?")) {
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
            alert("Profil berhasil disimpan!");
            localStorage.setItem('user_session', JSON.stringify(result.user));
            setUser(result.user);
            setView('menu'); // Kembali ke menu awal
        } else {
            alert("Gagal: " + result.message);
        }
    } catch (err) {
        alert("Gagal koneksi server");
    } finally {
        setLoading(false);
    }
  };

  // --- SUB-VIEW: EDIT PROFIL ---
  if (view === 'edit') {
      return (
        <div className="pb-24 md:pb-0">
            <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:px-0 flex items-center gap-2">
                <button onClick={()=>setView('menu')} className="p-1 hover:bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-bold text-slate-800">Edit Profil</h1>
            </div>
            <div className="p-4 md:p-0">
                <form onSubmit={handleUpdate} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                        <input type="text" value={user.nama_depan} onChange={e=>setUser({...user, nama_depan: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                        <input type="text" value={user.nama_belakang} onChange={e=>setUser({...user, nama_belakang: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                        <textarea value={user.alamat || ''} onChange={e=>setUser({...user, alamat: e.target.value})} className="w-full p-2 border border-slate-300 rounded-lg"/>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  // --- SUB-VIEW: BANK / SALDO ---
  if (view === 'bank') {
      return (
        <div className="pb-24 md:pb-0">
            <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:px-0 flex items-center gap-2">
                <button onClick={()=>setView('menu')} className="p-1 hover:bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-bold text-slate-800">Keuangan</h1>
            </div>
            <div className="p-4 md:p-0">
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
                    <p className="text-slate-500">Saldo Dompet Anda</p>
                    <h2 className="text-3xl font-bold text-slate-800 my-2">Rp 1.500.000</h2>
                    <p className="text-xs text-green-600 bg-green-50 inline-block px-2 py-1 rounded">Siap Ditarik</p>
                    <div className="mt-6 border-t pt-4 text-left">
                        <p className="font-bold text-sm mb-2">Riwayat Terakhir</p>
                        <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                            <span>Servis AC</span>
                            <span className="text-green-600 font-bold">+ Rp 150.000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW UTAMA (SESUAI REQUEST AWAL) ---
  return (
    <div className="pb-24 md:pb-0">
       <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:px-0">
          <h1 className="text-2xl font-bold text-slate-800">Akun Saya</h1>
       </div>

       <div className="p-4 md:p-0">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Header Profil */}
                <div className="p-4 flex items-center gap-4 border-b border-slate-50">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                        className="w-16 h-16 rounded-full bg-slate-100" 
                        alt="Profil"
                    />
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 capitalize">{user.nama_depan} {user.nama_belakang}</h2>
                        <p className="text-sm text-blue-600 font-medium">Mitra Terverifikasi</p>
                    </div>
                </div>

                {/* Menu List */}
                <div className="divide-y divide-slate-50">
                    <MenuItem label="Kelola Profil" onClick={() => setView('edit')} />
                    <MenuItem label="Rekening Bank" onClick={() => setView('bank')} />
                    <MenuItem label="Riwayat Saldo" onClick={() => setView('bank')} />
                    
                    <div className="bg-slate-50 px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Pengaturan</div>
                    
                    <MenuItem label="Notifikasi" onClick={() => alert("Tidak ada notifikasi baru")} />
                    <MenuItem label="Bantuan" onClick={() => alert("Hubungi Admin via Chat")} />
                    
                    {/* Tambahan Tombol Logout di dalam list agar rapi */}
                    <button onClick={handleLogout} className="w-full flex justify-between items-center p-4 hover:bg-red-50 transition text-red-500 text-sm font-medium text-left">
                        Keluar Aplikasi
                        <LogOut size={16} />
                    </button>
                </div>
           </div>
           
           <p className="text-center text-xs text-slate-400 mt-6">Versi Aplikasi 1.0.5</p>
       </div>
    </div>
  );
};

// Komponen Item Menu Sederhana (Sesuai Desain Awal)
const MenuItem = ({ label, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition text-slate-700 text-sm font-medium text-left">
        {label}
        <ChevronRight size={16} className="text-slate-300"/>
    </button>
);

export default TukangAkun;
import React, { useState, useEffect } from 'react';
import { ChevronRight, User, CreditCard, History, Bell, HelpCircle, LogOut, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TukangAkun = () => {
  const navigate = useNavigate();
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  const [view, setView] = useState('menu'); 
  const [user, setUser] = useState({
      id: '', nama_depan: 'User', nama_belakang: '', email: '', alamat: '', tipe_pengguna: 'tukang'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (sessionStr) {
       setUser(JSON.parse(sessionStr));
    } else {
       // Jangan redirect dulu biar bisa lihat tampilan menu debug
       console.log("Session tidak ditemukan");
    }
  }, []);

  const handleLogout = () => {
      if(window.confirm("Yakin ingin keluar?")) {
          localStorage.removeItem('user_session');
          navigate('/login');
      }
  };

  const handleUpdateProfile = async (e) => {
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
              alert("✅ Profil berhasil diperbarui!");
              localStorage.setItem('user_session', JSON.stringify(result.user));
              setUser(result.user);
              setView('menu');
          } else {
              alert("❌ Gagal: " + result.message);
          }
      } catch (error) {
          alert("Gagal koneksi server.");
      } finally {
          setLoading(false);
      }
  };

  // --- HALAMAN EDIT PROFIL ---
  if (view === 'profil') {
      return (
          <div className="pb-24 bg-white min-h-screen">
              <div className="px-6 pt-8 pb-4 flex items-center gap-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                  <button onClick={() => setView('menu')} className="p-2 bg-slate-100 rounded-full"><ArrowLeft size={20}/></button>
                  <h1 className="text-xl font-bold">Edit Profil</h1>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Nama Depan</label>
                      <input type="text" value={user.nama_depan} onChange={(e) => setUser({...user, nama_depan: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Nama Belakang</label>
                      <input type="text" value={user.nama_belakang} onChange={(e) => setUser({...user, nama_belakang: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Alamat</label>
                      <textarea value={user.alamat || ''} onChange={(e) => setUser({...user, alamat: e.target.value})} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"/>
                  </div>
                  <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold mt-4">Simpan Profil</button>
              </form>
          </div>
      );
  }

  // --- HALAMAN UTAMA ---
  return (
    <div className="pb-24 md:pb-0 h-full overflow-y-auto bg-slate-50 min-h-screen">
       <div className="px-6 pt-8 pb-6 bg-white rounded-b-3xl shadow-sm mb-6">
          {/* TANDA INI UNTUK CEK APAKAH KODINGAN BERUBAH ATAU TIDAK */}
          <h1 className="text-xl font-bold text-green-600 mb-6">AKUN SAYA (VERSI BARU) ✅</h1>
          
          <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center font-bold text-2xl text-orange-600">
                   {user.nama_depan?.charAt(0)}
               </div>
               <div>
                   <h2 className="font-bold text-xl text-slate-800">{user.nama_depan} {user.nama_belakang}</h2>
                   <p className="text-sm text-slate-500">{user.email}</p>
                   <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-bold mt-1 inline-block">Mitra Tukang</span>
               </div>
          </div>
       </div>

       <div className="px-6 space-y-4">
           {/* Tombol Navigasi dengan onClick yang JELAS */}
           <button onClick={() => setView('profil')} className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-orange-50 transition border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-500"><User size={20}/></div>
                    <span className="font-bold text-slate-700">Edit Profil</span>
                </div>
                <ChevronRight size={20} className="text-slate-300"/>
           </button>

           <button onClick={() => alert("Fitur Saldo Berfungsi!")} className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-orange-50 transition border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-full text-orange-500"><CreditCard size={20}/></div>
                    <span className="font-bold text-slate-700">Cek Saldo</span>
                </div>
                <ChevronRight size={20} className="text-slate-300"/>
           </button>

           <button onClick={handleLogout} className="w-full bg-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:bg-red-50 transition border border-slate-100 group">
                <div className="flex items-center gap-3">
                    <div className="bg-red-50 group-hover:bg-red-100 p-2 rounded-full text-red-500"><LogOut size={20}/></div>
                    <span className="font-bold text-red-500">Log Out</span>
                </div>
           </button>
           
           <p className="text-center text-xs text-slate-400 mt-4">Debug Version 2.0</p>
       </div>
    </div>
  );
};

export default TukangAkun;
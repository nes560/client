import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { API_URL } from '../utils/api'; // Pastikan sudah punya utils/api.js

const Profil = () => {
  const navigate = useNavigate();
  
  // State Data User
  const [user, setUser] = useState({
    id: '',
    nama_depan: '',
    nama_belakang: '',
    email: '',
    alamat: ''
  });

  // State Mode Edit & Loading
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // === 1. LOAD DATA SAAT HALAMAN DIBUKA ===
  useEffect(() => {
    // Ambil data sesi dari Login
    const sessionRaw = localStorage.getItem('user_session');
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      // Isi state dengan data dari localStorage dulu (agar cepat)
      setUser(session);
    } else {
      navigate('/login'); // Jika belum login, tendang ke login
    }
  }, [navigate]);

  // === 2. FUNGSI MENANGANI PERUBAHAN INPUT ===
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // === 3. FUNGSI SIMPAN PERUBAHAN KE DATABASE ===
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Kirim data baru ke Backend (PUT)
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const result = await response.json();

      if (result.success) {
        // Update LocalStorage dengan data terbaru (Penting!)
        localStorage.setItem('user_session', JSON.stringify(result.user));
        setUser(result.user); // Update state tampilan
        
        setIsEditing(false); // Keluar mode edit
        showToast("✅ Profil berhasil disimpan!");
      } else {
        alert("Gagal update: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  };

  // === 4. FUNGSI LOGOUT ===
  const handleLogout = () => {
    if (window.confirm('Yakin ingin keluar?')) {
      localStorage.removeItem('user_session');
      navigate('/login');
    }
  };

  // Helper Toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative md:flex font-sans text-slate-800 bg-slate-50">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-white px-5 py-3 rounded-xl shadow-lg border-l-4 border-green-500 animate-fade-in">
          <span className="font-bold text-slate-700">{toastMessage}</span>
        </div>
      )}

      <Sidebar activeView="profil" />

      <main className="flex-1 min-h-screen relative overflow-x-hidden md:bg-slate-50 pb-24 md:pb-0">
        <div className="w-full md:max-w-none max-w-md mx-auto bg-slate-50 min-h-screen md:min-h-0 relative flex flex-col md:p-8">
            
            {/* Header Profil */}
            <div className="px-6 pt-8 pb-6 bg-white md:bg-transparent md:p-0 flex flex-col items-center md:flex-row md:justify-between sticky top-0 z-30 border-b border-slate-100 md:border-none md:mb-6">
                <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                    <div className="w-20 h-20 md:w-16 md:h-16 rounded-full p-1 border-2 border-blue-500 overflow-hidden relative group">
                        <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} 
                            alt="Profil" 
                            className="w-full h-full bg-slate-200 object-cover rounded-full"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Akun Pengguna</p>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">{user.nama_depan} {user.nama_belakang}</h2>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>
                
                {/* Tombol Edit / Simpan (Desktop & Mobile) */}
                <div className="mt-4 md:mt-0 w-full md:w-auto flex justify-end">
                    {isEditing ? (
                        <div className="flex gap-2 w-full md:w-auto">
                             <button 
                                onClick={() => setIsEditing(false)} 
                                className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 text-sm"
                                disabled={isLoading}
                             >
                                Batal
                             </button>
                             <button 
                                onClick={handleSave} 
                                className="flex-1 md:flex-none px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 text-sm flex items-center justify-center gap-2"
                                disabled={isLoading}
                             >
                                {isLoading ? 'Menyimpan...' : 'Simpan'}
                             </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="w-full md:w-auto px-6 py-2 rounded-lg bg-white border border-blue-200 text-blue-600 font-bold hover:bg-blue-50 text-sm flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Edit Profil
                        </button>
                    )}
                </div>
            </div>

            {/* Form Area */}
            <div className="px-6 md:px-0">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Informasi Pribadi</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Nama Depan */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Depan</label>
                            {isEditing ? (
                                <input 
                                    type="text" name="nama_depan" value={user.nama_depan} onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium text-lg border-b border-transparent py-2">{user.nama_depan}</p>
                            )}
                        </div>

                        {/* Nama Belakang */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nama Belakang</label>
                            {isEditing ? (
                                <input 
                                    type="text" name="nama_belakang" value={user.nama_belakang} onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium text-lg border-b border-transparent py-2">{user.nama_belakang}</p>
                            )}
                        </div>

                        {/* Email (Read Only biasanya, tapi boleh diedit jika mau) */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                            {isEditing ? (
                                <input 
                                    type="email" name="email" value={user.email} onChange={handleChange}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                                />
                            ) : (
                                <p className="text-slate-800 font-medium text-lg border-b border-transparent py-2">{user.email}</p>
                            )}
                        </div>

                         {/* Alamat */}
                         <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Alamat Lengkap</label>
                            {isEditing ? (
                                <textarea 
                                    name="alamat" value={user.alamat || ''} onChange={handleChange} rows="3"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50"
                                    placeholder="Masukkan alamat lengkap..."
                                ></textarea>
                            ) : (
                                <p className="text-slate-800 font-medium text-lg border-b border-transparent py-2">
                                    {user.alamat || <span className="text-slate-400 italic">Belum ada alamat</span>}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tombol Logout */}
                <div className="mt-6 mb-10">
                     <button onClick={handleLogout} className="w-full md:w-auto px-6 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                        Keluar dari Aplikasi
                     </button>
                </div>
            </div>
        </div>
      </main>

      <BottomNav setView={() => navigate('/')} />
      
    </div>
  );
};

export default Profil;
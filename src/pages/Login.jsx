import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postData } from '../utils/api'; 
import toast from 'react-hot-toast'; // ✅ 1. Import Toast

// ✅ IMPORT GAMBAR LOCAL
import bgImage from '../assets/bground.jpg'; 

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // ✅ Tampilkan Loading Toast
    const loadingToast = toast.loading('Sedang memproses...');

    try {
      // ⚠️ PERBAIKAN DISINI: Hapus '/api' di depan, cukup '/login'
      const result = await postData('/login', formData);

      // Hapus loading toast saat selesai
      toast.dismiss(loadingToast);

      if (result && result.success) {
        // ✅ SUKSES: Tampilkan Toast Hijau
        toast.success("Login Berhasil! Selamat Datang.");
        
        localStorage.setItem('user_session', JSON.stringify(result.user));
        
        // Beri sedikit delay sebelum pindah halaman agar toast terbaca
        setTimeout(() => {
            if (result.user.tipe_pengguna === 'admin') {
                navigate('/admin');
            } else if (result.user.tipe_pengguna === 'tukang') {
                navigate('/tukang');
            } else {
                navigate('/beranda');
            }
        }, 1000);

      } else {
        // ❌ GAGAL: Tampilkan Toast Merah
        toast.error(result?.message || 'Login Gagal. Cek email & password.');
      }

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Error Login:", error);
      // ❌ ERROR JARINGAN
      toast.error('Gagal terhubung ke server (Cek koneksi internet).');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center font-sans relative"
      style={{ 
        backgroundImage: `url(${bgImage})`,
      }}
    >
      
      {/* Overlay Hitam */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Tombol Kembali */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 z-20 p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-blue-600 transition shadow-lg"
        title="Kembali ke Halaman Depan"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      {/* Kartu Login */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Selamat Datang</h1>
          <p className="text-slate-500">Silakan login untuk melanjutkan</p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Input Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <input 
                type="email" 
                name="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-slate-800"
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                name="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-slate-800"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98] disabled:bg-slate-400 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm font-medium">
          Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
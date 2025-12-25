import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  
  // State untuk peran (default: user/pelanggan)
  const [role, setRole] = useState('user'); 

  // State untuk form
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1. Validasi Password
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak sama!");
      return;
    }

    // 2. Persiapkan Data
    const namaParts = formData.nama.trim().split(' ');
    const namaDepan = namaParts[0];
    const namaBelakang = namaParts.slice(1).join(' ') || '';

    // Data yang dikirim (TANPA KEAHLIAN)
    const dataToSend = {
      nama_depan: namaDepan,
      nama_belakang: namaBelakang,
      email: formData.email,
      password: formData.password,
      alamat: '-', 
      tipe_pengguna: role === 'mitra' ? 'tukang' : 'user'
    };

    try {
      // 3. Kirim ke Backend
      const response = await fetch('https://backend-production-b8f3.up.railway.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Registrasi Berhasil! Silakan Login.");
        navigate('/login');
      } else {
        alert("❌ Gagal Mendaftar: " + result.message);
      }

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Terjadi kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center font-sans py-10"
         style={{ backgroundImage: "url('https://img.freepik.com/free-photo/tropical-green-leaves-background_53876-88891.jpg?w=1800')" }}>
      
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md mx-4 border border-white/20">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Buat Akun Baru</h1>
          <p className="text-slate-500">Pilih jenis akun Anda di bawah ini</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* === PILIHAN PERAN === */}
          <div className="grid grid-cols-2 gap-4 mb-6">
             {/* Pelanggan */}
             <div 
               onClick={() => setRole('user')}
               className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${role === 'user' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' : 'border-slate-100 hover:border-slate-300 text-slate-400 bg-white'}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'user' ? 'bg-blue-200' : 'bg-slate-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span className="font-bold text-sm">Pelanggan</span>
             </div>

             {/* Mitra Tukang */}
             <div 
               onClick={() => setRole('mitra')}
               className={`cursor-pointer p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all duration-200 ${role === 'mitra' ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md transform scale-[1.02]' : 'border-slate-100 hover:border-slate-300 text-slate-400 bg-white'}`}
             >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role === 'mitra' ? 'bg-blue-200' : 'bg-slate-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                </div>
                <span className="font-bold text-sm">Mitra Tukang</span>
             </div>
          </div>

          {/* Input Nama */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
                {role === 'user' ? 'Nama Lengkap' : 'Nama Lengkap / Usaha'}
            </label>
            <div className="relative">
              <input 
                type="text" name="nama"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-slate-800"
                placeholder={role === 'user' ? "Contoh: Budi Santoso" : "Contoh: Jasa Listrik Pak Budi"}
                value={formData.nama} onChange={handleChange} required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            </div>
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
            <div className="relative">
              <input 
                type="email" name="email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-slate-800"
                placeholder="nama@email.com"
                value={formData.email} onChange={handleChange} required
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
                type="password" name="password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white text-slate-800"
                placeholder="Minimal 6 karakter"
                value={formData.password} onChange={handleChange} required minLength={6}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Ulangi Password</label>
            <div className="relative">
              <input 
                type="password" name="confirmPassword"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition bg-white text-slate-800 ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'}`}
                placeholder="Ketik ulang password"
                value={formData.confirmPassword} onChange={handleChange} required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
              </div>
            </div>
             {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium ml-1">Password tidak cocok!</p>
             )}
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-[0.98]">
                Daftar Sebagai {role === 'user' ? 'Pelanggan' : 'Mitra'}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-slate-600 text-sm font-medium">
          Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login disini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
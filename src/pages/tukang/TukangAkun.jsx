import React, { useState, useEffect } from 'react';
import { ChevronRight, User, CreditCard, History, Bell, HelpCircle, LogOut, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TukangAkun = () => {
  const navigate = useNavigate();
  
  // URL Backend Railway (Pastikan ini benar)
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  // State untuk Mengatur Tampilan (menu | profil | bank)
  const [view, setView] = useState('menu'); 
  
  // State Data User
  const [user, setUser] = useState({
      id: '', nama_depan: '', nama_belakang: '', email: '', alamat: '', tipe_pengguna: 'tukang'
  });
  const [loading, setLoading] = useState(false);

  // 1. Ambil Data User dari LocalStorage saat halaman dibuka
  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (sessionStr) {
       setUser(JSON.parse(sessionStr));
    } else {
       navigate('/login');
    }
  }, [navigate]);

  // 2. Fungsi LOGOUT
  const handleLogout = () => {
      if(window.confirm("Yakin ingin keluar akun?")) {
          localStorage.removeItem('user_session'); // Hapus sesi
          navigate('/login'); // Lempar ke login
      }
  };

  // 3. Fungsi UPDATE PROFIL ke Backend
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
              // Simpan data baru ke LocalStorage agar tidak hilang saat refresh
              localStorage.setItem('user_session', JSON.stringify(result.user));
              setUser(result.user);
              setView('menu'); // Kembali ke menu utama
          } else {
              alert("❌ Gagal update: " + result.message);
          }
      } catch (error) {
          console.error(error);
          alert("Terjadi kesalahan koneksi ke server.");
      } finally {
          setLoading(false);
      }
  };

  // --- TAMPILAN 1: SUB-HALAMAN EDIT PROFIL ---
  if (view === 'profil') {
      return (
          <div className="pb-24 bg-white min-h-screen">
              <div className="px-6 pt-8 pb-4 flex items-center gap-3 border-b border-slate-100 bg-white sticky top-0 z-10">
                  <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="text-slate-700"/></button>
                  <h1 className="text-xl font-bold text-slate-800">Edit Profil</h1>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Nama Depan</label>
                      <input type="text" value={user.nama_depan} onChange={(e) => setUser({...user, nama_depan: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Nama Belakang</label>
                      <input type="text" value={user.nama_belakang} onChange={(e) => setUser({...user, nama_belakang: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Email (Login)</label>
                      <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="w-full p-3 bg-slate-100 text-slate-500 rounded-lg border border-slate-200 mt-1 cursor-not-allowed" readOnly/>
                      <p className="text-[10px] text-red-400 mt-1">*Email tidak dapat diubah sembarangan.</p>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Alamat Domisili</label>
                      <textarea rows="3" value={user.alamat || ''} onChange={(e) => setUser({...user, alamat: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1 focus:ring-2 focus:ring-orange-500 outline-none"></textarea>
                  </div>
                  
                  <div className="pt-4">
                      <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-200 flex justify-center items-center gap-2 transition">
                          {loading ? 'Menyimpan...' : <><Save size={18}/> Simpan Perubahan</>}
                      </button>
                  </div>
              </form>
          </div>
      );
  }

  // --- TAMPILAN 2: SUB-HALAMAN REKENING & SALDO (MOCKUP) ---
  if (view === 'bank') {
      return (
          <div className="pb-24 bg-white min-h-screen">
              <div className="px-6 pt-8 pb-4 flex items-center gap-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <button onClick={() => setView('menu')} className="p-2 hover:bg-slate-100 rounded-full"><ArrowLeft className="text-slate-700"/></button>
                  <h1 className="text-xl font-bold text-slate-800">Dompet Mitra</h1>
              </div>
              <div className="p-6 animate-in slide-in-from-right duration-300">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-200 mb-6">
                      <p className="text-orange-100 text-sm font-medium">Saldo Penghasilan</p>
                      <h2 className="text-3xl font-bold mt-1 tracking-tight">Rp 1.500.000</h2>
                      <div className="mt-6 flex gap-3">
                          <button onClick={()=>alert("Fitur Tarik Dana sedang maintenance")} className="flex-1 bg-white/20 hover:bg-white/30 py-2.5 rounded-lg text-sm font-bold backdrop-blur-sm transition border border-white/30">Tarik Dana</button>
                          <button className="flex-1 bg-white/20 hover:bg-white/30 py-2.5 rounded-lg text-sm font-bold backdrop-blur-sm transition border border-white/30">Riwayat</button>
                      </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Riwayat Transaksi Terakhir</h3>
                  <div className="space-y-3">
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div>
                              <p className="font-bold text-slate-700 text-sm">Servis AC (Bu Rina)</p>
                              <p className="text-xs text-slate-400">25 Des 2025 • 14:30</p>
                          </div>
                          <span className="text-green-600 font-bold text-sm">+ Rp 150.000</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div>
                              <p className="font-bold text-slate-700 text-sm">Penarikan ke BCA</p>
                              <p className="text-xs text-slate-400">20 Des 2025 • 09:00</p>
                          </div>
                          <span className="text-red-500 font-bold text-sm">- Rp 500.000</span>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- TAMPILAN UTAMA (MENU AKUN) ---
  return (
    <div className="pb-24 md:pb-0 h-full overflow-y-auto bg-slate-50 min-h-screen">
       <div className="px-6 pt-8 pb-6 bg-white rounded-b-[2rem] shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Akun Saya</h1>
          
          {/* Card Profil */}
          <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center overflow-hidden">
                   <img 
                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                       alt="Avatar" 
                       className="w-full h-full object-cover"
                   />
               </div>
               <div>
                   <h2 className="font-bold text-xl text-slate-800 capitalize">{user.nama_depan} {user.nama_belakang}</h2>
                   <div className="flex items-center gap-1.5 mt-1 bg-blue-50 w-max px-2 py-0.5 rounded-full border border-blue-100">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <p className="text-xs text-blue-600 font-bold">Mitra Terverifikasi</p>
                   </div>
               </div>
          </div>
       </div>

       <div className="px-6 space-y-6">
           {/* Menu Group 1 */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-50">
                    <MenuItem 
                        icon={<User size={20} className="text-orange-500"/>} 
                        label="Kelola Profil" 
                        desc="Ubah nama & alamat"
                        onClick={() => setView('profil')} 
                    />
                    <MenuItem 
                        icon={<CreditCard size={20} className="text-orange-500"/>} 
                        label="Rekening & Saldo" 
                        desc="Cek penghasilan Anda"
                        onClick={() => setView('bank')} 
                    />
                    <MenuItem 
                        icon={<History size={20} className="text-orange-500"/>} 
                        label="Riwayat Pesanan" 
                        desc="Lihat pekerjaan lampau"
                        onClick={() => alert("Silakan cek tab 'Orderan' di bawah")} 
                    />
                </div>
           </div>
           
           {/* Menu Group 2 */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Pengaturan Aplikasi</div>
                <div className="divide-y divide-slate-50">
                    <MenuItem icon={<Bell size={20} className="text-slate-400"/>} label="Notifikasi" onClick={() => alert("Belum ada notifikasi baru")} />
                    <MenuItem icon={<HelpCircle size={20} className="text-slate-400"/>} label="Pusat Bantuan" onClick={() => alert("Hubungi Admin via Chat")} />
                    
                    <button onClick={handleLogout} className="w-full flex justify-between items-center p-5 hover:bg-red-50 transition text-red-500 text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition">
                                <LogOut size={18} />
                            </div>
                            <span className="font-bold text-sm">Keluar Aplikasi</span>
                        </div>
                    </button>
                </div>
           </div>

           <p className="text-center text-xs text-slate-400 py-4">HandyMan App v1.0.5</p>
       </div>
    </div>
  );
};

// Komponen Item Menu (Reusable)
const MenuItem = ({ label, icon, desc, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-5 hover:bg-slate-50 transition text-left group active:bg-slate-100">
        <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-white border border-slate-100 flex items-center justify-center transition shadow-sm">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-sm text-slate-700">{label}</h4>
                {desc && <p className="text-[10px] text-slate-400">{desc}</p>}
            </div>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition"/>
    </button>
);

export default TukangAkun;
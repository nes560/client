import React, { useState, useEffect } from 'react';
import { ChevronRight, User, CreditCard, History, Bell, HelpCircle, LogOut, ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TukangAkun = () => {
  const navigate = useNavigate();
  
  // URL Backend Railway
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  // State Halaman (menu | profil | bank | bantuan)
  const [view, setView] = useState('menu'); 
  const [user, setUser] = useState({
      nama_depan: '', nama_belakang: '', email: '', alamat: '', tipe_pengguna: 'tukang'
  });
  const [loading, setLoading] = useState(false);

  // 1. Ambil Data User Terbaru saat Load
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
      if(window.confirm("Yakin ingin keluar akun?")) {
          localStorage.removeItem('user_session');
          navigate('/login');
      }
  };

  // 3. Fungsi Update Profil
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
              alert("Profil berhasil diperbarui!");
              // Update localStorage dengan data baru
              localStorage.setItem('user_session', JSON.stringify(result.user));
              setUser(result.user);
              setView('menu'); // Kembali ke menu
          } else {
              alert("Gagal update: " + result.message);
          }
      } catch (error) {
          console.error(error);
          alert("Terjadi kesalahan koneksi");
      } finally {
          setLoading(false);
      }
  };

  // --- SUB-HALAMAN: EDIT PROFIL ---
  if (view === 'profil') {
      return (
          <div className="pb-24 bg-white min-h-screen">
              <div className="px-6 pt-8 pb-4 flex items-center gap-3 border-b border-slate-100">
                  <button onClick={() => setView('menu')}><ArrowLeft className="text-slate-700"/></button>
                  <h1 className="text-xl font-bold text-slate-800">Edit Profil</h1>
              </div>
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Nama Depan</label>
                      <input type="text" value={user.nama_depan} onChange={(e) => setUser({...user, nama_depan: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Nama Belakang</label>
                      <input type="text" value={user.nama_belakang} onChange={(e) => setUser({...user, nama_belakang: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                      <input type="email" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1"/>
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Alamat Domisili</label>
                      <textarea rows="3" value={user.alamat} onChange={(e) => setUser({...user, alamat: e.target.value})} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 mt-1"></textarea>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200 flex justify-center items-center gap-2">
                      {loading ? 'Menyimpan...' : <><Save size={18}/> Simpan Perubahan</>}
                  </button>
              </form>
          </div>
      );
  }

  // --- SUB-HALAMAN: REKENING & SALDO (MOCKUP) ---
  if (view === 'bank') {
      return (
          <div className="pb-24 bg-white min-h-screen">
              <div className="px-6 pt-8 pb-4 flex items-center gap-3 border-b border-slate-100">
                  <button onClick={() => setView('menu')}><ArrowLeft className="text-slate-700"/></button>
                  <h1 className="text-xl font-bold text-slate-800">Dompet Mitra</h1>
              </div>
              <div className="p-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl shadow-orange-200 mb-6">
                      <p className="text-orange-100 text-sm">Saldo Penghasilan</p>
                      <h2 className="text-3xl font-bold mt-1">Rp 1.500.000</h2>
                      <div className="mt-6 flex gap-3">
                          <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition">Tarik Dana</button>
                          <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition">Riwayat</button>
                      </div>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-4">Riwayat Transaksi</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <div>
                              <p className="font-bold text-slate-700">Jasa Servis AC</p>
                              <p className="text-xs text-slate-400">25 Des 2025</p>
                          </div>
                          <span className="text-green-600 font-bold">+ Rp 150.000</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                          <div>
                              <p className="font-bold text-slate-700">Penarikan Dana</p>
                              <p className="text-xs text-slate-400">20 Des 2025</p>
                          </div>
                          <span className="text-red-500 font-bold">- Rp 500.000</span>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- HALAMAN UTAMA (MENU) ---
  return (
    <div className="pb-24 md:pb-0 h-full overflow-y-auto">
       <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:px-0">
          <h1 className="text-2xl font-bold text-slate-800">Akun Saya</h1>
       </div>

       <div className="p-4 md:p-0">
           {/* Card Profil */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-4">
                <div className="p-5 bg-orange-50 border-b border-orange-100 flex items-center gap-4">
                    <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                        className="w-16 h-16 rounded-full bg-white border-2 border-orange-200" 
                        alt="Profil"
                    />
                    <div>
                        <h2 className="font-bold text-lg text-slate-800">{user.nama_depan} {user.nama_belakang}</h2>
                        <div className="flex items-center gap-1">
                             <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                             <p className="text-sm text-orange-600 font-medium">Mitra Aktif</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <MenuItem icon={<User size={18} className="text-orange-500"/>} label="Kelola Profil" onClick={() => setView('profil')} />
                    <MenuItem icon={<CreditCard size={18} className="text-orange-500"/>} label="Rekening & Saldo" onClick={() => setView('bank')} />
                    <MenuItem icon={<History size={18} className="text-orange-500"/>} label="Riwayat Pesanan" onClick={() => alert("Lihat tab Pesanan")} />
                </div>
           </div>
           
           {/* Card Pengaturan */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="bg-slate-50 px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">Pengaturan</div>
                <div className="divide-y divide-slate-50">
                    <MenuItem icon={<Bell size={18} className="text-slate-400"/>} label="Notifikasi" onClick={() => alert("Fitur segera hadir")} />
                    <MenuItem icon={<HelpCircle size={18} className="text-slate-400"/>} label="Bantuan & Dukungan" onClick={() => alert("Hubungi Admin via Chat")} />
                    <button onClick={handleLogout} className="w-full flex justify-between items-center p-4 hover:bg-red-50 transition text-red-500 text-sm font-bold text-left">
                        <div className="flex items-center gap-3">
                            <LogOut size={18} /> Keluar Aplikasi
                        </div>
                    </button>
                </div>
           </div>

           <p className="text-center text-xs text-slate-400">Versi Aplikasi 1.0.5 Beta</p>
       </div>
    </div>
  );
};

// Komponen Item Menu Reusable
const MenuItem = ({ label, icon, onClick }) => (
    <button onClick={onClick} className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition text-slate-700 text-sm font-medium text-left">
        <div className="flex items-center gap-3">
            {icon}
            {label}
        </div>
        <ChevronRight size={16} className="text-slate-300"/>
    </button>
);

export default TukangAkun;
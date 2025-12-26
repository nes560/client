import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Clock, User, MessageSquare } from 'lucide-react'; // ✅ Tambah MessageSquare

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Daftar Menu Navigasi (SEKARANG ADA 5)
  const navItems = [
    { path: '/beranda', label: 'Beranda', icon: Home },
    { path: '/pesanan', label: 'Pesan', icon: ClipboardList },
    { path: '/chat', label: 'Chat', icon: MessageSquare },     // ✅ Tombol Chat Kembali
    { path: '/riwayat-pesanan', label: 'Riwayat', icon: Clock },
    { path: '/profil', label: 'Akun', icon: User },
  ];

  return (
    // Container Utama (Fixed di bawah)
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      
      {/* Container Glass Effect */}
      {/* Kita ubah px-6 jadi px-4 agar muat 5 tombol tanpa sesak */}
      <div className="glass-effect px-4 pb-6 pt-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
        <div className="flex justify-between items-center">
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 relative group ${
                  isActive ? '-translate-y-2' : ''
                }`}
                style={{ width: '20%' }} // Pastikan lebar terbagi rata
              >
                {/* Lingkaran Icon */}
                <div className={`p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                    : 'bg-transparent text-slate-400 hover:bg-slate-50'
                }`}>
                  <Icon size={isActive ? 20 : 22} strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {/* Label (Muncul saat aktif) */}
                <span className={`text-[9px] font-bold transition-all duration-300 ${
                  isActive ? 'text-blue-600 opacity-100' : 'text-slate-400 opacity-0 hidden'
                }`}>
                  {item.label}
                </span>
                
                {/* Indikator Titik Kecil */}
                {!isActive && (
                    <span className="w-1 h-1 bg-slate-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-2"></span>
                )}
              </button>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default BottomNav;
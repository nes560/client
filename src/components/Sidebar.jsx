import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Home, ClipboardList, MessageSquare, Clock, User, LogOut, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal'; // Pastikan path import benar

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fungsi Cek Menu Aktif
  const isActive = (path) => location.pathname === path;

  // Daftar Menu
  const menus = [
    { path: '/beranda', label: 'Beranda', icon: Home },
    { path: '/pesanan', label: 'Pesan Jasa', icon: ClipboardList },
    { path: '/chat', label: 'Chat', icon: MessageSquare },
    { path: '/riwayat-pesanan', label: 'Riwayat & Review', icon: Clock },
    { path: '/profil', label: 'Akun Saya', icon: User },
  ];

  // Logic Logout
  const handleLogout = () => {
    localStorage.removeItem('user_session');
    toast.success("Berhasil keluar aplikasi");
    navigate('/login');
  };

  return (
    <>
      {/* Container Sidebar (Hanya Muncul di Desktop/MD ke atas) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40">
        
        {/* 1. Header Logo */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-blue-600 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Wrench size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">HandyMan.</h1>
          </div>
          <p className="text-xs text-slate-400 font-medium ml-1">Solusi Perbaikan Rumah</p>
        </div>

        {/* 2. Navigasi Menu */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
          
          {menus.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm group ${
                  active 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <Icon size={20} className={active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600 transition-colors'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Footer / Logout */}
        <div className="p-4 border-t border-slate-50">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            Keluar Aplikasi
          </button>
          
          <div className="mt-4 text-center">
             <p className="text-[10px] text-slate-300">© 2024 HandyMan App</p>
          </div>
        </div>
      </aside>

      {/* Modal Konfirmasi Logout */}
      <ConfirmModal 
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          title="Keluar Akun?"
          message="Anda harus login kembali untuk mengakses dashboard."
      />
    </>
  );
};

export default Sidebar;
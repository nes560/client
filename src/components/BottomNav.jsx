import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const BottomNav = ({ setView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. LOGIKA KLIK HOME (Sama seperti Sidebar)
  const handleHomeClick = () => {
    // Jika user sudah di /beranda dan prop setView ada (untuk ganti tab kategori), gunakan setView
    if (location.pathname === '/beranda' && setView) {
      setView('home');
    } else {
      // Jika user di halaman lain (misal Profil), pindah ke /beranda
      navigate('/beranda');
    }
  };

  // 2. HELPER UNTUK CEK STATUS AKTIF
  // Menentukan class CSS: Biru & Besar jika aktif, Abu-abu jika tidak
  const getIconClass = (path) => {
    const isActive = location.pathname === path;
    return `transition-all duration-300 ${
      isActive 
        ? 'text-blue-600 scale-125 drop-shadow-sm' // Style jika Aktif
        : 'text-gray-400 hover:text-gray-600'      // Style jika Tidak Aktif
    }`;
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-50">
      <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl flex justify-around py-4 px-2 items-center">
        
        {/* Tombol Home */}
        <button onClick={handleHomeClick} className={getIconClass('/beranda')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        
        {/* Tombol Pesanan */}
        <Link to="/pesanan" className={getIconClass('/pesanan')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </Link>
        
        {/* Tombol Chat */}
        <Link to="/chat" className={getIconClass('/chat')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </Link>
        
        {/* Tombol Profil */}
        <Link to="/profil" className={getIconClass('/profil')}>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
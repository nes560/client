import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

const Sidebar = ({ activeView, setView }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // LOGIKA BARU: Cek apakah sedang di /beranda
  const handleHomeClick = () => {
    if (location.pathname === '/beranda' && setView) {
      setView('home');
    } else {
      navigate('/beranda'); // Pindah ke /beranda, bukan /
    }
  };

  // ✅ FUNGSI LOGOUT CANTIK
  const handleLogout = () => {
    Swal.fire({
        title: 'Yakin ingin keluar?',
        text: "Sesi Anda akan diakhiri.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33', // Merah untuk bahaya/logout
        cancelButtonColor: '#3085d6', // Biru untuk batal
        confirmButtonText: 'Ya, Keluar',
        cancelButtonText: 'Batal',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Hapus data sesi
            localStorage.removeItem('user_session');
            // Arahkan ke halaman login
            navigate('/login');
        }
    });
  };

  const isActive = (viewName, path) => {
    if (activeView === viewName) return true;
    if (location.pathname === path) return true;
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 p-6 shadow-sm z-40">
      <div className="flex items-center gap-2 mb-10 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-blue-100"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H14.5c-.85 0-1.65-.33-2.25-.93L11 4.71"/><path d="M5.5 8.5 9 12"/></svg>
        <h1 className="font-bold text-xl tracking-tight text-slate-800">Handy<span className="text-blue-600">Man</span></h1>
      </div>

      <nav className="space-y-2 flex-1">
        
        {/* Tombol Beranda */}
        <button 
          onClick={handleHomeClick} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('home', '/beranda') && !isActive('category') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Beranda
        </button>
        
        <Link to="/pesanan" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('pesanan', '/pesanan') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Pesanan
        </Link>

        <Link to="/chat" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('chat', '/chat') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Chat
        </Link>

        <Link to="/profil" className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${isActive('profil', '/profil') ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          Profil
        </Link>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">PS</div>
          <div>
            <p className="text-sm font-bold text-slate-700">Pelanggan Setia</p>
            <p className="text-xs text-slate-400">Premium Member</p>
          </div>
        </div>

        {/* ✅ TOMBOL LOGOUT BARU */}
        <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Keluar
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
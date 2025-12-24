import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// Tambahkan ikon MessageSquare untuk Chat
import { Home, ClipboardList, Bell, User, LogOut, Wrench, MessageSquare } from 'lucide-react';

const TukangLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Fungsi Logout
  const handleLogout = () => {
    if (window.confirm('Akhiri sesi kerja?')) {
      localStorage.removeItem('user_session');
      navigate('/login');
    }
  };

  // Helper untuk mengecek menu aktif
  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:flex md:h-screen md:overflow-hidden bg-slate-100 font-sans text-slate-800">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full p-6 shadow-sm z-40">
        <div className="flex items-center gap-2 mb-10 text-blue-600">
          <Wrench className="w-8 h-8" />
          <h1 className="font-bold text-xl tracking-tight text-slate-800">Handy<span className="text-blue-600">Man</span></h1>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={<Home size={20}/>} label="Dashboard" path="/tukang/beranda" active={isActive('/tukang/beranda')} onClick={() => navigate('/tukang/beranda')} />
          <SidebarItem icon={<ClipboardList size={20}/>} label="Orderan" path="/tukang/orderan" active={isActive('/tukang/orderan')} onClick={() => navigate('/tukang/orderan')} />
          {/* MENU CHAT BARU (DESKTOP) */}
          <SidebarItem icon={<MessageSquare size={20}/>} label="Chat Admin" path="/tukang/chat" active={isActive('/tukang/chat')} onClick={() => navigate('/tukang/chat')} />
          
          <SidebarItem icon={<Bell size={20}/>} label="Notifikasi" path="/tukang/notifikasi" active={isActive('/tukang/notifikasi')} onClick={() => navigate('/tukang/notifikasi')} />
          <SidebarItem icon={<User size={20}/>} label="Akun Saya" path="/tukang/akun" active={isActive('/tukang/akun')} onClick={() => navigate('/tukang/akun')} />
        </nav>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition mt-auto border border-red-100">
          <LogOut size={20} /> Keluar
        </button>
      </aside>

      {/* AREA KONTEN UTAMA */}
      <main className="flex-1 relative md:bg-slate-50 md:overflow-y-auto">
        <div className="w-full md:max-w-none max-w-md mx-auto bg-slate-50 min-h-screen md:min-h-0 relative flex flex-col md:p-8">
            {/* Tempat Halaman Anak (Beranda, Orderan, Chat, dll) akan muncul */}
            <Outlet />
        </div>
      </main>

      {/* NAVIGASI MOBILE (BOTTOM BAR) */}
      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] bg-white/95 backdrop-blur-md border border-white/40 shadow-2xl rounded-2xl p-2 flex justify-between items-center z-50">
        <MobileNavItem icon={<Home size={24}/>} active={isActive('/tukang/beranda')} onClick={() => navigate('/tukang/beranda')} />
        <MobileNavItem icon={<ClipboardList size={24}/>} active={isActive('/tukang/orderan')} onClick={() => navigate('/tukang/orderan')} />
        
        {/* MENU CHAT BARU (MOBILE) - DI TENGAH AGAR MUDAH DIJANGKAU */}
        <MobileNavItem icon={<MessageSquare size={24}/>} active={isActive('/tukang/chat')} onClick={() => navigate('/tukang/chat')} />

        <MobileNavItem icon={<Bell size={24}/>} active={isActive('/tukang/notifikasi')} onClick={() => navigate('/tukang/notifikasi')} />
        <MobileNavItem icon={<User size={24}/>} active={isActive('/tukang/akun')} onClick={() => navigate('/tukang/akun')} />
      </div>

    </div>
  );
};

// Komponen Kecil untuk Item Sidebar
const SidebarItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition duration-200 ${active ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-transparent'}`}>
    {icon} {label}
  </button>
);

// Komponen Kecil untuk Item Mobile
const MobileNavItem = ({ icon, active, onClick }) => (
  <button onClick={onClick} className={`w-full py-2 flex flex-col items-center gap-1 transition ${active ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
    {icon}
    {active && <span className="w-1 h-1 bg-blue-600 rounded-full absolute bottom-1"></span>}
  </button>
);

export default TukangLayout;
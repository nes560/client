import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Bell, User, LogOut, Wrench, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast'; // ✅ Import Toast

const TukangLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FUNGSI LOGOUT YANG DIPERCANTIK (Bukan window.confirm lagi)
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <span className="font-bold text-slate-800 text-sm">
          Yakin ingin mengakhiri sesi?
        </span>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Batal
          </button>
          <button
            className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={() => {
              toast.dismiss(t.id);
              localStorage.removeItem('user_session');
              navigate('/login');
              toast.success("Berhasil Logout");
            }}
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
      style: {
        background: '#fff',
        padding: '16px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        border: '1px solid #f1f5f9'
      },
    });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:flex md:h-screen md:overflow-hidden bg-slate-50 font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-600">
      
      {/* === SIDEBAR DESKTOP === */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-full p-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-40 transition-all duration-300">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Wrench size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800 leading-none">
              Handy<span className="text-blue-600">Man.</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1">Mitra Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Menu Utama</p>
          <SidebarItem icon={<Home size={20}/>} label="Dashboard" path="/tukang/beranda" active={isActive('/tukang/beranda')} onClick={() => navigate('/tukang/beranda')} />
          <SidebarItem icon={<ClipboardList size={20}/>} label="Orderan" path="/tukang/orderan" active={isActive('/tukang/orderan')} onClick={() => navigate('/tukang/orderan')} />
          <SidebarItem icon={<MessageSquare size={20}/>} label="Chat Admin" path="/tukang/chat" active={isActive('/tukang/chat')} onClick={() => navigate('/tukang/chat')} />
          
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2">Pengaturan</p>
          <SidebarItem icon={<Bell size={20}/>} label="Notifikasi" path="/tukang/notifikasi" active={isActive('/tukang/notifikasi')} onClick={() => navigate('/tukang/notifikasi')} />
          <SidebarItem icon={<User size={20}/>} label="Akun Saya" path="/tukang/akun" active={isActive('/tukang/akun')} onClick={() => navigate('/tukang/akun')} />
        </nav>

        <div className="pt-4 border-t border-slate-50 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 group">
            <LogOut size={20} className="group-hover:stroke-red-600 transition-colors" /> 
            <span className="group-hover:font-bold">Keluar Aplikasi</span>
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 relative md:bg-slate-100 md:overflow-y-auto">
        <div className="w-full min-h-screen relative flex flex-col">
            <Outlet />
            <div className="h-24 md:h-0"></div>
        </div>
      </main>

      {/* === MOBILE NAV === */}
      <div className="md:hidden fixed bottom-5 left-1/2 transform -translate-x-1/2 w-[92%] max-w-sm z-50">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl px-6 py-3 flex justify-between items-center ring-1 ring-slate-900/5">
          <MobileNavItem icon={Home} active={isActive('/tukang/beranda')} onClick={() => navigate('/tukang/beranda')} />
          <MobileNavItem icon={ClipboardList} active={isActive('/tukang/orderan')} onClick={() => navigate('/tukang/orderan')} />
          
          <button 
             onClick={() => navigate('/tukang/chat')}
             className={`relative -top-5 p-4 rounded-full shadow-lg shadow-blue-500/30 transition-transform duration-300 ${
                 isActive('/tukang/chat') ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-100' : 'bg-blue-600 text-white hover:scale-105'
             }`}
          >
             <MessageSquare size={24} strokeWidth={2.5} />
          </button>

          <MobileNavItem icon={Bell} active={isActive('/tukang/notifikasi')} onClick={() => navigate('/tukang/notifikasi')} />
          {/* Tombol Logout Mobile di Menu User */}
          <MobileNavItem icon={LogOut} active={false} onClick={handleLogout} isDanger /> 
        </div>
      </div>

    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group relative overflow-hidden ${
      active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-200 translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
    }`}
  >
    <span className={`transition-colors duration-300 ${active ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>{icon}</span>
    <span className="relative z-10">{label}</span>
    {active && <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full opacity-50"></span>}
  </button>
);

const MobileNavItem = ({ icon: Icon, active, onClick, isDanger }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 relative ${
        active ? '-translate-y-1' : 'hover:bg-slate-50'
    } ${isDanger ? 'hover:bg-red-50 hover:text-red-500' : ''}`}
  >
    <Icon 
        size={active ? 24 : 22} 
        strokeWidth={active ? 2.5 : 2}
        className={`transition-colors duration-300 ${active ? 'text-blue-600' : isDanger ? 'text-slate-400 group-hover:text-red-500' : 'text-slate-400'}`} 
    />
    {active && <span className="absolute -bottom-2 w-1 h-1 bg-blue-600 rounded-full"></span>}
  </button>
);

export default TukangLayout;
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ICONS (Agar tampilan cantik tanpa install library lain) ---
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const OrderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- CONFIG ---
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  // --- STATE UTAMA ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk Mobile Sidebar
  
  // --- STATE DATA ---
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminId, setAdminId] = useState(null);

  // --- STATE CHAT ---
  const [allChats, setAllChats] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");

  // --- STATE STATISTIK ---
  const [stats, setStats] = useState({
    totalUsers: 0, countPelanggan: 0, countMitra: 0,
    totalOrders: 0, ordersSelesai: 0, revenue: 0
  });

  // 1. CEK SESSION & FETCH AWAL
  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (!sessionStr) {
      alert("Anda belum login.");
      navigate('/login');
      return;
    }

    const session = JSON.parse(sessionStr);
    if (session.tipe_pengguna !== 'admin') {
      alert("Akses Ditolak! Anda bukan Admin.");
      navigate('/login');
      return;
    }
    
    setAdminId(session.id);
    fetchData();

    // Auto refresh chat tiap 5 detik
    const interval = setInterval(fetchChatsOnly, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  // 2. AUTO SCROLL CHAT
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChats, selectedChatUser]);

  // --- FUNGSI FETCH DATA LENGKAP ---
  const fetchData = async () => {
    try {
      // Users
      const resUser = await fetch(`${API_URL}/users/all`);
      const dataUser = await resUser.json();
      const userList = dataUser.success ? dataUser.data : [];
      setUsers(userList);

      // Orders
      const resOrder = await fetch(`${API_URL}/pesanan`);
      const dataOrder = await resOrder.json();
      const orderList = dataOrder.success ? dataOrder.data : [];
      setOrders(orderList);

      // Chats
      await fetchChatsOnly();

      // Hitung Statistik
      const mitraCount = userList.filter(u => u.tipe_pengguna === 'tukang').length;
      const userCount = userList.filter(u => u.tipe_pengguna === 'user' || u.tipe_pengguna === 'pelanggan').length;
      const doneCount = orderList.filter(o => o.status === 'Selesai').length;

      setStats({
        totalUsers: userList.length,
        countPelanggan: userCount,
        countMitra: mitraCount,
        totalOrders: orderList.length,
        ordersSelesai: doneCount,
        revenue: doneCount * 50000 // Asumsi harga per jasa fix
      });

    } catch (err) {
      console.error("Gagal ambil data admin", err);
    }
  };

  // --- FUNGSI KHUSUS FETCH CHAT (Ringan) ---
  const fetchChatsOnly = async () => {
      try {
        const resChat = await fetch(`${API_URL}/chats`);
        const dataChat = await resChat.json();
        if(dataChat.success) {
            setAllChats(dataChat.data);
        }
      } catch (error) {
          console.error("Gagal load chat", error);
      }
  };

  // --- ACTIONS ---
  const handleSendMessage = async (e) => {
      e.preventDefault();
      if(!adminMessage.trim() || !selectedChatUser) return;

      try {
          await fetch(`${API_URL}/chats`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  sender_id: adminId,
                  receiver_id: selectedChatUser.id,
                  message: adminMessage
              })
          });
          setAdminMessage(""); 
          fetchChatsOnly(); 
      } catch (error) {
          alert("Gagal mengirim pesan");
      }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("⚠️ Hapus user ini secara permanen?")) return;
    try {
        await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
        fetchData(); 
    } catch (error) {
        alert("Gagal menghapus user");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
        await fetch(`${API_URL}/pesanan/${id}/status`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        // Optimistic update
        setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
        alert("Gagal update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  // --- FILTERING DATA UTILS ---
  const chatContacts = users.filter(u => u.id !== adminId); 
  const currentMessages = allChats.filter(msg => 
      (msg.sender_id === adminId && msg.receiver_id === selectedChatUser?.id) || 
      (msg.sender_id === selectedChatUser?.id && msg.receiver_id === adminId)
  );

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* 1. MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* 2. SIDEBAR (RESPONSIVE) */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out shadow-xl flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <h1 className="text-xl font-extrabold text-blue-400">ADMIN<span className="text-white">PANEL</span></h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><XIcon /></button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
            <HomeIcon /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
            <UsersIcon /> Data Pengguna
          </button>
          <button onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
            <OrderIcon /> Data Pesanan
          </button>
          <button onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-400'}`}>
            <ChatIcon /> Live Chat
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 w-full text-red-400 hover:text-red-300 p-2 font-bold transition">
            <LogoutIcon /> Keluar
          </button>
        </div>
      </aside>

      {/* 3. KONTEN UTAMA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header Mobile */}
        <header className="bg-white p-4 shadow-sm md:hidden flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="text-slate-700"><MenuIcon /></button>
                <span className="font-bold text-slate-800">Admin Panel</span>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">

          {/* === DASHBOARD TAB === */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-slate-800">Overview Statistik</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 font-medium text-sm uppercase">Total Users</p>
                        <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalUsers}</h3>
                        <p className="text-xs text-blue-500 mt-2 font-bold bg-blue-50 w-max px-2 py-1 rounded">
                            {stats.countMitra} Mitra • {stats.countPelanggan} Pelanggan
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 font-medium text-sm uppercase">Total Order</p>
                        <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalOrders}</h3>
                        <p className="text-xs text-orange-500 mt-2 font-bold bg-orange-50 w-max px-2 py-1 rounded">
                            {stats.ordersSelesai} Selesai
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <p className="text-slate-500 font-medium text-sm uppercase">Revenue</p>
                        <h3 className="text-4xl font-bold text-green-600 mt-2">Rp {stats.revenue.toLocaleString('id-ID')}</h3>
                    </div>
                </div>
            </div>
          )}

          {/* === USERS TAB === */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100"><h3 className="font-bold">Manajemen User</h3></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-800 font-bold">
                            <tr>
                                <th className="p-4">Nama</th>
                                <th className="p-4">Tipe</th>
                                <th className="p-4">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium text-slate-900">{u.nama_depan} {u.nama_belakang}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.tipe_pengguna === 'tukang' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {u.tipe_pengguna}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {u.tipe_pengguna !== 'admin' && (
                                            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500 hover:text-red-700 font-bold text-xs">Hapus</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}

          {/* === ORDERS TAB === */}
          {activeTab === 'orders' && (
            <div className="grid gap-4">
                {orders.map(order => (
                    <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-lg">{order.kategori_jasa}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                    order.status === 'Selesai' ? 'border-green-200 bg-green-50 text-green-700' : 
                                    order.status === 'Dibatalkan' ? 'border-red-200 bg-red-50 text-red-700' : 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                }`}>{order.status}</span>
                            </div>
                            <p className="text-sm text-slate-500">Pelanggan: <span className="font-medium text-slate-700">{order.nama_user}</span></p>
                            <p className="text-xs text-slate-400 mt-1 max-w-md truncate">"{order.deskripsi_masalah}"</p>
                        </div>
                        <div className="flex gap-2">
                            <select 
                                className="bg-slate-100 border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={order.status}
                                onChange={(e)=>handleUpdateStatus(order.id, e.target.value)}
                            >
                                <option value="Menunggu Konfirmasi">Menunggu</option>
                                <option value="Diproses">Diproses</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Dibatalkan">Batalkan</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
          )}

          {/* === CHAT TAB (RESPONSIVE) === */}
          {activeTab === 'chat' && (
            <div className="flex flex-col md:flex-row h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* LIST KONTAK (KIRI) */}
                <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col ${selectedChatUser ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-slate-700">Inbox</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatContacts.map(user => {
                            const hasChat = allChats.some(m => m.sender_id === user.id || m.receiver_id === user.id);
                            return (
                                <div key={user.id} onClick={() => setSelectedChatUser(user)}
                                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-blue-50 transition flex items-center gap-3 ${selectedChatUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.tipe_pengguna === 'tukang' ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                        {user.nama_depan.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-slate-800 text-sm">{user.nama_depan}</h4>
                                            {hasChat && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                        </div>
                                        <p className="text-xs text-slate-500">{user.tipe_pengguna}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* AREA CHAT (KANAN) */}
                <div className={`w-full md:w-2/3 flex-col bg-slate-50 ${selectedChatUser ? 'flex' : 'hidden md:flex'}`}>
                    {selectedChatUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-3">
                                <button onClick={() => setSelectedChatUser(null)} className="md:hidden text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                                </button>
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {selectedChatUser.nama_depan.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm">{selectedChatUser.nama_depan}</h3>
                                    <p className="text-[10px] text-slate-500 uppercase">{selectedChatUser.tipe_pengguna}</p>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {currentMessages.length === 0 ? (
                                    <div className="text-center text-slate-400 text-sm mt-10">Mulai percakapan...</div>
                                ) : (
                                    currentMessages.map((msg, idx) => {
                                        const isMe = msg.sender_id === adminId;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm rounded-bl-none'}`}>
                                                    <p>{msg.message}</p>
                                                    <p className={`text-[9px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef}></div>
                            </div>

                            {/* Chat Input */}
                            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Tulis pesan..."
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-blue-600 text-white w-10 h-10 rounded-full hover:bg-blue-700 transition flex items-center justify-center shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <ChatIcon />
                            <p className="mt-2 text-sm">Pilih kontak untuk chat</p>
                        </div>
                    )}
                </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
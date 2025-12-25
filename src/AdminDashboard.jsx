import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data State
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // === STATE BARU UNTUK CHAT ===
  const [allChats, setAllChats] = useState([]); // Menampung SEMUA chat dari database
  const [selectedChatUser, setSelectedChatUser] = useState(null); // User yang sedang di-chat admin
  const [adminMessage, setAdminMessage] = useState(""); // Input pesan admin
  const [adminId, setAdminId] = useState(null); // ID Admin yang sedang login
  const chatEndRef = useRef(null); // Untuk auto scroll ke bawah
  
  // Statistik State
  const [stats, setStats] = useState({
    totalUsers: 0,
    countPelanggan: 0,
    countMitra: 0,
    persenPelanggan: 0,
    persenMitra: 0,
    totalOrders: 0,
    ordersSelesai: 0,
    persenSelesai: 0,
    revenue: 0
  });

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
    
    setAdminId(session.id); // Simpan ID Admin
    fetchData();

    // Opsional: Auto refresh chat setiap 5 detik agar realtime
    const interval = setInterval(fetchChatsOnly, 5000);
    return () => clearInterval(interval);

  }, [navigate]);

  // Scroll ke bawah saat buka chat baru / ada pesan baru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChats, selectedChatUser]);

  const fetchData = async () => {
    try {
      // 1. Ambil Data Users
      const resUser = await fetch('https://backend-production-b8f3.up.railway.app/api/users/all');
      const dataUser = await resUser.json();
      const userList = dataUser.success ? dataUser.data : [];
      setUsers(userList);

      // 2. Ambil Data Orders
      const resOrder = await fetch('https://backend-production-b8f3.up.railway.app/api/pesanan');
      const dataOrder = await resOrder.json();
      const orderList = dataOrder.success ? dataOrder.data : [];
      setOrders(orderList);

      // 3. Ambil Data Chat (BARU)
      await fetchChatsOnly();

      // 4. Hitung Statistik
      const mitraCount = userList.filter(u => u.tipe_pengguna === 'tukang').length;
      const userCount = userList.filter(u => u.tipe_pengguna === 'user' || u.tipe_pengguna === 'pelanggan').length;
      const totalU = userList.length;

      const doneCount = orderList.filter(o => o.status === 'Selesai').length;
      const totalO = orderList.length;
      const revenueCalc = doneCount * 50000; 

      setStats({
        totalUsers: totalU,
        countPelanggan: userCount,
        countMitra: mitraCount,
        persenPelanggan: totalU > 0 ? Math.round((userCount / totalU) * 100) : 0,
        persenMitra: totalU > 0 ? Math.round((mitraCount / totalU) * 100) : 0,
        totalOrders: totalO,
        ordersSelesai: doneCount,
        persenSelesai: totalO > 0 ? Math.round((doneCount / totalO) * 100) : 0,
        revenue: revenueCalc
      });

    } catch (err) {
      console.error("Gagal ambil data admin", err);
    }
  };

  // Fungsi khusus ambil chat saja (untuk auto refresh)
  const fetchChatsOnly = async () => {
      try {
        const resChat = await fetch('https://backend-production-b8f3.up.railway.app/api/chats');
        const dataChat = await resChat.json();
        if(dataChat.success) {
            setAllChats(dataChat.data);
        }
      } catch (error) {
          console.error("Gagal load chat", error);
      }
  };

  // === FUNGSI KIRIM PESAN ADMIN ===
  const handleSendMessage = async (e) => {
      e.preventDefault();
      if(!adminMessage.trim() || !selectedChatUser) return;

      try {
          // Kirim ke backend
          await fetch('https://backend-production-b8f3.up.railway.app/api/chats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  sender_id: adminId,         // Dari Admin
                  receiver_id: selectedChatUser.id, // Ke User yang dipilih
                  message: adminMessage
              })
          });

          setAdminMessage(""); // Reset input
          fetchChatsOnly(); // Refresh chat agar muncul
      } catch (error) {
          alert("Gagal mengirim pesan");
      }
  };

  // === LOGIKA FILTER KONTAK CHAT ===
  // Kita ingin mencari User mana saja yang pernah chat dengan admin atau bisa di-chat
  // Di sini kita tampilkan semua user agar Admin bisa memulai chat dengan siapa saja
  const chatContacts = users.filter(u => u.id !== adminId); // Kecualikan diri sendiri (admin)

  // === LOGIKA FILTER PESAN ===
  // Hanya tampilkan pesan antara Admin vs User yang dipilih
  const currentMessages = allChats.filter(msg => 
      (msg.sender_id === adminId && msg.receiver_id === selectedChatUser?.id) || 
      (msg.sender_id === selectedChatUser?.id && msg.receiver_id === adminId)
  );


  // Fungsi Hapus User
  const handleDeleteUser = async (id) => {
    if(!window.confirm("⚠️ PERINGATAN: Menghapus user ini bersifat permanen. Lanjutkan?")) return;
    try {
        await fetch(`https://backend-production-b8f3.up.railway.app/api/users/${id}`, { method: 'DELETE' });
        alert("User berhasil dihapus.");
        fetchData(); 
    } catch (error) {
        alert("Gagal menghapus user");
    }
  };

  // Fungsi Update Status Order
  const handleUpdateStatus = async (id, newStatus) => {
    try {
        await fetch(`https://backend-production-b8f3.up.railway.app/api/pesanan/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        fetchData(); 
    } catch (error) {
        alert("Gagal update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      
      {/* SIDEBAR MENU */}
      <div className="w-64 bg-slate-900 text-white flex flex-col fixed h-full md:relative z-20 shadow-xl">
        <div className="p-6 text-2xl font-extrabold text-blue-400 border-b border-slate-700 tracking-wide">
          ADMIN<span className="text-white">PANEL</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-3 mt-4">
          <button onClick={() => setActiveTab('dashboard')} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}>
            📊 Dashboard
          </button>
          <button onClick={() => setActiveTab('users')} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}>
            👥 Data Pengguna
          </button>
          <button onClick={() => setActiveTab('orders')} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}>
            📝 Data Pesanan
          </button>
          <button onClick={() => setActiveTab('chat')} 
            className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center gap-3 font-medium ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 text-slate-400'}`}>
            💬 Live Chat
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-xl font-bold transition shadow-lg shadow-red-900/20">
            Keluar
          </button>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 ml-0 md:ml-0 h-screen">
        
        {/* Header (Hanya muncul selain di tab chat agar chat full height) */}
        {activeTab !== 'chat' && (
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Halo, Super Admin 👋</h1>
                    <p className="text-slate-500">Berikut adalah laporan perkembangan bisnis Anda.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-semibold text-slate-600">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>
        )}

        {/* === TAB 1: DASHBOARD === */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Kartu Statistik */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium">Total Pengguna</p>
                <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalUsers}</h3>
                <p className="text-xs text-blue-500 mt-2 font-bold bg-blue-50 w-max px-2 py-1 rounded-md">
                    {stats.countMitra} Mitra & {stats.countPelanggan} Pelanggan
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium">Total Pesanan</p>
                <h3 className="text-4xl font-bold text-slate-800 mt-2">{stats.totalOrders}</h3>
                <p className="text-xs text-orange-500 mt-2 font-bold bg-orange-50 w-max px-2 py-1 rounded-md">
                    {stats.ordersSelesai} Selesai
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <p className="text-slate-500 font-medium">Pendapatan</p>
                <h3 className="text-4xl font-bold text-green-600 mt-2">Rp {stats.revenue.toLocaleString('id-ID')}</h3>
              </div>
            </div>
          </div>
        )}

        {/* === TAB 2: USERS === */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold text-xs border-b">
                <tr>
                    <th className="p-5">Nama Lengkap</th>
                    <th className="p-5">Tipe Akun</th>
                    <th className="p-5 text-center">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                    <tr key={u.id}>
                    <td className="p-5 font-bold">{u.nama_depan} {u.nama_belakang}</td>
                    <td className="p-5">{u.tipe_pengguna}</td>
                    <td className="p-5 text-center">
                        {u.tipe_pengguna !== 'admin' && (
                        <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 font-bold text-sm">Hapus</button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}

        {/* === TAB 3: ORDERS === */}
        {activeTab === 'orders' && (
          <div className="grid gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                <div>
                    <h3 className="font-bold">{order.kategori_jasa}</h3>
                    <p className="text-sm text-slate-500">Pelanggan: {order.nama_user}</p>
                    <p className="text-sm mt-1 bg-slate-100 p-2 rounded">Status: {order.status || 'Pending'}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={()=>handleUpdateStatus(order.id, 'Diproses')} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs font-bold">Proses</button>
                    <button onClick={()=>handleUpdateStatus(order.id, 'Selesai')} className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold">Selesai</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === TAB 4: LIVE CHAT (FITUR BARU) === */}
        {activeTab === 'chat' && (
            <div className="flex h-[85vh] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                
                {/* 1. Sidebar Kontak (Kiri) */}
                <div className="w-1/3 border-r border-slate-100 flex flex-col">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="font-bold text-slate-700">Daftar Kontak</h3>
                        <p className="text-xs text-slate-500">Pilih user untuk membalas pesan</p>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {chatContacts.map(user => {
                            // Cek apakah ada pesan dari user ini
                            const hasChat = allChats.some(m => m.sender_id === user.id || m.receiver_id === user.id);
                            return (
                                <div 
                                    key={user.id}
                                    onClick={() => setSelectedChatUser(user)}
                                    className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-blue-50 transition flex items-center gap-3 ${selectedChatUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.tipe_pengguna === 'tukang' ? 'bg-orange-400' : 'bg-blue-400'}`}>
                                        {user.nama_depan.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{user.nama_depan} {user.nama_belakang}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.tipe_pengguna === 'tukang' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {user.tipe_pengguna}
                                        </span>
                                        {hasChat && <span className="ml-2 text-[10px] text-green-600 font-bold">● Ada Chat</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Area Chat (Kanan) */}
                <div className="w-2/3 flex flex-col bg-slate-50">
                    {selectedChatUser ? (
                        <>
                            {/* Header Chat */}
                            <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                                    {selectedChatUser.nama_depan.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{selectedChatUser.nama_depan} {selectedChatUser.nama_belakang}</h3>
                                    <p className="text-xs text-slate-500">{selectedChatUser.tipe_pengguna.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Isi Pesan */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {currentMessages.length === 0 ? (
                                    <div className="text-center text-slate-400 text-sm mt-10">Belum ada riwayat percakapan. Mulai chat sekarang!</div>
                                ) : (
                                    currentMessages.map((msg, idx) => {
                                        const isMe = msg.sender_id === adminId;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm rounded-bl-none'}`}>
                                                    <p>{msg.message}</p>
                                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={chatEndRef}></div>
                            </div>

                            {/* Input Pesan */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="Ketik balasan..."
                                    value={adminMessage}
                                    onChange={(e) => setAdminMessage(e.target.value)}
                                />
                                <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition w-10 h-10 flex items-center justify-center">
                                    ➤
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <span className="text-4xl mb-2">💬</span>
                            <p>Pilih kontak di sebelah kiri untuk mulai chat</p>
                        </div>
                    )}
                </div>

            </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
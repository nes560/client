import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, ShoppingBag, MessageSquare, LogOut, 
  Menu, X, Search, MoreVertical, Send, Trash2, CheckCircle, Clock, XCircle 
} from 'lucide-react'; 

const AdminDashboard = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- CONFIG ---
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminId, setAdminId] = useState(null);
  
  // Chat State
  const [allChats, setAllChats] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 

  // Stats State
  const [stats, setStats] = useState({
    totalUsers: 0, countPelanggan: 0, countMitra: 0,
    totalOrders: 0, ordersSelesai: 0, revenue: 0
  });

  // --- EFFECTS ---
  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (!sessionStr) { navigate('/login'); return; }
    const session = JSON.parse(sessionStr);
    if (session.tipe_pengguna !== 'admin') { navigate('/login'); return; }
    
    setAdminId(session.id);
    fetchData();
    const interval = setInterval(fetchChatsOnly, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allChats, selectedChatUser]);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [resUser, resOrder] = await Promise.all([
        fetch(`${API_URL}/users/all`),
        fetch(`${API_URL}/pesanan`)
      ]);
      
      const dataUser = await resUser.json();
      const dataOrder = await resOrder.json();
      
      const userList = dataUser.success ? dataUser.data : [];
      const orderList = dataOrder.success ? dataOrder.data : [];
      
      setUsers(userList);
      setOrders(orderList);
      await fetchChatsOnly();

      // Calculate Stats
      const doneCount = orderList.filter(o => o.status === 'Selesai').length;
      setStats({
        totalUsers: userList.length,
        countPelanggan: userList.filter(u => ['user','pelanggan'].includes(u.tipe_pengguna)).length,
        countMitra: userList.filter(u => u.tipe_pengguna === 'tukang').length,
        totalOrders: orderList.length,
        ordersSelesai: doneCount,
        revenue: doneCount * 15000 
      });
    } catch (err) { console.error("Error fetching data", err); }
  };

  const fetchChatsOnly = async () => {
    try {
      const res = await fetch(`${API_URL}/chats`);
      const data = await res.json();
      if(data.success) setAllChats(data.data);
    } catch (e) { console.error(e); }
  };

  // --- HANDLERS ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if(!adminMessage.trim() || !selectedChatUser) return;
    try {
      await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender_id: adminId, receiver_id: selectedChatUser.id, message: adminMessage })
      });
      setAdminMessage("");
      fetchChatsOnly();
    } catch (e) { alert("Gagal kirim pesan"); }
  };

  const handleDeleteUser = async (id) => {
    if(!window.confirm("Hapus user ini?")) return;
    await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    await fetch(`${API_URL}/pesanan/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  // --- FILTERED DATA ---
  const filteredUsers = users.filter(u => u.nama_depan.toLowerCase().includes(searchTerm.toLowerCase()));
  const chatContacts = users.filter(u => u.id !== adminId);
  const currentMessages = allChats.filter(msg => 
    (msg.sender_id === adminId && msg.receiver_id === selectedChatUser?.id) || 
    (msg.sender_id === selectedChatUser?.id && msg.receiver_id === adminId)
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* OVERLAY MOBILE */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">H</div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">HandyMan</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400"><X /></button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }} />
          <SidebarItem icon={<Users size={20} />} label="Pengguna" active={activeTab === 'users'} onClick={() => { setActiveTab('users'); setSidebarOpen(false); }} />
          <SidebarItem icon={<ShoppingBag size={20} />} label="Pesanan" active={activeTab === 'orders'} onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }} />
          <SidebarItem icon={<MessageSquare size={20} />} label="Live Chat" active={activeTab === 'chat'} onClick={() => { setActiveTab('chat'); setSidebarOpen(false); }} badge={allChats.length > 0} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { localStorage.removeItem('user_session'); navigate('/login'); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition group">
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* HEADER MOBILE */}
        <header className="bg-white px-6 py-4 shadow-sm md:hidden flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-slate-600"><Menu /></button>
            <h1 className="font-bold text-slate-800 text-lg capitalize">{activeTab}</h1>
          </div>
        </header>

        {/* CONTENT SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* === DASHBOARD VIEW === */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in zoom-in duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Overview Statistik</h2>
                  <p className="text-slate-500 text-sm mt-1">Ringkasan performa aplikasi hari ini.</p>
                </div>
                <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">Refresh Data</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Pengguna" value={stats.totalUsers} sub={`${stats.countMitra} Mitra / ${stats.countPelanggan} User`} icon={<Users size={24} className="text-blue-600"/>} color="bg-blue-50" />
                <StatCard title="Total Pesanan" value={stats.totalOrders} sub={`${stats.ordersSelesai} Selesai`} icon={<ShoppingBag size={24} className="text-purple-600"/>} color="bg-purple-50" />
                <StatCard title="Total Pendapatan" value={`Rp ${stats.revenue.toLocaleString('id-ID')}`} sub="Estimasi Profit" icon={<CheckCircle size={24} className="text-green-600"/>} color="bg-green-50" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4">Pesanan Terbaru</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-500">
                            {o.nama_user?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{o.kategori_jasa}</p>
                            <p className="text-xs text-slate-500">{o.nama_user}</p>
                          </div>
                        </div>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === USERS VIEW === */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="font-bold text-lg text-slate-800">Data Pengguna</h3>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Cari nama..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                    <tr>
                      <th className="p-4 w-16">#</th>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Email / Kontak</th>
                      <th className="p-4">Peran</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 text-slate-400">{i + 1}</td>
                        <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${u.tipe_pengguna === 'tukang' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                            {u.nama_depan.charAt(0)}
                          </div>
                          {u.nama_depan} {u.nama_belakang}
                        </td>
                        <td className="p-4 text-slate-500">{u.email || '-'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${u.tipe_pengguna === 'tukang' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                            {u.tipe_pengguna}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {u.tipe_pengguna !== 'admin' && (
                            <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus User">
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === ORDERS VIEW === */}
          {activeTab === 'orders' && (
            <div className="grid gap-4 animate-in slide-in-from-bottom-4 duration-300">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-800">{order.kategori_jasa}</h3>
                          <span className="text-xs text-slate-400">• ID: #{order.id}</span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">Pelanggan: <span className="font-medium">{order.nama_user}</span></p>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-600 italic">
                          "{order.deskripsi_masalah}"
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                      <StatusBadge status={order.status} />
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer hover:bg-slate-50"
                      >
                        <option value="Menunggu Konfirmasi">Menunggu</option>
                        <option value="Diproses">Diproses</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Batalkan</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* === CHAT VIEW (FIXED SCROLL MOBILE) === */}
          {activeTab === 'chat' && (
            <div className="flex flex-col md:flex-row h-[calc(100dvh-130px)] md:h-[calc(100vh-100px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
              
              {/* CONTACTS LIST */}
              <div className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50 ${selectedChatUser ? 'hidden md:flex' : 'flex h-full'}`}>
                <div className="p-4 border-b border-slate-200 bg-white shrink-0">
                  <h3 className="font-bold text-slate-800">Pesan Masuk</h3>
                </div>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {chatContacts.map(user => (
                    <div key={user.id} onClick={() => setSelectedChatUser(user)} className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-3 ${selectedChatUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm shrink-0 ${user.tipe_pengguna === 'tukang' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                        {user.nama_depan.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">{user.nama_depan} {user.nama_belakang}</h4>
                        <p className="text-xs text-slate-500 capitalize truncate">{user.tipe_pengguna}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHAT AREA */}
              <div className={`flex-1 flex flex-col bg-white ${!selectedChatUser ? 'hidden md:flex' : 'flex h-full'}`}>
                {selectedChatUser ? (
                  <>
                    <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/80 backdrop-blur sticky top-0 z-10 shrink-0">
                      <button onClick={() => setSelectedChatUser(null)} className="md:hidden p-2 -ml-2 text-slate-500"><X size={20}/></button>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {selectedChatUser.nama_depan.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{selectedChatUser.nama_depan}</h3>
                        <p className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online</p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 min-h-0">
                      {currentMessages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2 opacity-50">
                          <MessageSquare size={48} />
                          <p>Belum ada percakapan.</p>
                        </div>
                      )}
                      {currentMessages.map((msg, i) => {
                        const isMe = msg.sender_id === adminId;
                        return (
                          <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'}`}>
                              <p>{msg.message}</p>
                              <p className={`text-[10px] mt-1 text-right opacity-70`}>
                                {new Date(msg.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                      <input 
                        type="text" 
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                        placeholder="Ketik pesan balasan..."
                        value={adminMessage}
                        onChange={e => setAdminMessage(e.target.value)}
                      />
                      <button type="submit" className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50 shrink-0" disabled={!adminMessage.trim()}>
                        <Send size={20} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare size={40} />
                    </div>
                    <p>Pilih kontak untuk mulai chat</p>
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

// --- SUB COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
    <div className="flex items-center gap-3">
      {icon} <span>{label}</span>
    </div>
    {badge && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
  </button>
);

const StatCard = ({ title, value, sub, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  let styles = "bg-slate-100 text-slate-600 border-slate-200";
  let icon = <Clock size={12} />;
  
  if(status === 'Selesai') { styles = "bg-green-50 text-green-700 border-green-200"; icon = <CheckCircle size={12} />; }
  else if(status === 'Dibatalkan') { styles = "bg-red-50 text-red-700 border-red-200"; icon = <XCircle size={12} />; }
  else if(status === 'Diproses') { styles = "bg-blue-50 text-blue-700 border-blue-200"; icon = <Clock size={12} />; }

  return (
    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles}`}>
      {icon} {status}
    </span>
  );
};

export default AdminDashboard;
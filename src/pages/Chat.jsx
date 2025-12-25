import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';   // Pastikan path import benar
import BottomNav from '../../components/BottomNav'; // Pastikan path import benar

const Chat = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // --- BAGIAN KRUSIAL (JANGAN DIGANTI KE LOCALHOST) ---
  // 1. URL Backend Railway
  const API_URL = "https://backend-production-b8f3.up.railway.app/api";
  
  // 2. ID Admin Pusat (Sesuai Database Anda)
  const ADMIN_ID = 28;
  // ---------------------------------------------------

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userSession, setUserSession] = useState(null);

  // 1. CEK LOGIN
  useEffect(() => {
    const sessionStr = localStorage.getItem('user_session');
    if (!sessionStr) {
      navigate('/login');
    } else {
      const session = JSON.parse(sessionStr);
      setUserSession(session);
    }
  }, [navigate]);

  // 2. FUNGSI AMBIL CHAT (POLLING)
  const fetchMessages = async () => {
    if (!userSession) return;

    try {
      const response = await fetch(`${API_URL}/chats`);
      const result = await response.json();

      if (result.success) {
        // FILTER: Ambil chat antara SAYA (Pelanggan) <-> ADMIN
        const myChats = result.data.filter(msg => 
            (msg.sender_id === userSession.id && msg.receiver_id === ADMIN_ID) ||
            (msg.sender_id === ADMIN_ID && msg.receiver_id === userSession.id)
        );
        setMessages(myChats);
      }
    } catch (error) {
      console.error("Gagal mengambil chat:", error);
    }
  };

  // Jalankan Polling setiap 3 detik
  useEffect(() => {
    if (!userSession) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); 
    return () => clearInterval(interval);
  }, [userSession]);

  // 3. AUTO SCROLL KE BAWAH
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. KIRIM PESAN
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !userSession) return;

    const originalText = inputText;
    setInputText(''); 

    try {
      await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender_id: userSession.id,   
            receiver_id: ADMIN_ID,       
            message: originalText
        })
      });
      fetchMessages(); // Refresh langsung
    } catch (error) {
      alert("Gagal kirim pesan. Cek internet.");
      setInputText(originalText); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative md:flex font-sans text-slate-800 bg-slate-50">
      
      {/* SIDEBAR (Desktop) */}
      <Sidebar activeView="chat" />

      {/* KONTEN UTAMA */}
      <main className="flex-1 h-screen relative flex flex-col bg-slate-100">
            
        {/* Header Chat */}
        <div className="bg-white px-6 py-4 shadow-sm flex items-center justify-between z-10 border-b border-slate-200">
            <div className="flex items-center gap-3">
                {/* Tombol Back Mobile */}
                <button onClick={() => navigate('/beranda')} className="md:hidden text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    A
                </div>
                <div>
                    <h2 className="font-bold text-slate-800 text-sm">Admin Pusat</h2>
                    <p className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                    </p>
                </div>
            </div>
        </div>

        {/* Area Pesan */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-24">
            {messages.length === 0 && (
                <div className="text-center text-xs text-slate-400 mt-10">
                    Halo, {userSession?.nama_depan}.<br/>Ada yang bisa kami bantu hari ini?
                </div>
            )}

            {messages.map((msg) => {
                const isMe = msg.sender_id === userSession?.id;
                
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'}`}>
                            <p>{msg.message}</p>
                            <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                        </div>
                    </div>
                );
            })}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-slate-200 sticky bottom-0 md:mb-0 mb-[60px]">
            <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-slate-100 border-0 rounded-full px-5 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm" 
                    placeholder="Ketik pesan..." 
                />
                <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </form>
        </div>

      </main>

      {/* MENU BAWAH (Mobile) */}
      <BottomNav setView={() => navigate('/beranda')} />
      
    </div>
  );
};

export default Chat;
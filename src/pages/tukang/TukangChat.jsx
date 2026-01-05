import React, { useState, useEffect, useRef } from 'react';

const TukangChat = () => {
  const chatEndRef = useRef(null);

  // --- PERBAIKAN DI SINI ---
  // 1. Kita kunci URL ke Railway agar tidak nyasar ke Localhost lagi
  const API_URL = "https://backend-sigma-nine-12.vercel.app/api"; 
  
  // 2. ID Admin = 28 (Sesuai dengan gambar database Anda)
  const ADMIN_ID = 28; 
  // -------------------------

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userSession, setUserSession] = useState(null);

  // 1. Cek Login
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('user_session'));
    if (session) {
        setUserSession(session);
    }
  }, []);

  // 2. Ambil Chat (Polling)
  const fetchMessages = async () => {
    if (!userSession) return;
    try {
      const response = await fetch(`${API_URL}/chats`);
      const result = await response.json();
      
      if (result.success) {
        // Filter: Chat antara SAYA (Tukang) dan ADMIN (ID 28)
        const myChats = result.data.filter(msg => 
            (msg.sender_id === userSession.id && msg.receiver_id === ADMIN_ID) ||
            (msg.sender_id === ADMIN_ID && msg.receiver_id === userSession.id)
        );
        setMessages(myChats);
      }
    } catch (error) {
      console.error("Gagal load chat", error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Update tiap 3 detik
    return () => clearInterval(interval);
  }, [userSession]);

  // 3. Scroll Bawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Kirim Pesan
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

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
      fetchMessages(); // Refresh chat setelah kirim
    } catch (error) {
      alert("Gagal kirim pesan. Cek koneksi internet.");
      setInputText(originalText);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] md:h-full bg-white md:rounded-2xl md:shadow-sm md:border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                A
            </div>
            <div>
                <h2 className="font-bold text-slate-800">Admin Pusat</h2>
                <p className="text-xs text-slate-500">Bantuan Mitra Tukang</p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.length === 0 && <div className="text-center text-slate-400 mt-10 text-sm">Belum ada chat. Silakan lapor jika ada kendala orderan.</div>}
            
            {messages.map((msg) => {
                const isMe = msg.sender_id === userSession?.id;
                return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-2 rounded-xl text-sm max-w-[80%] ${isMe ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-slate-700 shadow-sm border border-slate-200 rounded-bl-none'}`}>
                            {msg.message}
                            <div className={`text-[10px] text-right mt-1 ${isMe ? 'text-orange-200' : 'text-slate-400'}`}>
                                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                    </div>
                )
            })}
            <div ref={chatEndRef}></div>
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tulis pesan..."
            />
            <button type="submit" className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </form>
    </div>
  );
};

export default TukangChat;
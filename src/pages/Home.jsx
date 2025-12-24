import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { API_URL } from '../utils/api'; 

const Home = () => {
  const navigate = useNavigate();

  // === STATE MANAGEMENT ===
  const [activeView, setActiveView] = useState('home');
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // State Data
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Pelanggan');
  const [userAddress, setUserAddress] = useState('Lokasi Belum Diatur'); 

  // === 1. AMBIL DATA DARI DATABASE & LOCAL STORAGE ===
  useEffect(() => {
    // Ambil data sesi User
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    
    if (userSession) {
        // Ambil Nama
        if (userSession.nama_depan) {
            setUserName(userSession.nama_depan);
        }
        
        // Ambil Alamat (jika ada)
        if (userSession.alamat && userSession.alamat !== "") {
            // Potong alamat jika terlalu panjang agar muat di UI
            const shortAddress = userSession.alamat.length > 25 
                ? userSession.alamat.substring(0, 25) + "..." 
                : userSession.alamat;
            setUserAddress(shortAddress);
        }
    }

    const fetchTukangs = async () => {
      try {
        const response = await fetch(`${API_URL}/tukang`);
        const result = await response.json();

        if (result.success) {
          const formattedData = result.data.map((t) => ({
            id: t.id,
            name: `${t.nama_depan} ${t.nama_belakang}`,
            role: Array.isArray(t.keahlian) ? t.keahlian.join(', ') : t.keahlian || 'Umum',
            dist: (Math.random() * 5).toFixed(1) + ' km', // Simulasi jarak
            price: '50.000',
            rating: (4.0 + Math.random()).toFixed(1), // Simulasi rating 4.0 - 5.0
            // Generate avatar lucu berdasarkan nama
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.email || t.nama_depan}`,
            isVerified: Math.random() > 0.5 // Simulasi badge verified
          }));
          setProviders(formattedData);
        }
      } catch (error) {
        console.error("Error:", error);
        // Data Dummy jika server mati
        setProviders([
           { id: 1, name: "Budi Santoso", role: "Ahli Listrik", dist: "1.2 km", price: "50.000", rating: "4.8", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi", isVerified: true },
           { id: 2, name: "Asep Teknik", role: "Service AC", dist: "2.5 km", price: "75.000", rating: "4.9", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Asep", isVerified: true },
           { id: 3, name: "Rian Cat", role: "Tukang Cat", dist: "0.8 km", price: "60.000", rating: "4.5", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rian", isVerified: false }
        ]);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchTukangs();
  }, []);

  const openDetail = (provider) => {
    setSelectedProvider(provider);
    setActiveView('detail');
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative md:flex font-sans text-slate-800 bg-slate-50">
      
      <Sidebar activeView={activeView} setView={setActiveView} />

      <main className="flex-1 min-h-screen relative overflow-x-hidden pb-28 md:pb-0">
        
        {/* === TAMPILAN 1: BERANDA === */}
        {activeView === 'home' && (
          <div className="animate-fade-in">
             
             {/* --- HEADER MODERN --- */}
            <div className="bg-white px-6 pt-8 pb-4 sticky top-0 z-30 shadow-sm md:static md:shadow-none">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-slate-400 text-xs font-medium mb-1">Lokasi Kamu</p>
                        <div 
                            onClick={() => navigate('/profil')} 
                            className="flex items-center gap-1 text-slate-800 font-bold cursor-pointer hover:text-blue-600 transition"
                        >
                            <span>📍 {userAddress}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                    </div>
                    <div className="relative cursor-pointer p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition">
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                    </div>
                </div>

                {/* Sapaan User */}
                <h1 className="text-2xl font-bold text-slate-800">
                    Halo, <span className="text-blue-600">{userName} 👋</span>
                </h1>
                <p className="text-slate-500 text-sm mt-1">Butuh bantuan apa hari ini?</p>
                
                {/* Search Bar Modern */}
                <div className="mt-6 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-focus-within:text-blue-500 transition"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Cari 'Tukang AC' atau 'Pipa Bocor'..." 
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition shadow-sm"
                    />
                </div>
            </div>

            <div className="px-6 pb-6">
                
                {/* --- PROMO CAROUSEL (Scrollable) --- */}
                <div className="mt-4 flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar snap-x">
                    {/* Banner 1 */}
                    <div className="snap-center shrink-0 w-[85%] md:w-[320px] h-40 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden shadow-lg shadow-blue-200 flex items-center p-6 text-white group cursor-pointer hover:scale-[1.02] transition">
                        <div className="relative z-10 w-2/3">
                            <span className="bg-white/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Promo</span>
                            <h3 className="font-bold text-xl leading-tight">Diskon 50% Jasa Pertama!</h3>
                            <button className="mt-3 bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">Klaim Sekarang</button>
                        </div>
                        <div className="absolute right-[-20px] bottom-[-20px] text-white/20 rotate-12">
                            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                        </div>
                    </div>
                    
                    {/* Banner 2 */}
                    <div className="snap-center shrink-0 w-[85%] md:w-[320px] h-40 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 relative overflow-hidden shadow-lg shadow-emerald-200 flex items-center p-6 text-white group cursor-pointer hover:scale-[1.02] transition">
                        <div className="relative z-10 w-2/3">
                            <span className="bg-white/20 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">Baru</span>
                            <h3 className="font-bold text-xl leading-tight">Garansi Servis 30 Hari</h3>
                            <p className="text-xs mt-1 text-white/90">Aman & Terpercaya</p>
                        </div>
                        <div className="absolute right-[-10px] bottom-[-10px] text-white/20 rotate-[-12deg]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </div>
                    </div>
                </div>

                {/* --- GRID KATEGORI --- */}
                <div className="flex justify-between items-center mb-4 mt-2">
                    <h2 className="font-bold text-slate-800 text-lg">Kategori Layanan</h2>
                    <button className="text-blue-600 text-xs font-bold">Lihat Semua</button>
                </div>
                
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <CategoryItem icon="⚡" color="bg-amber-100 text-amber-600" label="Listrik" onClick={() => navigate('/layanan/listrik')} />
                    <CategoryItem icon="💧" color="bg-blue-100 text-blue-600" label="Pipa" onClick={() => navigate('/layanan/pipa')} />
                    <CategoryItem icon="🔨" color="bg-purple-100 text-purple-600" label="Renov" onClick={() => navigate('/layanan/cat')} />
                    <CategoryItem icon="❄️" color="bg-cyan-100 text-cyan-600" label="AC" onClick={() => navigate('/layanan/ac')} />
                </div>

                {/* --- REKOMENDASI MITRA (LIST DATABASE) --- */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-slate-800 text-lg">Mitra Pilihan <span className="text-yellow-500 text-sm">★</span></h2>
                    <button onClick={() => setActiveView('category')} className="text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition">Semua</button>
                </div>

                {/* SKELETON LOADING (Efek Loading Keren) */}
                {loading ? (
                   <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4 animate-pulse">
                              <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                              <div className="flex-1 space-y-2 py-1">
                                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                              </div>
                          </div>
                      ))}
                   </div>
                ) : (
                    <div className="space-y-4">
                        {providers.map((item) => (
                            <div key={item.id} onClick={() => openDetail(item)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                {/* Avatar */}
                                <div className="relative">
                                    <img src={item.avatar} alt={item.name} className="w-16 h-16 rounded-2xl bg-slate-100 object-cover" />
                                    {item.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full border-2 border-white" title="Terverifikasi">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition">{item.name}</h3>
                                        <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">
                                            <span>📍</span> {item.dist}
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-xs mt-0.5">{item.role}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                            {item.rating}
                                        </div>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-blue-600 font-bold text-sm">Rp {item.price}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Space Bottom agar tidak tertutup nav */}
                <div className="h-6"></div>
            </div>
          </div>
        )}

        {/* === TAMPILAN 2: LIST SEMUA (Category View) === */}
        {activeView === 'category' && (
           <div className="p-5 md:p-10 animate-fade-in min-h-screen bg-slate-50">
              <div className="flex items-center mb-6 sticky top-0 bg-slate-50/90 backdrop-blur-md py-4 z-20">
                <button onClick={() => setActiveView('home')} className="mr-4 p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 shadow-sm transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h1 className="font-bold text-xl text-slate-800">Semua Mitra</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {providers.map((item) => (
                    <div key={item.id} onClick={() => openDetail(item)} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:border-blue-300 transition">
                         <img src={item.avatar} alt={item.name} className="w-14 h-14 rounded-xl bg-slate-100 object-cover" />
                        <div>
                            <h3 className="font-bold text-slate-800">{item.name}</h3>
                            <p className="text-slate-500 text-xs mb-1">{item.role}</p>
                            <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-bold">Rp {item.price}</span>
                        </div>
                    </div>
                  ))}
              </div>
           </div>
        )}

        {/* === TAMPILAN 3: DETAIL TUKANG === */}
        {activeView === 'detail' && selectedProvider && (
            <div className="animate-fade-in pb-32 bg-white min-h-screen">
                {/* Header Image */}
                <div className="relative h-64 bg-slate-800">
                     <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1581578731117-104f8a74695b?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                     <button onClick={() => setActiveView('category')} className="absolute top-6 left-6 p-3 bg-white/20 rounded-full text-white backdrop-blur-md hover:bg-white/30 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                     </button>
                </div>
                
                <div className="px-6 -mt-20 relative z-10">
                    <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-slate-200/50 text-center border border-slate-50">
                        <div className="relative inline-block">
                             <img src={selectedProvider.avatar} className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-md bg-white object-cover" alt="Profile"/>
                             {selectedProvider.isVerified && <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg></div>}
                        </div>
                        
                        <h2 className="mt-3 text-2xl font-bold text-slate-800">{selectedProvider.name}</h2>
                        <p className="text-slate-500 font-medium text-sm">{selectedProvider.role}</p>
                        
                        <div className="flex justify-center gap-2 mt-3">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">● Tersedia</span>
                            <span className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">2.4 km</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
                             <div className="text-center p-3 bg-slate-50 rounded-2xl">
                                <div className="font-black text-lg text-amber-500">4.8</div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Rating</p>
                             </div>
                             <div className="text-center p-3 bg-slate-50 rounded-2xl">
                                <div className="font-black text-lg text-blue-600">100+</div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Order</p>
                             </div>
                             <div className="text-center p-3 bg-slate-50 rounded-2xl">
                                <div className="font-black text-lg text-slate-700">5th</div>
                                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">Pengalaman</p>
                             </div>
                        </div>

                        <div className="text-left mb-8">
                            <h3 className="font-bold text-slate-800 mb-2">Tentang Mitra</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Profesional berpengalaman dalam bidang {selectedProvider.role}. Siap melayani perbaikan rumah dengan peralatan lengkap dan pengerjaan rapi bergaransi.
                            </p>
                        </div>

                        <button onClick={() => navigate('/pesanan')} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                            <span>Booking Jasa - Rp {selectedProvider.price}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        )}

      </main>

      <BottomNav setView={setActiveView} />
      
    </div>
  );
};

// Komponen Kecil untuk Kategori agar kode rapi
const CategoryItem = ({ icon, color, label, onClick }) => (
    <div onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
        <div className={`w-16 h-16 ${color} flex items-center justify-center rounded-[20px] shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 text-2xl border border-white`}>
            {icon}
        </div>
        <span className="text-xs font-bold text-slate-600 group-hover:text-blue-600 transition">{label}</span>
    </div>
);

export default Home;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// PERBAIKAN: Menambahkan 'Wrench' ke dalam import
import { Wallet, Star, MapPin, Clock, Wrench } from 'lucide-react';

const TukangBeranda = () => {
  const [user, setUser] = useState({ nama_depan: 'Mitra', nama_belakang: '' });
  
  useEffect(() => {
    // Ambil data user dari login, jika ada
    try {
        const session = JSON.parse(localStorage.getItem('user_session'));
        if (session) setUser(session);
    } catch (e) {
        console.error("Gagal load sesi", e);
    }
  }, []);

  return (
    <div className="pb-24 md:pb-0">
      {/* HEADER MOBILE */}
      <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:p-0 flex justify-between items-center sticky top-0 md:static z-30 border-b border-slate-100 md:border-none md:mb-6">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full p-0.5 border-2 border-blue-500">
                <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} 
                    alt="Profil" 
                    className="w-full h-full rounded-full bg-slate-200" 
                />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium">Selamat Bekerja,</p>
                <h2 className="text-lg font-bold text-slate-800 leading-tight">{user.nama_depan} {user.nama_belakang}</h2>
            </div>
        </div>
      </div>

      <div className="p-6 md:p-0 space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        
        {/* KARTU SALDO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-blue-100 text-xs font-medium mb-1">Pendapatan Bulan Ini</p>
                        <h1 className="text-3xl font-bold tracking-tight">Rp 4.500.000</h1>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <Wallet className="text-white" size={24} />
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] text-blue-100 mb-1">Total Order</p>
                        <p className="font-bold text-lg">24</p>
                    </div>
                    <div className="flex-1 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                        <p className="text-[10px] text-blue-100 mb-1">Rating</p>
                        <p className="font-bold text-lg flex items-center gap-1">
                            4.9 <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* PEKERJAAN AKTIF */}
        <div>
            <h3 className="font-bold text-slate-800 mb-3">Pekerjaan Aktif</h3>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative hover:shadow-md transition">
                <span className="absolute top-5 right-5 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                    Sedang Jalan
                </span>
                
                <div className="flex gap-4 mb-5">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100">
                        {/* DISINI YANG TADINYA ERROR */}
                        <Wrench size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-sm">Perbaikan Pipa Bocor</h4>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <MapPin size={12} /> Jl. Merpati No. 12B
                        </p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={12} /> 14:30 WIB
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">Detail</button>
                    <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 transition">Selesaikan</button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default TukangBeranda;
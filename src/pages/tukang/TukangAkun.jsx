import React from 'react';
import { ChevronRight } from 'lucide-react';

const TukangAkun = () => {
  const user = JSON.parse(localStorage.getItem('user_session')) || { nama_depan: 'Mitra', nama_belakang: 'HandyMan' };

  return (
    <div className="pb-24 md:pb-0">
       <div className="px-6 pt-8 pb-4 bg-white md:bg-transparent md:px-0">
          <h1 className="text-2xl font-bold text-slate-800">Akun Saya</h1>
       </div>

       <div className="p-4 md:p-0">
           <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-4">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nama_depan}`} className="w-16 h-16 rounded-full bg-white" alt="Profil"/>
                    <div>
                        <h2 className="font-bold text-lg text-slate-800">{user.nama_depan} {user.nama_belakang}</h2>
                        <p className="text-sm text-blue-600">Mitra Terverifikasi</p>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    <MenuItem label="Kelola Profil" />
                    <MenuItem label="Rekening Bank" />
                    <MenuItem label="Riwayat Saldo" />
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wide">Pengaturan</div>
                    <MenuItem label="Notifikasi" />
                    <MenuItem label="Bantuan" />
                </div>
           </div>
           
           <p className="text-center text-xs text-slate-400 mt-6">Versi Aplikasi 1.0.5</p>
       </div>
    </div>
  );
};

const MenuItem = ({ label }) => (
    <button className="w-full flex justify-between items-center p-4 hover:bg-slate-50 transition text-slate-700 text-sm font-medium text-left">
        {label}
        <ChevronRight size={16} className="text-slate-300"/>
    </button>
);

export default TukangAkun;
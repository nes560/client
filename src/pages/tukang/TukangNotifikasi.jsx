import React from 'react';
import { Bell, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';

const TukangNotifikasi = () => {
  // Data Dummy Notifikasi (Nanti bisa diganti API)
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Pembayaran Diterima',
      desc: 'Saldo sebesar Rp 150.000 dari Order #ORD-2024 telah masuk ke dompet Anda.',
      time: 'Baru saja'
    },
    {
      id: 2,
      type: 'info',
      title: 'Order Baru Masuk!',
      desc: 'Ada pelanggan di sekitar Malang Kota membutuhkan jasa perbaikan AC.',
      time: '10 menit lalu'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Verifikasi Akun',
      desc: 'Mohon lengkapi dokumen KTP Anda agar akun terverifikasi dan mendapat badge terpercaya.',
      time: '1 Jam lalu'
    },
    {
      id: 4,
      type: 'info',
      title: 'Tips Sukses',
      desc: 'Gunakan seragam rapi saat berkunjung ke pelanggan untuk meningkatkan rating bintang 5.',
      time: 'Kemarin'
    }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Notifikasi</h1>
            <p className="text-sm text-slate-500">Pemberitahuan terbaru untuk Anda</p>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 text-blue-600 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>
      </div>

      {/* List Notifikasi */}
      <div className="space-y-4">
        {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex gap-4 items-start group relative overflow-hidden">
                {/* Icon Indikator */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'success' ? 'bg-green-100 text-green-600' :
                    notif.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                    'bg-blue-100 text-blue-600'
                }`}>
                    {notif.type === 'success' ? <CheckCircle size={20} /> :
                     notif.type === 'warning' ? <AlertTriangle size={20} /> :
                     <Info size={20} />}
                </div>

                {/* Konten */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 mb-1">{notif.title}</h3>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{notif.time}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">{notif.desc}</p>
                </div>

                {/* Hapus Button (Hover only on desktop) */}
                <button className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={16} />
                </button>
            </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="text-sm text-slate-400 hover:text-blue-600 font-medium transition">
            Tandai semua sudah dibaca
        </button>
      </div>

    </div>
  );
};

export default TukangNotifikasi;
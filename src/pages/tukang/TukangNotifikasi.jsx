import React from 'react';

const TukangNotifikasi = () => {
  // Data Dummy
  const notifs = [
    { id: 1, title: 'Order Masuk', msg: 'Service AC di Melati Mas', time: 'Baru saja', read: false },
    { id: 2, title: 'Tips', msg: 'Jaga performa Anda agar rating naik.', time: '1 jam lalu', read: true },
  ];

  return (
    <div className="pb-24 md:pb-0">
        <div className="px-6 pt-6 pb-4 bg-white md:bg-transparent md:px-0 sticky top-0 z-20">
            <h1 className="text-2xl font-bold text-slate-800">Notifikasi</h1>
        </div>

        <div className="p-4 md:p-0 space-y-2">
            {notifs.map(n => (
                <div key={n.id} className={`p-4 rounded-xl border ${n.read ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-100'} cursor-pointer`}>
                    <div className="flex justify-between">
                        <h4 className="font-bold text-sm text-slate-800">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{n.msg}</p>
                </div>
            ))}
        </div>
    </div>
  );
};

export default TukangNotifikasi;
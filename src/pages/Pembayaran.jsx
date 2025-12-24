import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';
import { QrCode, ArrowLeft, CheckCircle, Info, Phone } from 'lucide-react';
// Import gambar QR DANA Anda
import qrisImage from '../assets/qris-dana.jpeg';

const Pembayaran = () => {
  const { id } = useParams(); // Ambil ID Pesanan dari URL
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrisData, setQrisData] = useState(null);

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    // 1. Ambil Data Pesanan berdasarkan ID
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/pesanan/${id}`);
        const result = await response.json();
        if (result.success) {
          setOrder(result.data);
        }
      } catch (error) {
        console.error("Gagal ambil pesanan:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Ambil Data Merchant (Nomor HP dll)
    const fetchQris = async () => {
      try {
        const response = await fetch(`${API_URL}/qris-settings`);
        const result = await response.json();
        if (result.success) setQrisData(result.data);
      } catch (error) {
        console.error("Gagal ambil QRIS setting:", error);
      }
    };

    fetchOrder();
    fetchQris();
  }, [id]);

  const handleConfirm = async () => {
    const isConfirmed = window.confirm("Apakah Anda yakin sudah melakukan transfer?");
    if (!isConfirmed) return;

    try {
      // Update status di database menjadi 'dibayar'
      const response = await fetch(`${API_URL}/pesanan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dibayar' })
      });
      
      const result = await response.json();
      if (result.success) {
        alert("✅ Pembayaran Berhasil Dikonfirmasi!");
        navigate('/pesanan'); // Kembali ke halaman riwayat pesanan
      }
    } catch (error) {
      alert("Gagal konfirmasi pembayaran.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat data pembayaran...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center">Pesanan tidak ditemukan.</div>;

  // Harga Default (Misal belum diset di DB, kita pakai 150rb)
  const totalHarga = order.harga || 150000;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* HEADER */}
        <div className="bg-blue-600 p-6 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Pembayaran QRIS</h1>
          <p className="text-blue-100 text-sm">Scan QR Code di bawah ini</p>
        </div>

        <div className="p-6">
          {/* INFO PESANAN */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">ID Pesanan</span>
              <span className="font-bold text-slate-800">#{order.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Layanan</span>
              <span className="font-bold text-slate-800">{order.kategori_jasa}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
              <span className="text-slate-800 font-bold">Total Tagihan</span>
              <span className="text-blue-600 font-bold text-lg">{formatRupiah(totalHarga)}</span>
            </div>
          </div>

          {/* QR CODE IMAGE (Fixed) */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-6 flex justify-center items-center relative flex-col">
            <img 
              src={qrisImage} 
              alt="Scan QRIS DANA" 
              className="w-56 h-auto object-contain hover:scale-105 transition duration-300" 
            />
            <div className="mt-2 text-center">
                <p className="text-xs font-bold text-slate-500">A.N. ASKAR MIN17</p>
                <p className="text-[10px] text-slate-400">Scan menggunakan DANA / GoPay / OVO</p>
            </div>
          </div>

          {/* INSTRUKSI */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-2">
               <Info className="w-4 h-4" /> Cara Pembayaran
            </h3>
            <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1">
                <li>Buka aplikasi GoPay/OVO/Dana/BCA</li>
                <li>Scan QR Code di atas</li>
                <li>Periksa nama merchant: <b>{qrisData?.merchant_name || 'HandyMan'}</b></li>
                <li>Masukkan nominal sesuai tagihan</li>
                <li>Klik tombol konfirmasi di bawah</li>
            </ol>
          </div>

          {/* TOMBOL AKSI */}
          <div className="space-y-3">
            <button 
                onClick={handleConfirm}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
                <CheckCircle className="w-5 h-5" /> Saya Sudah Membayar
            </button>
            <button 
                onClick={() => navigate('/beranda')}
                className="w-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
            >
                <ArrowLeft className="w-5 h-5" /> Bayar Nanti
            </button>
          </div>

          {/* FOOTER */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
             <p className="text-xs text-slate-400 flex justify-center items-center gap-1">
               <Phone className="w-3 h-3" /> Bantuan: {qrisData?.merchant_phone || '0812-3456-7890'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;
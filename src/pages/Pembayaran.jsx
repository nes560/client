import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, ArrowLeft, CheckCircle, Info, Phone } from 'lucide-react';

const Pembayaran = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. URL BACKEND (Hardcoded agar pasti jalan)
  const API_URL = "https://backend-sigma-nine-12.vercel.app/api";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data QRIS Manual (Pengganti fetchQris yang error)
  const qrisData = {
    merchant_name: "HandyMan Official",
    merchant_phone: "0812-3456-7890"
  };

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${API_URL}/pesanan/${id}`);
        // Cek apakah response valid
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("Respon bukan JSON");
        }
        
        const result = await response.json();
        
        if (result.success) {
          // Handle jika data berupa array atau object
          const data = Array.isArray(result.data) ? result.data[0] : result.data;
          setOrder(data);
        } else {
            // Jika pesanan tidak ditemukan di database
            alert("Pesanan tidak ditemukan.");
            navigate('/pesanan');
        }
      } catch (error) {
        console.error("Gagal ambil pesanan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleConfirm = async () => {
    const isConfirmed = window.confirm("Apakah Anda yakin sudah melakukan transfer?");
    if (!isConfirmed) return;

    try {
      // Update status menjadi 'Diproses' atau 'Menunggu Konfirmasi'
      const response = await fetch(`${API_URL}/pesanan/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Diproses' }) 
      });
      
      const result = await response.json();
      if (result.success) {
        alert("✅ Pembayaran Berhasil Dikonfirmasi! Tukang akan segera diproses.");
        navigate('/riwayat-pesanan'); 
      } else {
        alert("Gagal update status: " + result.message);
      }
    } catch (error) {
      alert("Gagal konfirmasi pembayaran. Cek koneksi internet.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Memuat data...</div>;
  if (!order) return <div className="min-h-screen flex items-center justify-center text-red-500">Data pesanan tidak ditemukan.</div>;

  // Harga Default (Misal belum diset di DB)
  const totalHarga = 50000; // Biaya Survey / Default

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

          {/* QR CODE IMAGE */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 mb-6 flex justify-center items-center relative flex-col">
            {/* Saya ganti pakai link online supaya tidak error saat dicopy. Bisa diganti import local nanti */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
              alt="Scan QRIS" 
              className="w-48 h-48 object-contain mix-blend-multiply" 
            />
            <div className="mt-4 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase">A.N. {qrisData.merchant_name}</p>
                <p className="text-[10px] text-slate-400">Scan menggunakan DANA / GoPay / OVO / BCA</p>
            </div>
          </div>

          {/* INSTRUKSI */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-blue-800 text-sm flex items-center gap-2 mb-2">
               <Info className="w-4 h-4" /> Cara Pembayaran
            </h3>
            <ol className="text-xs text-blue-700 list-decimal list-inside space-y-1">
                <li>Buka aplikasi E-Wallet atau M-Banking</li>
                <li>Scan QR Code di atas</li>
                <li>Periksa nama merchant: <b>{qrisData.merchant_name}</b></li>
                <li>Masukkan nominal <b>{formatRupiah(totalHarga)}</b></li>
                <li>Klik tombol konfirmasi di bawah setelah berhasil</li>
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
               <Phone className="w-3 h-3" /> Bantuan: {qrisData.merchant_phone}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;
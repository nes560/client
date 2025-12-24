import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BottomNav from '../components/BottomNav';
import { API_URL } from '../utils/api'; 

const Pesanan = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State Data Form
  const [formData, setFormData] = useState({
    kategori: 'Listrik',
    deskripsi: '',
    alamat: ''
  });

  // State Khusus File Foto
  const [fotoFile, setFotoFile] = useState(null);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    if (userSession) {
        setUserName(`${userSession.nama_depan} ${userSession.nama_belakang}`);
        if (userSession.alamat) {
            setFormData(prev => ({ ...prev, alamat: userSession.alamat }));
        }
    } else {
        alert("Silakan login terlebih dahulu!");
        navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle saat user memilih file
  const handleFileChange = (e) => {
      setFotoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // --- GUNAKAN FORMDATA UNTUK UPLOAD FILE ---
    const dataToSend = new FormData();
    dataToSend.append('nama_user', userName);
    dataToSend.append('kategori', formData.kategori);
    dataToSend.append('deskripsi', formData.deskripsi);
    dataToSend.append('alamat', formData.alamat);
    
    // Masukkan foto ke FormData jika ada
    if (fotoFile) {
        dataToSend.append('foto', fotoFile);
    }

    try {
      const response = await fetch(`${API_URL}/pesanan`, {
        method: 'POST',
        body: dataToSend
      });

      const result = await response.json();

      if (result.success) {
        // === PERBAIKAN DISINI ===
        // Redirect ke halaman pembayaran dengan membawa ID Pesanan
        navigate(`/pembayaran/${result.orderId}`);
      } else {
        alert("❌ Gagal: " + result.message);
      }
    } catch (error) {
      console.error("Error submit:", error);
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative md:flex font-sans text-slate-800 bg-slate-50">
      <Sidebar activeView="pesanan" />

      <main className="flex-1 min-h-screen relative overflow-x-hidden pb-24 md:pb-0 p-6 md:p-10">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">Buat Pesanan Baru</h1>
            <p className="text-slate-500 text-sm">Sertakan foto masalah agar tukang lebih paham.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Info User */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {userName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-xs text-blue-500 font-bold uppercase">Pemesan</p>
                        <p className="font-bold text-slate-700">{userName}</p>
                    </div>
                </div>

                {/* Kategori */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Jenis Layanan</label>
                    <select name="kategori" value={formData.kategori} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500">
                        <option value="Listrik">⚡ Teknisi Listrik</option>
                        <option value="Pipa & Air">💧 Pipa & Saluran Air</option>
                        <option value="Service AC">❄️ Service AC</option>
                        <option value="Renovasi">🔨 Renovasi & Cat</option>
                        <option value="Elektronik">📺 Service Elektronik</option>
                    </select>
                </div>

                {/* INPUT FOTO */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Foto Kerusakan</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 text-center hover:bg-blue-50 hover:border-blue-300 transition cursor-pointer relative">
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center justify-center gap-2">
                             {fotoFile ? (
                                <div className="text-green-600 font-bold flex items-center gap-2">
                                    <span>📷</span> {fotoFile.name}
                                </div>
                             ) : (
                                <>
                                    <span className="text-3xl text-slate-400">📷</span>
                                    <span className="text-sm text-slate-500 font-medium">Klik untuk upload foto (Jpg/Png)</span>
                                </>
                             )}
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Detail Masalah</label>
                    <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" placeholder="Jelaskan masalahnya..." className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" required></textarea>
                </div>

                {/* Alamat */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Alamat</label>
                    <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500" required />
                </div>

                <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:bg-slate-300 flex justify-center items-center gap-2">
                    {isLoading ? 'Mengirim...' : 'Pesan Jasa Sekarang'}
                </button>

            </form>
        </div>
      </main>
      <BottomNav setView={() => {}} />
    </div>
  );
};

export default Pesanan;
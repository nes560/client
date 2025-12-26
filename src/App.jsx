import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// === IMPORT HALAMAN USER (PELANGGAN) ===
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pesanan from './pages/Pesanan';
import RiwayatPesanan from './pages/RiwayatPesanan'; // ✅ Rute Baru untuk Review
import Chat from './pages/Chat';
import Profil from './pages/Profil';
import LandingPage from './pages/LandingPage';
import LayananDetail from './pages/LayananDetail';
import Pembayaran from './pages/Pembayaran';

// === IMPORT HALAMAN TUKANG (MITRA) ===
import TukangLayout from './components/TukangLayout';
import TukangBeranda from './pages/tukang/TukangBeranda';
import TukangOrderan from './pages/tukang/TukangOrderan';
import TukangAkun from './pages/tukang/TukangAkun';
import TukangNotifikasi from './pages/tukang/TukangNotifikasi';
import TukangChat from './pages/tukang/TukangChat'; 

// === IMPORT HALAMAN ADMIN ===
import AdminDashboard from './AdminDashboard'; 

function App() {
  return (
    <Router>
      {/* Notifikasi Global */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ========================================= */}
        {/* RUTE USER (PELANGGAN)                     */}
        {/* ========================================= */}
        
        {/* Halaman Depan & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Halaman Utama User */}
        <Route path="/beranda" element={<Home />} />
        
        {/* Fitur Utama User */}
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/riwayat-pesanan" element={<RiwayatPesanan />} /> {/* ✅ Halaman Riwayat & Review */}
        <Route path="/chat" element={<Chat />} />
        <Route path="/profil" element={<Profil />} />
        
        {/* Detail & Pembayaran */}
        <Route path="/layanan/:slug" element={<LayananDetail />} />
        <Route path="/pembayaran/:id" element={<Pembayaran />} />


        {/* ========================================= */}
        {/* RUTE TUKANG (MITRA)                       */}
        {/* ========================================= */}
        <Route path="/tukang" element={<TukangLayout />}>
            {/* Redirect default ke TukangBeranda (Tampilan Mobile) */}
            <Route index element={<TukangBeranda />} /> 
            
            <Route path="beranda" element={<TukangBeranda />} /> 
            
            <Route path="orderan" element={<TukangOrderan />} />
            <Route path="chat" element={<TukangChat />} />
            <Route path="akun" element={<TukangAkun />} />
            <Route path="notifikasi" element={<TukangNotifikasi />} />
        </Route>

        {/* ========================================= */}
        {/* RUTE ADMIN (PUSAT KONTROL)                */}
        {/* ========================================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
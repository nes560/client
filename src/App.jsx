import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// === IMPORT HALAMAN USER (PELANGGAN) ===
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Pesanan from './pages/Pesanan';
import RiwayatPesanan from './pages/RiwayatPesanan';
import Chat from './pages/Chat';
import Profil from './pages/Profil';
import LayananDetail from './pages/LayananDetail';
import Pembayaran from './pages/Pembayaran';

// === IMPORT HALAMAN TUKANG (MITRA) ===
// Pastikan file TukangLayout berada di folder yang benar (components atau layouts)
import TukangLayout from './components/TukangLayout'; 
import TukangBeranda from './pages/tukang/TukangBeranda';

// Pastikan Anda sudah membuat file-file dummy ini jika belum ada isinya,
// atau komentari dulu baris import ini agar tidak error.
import TukangOrderan from './pages/tukang/TukangOrderan';
import TukangAkun from './pages/tukang/TukangAkun';
import TukangNotifikasi from './pages/tukang/TukangNotifikasi';
import TukangChat from './pages/tukang/TukangChat'; 

// === IMPORT HALAMAN ADMIN ===
import AdminDashboard from './AdminDashboard'; 

function App() {
  return (
    <Router>
      {/* Notifikasi Toast Global */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        
        {/* ========================================= */}
        {/* 1. PUBLIC ROUTES (Tanpa Login/Umum)       */}
        {/* ========================================= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ========================================= */}
        {/* 2. RUTE USER (PELANGGAN)                  */}
        {/* ========================================= */}
        {/* Halaman ini berdiri sendiri karena sudah import Sidebar/BottomNav di dalamnya */}
        <Route path="/beranda" element={<Home />} />
        <Route path="/pesanan" element={<Pesanan />} />
        <Route path="/riwayat-pesanan" element={<RiwayatPesanan />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/layanan/:slug" element={<LayananDetail />} />
        <Route path="/pembayaran/:id" element={<Pembayaran />} />

        {/* ========================================= */}
        {/* 3. RUTE TUKANG (MITRA)                    */}
        {/* ========================================= */}
        {/* Semua halaman tukang dibungkus TukangLayout agar Sidebar-nya Konsisten */}
        <Route path="/tukang" element={<TukangLayout />}>
            
            {/* Jika buka /tukang, langsung ke Beranda */}
            <Route index element={<TukangBeranda />} />
            
            {/* Sub-menu Tukang */}
            <Route path="beranda" element={<TukangBeranda />} />
            <Route path="orderan" element={<TukangOrderan />} />
            <Route path="chat" element={<TukangChat />} />
            <Route path="akun" element={<TukangAkun />} />
            <Route path="notifikasi" element={<TukangNotifikasi />} />
        </Route>

        {/* ========================================= */}
        {/* 4. RUTE ADMIN (PUSAT KONTROL)             */}
        {/* ========================================= */}
        <Route path="/admin" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
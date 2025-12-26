import React from 'react';
import { Wrench, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Terima props 'variant' (defaultnya 'dark' untuk Landing Page)
const Footer = ({ variant = 'dark' }) => {
  
  // Tentukan warna berdasarkan variant
  const isLight = variant === 'light';

  // Konfigurasi Warna (Dinami)
  const styles = {
    bg: isLight ? 'bg-white border-t border-slate-100' : 'bg-slate-900',
    text: isLight ? 'text-slate-500' : 'text-slate-300',
    heading: isLight ? 'text-slate-800' : 'text-white',
    iconBg: isLight ? 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white' : 'bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white',
    linkHover: 'hover:text-blue-500 transition-colors'
  };

  return (
    <footer className={`${styles.bg} ${styles.text} pt-16 pb-8 font-sans transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* BAGIAN ATAS: Grid 4 Kolom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Kolom 1: Brand & Deskripsi */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${styles.heading}`}>
               <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                 <Wrench size={18} strokeWidth={2.5} />
               </div>
               <span className="text-xl font-bold tracking-tight">HandyMan.</span>
            </div>
            <p className={`text-sm ${styles.text} leading-relaxed`}>
              Solusi terpercaya untuk segala kebutuhan perbaikan rumah Anda. Cepat, aman, dan profesional.
            </p>
          </div>

          {/* Kolom 2: Link Cepat */}
          <div>
            <h3 className={`${styles.heading} font-bold mb-6`}>Perusahaan</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/tentang-kami" className={styles.linkHover}>Tentang Kami</Link></li>
              <li><Link to="/karir" className={styles.linkHover}>Karir</Link></li>
              <li><Link to="/blog" className={styles.linkHover}>Blog Berita</Link></li>
              <li><Link to="/mitra" className={styles.linkHover}>Gabung Jadi Mitra</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Layanan Popular */}
          <div>
            <h3 className={`${styles.heading} font-bold mb-6`}>Layanan</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className={styles.linkHover}>Perbaikan AC</a></li>
              <li><a href="#" className={styles.linkHover}>Kelistrikan</a></li>
              <li><a href="#" className={styles.linkHover}>Pipa & Saluran Air</a></li>
              <li><a href="#" className={styles.linkHover}>Renovasi Ringan</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak */}
          <div>
            <h3 className={`${styles.heading} font-bold mb-6`}>Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5" />
                <span>Jl. Kali Gunting No.70, Tanjungsari, Kota Blitar, Jawa Timur</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500" />
                <span>+62 858-1028-6087</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500" />
                <span>hpb30227@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* GARIS PEMBATAS */}
        <div className={`border-t ${isLight ? 'border-slate-100' : 'border-slate-800'} pt-8 flex flex-col md:flex-row justify-between items-center gap-4`}>
          
          {/* Copyright */}
          <p className="text-xs text-center md:text-left opacity-75">
            &copy; {new Date().getFullYear()} HandyMan App. Hak Cipta Dilindungi.
          </p>

          {/* Link Legal & Sosmed */}
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex gap-6 text-xs font-medium">
                <Link to="/syarat" className={styles.linkHover}>Syarat & Ketentuan</Link>
                <Link to="/privasi" className={styles.linkHover}>Kebijakan Privasi</Link>
             </div>

             <div className="flex gap-4">
                <a href="#" className={`p-2 rounded-full transition-all ${styles.iconBg}`}><Facebook size={16} /></a>
                <a href="#" className={`p-2 rounded-full transition-all ${styles.iconBg}`}><Instagram size={16} /></a>
                <a href="#" className={`p-2 rounded-full transition-all ${styles.iconBg}`}><Twitter size={16} /></a>
             </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';

const BottomNav = ({ setView }) => {
  return (
    <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm z-50">
      <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl flex justify-around py-4 px-2">
        <button onClick={() => setView('home')} className="flex flex-col items-center transition-all duration-300 text-blue-600 scale-110">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </button>
        <Link to="/pesanan" className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        </Link>
        <Link to="/chat" className="text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </Link>
        <Link to="/profil" className="text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
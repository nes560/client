import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Jika index.css kosong/dihapus, hapus baris ini juga

// ⚠️ PASTIKAN TULISANNYA 'root', BUKAN 'app' ATAU YANG LAIN
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
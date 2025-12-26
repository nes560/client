import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { postData } from '../utils/api'; // Pastikan path utility api benar

const ReviewModal = ({ orderId, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Mohon berikan bintang");
    
    setIsSubmitting(true);
    try {
      // Kirim ke Backend (Pastikan backend punya endpoint ini)
      const result = await postData(`/api/pesanan/${orderId}/review`, {
        rating,
        ulasan: review
      });

      if (result.success) {
        toast.success("Terima kasih atas ulasan Anda!");
        onSuccess(); // Refresh data di halaman induk
        onClose();   // Tutup modal
      } else {
        toast.error("Gagal mengirim ulasan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop Gelap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 animate-fade-in shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">Bagaimana Hasilnya?</h3>
          <p className="text-slate-500 text-sm">Beri nilai untuk kinerja Tukang</p>
        </div>

        {/* BINTANG INTERAKTIF */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(rating)}
            >
              <Star 
                size={32} 
                className={`${star <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'} transition-colors`} 
              />
            </button>
          ))}
        </div>

        {/* TEXT AREA ULASAN */}
        <textarea
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-slate-700"
          rows="3"
          placeholder="Tulis pengalaman Anda di sini (opsional)..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-slate-300"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
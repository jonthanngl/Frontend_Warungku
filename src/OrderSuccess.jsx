import React from 'react';
import { toast } from 'react-hot-toast';

const OrderSuccess = ({ transactionCode, onBackMenu }) => {

  const handleCopy = () => {
    if (transactionCode) {
      navigator.clipboard.writeText(transactionCode);
      toast.success('Kode berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-warung-secondary flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-premium max-w-lg w-full text-center border border-white">
        
        {/* Ikon Sukses dengan Animasi */}
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Pesanan Diterima!</h2>
        <p className="text-gray-500 mb-8">Terima kasih telah memesan. Dapur kami sedang menyiapkan hidangan lezatmu.</p>

        {/* AREA KODE TRANSAKSI (BISA DI-KLIK COPY) */}
        <div 
          onClick={handleCopy}
          className="group bg-gray-50 rounded-2xl p-6 mb-8 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all relative"
          title="Klik untuk menyalin kode"
        >
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2 group-hover:text-red-500 transition-colors">Kode Transaksi (Klik Salin)</p>
          
          <div className="flex items-center justify-center gap-3">
             <p className="text-4xl font-mono font-black text-gray-800 tracking-wider select-all group-hover:text-red-600 transition-colors">
                {transactionCode || 'W-XXXXX'}
             </p>
             {/* Ikon Copy */}
             <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow-md transition-all">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                 </svg>
             </div>
          </div>
          
          <p className="text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-bold">
            Salin ke Clipboard
          </p>
        </div>

        {/* TOMBOL KEMBALI YANG LEBIH MENARIK */}
        <button 
          onClick={onBackMenu}
          className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
        >
          <span>Kembali ke Menu Utama</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
        
        <p className="mt-6 text-xs text-gray-400">
            Simpan kode transaksimu untuk mengecek status pesanan.
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;

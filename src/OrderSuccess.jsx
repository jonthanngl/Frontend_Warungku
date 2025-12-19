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
        
        {/* Ikon Sukses */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-2">Pesanan Diterima!</h2>
        <p className="text-gray-500 mb-8">Terima kasih telah memesan. Dapur kami sedang menyiapkan hidangan lezatmu.</p>

        {/* AREA KODE TRANSAKSI (BISA DI-KLIK COPY) */}
        <div 
          onClick={handleCopy}
          className="group bg-gray-50 rounded-2xl p-6 mb-8 border border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 hover:border-warung-primary/50 transition relative"
          title="Klik untuk menyalin kode"
        >
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Kode Transaksi (Klik untuk Salin)</p>
          
          <div className="flex items-center justify-center gap-3">
             <p className="text-3xl font-mono font-black text-gray-800 tracking-wider select-all">
                {transactionCode || 'W-XXXXX'}
             </p>
             {/* Ikon Copy */}
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-warung-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
          </div>
          
          <p className="text-[10px] text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-warung-primary font-bold">
            Salin ke Clipboard
          </p>
        </div>

        <button 
          onClick={onBackMenu}
          className="text-warung-primary font-bold text-lg hover:underline transition-all"
        >
          Kembali ke Menu Utama &rarr;
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

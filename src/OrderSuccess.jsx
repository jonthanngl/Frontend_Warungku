import React from 'react';

const OrderSuccess = ({ transactionCode, onBackMenu }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center border-t-8 border-red-600">
        
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Pesanan Diterima!</h2>
        <p className="text-gray-500 mb-8">Terima kasih telah memesan. Dapur kami sedang menyiapkan hidangan lezatmu.</p>

        <div className="bg-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Kode Transaksi</p>
          <p className="text-3xl font-mono font-bold text-red-600 tracking-wider select-all">{transactionCode || 'W-XXXXX'}</p>
        </div>

        <button 
          onClick={onBackMenu}
          className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-red-700 transition-all transform hover:scale-[1.02]"
        >
          Kembali ke Menu Utama
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

import React, { useState } from 'react';

// MENERIMA PROP transactionCode DARI PARENT (MenuPage)
const OrderSuccess = ({ onBackToHome, transactionCode }) => {
  
  // HAPUS GENERATE KODE RANDOM DISINI
  
  // Hitung waktu batas bayar (1 jam dari sekarang)
  const deadline = new Date(new Date().getTime() + 60 * 60 * 1000).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Copy kode transaksi yang asli
    navigator.clipboard.writeText(transactionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="min-h-screen bg-warung-bg font-sans pb-10 animate-fade-in">
      
      {/* NAVBAR */}
      <nav className="bg-warung-navbar px-6 py-4 flex justify-between items-center shadow-warung">
        <div className="bg-white px-3 py-1 rounded shadow-sm">
           <h1 className="text-warung-navbar font-bold text-xl tracking-widest leading-none">WARUNGKU</h1>
        </div>
        <div className="flex items-center gap-2 text-white font-bold">
            <span>👋 Sampai Jumpa</span>
        </div>
      </nav>

      {/* HEADER HIJAU */}
      <div className="bg-warung-btn2 py-12 px-6 text-center text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 flex flex-col items-center">
            <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce-slow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-wide">Pesanan Diterima!</h2>
            <p className="opacity-90 mt-2">Terima kasih telah memesan di WarungKu</p>
        </div>
      </div>

      {/* KONTEN KARTU */}
      <main className="max-w-xl mx-auto px-6 -mt-8 relative z-20 space-y-6">
        
        {/* KARTU KODE TRANSAKSI */}
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-4 border-warung-btn2">
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">Kode Transaksi</p>
            
            <div className="flex justify-center items-center gap-3 mb-4">
                {/* TAMPILKAN KODE ASLI */}
                <span className="text-3xl font-bold text-warung-navbar tracking-widest">
                    {transactionCode || "ERROR-CODE"}
                </span>
                
                <button 
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-warung-btn2 transition relative group"
                    title="Salin Kode"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {copied && <span className="absolute -top-8 -left-4 bg-black text-white text-xs px-2 py-1 rounded">Disalin!</span>}
                </button>
            </div>

            <div className="inline-block bg-yellow-100 text-yellow-700 px-6 py-1.5 rounded-full text-sm font-bold border border-yellow-200">
                Menunggu Pembayaran
            </div>
        </div>

        {/* INFO LAINNYA */}
        <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex items-start gap-3 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p className="text-gray-800 font-bold text-sm">Batas Waktu Pembayaran</p>
                    <p className="text-orange-500 font-medium text-sm">Bayar sebelum <span className="font-bold">{deadline} WIB</span></p>
                </div>
            </div>

             <div className="border-t pt-4 mt-2">
                <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Instruksi:</p>
                <p className="text-sm text-gray-600">Silakan tunjukkan kode transaksi di atas kepada Kasir WarungKu untuk menyelesaikan pembayaran.</p>
             </div>
        </div>

        <button 
            onClick={onBackToHome}
            className="w-full bg-warung-btn2 hover:bg-green-800 text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] flex justify-center items-center gap-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Kembali ke Menu
        </button>

      </main>
    </div>
  );
};

export default OrderSuccess;
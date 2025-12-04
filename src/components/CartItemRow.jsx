import React from 'react';

// URL Backend
const API_URL = 'http://localhost:5000';

const CartItemRow = ({ item, onIncrease, onDecrease, onRemove }) => {
  
  // Fungsi Helper Pelengkap URL
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150';
    if (url.startsWith('http')) return url;
    return `${API_URL}${url}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-4 bg-white rounded-xl shadow-sm border border-gray-100">
      
      {/* Gambar & Detail Menu */}
      <div className="flex items-center gap-4 flex-1 w-full sm:w-auto mb-4 sm:mb-0">
        <img 
            // PAKAI HELPER DISINI:
            src={getImageUrl(item.image_url || item.image)} 
            alt={item.name} 
            className="w-20 h-20 object-cover rounded-lg shadow-sm" 
        />
        <div>
          <h4 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h4>
          <p className="text-warung-orange font-bold mt-1">
            Rp {parseInt(item.price).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Tombol Aksi (+, -, Hapus) */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6">
        
        <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
          <button onClick={() => onDecrease(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-l-lg transition font-bold">-</button>
          <span className="w-10 text-center font-bold text-gray-800">{item.qty}</span>
          <button onClick={() => onIncrease(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded-r-lg transition font-bold">+</button>
        </div>

        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-warung-btn1 transition p-2 hover:bg-red-50 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>

      </div>
    </div>
  );
};

export default CartItemRow;
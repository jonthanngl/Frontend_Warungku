import React from 'react';

// URL Backend (Supaya bisa akses folder /uploads)
const API_URL = 'http://localhost:5000';

const MenuCard = ({ item, onAddToCart }) => {
  // Logika URL Gambar:
  // 1. Jika gambar dari internet (https://...), pakai langsung.
  // 2. Jika gambar uploadan (/uploads/...), tambahkan http://localhost:5000 di depannya.
  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/150'; // Gambar cadangan kalau kosong
    if (url.startsWith('http')) return url; // Link eksternal (Unsplash dll)
    return `${API_URL}${url}`; // Link internal (Uploadan sendiri)
  };

  return (
    <div className="bg-warung-kolom rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      
      <div className="h-48 overflow-hidden relative">
        <img 
          // PERBAIKAN UTAMA DI SINI:
          src={getImageUrl(item.image_url || item.image)} 
          alt={item.name} 
          className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
        />
        
        {/* Badge Status */}
        <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white ${item.is_available ? 'bg-green-600' : 'bg-gray-500'}`}>
          {item.is_available ? 'Tersedia' : 'Habis'}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-warung-orange font-bold text-lg">
            Rp {parseInt(item.price).toLocaleString('id-ID')}
          </span>
          
          <button 
            disabled={!item.is_available} 
            onClick={() => onAddToCart(item)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-white font-medium transition ${
              item.is_available 
                ? 'bg-warung-btn1 hover:bg-warung-red-dark shadow-md active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {item.is_available ? 'Tambah' : 'Stok Habis'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
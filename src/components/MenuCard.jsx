import React from 'react';

const MenuCard = ({ item, onAddToCart }) => {
  // 👇 LINK BACKEND BACKEND VERCEL
  const API_URL = 'https://backend-warungku.vercel.app';

  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col h-full ${!item.is_available ? 'opacity-75 grayscale' : ''}`}>
      
      <div className="h-48 overflow-hidden relative group">
        <img 
          src={
              item.image_url && item.image_url.startsWith('http') 
              ? item.image_url 
              : `${API_URL}${item.image_url}`
          } 
          alt={item.name} 
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />
        {!item.is_available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-sm transform -rotate-12 border-2 border-white">HABIS</span>
            </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
            <div>
                <span className="text-xs font-bold text-warung-btn2 bg-green-50 px-2 py-1 rounded-md mb-2 inline-block">
                    {item.category}
                </span>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
            </div>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {item.description || "Menu lezat khas Warungku, dimasak dengan bumbu pilihan."}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="font-extrabold text-xl text-warung-navbar">
                Rp {parseInt(item.price).toLocaleString('id-ID')}
            </span>
            
            <button 
                onClick={() => onAddToCart(item)}
                disabled={!item.is_available}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition ${
                    item.is_available 
                    ? 'bg-warung-btn1 text-white hover:bg-red-700 hover:scale-110 active:scale-95' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

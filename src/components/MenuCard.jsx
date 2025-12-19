import React from 'react';

const MenuCard = ({ item, onAddToCart }) => {
  const API_URL = 'https://backend-warungku.vercel.app';

  return (
    <div className={`group relative bg-white rounded-[2rem] p-3 shadow-premium hover:shadow-card-hover transition-all duration-500 flex flex-col h-full ${!item.is_available ? 'opacity-70 grayscale' : ''}`}>
      
      {/* Container Gambar */}
      <div className="relative h-56 w-full overflow-hidden rounded-[1.5rem] mb-4">
        <img 
          src={item.image_url && item.image_url.startsWith('http') ? item.image_url : `${API_URL}${item.image_url}`} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badge Harga Melayang */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
          <span className="text-sm font-bold text-warung-primary">
            Rp {parseInt(item.price).toLocaleString('id-ID')}
          </span>
        </div>

        {!item.is_available && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-warung-danger px-6 py-2 rounded-full font-black tracking-widest text-xs uppercase shadow-xl">Habis</span>
          </div>
        )}
      </div>

      {/* Konten Teks */}
      <div className="px-3 pb-2 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-warung-accent bg-warung-accent/10 px-2 py-0.5 rounded-md">
            {item.category}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-warung-primary transition-colors">
          {item.name}
        </h3>
        
        <p className="mt-2 text-gray-500 text-xs line-clamp-2 italic leading-relaxed">
          {item.description || "Nikmati cita rasa otentik dari dapur kami."}
        </p>

        {/* Tombol Aksi */}
        <div className="mt-auto pt-5">
          <button 
            disabled={!item.is_available}
            onClick={() => onAddToCart(item)}
            className="w-full bg-warung-dark text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-warung-primary transition-all active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

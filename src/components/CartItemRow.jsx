import React from 'react';

const CartItemRow = ({ item, onIncrease, onDecrease, onRemove }) => {
  // 👇 LINK BACKEND BACKEND VERCEL
  const API_URL = 'https://backend-warungku.vercel.app'; 

  return (
    <div className="flex items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
      
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 border border-gray-200">
        <img 
            src={
                item.image_url && item.image_url.startsWith('http') 
                ? item.image_url 
                : `${API_URL}${item.image_url}`
            } 
            alt={item.name} 
            className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 ml-4">
        <h4 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{item.name}</h4>
        <p className="text-warung-btn1 font-bold mt-1">Rp {parseInt(item.price).toLocaleString('id-ID')}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
            <button 
                onClick={() => onDecrease(item.id)} 
                className="w-6 h-6 flex items-center justify-center bg-white text-warung-btn1 rounded hover:bg-red-50 font-bold shadow-sm"
            >
                -
            </button>
            <span className="font-bold text-gray-700 w-4 text-center text-sm">{item.qty}</span>
            <button 
                onClick={() => onIncrease(item.id)} 
                className="w-6 h-6 flex items-center justify-center bg-warung-btn2 text-white rounded hover:bg-green-700 font-bold shadow-sm"
            >
                +
            </button>
        </div>
        <button 
            onClick={() => onRemove(item.id)} 
            className="text-xs text-red-500 hover:text-red-700 underline font-medium"
        >
            Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;

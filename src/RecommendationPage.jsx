import React from 'react';

const RecommendationPage = ({ onSelectCategory, onSkip }) => {
  const suggestions = [
    { 
      id: 'segar', 
      title: 'Mau yang Seger-seger?', 
      desc: 'Cocok buat cuaca panas begini.', 
      icon: '🍹', 
      color: 'bg-blue-50 text-blue-600 border-blue-100' 
    },
    { 
      id: 'kenyang', 
      title: 'Butuh yang Kenyang?', 
      desc: 'Porsi mantap, rasa bintang lima.', 
      icon: '🍚', 
      color: 'bg-orange-50 text-orange-600 border-orange-100' 
    },
    { 
      id: 'nyemil', 
      title: 'Cuma Pengen Nyemil?', 
      desc: 'Teman setia buat santai atau kerja.', 
      icon: '🍿', 
      color: 'bg-purple-50 text-purple-600 border-purple-100' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <span className="text-[#8B4513] font-bold tracking-widest uppercase text-xs mb-3 block">Rekomendasi Pintar</span>
        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Bingung Mau Makan Apa?</h2>
        <p className="text-gray-500 mb-10">Biar kami bantu pilihkan yang paling pas buat kamu.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestions.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`p-6 rounded-[2rem] border-2 transition-all hover:scale-105 hover:shadow-xl text-left flex items-start gap-4 bg-white ${item.color}`}
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
                <p className="text-sm opacity-70 mt-1">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onSkip}
          className="mt-12 text-gray-400 font-bold hover:text-[#8B4513] transition-colors flex items-center gap-2 mx-auto"
        >
          Lihat semua menu saja <span>→</span>
        </button>
      </div>
    </div>
  );
};

export default RecommendationPage;

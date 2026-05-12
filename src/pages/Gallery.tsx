import React, { useState } from 'react';
import { Camera, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

const categories = ['Barchasi', 'Tadbirlar', 'Dars jarayoni', 'Yutuqlar', 'Sayohatlar'];

const galleryItems = [
  { id: 1, image: 'https://picsum.photos/seed/sch1/800/600', category: 'Tadbirlar', title: 'Maktab tadbiri' },
  { id: 2, image: 'https://picsum.photos/seed/sch2/800/600', category: 'Dars jarayoni', title: 'Kimyo darsi' },
  { id: 3, image: 'https://picsum.photos/seed/sch3/800/600', category: 'Yutuqlar', title: 'G\'oliblarimiz' },
  { id: 4, image: 'https://picsum.photos/seed/sch4/800/600', category: 'Sayohatlar', title: 'Tog\' sayohati' },
  { id: 5, image: 'https://picsum.photos/seed/sch5/800/600', category: 'Tadbirlar', title: 'Bayram tadbiri' },
  { id: 6, image: 'https://picsum.photos/seed/sch6/800/600', category: 'Dars jarayoni', title: 'Informatika darsi' },
  { id: 7, image: 'https://picsum.photos/seed/sch7/800/600', category: 'Yutuqlar', title: 'Sport yutuqlari' },
  { id: 8, image: 'https://picsum.photos/seed/sch8/800/600', category: 'Sayohatlar', title: 'Muzeyga tashrif' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  const filteredItems = activeCategory === 'Barchasi' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em]">Bizning hayotimiz</h2>
        <h1 className="text-4xl font-black text-gray-900 uppercase">Galereya</h1>
        <p className="text-gray-500 leading-relaxed">
          Maktabimiz hayotidan yorqin lavhalar va unutilmas lahzalar to'plami.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-all border",
              activeCategory === cat
                ? "bg-[#003366] text-white border-[#003366] shadow-lg shadow-blue-900/20"
                : "bg-white text-gray-400 border-gray-100 hover:text-[#003366] hover:border-[#003366]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-gray-100">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
              <Camera className="text-white w-8 h-8 mb-4 transform scale-75 group-hover:scale-100 transition-transform duration-500" />
              <h4 className="text-white font-black uppercase text-sm mb-1">{item.title}</h4>
              <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{item.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

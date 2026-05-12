import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  id: string;
  title: string;
  date: string;
  image: string;
  excerpt?: string;
}

export default function NewsCard({ id, title, date, image, excerpt }: NewsCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-0 left-0 bg-[#003366] text-white px-5 py-3 rounded-br-3xl flex flex-col items-center justify-center shadow-lg z-10 transition-transform group-hover:scale-110">
          <span className="text-lg font-black leading-none">{date.split('.')[0]}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-80">{date.split('.')[1]}</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#003366] transition-colors">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-50">
          <Link
            to={`/yangiliklar/${id}`}
            className="inline-flex items-center text-sm font-bold text-[#003366] hover:text-[#004a99] transition-colors group/link"
          >
            <span>Batafsil</span>
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

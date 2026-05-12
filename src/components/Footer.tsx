import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#002244] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
                <Shield className="text-[#002244] w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-black uppercase tracking-tight leading-none">
                  Ixtisoslashtirilgan
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-1 text-blue-300">
                  Maktab
                </span>
              </div>
            </Link>
            <p className="text-blue-100/60 text-sm leading-relaxed font-medium">
              Prezident ta'lim muassasalari agentligi tizimidagi ixtisoslashtirilgan maktab — zamonaviy ta'lim va yuksak ma'naviyat maskani.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-full transition-colors text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-full transition-colors text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-full transition-colors text-white">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-blue-900/50 hover:bg-blue-800 rounded-full transition-colors text-white">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-yellow-400">Tezkor havolalar</h3>
            <ul className="space-y-4">
              <li><Link to="/qabul" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Qabul jarayoni</Link></li>
              <li><Link to="/yangiliklar" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Yangiliklar</Link></li>
              <li><Link to="/budjet" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Budjet ochiqligi</Link></li>
              <li><Link to="/haqida" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Maktab haqida</Link></li>
            </ul>
          </div>

          {/* For Users */}
          <div>
             <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-yellow-400">Foydalanuvchilar uchun</h3>
             <ul className="space-y-4">
               <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm uppercase">Dars jadvali</a></li>
               <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm uppercase">Elektron kundalik</a></li>
               <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm uppercase">To'garaklar</a></li>
               <li><a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm uppercase">Bolalar uchun</a></li>
             </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-12 after:h-1 after:bg-yellow-400">Aloqa</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi, 123</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">+998 71 123-45-67</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-yellow-400 shrink-0" />
                <span className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors">info@maktab.uz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Ixtisoslashtirilgan Maktab. Barcha huquqlar himoyalangan.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-gray-300">Maxfiylik siyosati</a>
            <a href="#" className="hover:text-gray-300">Foydalanish shartlari</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

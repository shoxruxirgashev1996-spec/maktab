import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Settings, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const navItems = [
  { name: 'Bosh sahifa', path: '/' },
  { name: 'Maktab haqida', path: '/haqida' },
  { name: 'Qabul', path: '/qabul' },
  { name: 'Yangiliklar', path: '/yangiliklar' },
  { name: 'Budjet ochiqligi', path: '/budjet' },
  { name: 'Galereya', path: '/galereya' },
  { name: 'Aloqa', path: '/aloqa' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const isHome = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || isOpen || !isHome ? "bg-white shadow-xl py-4" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all shadow-lg",
              scrolled || isOpen || !isHome ? "bg-[#003366]" : "bg-white"
            )}>
              <Shield className={cn("w-6 h-6", scrolled || isOpen || !isHome ? "text-white" : "text-[#003366]")} />
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "text-base font-black uppercase tracking-tight leading-none",
                scrolled || isOpen || !isHome ? "text-gray-900" : "text-white"
              )}>
                Ixtisoslashtirilgan
              </span>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-[0.2em] leading-none mt-1",
                scrolled || isOpen || !isHome ? "text-[#003366]" : "text-blue-100"
              )}>
                Maktab
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all",
                  location.pathname === item.path
                    ? "bg-[#003366] text-white shadow-md"
                    : scrolled || !isHome
                      ? "text-gray-500 hover:text-[#003366] hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-gray-200 mx-2 hidden xl:block"></div>

            <Link
              to="/admin"
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center space-x-2",
                user 
                  ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                  : scrolled || !isHome
                    ? "text-[#003366] bg-gray-50 hover:bg-gray-100"
                    : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <Settings className="w-4 h-4" />
              <span>{user ? 'Panel' : 'Kirish'}</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              scrolled || isOpen || !isHome ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
            )}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-100 p-4 space-y-2 max-h-[90vh] overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "block px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                location.pathname === item.path
                  ? "bg-[#003366] text-white shadow-lg"
                  : "text-gray-500 hover:bg-gray-50 hover:text-[#003366]"
              )}
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center space-x-2 px-6 py-4 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-widest shadow-lg mt-4"
          >
            <Settings className="w-5 h-5" />
            <span>{user ? 'Admin Panel' : 'Tizimga kirish'}</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

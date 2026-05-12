import React, { useState } from 'react';
import { User, Shield, Briefcase, Award, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

const sections = [
  { id: 'leadership', name: 'Maktab rahbariyati', icon: Shield },
  { id: 'history', name: 'Maktab tarixi', icon: Briefcase },
  { id: 'achievements', name: 'Yutuqlarimiz', icon: Award },
  { id: 'structure', name: 'Tashkiliy tuzilma', icon: User },
];

const leaders = [
  {
    name: 'Abdullayev Jaloliddin Faxriddinovich',
    role: 'Maktab direktori',
    image: 'https://picsum.photos/seed/director/400/500',
    bio: 'Ko\'p yillik tajribaga ega pedagog, fizika-matematika fanlari nomzodi. Maktabimiz rivojiga ulkan hissa qo\'shib kelmoqda.',
    type: 'main'
  },
  {
    name: 'Karimova Malika Ahmadjonovna',
    role: 'O\'quv ishlari bo\'yicha direktor o\'rinbosari',
    image: 'https://picsum.photos/seed/deputy1/300/400',
    type: 'deputy'
  },
  {
    name: 'Sultonov Bekzod Rustamovich',
    role: 'Ma\'naviy-ma\'rifiy ishlar bo\'yicha o\'rinbosar',
    image: 'https://picsum.photos/seed/deputy2/300/400',
    type: 'deputy'
  },
  {
    name: 'Xidirov Alisher O\'ktamovich',
    role: 'Moliya va xo\'jalik ishlari bo\'yicha o\'rinbosar',
    image: 'https://picsum.photos/seed/deputy3/300/400',
    type: 'deputy'
  }
];

export default function About() {
  const [activeSection, setActiveSection] = useState('leadership');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="sticky top-24 space-y-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all",
                  activeSection === s.id
                    ? "bg-[#003366] text-white shadow-lg shadow-blue-900/20"
                    : "bg-white text-gray-500 hover:bg-gray-50 hover:text-[#003366]"
                )}
              >
                <div className="flex items-center space-x-3">
                  <s.icon className="w-5 h-5" />
                  <span>{s.name}</span>
                </div>
                <ChevronRight className={cn("w-4 h-4 transition-transform", activeSection === s.id ? "rotate-90" : "")} />
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-grow space-y-12">
          {activeSection === 'leadership' && (
            <div className="space-y-12">
              <header>
                <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em] mb-2">Bizning jamoa</h2>
                <h1 className="text-4xl font-black text-gray-900 uppercase">Maktab rahbariyati</h1>
              </header>

              {/* Main Director */}
              {leaders.filter(l => l.type === 'main').map((l, i) => (
                <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row items-stretch group hover:shadow-xl transition-shadow duration-500">
                  <div className="w-full md:w-2/5 aspect-[4/5]">
                    <img src={l.image} alt={l.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 uppercase leading-tight mb-2">{l.name}</h3>
                      <p className="text-blue-600 font-bold uppercase text-xs tracking-[0.15em]">{l.role}</p>
                    </div>
                    <p className="text-gray-500 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2">
                      "{l.bio}"
                    </p>
                    <div className="pt-4 flex gap-4">
                       <div className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-blue-600 transition-colors pointer-events-none uppercase text-[10px] font-bold">Qabul kunlari: Dushanba-Juma</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Deputies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {leaders.filter(l => l.type === 'deputy').map((l, i) => (
                  <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-500">
                    <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src={l.image} alt={l.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-6 text-center space-y-2">
                      <h4 className="font-black text-gray-900 uppercase text-sm leading-tight group-hover:text-[#003366] transition-colors">{l.name}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">{l.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection !== 'leadership' && (
            <div className="bg-gray-50 rounded-3xl p-12 text-center">
               <h3 className="text-xl font-bold text-gray-400 uppercase">Sahifa tayyorlanmoqda</h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

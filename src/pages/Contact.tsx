import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Camera, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const gallery = [
  'https://picsum.photos/seed/g1/400/300',
  'https://picsum.photos/seed/g2/400/300',
  'https://picsum.photos/seed/g3/400/300',
  'https://picsum.photos/seed/g4/400/300',
  'https://picsum.photos/seed/g5/400/300',
  'https://picsum.photos/seed/g6/400/300',
  'https://picsum.photos/seed/g7/400/300',
  'https://picsum.photos/seed/g8/400/300',
];

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const path = 'contact_messages';
    try {
      await addDoc(collection(db, path), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      {/* Header */}
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em]">Savollaringiz bormi?</h2>
        <h1 className="text-4xl font-black text-gray-900 uppercase">Biz bilan aloqa</h1>
        <p className="text-gray-500 leading-relaxed">
          Sizni qiziqtirgan barcha savollarga javob berishdan mamnunmiz. Quyidagi forma yoki kontaktlar orqali bizga bog'laning.
        </p>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-[40px] shadow-2xl p-8 md:p-12 overflow-hidden border border-gray-100">
        <div className="space-y-12">
           <div className="space-y-8">
             <h3 className="text-2xl font-black text-[#003366] uppercase">Aloqa ma'lumotlari</h3>
             <div className="space-y-6">
                <div className="flex items-start space-x-4">
                   <div className="p-3 bg-blue-50 text-[#003366] rounded-xl shrink-0">
                      <MapPin className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 mb-1">Manzil</h4>
                      <p className="text-sm text-gray-500">Toshkent shahri, Yunusobod tumani, Amir Temur ko'chasi, 123</p>
                   </div>
                </div>
                <div className="flex items-start space-x-4">
                   <div className="p-3 bg-blue-50 text-[#003366] rounded-xl shrink-0">
                      <Phone className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 mb-1">Telefon</h4>
                      <p className="text-sm text-gray-500">+998 71 123-45-67</p>
                   </div>
                </div>
                <div className="flex items-start space-x-4">
                   <div className="p-3 bg-blue-50 text-[#003366] rounded-xl shrink-0">
                      <Mail className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                      <p className="text-sm text-gray-500">info@maktab.uz</p>
                   </div>
                </div>
                <div className="flex items-start space-x-4">
                   <div className="p-3 bg-blue-50 text-[#003366] rounded-xl shrink-0">
                      <Clock className="w-6 h-6" />
                   </div>
                   <div>
                      <h4 className="font-bold text-gray-900 mb-1">Ish vaqti</h4>
                      <p className="text-sm text-gray-500">Dushanba - Juma: 08:00 – 17:00<br />Shanba: 08:00 – 13:00</p>
                   </div>
                </div>
             </div>
           </div>

           {/* Placeholder Map */}
           <div className="relative rounded-3xl overflow-hidden aspect-video border border-gray-100 shadow-sm">
              <img
                src="https://picsum.photos/seed/placeholder-map/800/450"
                alt="Map Placeholder"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-900/10 flex items-center justify-center p-8 text-center">
                 <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-[#003366]/20 max-w-xs">
                    <MapPin className="w-8 h-8 text-[#003366] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#003366] uppercase">Maktabimiz shu yerda joylashgan</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-8 md:p-12 rounded-[32px] border border-gray-100">
           <h3 className="text-2xl font-black text-[#003366] uppercase mb-10">Xabar yuborish</h3>
           {submitted ? (
             <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                   <CheckCircle className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-black text-gray-900 uppercase">Xabaringiz yuborildi!</h4>
                <p className="text-gray-500">Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
             </div>
           ) : (
             <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Ism</label>
                   <input
                     type="text"
                     required
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                     placeholder="Ismingizni kiriting"
                     className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                   <input
                     type="email"
                     required
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                     placeholder="Email manzilingiz"
                     className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all text-sm"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-500 uppercase">Xabar</label>
                   <textarea
                     rows={5}
                     required
                     value={formData.message}
                     onChange={(e) => setFormData({...formData, message: e.target.value})}
                     placeholder="Xabaringizni yozing..."
                     className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 transition-all text-sm resize-none"
                   ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-[#003366] hover:bg-[#004a99] text-white rounded-2xl font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center group disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Yuborish <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                  )}
                </button>
             </form>
           )}
        </div>
      </div>

      {/* Gallery Section */}
      <section className="space-y-12">
        <header className="flex justify-between items-end">
           <div>
              <h2 className="text-xs font-bold text-[#003366] uppercase tracking-[0.2em] mb-2">Maktabimiz fotolavhalari</h2>
              <h1 className="text-4xl font-black text-gray-900 uppercase">Galereya</h1>
           </div>
           <div className="flex space-x-2">
              {['Barchasi', 'Tadbirlar', 'Dars jarayoni', 'Yutuqlar', 'Sayohatlar'].map((cat, i) => (
                <button
                  key={cat}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                    i === 0 ? "bg-[#003366] text-white shadow-md" : "bg-white border border-gray-100 text-gray-400 hover:text-[#003366] hover:border-[#003366]"
                  )}
                >
                  {cat}
                </button>
              ))}
           </div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {gallery.map((img, i) => (
             <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <img
                  src={img}
                  alt={`Gallery item ${i+1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                   <Camera className="text-white w-8 h-8 transform scale-75 group-hover:scale-100 transition-transform duration-500" />
                </div>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Newspaper, Bell, FileText, Settings, LogOut, Users, MessageSquare, TrendingUp, Calendar as CalendarIcon, Loader2, LogIn } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';
import { auth, db, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

const chartData = [
  { name: '14 May', users: 400 },
  { name: '15 May', users: 700 },
  { name: '16 May', users: 600 },
  { name: '17 May', users: 800 },
  { name: '18 May', users: 600 },
  { name: '19 May', users: 900 },
  { name: '20 May', users: 1100 },
];

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Yangiliklar', value: '...', icon: Newspaper, color: 'blue' },
    { label: 'Qabul arizalari', value: '...', icon: FileText, color: 'indigo' },
    { label: 'E\'lonlar', value: '...', icon: Bell, color: 'yellow' },
    { label: 'Foydalanuvchilar', value: '...', icon: Users, color: 'green' },
  ]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
      if (currUser) {
        fetchAdminData();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Mock stats for now but could be real counts
      const newsSnap = await getDocs(collection(db, 'news'));
      const admissionsSnap = await getDocs(collection(db, 'admissions'));
      
      setStats([
        { label: 'Yangiliklar', value: newsSnap.size.toString(), icon: Newspaper, color: 'blue' },
        { label: 'Qabul arizalari', value: admissionsSnap.size.toString(), icon: FileText, color: 'indigo' },
        { label: 'E\'lonlar', value: '8', icon: Bell, color: 'yellow' },
        { label: 'Foydalanuvchilar', value: '12', icon: Users, color: 'green' },
      ]);

      const messagesSnap = await getDocs(query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'), limit(5)));
      setRecentActivities(messagesSnap.docs.map(doc => ({
        title: `Yangi xabar: ${doc.data().name}`,
        time: doc.data().createdAt?.toDate().toLocaleString() || 'Yaqinda',
        icon: MessageSquare
      })));
    } catch (e) {
      console.error("Admin data error:", e);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-[#003366]" /></div>;

  if (!user) {
    return (
      <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center p-8 space-y-8 bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center text-[#003366] mx-auto shadow-sm">
            <LayoutDashboard className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 uppercase">Admin Panel</h1>
          <p className="text-gray-500">Tizimga faqat vakolatli foydalanuvchilar kirishi mumkin.</p>
        </div>
        <button
          onClick={handleLogin}
          className="flex items-center space-x-3 px-8 py-4 bg-[#003366] text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-[#004a99] transition-all shadow-xl hover:shadow-blue-900/30 group"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Google orqali kirish</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-80px)] -mx-4 sm:-mx-6 lg:-mx-8">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#001529] text-gray-400 hidden lg:flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3 text-white">
            <Settings className="w-6 h-6" />
            <span className="font-black uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
        <nav className="flex-grow p-4 space-y-1">
          {[
            { name: 'Boshqaruv paneli', icon: LayoutDashboard, active: true },
            { name: 'Yangiliklar', icon: Newspaper },
            { name: 'E\'lonlar', icon: Bell },
            { name: 'Qabul arizalari', icon: FileText },
            { name: 'Natijalar', icon: CalendarIcon },
            { name: 'Budjet ochiqligi', icon: TrendingUp },
            { name: 'Galereya', icon: Newspaper },
            { name: 'Hujjatlar', icon: FileText },
            { name: 'Foydalanuvchilar', icon: Users },
            { name: 'Sozlamalar', icon: Settings },
          ].map((item) => (
            <button
               key={item.name}
               className={cn(
                 "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                 item.active ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "hover:bg-gray-800 hover:text-white"
               )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-grow p-8 space-y-8 h-full overflow-y-auto">
        <header className="flex justify-between items-center">
           <h2 className="text-2xl font-black text-gray-900 uppercase">Boshqaruv paneli</h2>
           <div className="flex items-center space-x-4">
              <div className="relative">
                 <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">3</span>
              </div>
              <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                 <div className="text-right">
                    <p className="text-xs font-black text-gray-900 uppercase">{user.displayName || 'Admin'}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Administrator</p>
                 </div>
                 <img src={user.photoURL || ''} className="w-10 h-10 rounded-full border border-gray-200" alt="Avatar" referrerPolicy="no-referrer" />
              </div>
           </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                <div>
                   <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">{stat.label}</p>
                   <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                </div>
                <div className={cn("p-4 rounded-2xl", `bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`)}>
                   <stat.icon className="w-8 h-8" />
                </div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
           {/* Chart */}
           <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg font-black text-[#003366] uppercase">Sayt statistikasi (Oxirgi 7 kun)</h3>
                 <select className="bg-gray-50 border border-gray-200 text-[10px] font-bold uppercase px-3 py-1 rounded-lg">
                    <option>7 Kunlik</option>
                    <option>30 Kunlik</option>
                 </select>
              </div>
              <div className="h-80 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
                     <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                     <Line type="monotone" dataKey="users" stroke="#003366" strokeWidth={4} dot={{ strokeWidth: 4, r: 4, fill: '#fff' }} activeDot={{ r: 8 }} />
                   </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Activities */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-lg font-black text-[#003366] uppercase">So'nggi faoliyatlar</h3>
              <div className="space-y-6">
                 {recentActivities.length > 0 ? recentActivities.map((act, i) => (
                   <div key={i} className="flex items-start space-x-4 group">
                      <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
                         <act.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-grow pt-1">
                         <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{act.title}</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{act.time}</p>
                      </div>
                   </div>
                 )) : (
                   <div className="text-gray-400 text-center py-8">Hozircha faoliyatlar yo'q</div>
                 )}
              </div>
              <button className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-[#003366] text-xs font-black uppercase tracking-widest rounded-xl transition-all">Barcha faoliyatlar</button>
           </div>
        </div>
      </main>
    </div>
  );
}

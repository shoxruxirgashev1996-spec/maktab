import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import News from './pages/News';
import BudgetOchiqligi from './pages/BudgetOchiqligi';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/haqida" element={<About />} />
            <Route path="/qabul" element={<Admission />} />
            <Route path="/yangiliklar" element={<News />} />
            <Route path="/budjet" element={<BudgetOchiqligi />} />
            <Route path="/galereya" element={<Gallery />} />
            <Route path="/aloqa" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

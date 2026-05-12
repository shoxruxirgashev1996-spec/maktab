import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import News from './pages/News';
import BudgetOchiqligi from './pages/BudgetOchiqligi';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

// Admin Pages
import Admin from './pages/Admin';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/haqida" element={<About />} />
          <Route path="/qabul" element={<Admission />} />
          <Route path="/yangiliklar" element={<News />} />
          <Route path="/budjet" element={<BudgetOchiqligi />} />
          <Route path="/galereya" element={<Gallery />} />
          <Route path="/aloqa" element={<Contact />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Admin />} />
          {/* Add more protected admin routes here as needed */}

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

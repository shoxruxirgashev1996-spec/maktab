import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, admin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          School
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/haqida" className="hover:text-blue-600 transition">
            About
          </Link>
          <Link to="/qabul" className="hover:text-blue-600 transition">
            Admission
          </Link>
          <Link to="/yangiliklar" className="hover:text-blue-600 transition">
            News
          </Link>
          <Link to="/galereya" className="hover:text-blue-600 transition">
            Gallery
          </Link>
          <Link to="/budjet" className="hover:text-blue-600 transition">
            Budget
          </Link>
          <Link to="/aloqa" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </div>

        <div>
          <Link
            to="/admin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {isAuthenticated && admin ? `${admin.name}` : 'Admin'}
          </Link>
        </div>
      </div>
    </nav>
  );
}

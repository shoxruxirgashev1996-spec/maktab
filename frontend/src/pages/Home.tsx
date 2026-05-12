import { useEffect, useState } from 'react';
import apiService from '../services/api';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await apiService.getBanners();
        setBanners(response.data || []);
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return (
    <div className="space-y-8">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome</h1>
          <p className="text-xl">Welcome to our institution</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Latest News</h2>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Add news cards here */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-2">Sample News</h3>
              <p className="text-gray-600">News content will be displayed here</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

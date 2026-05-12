export default function News() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">News</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="font-bold mb-2">Sample News Title</h3>
            <p className="text-gray-600 text-sm mb-4">News content will be displayed here</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
              Read more →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

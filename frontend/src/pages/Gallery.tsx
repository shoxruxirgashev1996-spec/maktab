export default function Gallery() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Gallery</h1>
      <div className="grid md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg hover:opacity-80 transition cursor-pointer"></div>
        ))}
      </div>
    </div>
  );
}

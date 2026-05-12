export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" className="w-full border border-gray-300 rounded px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" className="w-full border border-gray-300 rounded px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea className="w-full border border-gray-300 rounded px-4 py-2 h-32"></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

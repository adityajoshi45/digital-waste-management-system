import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../services/api";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

const categories = [
  { id: 1, name: "Mobile & Tablets" },
  { id: 2, name: "Laptops & Computers" },
  { id: 3, name: "TVs & Monitors" },
  { id: 4, name: "Printers & Peripherals" },
  { id: 5, name: "Batteries & Cables" },
  { id: 6, name: "Home Appliances" },
];

const CreateListing = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    brand: "",
    model: "",
    condition_type: "working",
    quantity: 1,
    estimated_weight: "",
    estimated_price: "",
    city: "",
    pincode: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));
      await createListing(fd);
      toast.success("Listing created!");
      navigate("/customer");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          List Your E-Waste
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className={inputClass}
              placeholder="e.g. Old iPhone 12 for recycling"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={inputClass}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <select
                required
                value={form.condition_type}
                onChange={(e) => set("condition_type", e.target.value)}
                className={inputClass}
              >
                <option value="working">Working</option>
                <option value="partially_working">Partially Working</option>
                <option value="not_working">Not Working</option>
                <option value="broken">Broken</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                className={inputClass}
                placeholder="Apple, Samsung..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                className={inputClass}
                placeholder="iPhone 12..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={form.estimated_weight}
                onChange={(e) => set("estimated_weight", e.target.value)}
                className={inputClass}
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Est. Price (₹)
              </label>
              <input
                type="number"
                value={form.estimated_price}
                onChange={(e) => set("estimated_price", e.target.value)}
                className={inputClass}
                placeholder="500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className={inputClass}
              placeholder="Describe the condition, any issues..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                required
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                required
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-green-400 transition-colors">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Click to upload images (max 5)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  setImages(Array.from(e.target.files).slice(0, 5))
                }
              />
            </label>
            {images.length > 0 && (
              <p className="text-sm text-green-600 mt-2">
                {images.length} image(s) selected
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyListings, getWallet, getImpact } from "../../services/api";
import Navbar from "../../components/common/Navbar";
import StatCard from "../../components/common/StatCard";
import { PackageOpen, Wallet, Leaf, Plus } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  active: "bg-blue-100 text-blue-700",
  bidding: "bg-yellow-100 text-yellow-700",
  accepted: "bg-purple-100 text-purple-700",
  picked_up: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const CustomerDashboard = () => {
  const [listings, setListings] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [impact, setImpact] = useState({
    total_weight: 0,
    co2_saved: 0,
    items_count: 0,
  });

  useEffect(() => {
    Promise.all([getMyListings(), getWallet(), getImpact()])
      .then(([l, w, i]) => {
        setListings(l.data.data);
        setWallet(w.data.data);
        setImpact(i.data.data);
      })
      .catch(() => toast.error("Failed to load data"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <Link
            to="/customer/list-item"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} /> List E-Waste
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Wallet Balance"
            value={`₹${wallet.balance}`}
            icon={<Wallet size={20} />}
            color="green"
          />
          <StatCard
            title="Items Listed"
            value={listings.length}
            icon={<PackageOpen size={20} />}
            color="blue"
          />
          <StatCard
            title="Weight Recycled"
            value={`${impact.total_weight} kg`}
            icon={<Leaf size={20} />}
            color="yellow"
          />
          <StatCard
            title="CO₂ Saved"
            value={`${impact.co2_saved} kg`}
            icon={<Leaf size={20} />}
            color="purple"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">My Listings</h2>
          </div>
          {listings.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <PackageOpen size={48} className="mx-auto mb-3 opacity-40" />
              <p>
                No listings yet.{" "}
                <Link to="/customer/list-item" className="text-green-600">
                  Create one!
                </Link>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{l.title}</p>
                    <p className="text-sm text-gray-500">
                      {l.category_name} · {l.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {l.offer_count} offers
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

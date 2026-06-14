import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllListings, getMyOffers, getMyPickups } from "../../services/api";
import Navbar from "../../components/common/Navbar";
import StatCard from "../../components/common/StatCard";
import { PackageSearch, Truck, Star, ClipboardList } from "lucide-react";
import toast from "react-hot-toast";

const CompanyDashboard = () => {
  const [listings, setListings] = useState([]);
  const [offers, setOffers] = useState([]);
  const [pickups, setPickups] = useState([]);

  useEffect(() => {
    Promise.all([getAllListings(), getMyOffers(), getMyPickups()])
      .then(([l, o, p]) => {
        setListings(l.data.data);
        setOffers(o.data.data);
        setPickups(p.data.data);
      })
      .catch(() => toast.error("Failed to load data"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Company Dashboard
          </h1>
          <Link
            to="/company/browse"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <PackageSearch size={16} /> Browse Listings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Available Listings"
            value={listings.length}
            icon={<PackageSearch size={20} />}
            color="blue"
          />
          <StatCard
            title="My Offers"
            value={offers.length}
            icon={<ClipboardList size={20} />}
            color="yellow"
          />
          <StatCard
            title="Total Pickups"
            value={pickups.length}
            icon={<Truck size={20} />}
            color="purple"
          />
          <StatCard
            title="Completed"
            value={pickups.filter((p) => p.status === "completed").length}
            icon={<Star size={20} />}
            color="green"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Recent Listings</h2>
              <Link
                to="/company/browse"
                className="text-green-600 text-sm hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {listings.slice(0, 6).map((l) => (
                <div
                  key={l.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {l.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {l.category_name} · {l.city}
                    </p>
                  </div>
                  <Link
                    to={`/company/listings/${l.id}`}
                    className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100"
                  >
                    Make Offer
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">My Offers</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {offers.slice(0, 6).map((o) => (
                <div
                  key={o.id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {o.listing_title}
                    </p>
                    <p className="text-xs text-gray-500">₹{o.amount}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize
                    ${
                      o.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : o.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

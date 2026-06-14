import { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getPendingCompanies,
  verifyCompany,
} from "../../services/api";
import Navbar from "../../components/common/Navbar";
import StatCard from "../../components/common/StatCard";
import {
  Users,
  Building2,
  PackageOpen,
  Truck,
  IndianRupee,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [companies, setCompanies] = useState([]);

  const load = () => {
    Promise.all([getAdminDashboard(), getPendingCompanies()])
      .then(([s, c]) => {
        setStats(s.data.data);
        setCompanies(c.data.data);
      })
      .catch(() => toast.error("Failed to load"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleVerify = async (id) => {
    try {
      await verifyCompany(id);
      toast.success("Company verified!");
      load();
    } catch {
      toast.error("Failed to verify");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="Customers"
            value={stats.total_users || 0}
            icon={<Users size={20} />}
            color="blue"
          />
          <StatCard
            title="Companies"
            value={stats.total_companies || 0}
            icon={<Building2 size={20} />}
            color="purple"
          />
          <StatCard
            title="Listings"
            value={stats.total_listings || 0}
            icon={<PackageOpen size={20} />}
            color="yellow"
          />
          <StatCard
            title="Pickups"
            value={stats.total_pickups || 0}
            icon={<Truck size={20} />}
            color="green"
          />
          <StatCard
            title="Total Paid"
            value={`₹${stats.total_paid || 0}`}
            icon={<IndianRupee size={20} />}
            color="red"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">
              Pending Verifications
              {companies.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                  {companies.length}
                </span>
              )}
            </h2>
          </div>
          {companies.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <CheckCircle size={48} className="mx-auto mb-3 opacity-40" />
              <p>All companies verified!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {companies.map((c) => (
                <div
                  key={c.id}
                  className="p-5 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-500">
                      {c.email} · {c.city}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      License: {c.license_number}
                    </p>
                  </div>
                  <button
                    onClick={() => handleVerify(c.id)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle size={15} /> Verify
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

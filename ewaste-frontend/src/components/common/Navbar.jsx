import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Recycle, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dashboardLink =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "company"
        ? "/company"
        : "/customer";

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to={dashboardLink}
          className="flex items-center gap-2 text-green-600 font-bold text-xl"
        >
          <Recycle size={24} /> E-Waste Platform
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <User size={16} />
              {user.name}
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full capitalize">
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

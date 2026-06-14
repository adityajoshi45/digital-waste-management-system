import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, loginCompany } from "../../services/api";
import toast from "react-hot-toast";
import { Recycle } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = form.role === "company" ? loginCompany : loginUser;
      const res = await fn({ email: form.email, password: form.password });
      const { token, ...userData } = res.data.data;
      login(token, userData);
      toast.success("Welcome back!");
      navigate(
        userData.role === "admin"
          ? "/admin"
          : userData.role === "company"
            ? "/company"
            : "/customer",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <Recycle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">E-Waste Platform</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {["customer", "company", "admin"].map((r) => (
            <button
              key={r}
              onClick={() => setForm((f) => ({ ...f, role: r }))}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors
                ${form.role === r ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

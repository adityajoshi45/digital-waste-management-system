import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerCustomer, registerCompany } from "../../services/api";
import toast from "react-hot-toast";
import { Recycle } from "lucide-react";

const Register = () => {
  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    license_number: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = role === "company" ? registerCompany : registerCustomer;
      const res = await fn({ ...form });
      if (role === "company") {
        toast.success("Registered! Await admin verification.");
        navigate("/login");
      } else {
        const { token, ...userData } = res.data.data;
        login(token, userData);
        toast.success("Welcome!");
        navigate("/customer");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = "text", placeholder = "" }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        placeholder={placeholder}
        onChange={(e) => set(name, e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 p-3 rounded-full mb-3">
            <Recycle size={32} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
          {["customer", "company"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors
                ${role === r ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" name="name" placeholder="John Doe" />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            placeholder="9876543210"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="City" name="city" placeholder="Latur" />
            <Field label="State" name="state" placeholder="Maharashtra" />
          </div>
          <Field label="Pincode" name="pincode" placeholder="413512" />
          {role === "company" && (
            <>
              <Field
                label="License Number"
                name="license_number"
                placeholder="MH-EWASTE-001"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell customers about your company..."
                />
              </div>
            </>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 font-medium hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

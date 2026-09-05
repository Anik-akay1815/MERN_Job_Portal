import { useState } from "react";
import { loginUser, loginCompany } from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function LoginUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (formData.role === "user") {
        res = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      } else {
        res = await loginCompany({
          email: formData.email,
          password: formData.password,
        });
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  return (
    <>
      <Navbar currentPage="login" />
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left branding panel */}
        <div className="lg:w-2/5 bg-slate-900 text-white px-8 py-14 lg:py-0 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-sm mx-auto lg:mx-0">
            <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              Welcome back
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mt-5 leading-tight">
              Pick up right where you left off
            </h1>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Log in to check your applications, manage job postings, or keep
              building your profile.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  One account for jobs, applications, and messages
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Switch between job seeker and company access
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-10">
              New here?{" "}
              <Link
                to="/register"
                className="text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:w-3/5 bg-white flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Register
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                    formData.role === "user"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={formData.role === "user"}
                    onChange={handleChange}
                    className="accent-emerald-500"
                  />
                  Job Seeker
                </label>
                <label
                  className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2.5 text-sm cursor-pointer transition-all duration-200 ${
                    formData.role === "company"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-gray-300 text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="company"
                    checked={formData.role === "company"}
                    onChange={handleChange}
                    className="accent-emerald-500"
                  />
                  Company
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold cursor-pointer text-white py-3 rounded-lg shadow-sm hover:shadow-md"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginUser;

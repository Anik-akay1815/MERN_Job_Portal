import { useState } from "react";
import { loginUser, loginCompany } from "../services/authService.js";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function LoginUser() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (formData.role === "user") {
        res = await loginUser({ email: formData.email, password: formData.password });
      } else {
        res = await loginCompany({ email: formData.email, password: formData.password });
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

  const inputClass = "w-full bg-white/80 dark:bg-[#161c2e]/70 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2] transition";
  const labelClass = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2";

  return (
    <>
      <Navbar currentPage="login" />
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] relative overflow-hidden flex items-center justify-center px-5 py-12">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-5xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/70 dark:border-white/10 bg-white/60 dark:bg-[#161c2e]/60 backdrop-blur-xl shadow-2xl dark:shadow-black/40">
          <div className="relative hidden lg:flex flex-col justify-center px-12 py-14 bg-[#10182b]/95 text-white overflow-hidden">
            <div className="absolute -top-24 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xl font-bold">C</div>
                <div>
                  <h1 className="text-2xl font-bold">Careerly</h1>
                  <p className="text-xs text-slate-400">Find • Connect • Grow</p>
                </div>
              </div>
              <span className="inline-flex items-center bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">🚀 Welcome back</span>
              <h2 className="text-4xl font-bold mt-6 leading-tight">Your next opportunity starts here.</h2>
              <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-md">Sign in to discover jobs, manage applications, connect with companies, and grow your career with Careerly.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Find jobs that match your skills</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Connect with growing companies</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Manage everything from one place</p></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">H</div>
                <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">HireNest</h1><p className="text-xs text-slate-500 dark:text-slate-400">Find • Connect • Grow</p></div>
              </div>

              <span className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 text-xs font-semibold px-3 py-1.5 rounded-full">🔐 Secure Login</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-5">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-7">Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Create one</Link></p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" name="password" placeholder="Your password" onChange={handleChange} required className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>I'm a...</label>
                  <div className="relative">
                    <select name="role" value={formData.role} onChange={handleChange} className="w-full appearance-none bg-white/80 dark:bg-[#161c2e]/80 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2] transition">
                      <option value="user" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Job Seeker</option>
                      <option value="company" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Company</option>
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-300">⌄</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition">
                  {loading ? "Logging in..." : "Log in  →"}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-7">By continuing, you agree to Careerly's terms and privacy policy.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginUser;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCompany } from "../services/authService";
import Navbar from "../components/Navbar.jsx";

function RegisterCompany() {
  const [formData, setFormData] = useState({
    companyname: "", email: "", password: "", location: "", description: "",
    website: "", industry: "", companySize: "", linkedin: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerCompany(formData);
      navigate("/login");
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
      <Navbar currentPage="register" />
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] relative overflow-hidden flex items-center justify-center px-5 py-12">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/70 dark:border-white/10 bg-white/60 dark:bg-[#161c2e]/60 backdrop-blur-xl shadow-2xl dark:shadow-black/40">
          <div className="relative flex flex-col justify-center px-8 md:px-12 py-12 bg-[#10182b]/95 text-white overflow-hidden">
            <div className="absolute -top-24 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xl font-bold">C</div>
                <div><h1 className="text-2xl font-bold">Careerly</h1><p className="text-xs text-slate-400">Find • Connect • Grow</p></div>
              </div>
              <span className="inline-flex bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">🏢 For Employers</span>
              <h2 className="text-4xl font-bold mt-6 leading-tight">Find the talent that moves your company forward</h2>
              <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-md">Set up your company profile, publish openings, and connect with candidates who fit your team.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Post unlimited job openings</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Build a public company profile candidates trust</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Manage applicants from one Dashboard</p></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-12">
            <div className="w-full max-w-xl">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">C</div>
                <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Careerly</h1><p className="text-xs text-slate-500 dark:text-slate-400">Find • Connect • Grow</p></div>
              </div>
              <span className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 text-xs font-semibold px-3 py-1.5 rounded-full">🏢 Company Registration</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-5">Create your company account</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-7">Already registered? <Link to="/login" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Log in</Link></p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Company name</label><input type="text" name="companyname" value={formData.companyname} placeholder="e.g. TechWorld Pvt Ltd" onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Work email</label><input type="email" name="email" value={formData.email} placeholder="you@company.com" onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Password</label><input type="password" name="password" value={formData.password} placeholder="Create a password" onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Location</label><input type="text" name="location" value={formData.location} placeholder="City, Country" onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Website</label><input type="text" name="website" value={formData.website} placeholder="https://example.com" onChange={handleChange} required className={inputClass} /></div>
                  <div><label className={labelClass}>Industry</label><input type="text" name="industry" value={formData.industry} placeholder="e.g. IT Services" onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Company size</label><input type="text" name="companySize" value={formData.companySize} placeholder="e.g. 11-50 employees" onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>LinkedIn page</label><input type="text" name="linkedin" value={formData.linkedin} placeholder="linkedin.com/company/..." onChange={handleChange} required className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>About the company</label><textarea name="description" value={formData.description} placeholder="What does your company do, and what makes it a great place to work?" onChange={handleChange} rows={4} className={`${inputClass} resize-none`} /></div>

                <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition">
                  {loading ? "Creating account..." : "Create company account"}
                </button>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">Looking for Job? <Link to="/register" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Register as Candidate</Link></p>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-1">By registering, you agree to our Terms of Service and Privacy Policy.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterCompany;

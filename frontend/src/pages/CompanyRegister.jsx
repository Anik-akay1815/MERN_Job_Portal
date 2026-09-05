import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCompany } from "../services/authService";
import Navbar from "../components/Navbar.jsx";

function RegisterCompany() {
  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    password: "",
    location: "",
    description: "",
    website: "",
    industry: "",
    companySize: "",
    linkedin: "",
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
      await registerCompany(formData);
      navigate("/login");
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
      <Navbar currentPage="register" />
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left branding panel */}
        <div className="lg:w-2/5 bg-slate-900 text-white px-8 py-14 lg:py-0 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-sm mx-auto lg:mx-0">
            <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              For Employers
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mt-5 leading-tight">
              Find the talent that moves your company forward
            </h1>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Set up your company profile, publish openings, and connect with
              candidates who fit your team.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Post unlimited job openings
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Build a public company profile candidates trust
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Manage applicants from one dashboard
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:w-3/5 bg-white flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your company account
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-8">
              Already registered?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company name</label>
                  <input
                    type="text"
                    name="companyname"
                    value={formData.companyname}
                    placeholder="e.g. TechWorld Pvt Ltd"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Work email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="you@company.com"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Create a password"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    placeholder="City, Country"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    placeholder="https://example.com"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    placeholder="e.g. IT Services"
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company size</label>
                  <input
                    type="text"
                    name="companySize"
                    value={formData.companySize}
                    placeholder="e.g. 11-50 employees"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn page</label>
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    placeholder="linkedin.com/company/..."
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>About the company</label>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="What does your company do, and what makes it a great place to work?"
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-white py-3 rounded-lg shadow-sm hover:shadow-md"
              >
                {loading ? "Creating account..." : "Create company account"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Looking for Job?{" "}
                <Link
                  to="/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Register as Candidate
                </Link>
              </p>

              <p className="text-xs text-gray-400 text-center pt-1">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterCompany;

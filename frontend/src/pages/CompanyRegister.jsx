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
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerCompany(formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Navbar currentPage="register" />
      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Create Your Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Register as a Company
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="companyname"
              value={formData.companyname}
              placeholder="Company name"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              placeholder="Location"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <textarea
              name="description"
              value={formData.description}
              placeholder="Describe your company"
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-semibold text-white py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
            >
              Register Company
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-slate-700 hover:text-slate-900 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default RegisterCompany;

import { useState } from "react";
import { registerUser } from "../services/authService.js";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";


function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      const res = await registerUser(formData);
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
            Join Job Portal today
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Username"
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

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-semibold text-white py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
            >
              Register
            </button>

            <p className="text-center">
              <Link
                to="/company/register"
                className="text-slate-700 hover:underline font-semibold"
              >
                Register as Company
              </Link>
            </p>
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
export default RegisterUser;

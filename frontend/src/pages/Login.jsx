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
    }
  };
  return (
    <>
      <Navbar currentPage="login" />
      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Log into Your Account
          </h1>
          <p className="text-center text-gray-500 mb-8">
            Welcome back! Please enter your details
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />

            <div className="flex gap-4 mt-2">
              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${formData.role === "user" ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold" : "border-gray-300 text-gray-600"}`}
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
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-4 py-3 cursor-pointer transition-all duration-200 ${formData.role === "company" ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold" : "border-gray-300 text-gray-600"}`}
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-semibold cursor-pointer text-white py-3 rounded-lg shadow-md hover:shadow-lg"
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-slate-700 hover:text-slate-900 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginUser;

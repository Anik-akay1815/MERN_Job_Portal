import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";

function Navbar({ currentPage }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token;
  const role = user?.role;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-9 h-9 bg-slate-800 dark:bg-slate-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                J
              </span>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Job<span className="text-slate-700 dark:text-slate-300">Portal</span>
              </h1>
            </Link>
            <div className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300 font-medium">
              <Link
                to="/"
                className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 dark:bg-slate-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {role !== "company" && role !== "admin" && (
                <Link
                  to="/jobs"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200 relative group"
                >
                  Jobs
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 dark:bg-slate-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              {role !== "company" && role !== "admin" && (
                <Link
                  to="/allcompany"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200 relative group"
                >
                  Companies
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 dark:bg-slate-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 text-gray-600 dark:text-gray-300 font-medium">
            {!isLoggedIn && currentPage !== "login" && (
              <Link
                to="/login"
                className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
              >
                Login
              </Link>
            )}
            {!isLoggedIn && currentPage !== "register" && (
              <Link
                to="/register"
                className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Register
              </Link>
            )}
            {isLoggedIn && role === "user" && (
              <>
                <Link
                  to="/userdashboard"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200 relative group"
                >
                  Dashboard
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 dark:bg-slate-300 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  to="/myapplications"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  My Applications
                </Link>
                <Link
                  to="/userprofile"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-semibold border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            )}
            {isLoggedIn && role === "company" && (
              <>
                <Link
                  to="/Dashboard"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/postjob"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Post Job
                </Link>
                <Link
                  to="/myjobs"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  My Jobs
                </Link>
                <Link
                  to="/companyprofile"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-semibold border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            )}
            {isLoggedIn && role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/userprofile"
                  className="hover:text-slate-800 dark:hover:text-white transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-semibold border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;
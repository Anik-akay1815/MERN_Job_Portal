import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Navbar({ currentPage }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  const isLoggedIn = !!token;
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navLink = (page) =>
    `relative text-sm font-medium transition-colors ${
      currentPage === page
        ? "text-[#111111] dark:text-white"
        : "text-gray-500 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#161c2e]/95 backdrop-blur-xl text-[#111111] dark:text-white border-b border-white/60 dark:border-white/10 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-5 md:px-8 h-18 flex items-center justify-between">
        {/* ================= LOGO ================= */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] flex items-center justify-center font-black text-lg shadow-sm">
            C
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#111111] dark:text-white">
              Career<span className="text-[#3aa0e8] dark:text-[#7cc2f2]">ly</span>
            </h1>

            <p className="hidden sm:block text-[8px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
              Find • Connect • Grow
            </p>
          </div>
        </Link>

        {/* ================= NAV LINKS ================= */}
        <div className="hidden md:flex items-center gap-8 ml-8 mr-auto">
          <Link to="/" className={navLink("home")}>
            Home
            {currentPage === "home" && (
              <span className="absolute left-0 -bottom-6.5 w-full h-0.5 bg-[#3aa0e8] dark:bg-[#7cc2f2]" />
            )}
          </Link>

          {role !== "company" && role !== "admin" && (
            <Link to="/jobs" className={navLink("jobs")}>
              Find Jobs
              {currentPage === "jobs" && (
                <span className="absolute left-0 -bottom-6.5 w-full h-0.5 bg-[#3aa0e8] dark:bg-[#7cc2f2]" />
              )}
            </Link>
          )}

          {role !== "company" && role !== "admin" && (
            <Link to="/allcompany" className={navLink("companies")}>
              Companies
              {currentPage === "companies" && (
                <span className="absolute left-0 -bottom-6.5 w-full h-0.5 bg-[#3aa0e8] dark:bg-[#7cc2f2]" />
              )}
            </Link>
          )}

          {/* ================= USER LINKS ================= */}
          {isLoggedIn && role === "user" && (
            <>
              <Link to="/userdashboard" className={navLink("dashboard")}>
                Dashboard
              </Link>

              <Link to="/myapplications" className={navLink("applications")}>
                My Applications
              </Link>
            </>
          )}

          {/* ================= COMPANY LINKS ================= */}
          {isLoggedIn && role === "company" && (
            <>
              <Link to="/Dashboard" className={navLink("dashboard")}>
                Dashboard
              </Link>

              <Link to="/postjob" className={navLink("postjob")}>
                Post Job
              </Link>

              <Link to="/myjobs" className={navLink("myjobs")}>
                My Jobs
              </Link>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {isLoggedIn && role === "admin" && (
            <Link to="/admin" className={navLink("admin")}>
              Admin Dashboard
            </Link>
          )}
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex items-center gap-3">
          {/* Location */}
          <div className="hidden lg:flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mr-1">
            <span className="text-[#3aa0e8] dark:text-[#7cc2f2]">📍</span>
            <span>India</span>
          </div>

          {/* ================= THEME BUTTON ================= */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] flex items-center justify-center text-base transition-all duration-200"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* ================= LOGGED OUT ================= */}
          {!isLoggedIn && (
            <>
              {currentPage !== "login" && (
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-[#111111] dark:hover:text-white px-3 py-2 transition"
                >
                  Login
                </Link>
              )}

              {currentPage !== "register" && (
                <Link
                  to="/register"
                  className="bg-[#7cc2f2] hover:bg-[#9ad3f6] text-[#111111] text-sm font-bold px-5 py-2.5 rounded-lg transition"
                >
                  Register
                </Link>
              )}
            </>
          )}

          {/* ================= USER ================= */}
          {isLoggedIn && role === "user" && (
            <>
              <Link
                to="/userprofile"
                className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2] hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] transition"
                title="Profile"
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 border border-white/60 dark:border-white/10 hover:border-red-400 px-3 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

          {/* ================= COMPANY ================= */}
          {isLoggedIn && role === "company" && (
            <>
              <Link
                to="/companyprofile"
                className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2] hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] transition"
                title="Company Profile"
              >
                {user?.companyname?.charAt(0)?.toUpperCase() || "C"}
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 border border-white/60 dark:border-white/10 hover:border-red-400 px-3 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {isLoggedIn && role === "admin" && (
            <>
              <Link
                to="/userprofile"
                className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2]"
              >
                A
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 border border-white/60 dark:border-white/10 hover:border-red-400 px-3 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;

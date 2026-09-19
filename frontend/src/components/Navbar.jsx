import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useState } from "react";
import careerlyLogo from "../assets/careerly-logo.png";

function Navbar({ currentPage }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

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
    setMenuOpen(false);
    navigate("/");
  };

  const profileImage =
    user?.profileImage ||
    user?.profilePhoto ||
    user?.photo ||
    user?.image ||
    user?.logo;

  const navLink = (page) =>
    `relative text-sm font-medium transition-colors ${
      currentPage === page
        ? "text-[#111111] dark:text-white"
        : "text-gray-500 dark:text-gray-400 hover:text-[#111111] dark:hover:text-white"
    }`;

  const mobileLink = (page) =>
    `block w-full px-4 py-3 rounded-xl text-sm font-semibold transition ${
      currentPage === page
        ? "bg-blue-50 dark:bg-blue-500/10 text-[#3aa0e8] dark:text-[#7cc2f2]"
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#161c2e]/95 backdrop-blur-xl text-[#111111] dark:text-white border-b border-white/60 dark:border-white/10 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 h-18 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm shrink-0">
            <img
              src={careerlyLogo}
              alt="Careerly"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#111111] dark:text-white">
              Career
              <span className="text-[#3aa0e8] dark:text-[#7cc2f2]">ly</span>
            </h1>
            <p className="hidden sm:block text-[8px] uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
              Find • Connect • Grow
            </p>
          </div>
        </Link>

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

          {isLoggedIn && role === "user" && (
            <>
              <Link to="/myapplications" className={navLink("applications")}>
                My Applications
              </Link>
              <Link to="/favourites" className={navLink("favourites")}>
                Favourites
              </Link>
              <Link to="/userdashboard" className={navLink("dashboard")}>
                Dashboard
              </Link>
            </>
          )}

          {isLoggedIn && role === "company" && (
            <>
              <Link to="/postjob" className={navLink("postjob")}>
                Post Job
              </Link>
              <Link to="/myjobs" className={navLink("myjobs")}>
                My Jobs
              </Link>
              <Link to="/Dashboard" className={navLink("dashboard")}>
                Dashboard
              </Link>
            </>
          )}

          {isLoggedIn && role === "admin" && (
            <Link to="/admin" className={navLink("admin")}>
              Admin Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mr-1">
            <span className="text-[#3aa0e8] dark:text-[#7cc2f2]">📍</span>
            <span>India</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] flex items-center justify-center text-base transition-all duration-200"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

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
                  className="hidden sm:block bg-[#7cc2f2] hover:bg-[#9ad3f6] text-[#111111] text-sm font-bold px-5 py-2.5 rounded-lg transition"
                >
                  Register
                </Link>
              )}
            </>
          )}

          {isLoggedIn && role === "user" && (
            <Link
              to="/userprofile"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2] hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] transition overflow-hidden"
              title="Profile"
            >
              {profileImage ? (
                <img
                  src={`http://localhost:19116/${profileImage}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </Link>
          )}

          {isLoggedIn && role === "company" && (
            <Link
              to="/companyprofile"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2] hover:border-[#3aa0e8] dark:hover:border-[#7cc2f2] transition overflow-hidden"
              title="Company Profile"
            >
              {profileImage ? (
                <img
                  src={`http://localhost:19116/${profileImage}`}
                  alt="Company Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.companyname?.charAt(0)?.toUpperCase() || "C"
              )}
            </Link>
          )}

          {isLoggedIn && role === "admin" && (
            <Link
              to="/userprofile"
              className="hidden sm:flex w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 items-center justify-center text-sm font-bold text-[#3aa0e8] dark:text-[#7cc2f2]"
            >
              A
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="hidden sm:block text-xs font-semibold text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 border border-white/60 dark:border-white/10 hover:border-red-400 px-3 py-2 rounded-lg transition"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-xl bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/10 text-xl flex items-center justify-center"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-slate-200/70 dark:border-white/10 bg-white/95 dark:bg-[#161c2e]/98 backdrop-blur-xl px-4 py-4 shadow-lg">
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={mobileLink("home")}
            >
              Home
            </Link>

            {role !== "company" && role !== "admin" && (
              <>
                <Link
                  to="/jobs"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("jobs")}
                >
                  Find Jobs
                </Link>
                <Link
                  to="/allcompany"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("companies")}
                >
                  Companies
                </Link>
              </>
            )}

            {isLoggedIn && role === "user" && (
              <>
                <Link
                  to="/userdashboard"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("dashboard")}
                >
                  Dashboard
                </Link>
                <Link
                  to="/myapplications"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("applications")}
                >
                  My Applications
                </Link>
                <Link
                  to="/favourites"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("favourites")}
                >
                  Favourites
                </Link>
                <Link
                  to="/userprofile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("profile")}
                >
                  My Profile
                </Link>
              </>
            )}

            {isLoggedIn && role === "company" && (
              <>
                <Link
                  to="/Dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("dashboard")}
                >
                  Dashboard
                </Link>
                <Link
                  to="/postjob"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("postjob")}
                >
                  Post Job
                </Link>
                <Link
                  to="/myjobs"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("myjobs")}
                >
                  My Jobs
                </Link>
                <Link
                  to="/companyprofile"
                  onClick={() => setMenuOpen(false)}
                  className={mobileLink("profile")}
                >
                  Company Profile
                </Link>
              </>
            )}

            {isLoggedIn && role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className={mobileLink("admin")}
              >
                Admin Dashboard
              </Link>
            )}

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-3 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="text-center py-3 rounded-xl bg-[#7cc2f2] text-[#111111] text-sm font-bold"
                >
                  Register
                </Link>
              </div>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full mt-2 py-3 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 text-sm font-semibold"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

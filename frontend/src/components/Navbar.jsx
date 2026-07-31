import { Link, useNavigate } from "react-router-dom";

function Navbar({ currentPage }) {
  const navigate = useNavigate();

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
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <span className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                J
              </span>
              <h1 className="text-xl font-bold text-gray-900">
                Job<span className="text-slate-700">Portal</span>
              </h1>
            </Link>

            <div className="hidden md:flex gap-8 text-gray-600 font-medium">
              <Link
                to="/"
                className="hover:text-slate-800 transition-colors duration-200 relative group"
              >
                Home
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {role !== "company" && (
                <Link
                  to="/jobs"
                  className="hover:text-slate-800 transition-colors duration-200 relative group"
                >
                  Jobs
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-slate-800 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 text-gray-600 font-medium">
            {!isLoggedIn && currentPage !== "login" && (
              <Link
                to="/login"
                className="hover:text-slate-800 transition-colors duration-200"
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
                  to="/myapplications"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  My Applications
                </Link>
                <Link
                  to="/userprofile"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            )}

            {isLoggedIn && role === "company" && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/postjob"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  Post Job
                </Link>
                <Link
                  to="/myjobs"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  My Jobs
                </Link>
                <Link
                  to="/companyprofile"
                  className="hover:text-slate-800 transition-colors duration-200"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-all duration-200"
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navbar;

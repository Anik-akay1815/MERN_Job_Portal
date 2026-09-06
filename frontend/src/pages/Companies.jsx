import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getAllCompanies } from "../services/authService.js";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompanies();
      setCompanies(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      c.companyname?.toLowerCase().includes(query) ||
      c.industry?.toLowerCase().includes(query) ||
      c.location?.toLowerCase().includes(query)
    );
  });

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const ABOUT_LIMIT = 110;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 mb-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Explore Companies
        </h1>
        <p className="text-gray-500 mb-6">
          Discover companies hiring on JobPortal
        </p>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, industry, or location..."
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>

        {loading ? (
          <h2 className="text-center text-gray-500 mt-10">Loading...</h2>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center bg-gray-50 rounded-2xl py-16 border border-gray-100">
            <p className="text-gray-400 font-medium">No companies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((c) => {
              const aboutText = c.description || "";
              const aboutPreview =
                aboutText.length > ABOUT_LIMIT
                  ? aboutText.slice(0, ABOUT_LIMIT) + "..."
                  : aboutText;

              return (
                <div
                  key={c._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {c.logo ? (
                      <img
                        src={`${fileBaseUrl}/${c.logo}`}
                        alt={c.companyname}
                        className="w-12 h-12 rounded-full object-cover shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                        {c.companyname?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {c.companyname}
                      </h3>
                      {c.location && (
                        <p className="text-xs text-gray-500 truncate">
                          📍 {c.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.industry && (
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                        🏭 {c.industry}
                      </span>
                    )}
                    {c.companySize && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                        👥 {c.companySize}
                      </span>
                    )}
                  </div>

                  {/* About */}
                  <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                    {aboutPreview || "No description provided."}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Link
                      to={`/company/${c._id}`}
                      className="flex-1 text-center bg-slate-700 hover:bg-slate-800 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      to={`/company/${c._id}#jobs`}
                      className="flex-1 text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm font-semibold py-2 rounded-lg transition-colors"
                    >
                      View Jobs
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
export default Companies;
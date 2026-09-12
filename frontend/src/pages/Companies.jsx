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
    return c.companyname?.toLowerCase().includes(query) || c.industry?.toLowerCase().includes(query) || c.location?.toLowerCase().includes(query);
  });

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const ABOUT_LIMIT = 110;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-80 h-80 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1.5 rounded-full text-xs font-semibold">🏢 Explore the network</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">Explore Companies</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Discover companies hiring on Careerly</p>
          </div>

          <div className="relative mb-8 max-w-xl">
            <div className="absolute inset-0 bg-blue-400/10 dark:bg-blue-500/10 blur-2xl rounded-2xl" />
            <div className="relative flex items-center bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl shadow-lg dark:shadow-black/20">
              <span className="pl-4 text-slate-400">🔍</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, industry, or location..." className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 outline-none" />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl px-6 py-4 text-sm text-slate-500 dark:text-slate-400 shadow-lg">Loading companies...</div></div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl rounded-2xl py-16 border border-white/60 dark:border-white/10 shadow-lg">
              <div className="text-4xl mb-3">🔎</div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No companies found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try another company, industry, or location.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((c, index) => {
                const aboutText = c.description || "";
                const aboutPreview = aboutText.length > ABOUT_LIMIT ? aboutText.slice(0, ABOUT_LIMIT) + "..." : aboutText;
                const accents = ["from-blue-400 to-indigo-500", "from-purple-400 to-blue-500", "from-teal-400 to-cyan-500"];
                const accent = accents[index % accents.length];

                return (
                  <div key={c._id} className="group relative rounded-2xl p-px bg-linear-to-br from-slate-200/80 via-white/60 to-blue-200/60 dark:from-white/10 dark:via-blue-500/10 dark:to-purple-500/20 hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300 dark:hover:from-blue-500/40 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/40 transition-all duration-300">
                    <div className="relative overflow-hidden bg-white/85 dark:bg-[#161c2e]/85 backdrop-blur-xl rounded-2xl p-5 min-h-80 flex flex-col border border-white/70 dark:border-white/10 shadow-sm dark:shadow-black/20 group-hover:shadow-xl dark:group-hover:shadow-black/40 group-hover:-translate-y-1 transition-all duration-300">
                      <div className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-linear-to-r ${accent}`} />

                      <div className="flex items-center gap-3 mb-5 mt-1">
                        {c.logo ? (
                          <div className="relative shrink-0">
                            <div className={`absolute inset-0 bg-linear-to-br ${accent} blur-lg opacity-30 rounded-full`} />
                            <img src={`${fileBaseUrl}/${c.logo}`} alt={c.companyname} className="relative w-14 h-14 rounded-2xl object-cover shadow-md ring-1 ring-white/70 dark:ring-white/10" />
                          </div>
                        ) : (
                          <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${accent} text-white flex items-center justify-center font-bold text-xl shadow-lg shrink-0`}>
                            {c.companyname?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{c.companyname}</h3>
                          {c.location && <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">📍 {c.location}</p>}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {c.industry && <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-semibold">🏭 {c.industry}</span>}
                        {c.companySize && <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-400/20 px-3 py-1 rounded-full text-xs font-semibold">👥 {c.companySize}</span>}
                      </div>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-5">{aboutPreview || "No description provided."}</p>

                      <div className="flex gap-2 pt-4 border-t border-slate-200/70 dark:border-white/10">
                        <Link to={`/company/${c._id}`} className="flex-1 text-center bg-slate-800 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-white/15 text-white text-sm font-semibold py-2.5 rounded-xl transition">View Profile</Link>
                        <Link to={`/company/${c._id}#jobs`} className="flex-1 text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 text-sm font-semibold py-2.5 rounded-xl transition">View Jobs</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Companies;

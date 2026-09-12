import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import {
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllCompaniesAdmin,
  deleteCompanyAdmin,
  getAllJobsAdmin,
  deleteJobAdmin,
} from "../services/authService.js";

function Sparkline({ color }) {
  return (
    <svg viewBox="0 0 100 30" className="w-full h-8 mt-3" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,25 15,20 30,22 45,12 60,15 75,6 100,8"
      />
    </svg>
  );
}

function Avatar({ name, photo }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  if (photo) {
    return (
      <img src={photo} alt={name} className="h-10 w-10 rounded-full object-cover"/>
    );
  }
  return (
    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-500 text-white font-semibold">
      {initial}
    </div>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const fetchAll = async () => {
    try {
      const [usersRes, companiesRes, jobsRes] = await Promise.all([
        getAllUsersAdmin(),
        getAllCompaniesAdmin(),
        getAllJobsAdmin(),
      ]);
      setUsers(usersRes.data.data || []);
      setCompanies(companiesRes.data.data || []);
      setJobs(jobsRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const candidateUsers = users.filter((u) => u.role !== "admin");
  const activeJobs = jobs.filter(
    (job) => !job.applicationDeadline || new Date(job.applicationDeadline) >= new Date()
  );

  const displayedUsers = showAllUsers ? candidateUsers : candidateUsers.slice(0, 3);
  const displayedCompanies = showAllCompanies ? companies : companies.slice(0, 3);
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 3);

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const getFileUrl = (file) => {
    if (!file) return null;
    if (file.startsWith("http")) return file;
    return `${fileBaseUrl}/${file.replace(/^\/+/, "")}`;
  };

  const requestDelete = (type, id, name) => setConfirmTarget({ type, id, name });
  const cancelDelete = () => setConfirmTarget(null);

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const { type, id } = confirmTarget;
    try {
      if (type === "user") {
        await deleteUserAdmin(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
      if (type === "company") {
        await deleteCompanyAdmin(id);
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      }
      if (type === "job") {
        await deleteJobAdmin(id);
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setConfirmTarget(null);
    }
  };

  const scrollToSection = (id) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarItems = [
    { label: "Dashboard", icon: "🏠", id: null },
    { label: "Users", icon: "👤", id: "users-section" },
    { label: "Companies", icon: "🏢", id: "companies-section" },
    { label: "Jobs", icon: "💼", id: "jobs-section" },
    { label: "Applications", icon: "📄", id: null },
    { label: "Analytics", icon: "📊", id: null },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] dark:bg-[#0f1420] transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* page bg matches the reference image: soft light-gray in light mode, deep navy in dark mode */}
      <div className="relative min-h-screen overflow-hidden bg-[#f5f6fa] dark:bg-[#0f1420] text-[#111111] dark:text-white transition-colors duration-300">
        {/* glass blobs — same soft glow as the reference image, blurred and sitting behind the cards */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-md h-112 rounded-full bg-blue-400/25 dark:bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-purple-400/20 dark:bg-purple-500/15 blur-3xl" />

        <div className="relative flex">
          {/* SIDEBAR — scrolls to sections on this same page, no new routes */}
          <aside className="hidden md:flex md:flex-col fixed left-0 top-0 w-64 h-screen bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border-r border-white/60 dark:border-white/10 py-6 px-4 z-40">
            <nav className="flex-1 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="pt-4 mt-4 border-t border-white/40 dark:border-white/10 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5 transition-all">
                <span className="text-lg">⚙️</span>
                Settings
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <span className="text-lg">🚪</span>
                Logout
              </button>
            </div>
          </aside>

        <div className="min-w-0 flex-1 max-w-7xl mx-auto px-5 md:px-8 py-8 md:ml-64">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-[#3aa0e8] dark:text-[#7cc2f2] mb-2">
                ADMIN PANEL
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Monitor and manage your JobPortal platform
              </p>
            </div>

            <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-xl px-4 py-3 shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                  Platform Active
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400 leading-tight">
                  All systems running smoothly
                </p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{candidateUsers.length}</p>
                  <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">↑ 12%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 flex items-center justify-center text-xl">👤</div>
              </div>
              <Sparkline color="#6366f1" />
            </div>

            <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{companies.length}</p>
                  <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">↑ 8%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xl">🏢</div>
              </div>
              <Sparkline color="#3b82f6" />
            </div>

            <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{jobs.length}</p>
                  <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">↑ 18%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xl">💼</div>
              </div>
              <Sparkline color="#a855f7" />
            </div>

            <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{activeJobs.length}</p>
                  <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">↑ 24%</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center text-xl">📈</div>
              </div>
              <Sparkline color="#14b8a6" />
            </div>
          </div>

          {/* RECENT USERS */}
          <section id="users-section" className="scroll-mt-6 bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-indigo-500">👤</span> Recent Users
              </h2>
              {candidateUsers.length > 3 && (
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                >
                  {showAllUsers ? "Show Less ↑" : "View All →"}
                </button>
              )}
            </div>

            {displayedUsers.length === 0 ? (
              <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">No users found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((user) => (
                    <tr key={user._id} className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition">
                      <td className="px-5 py-3">
                        <Link to={`/user/${user._id}`} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar 
                            name={user.name}
                            photo={getFileUrl(user.profilePhoto)} />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-[#161c2e]" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-white">{user.name}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20">
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end">
                          <button
                            onClick={() => requestDelete("user", user._id, user.name)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* RECENT COMPANIES */}
          <section id="companies-section" className="scroll-mt-6 bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl shadow-sm mb-6 overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-blue-500">🏢</span> Recent Companies
              </h2>
              {companies.length > 3 && (
                <button
                  onClick={() => setShowAllCompanies(!showAllCompanies)}
                  className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                >
                  {showAllCompanies ? "Show Less ↑" : "View All →"}
                </button>
              )}
            </div>

            {displayedCompanies.length === 0 ? (
              <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">No companies found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Location</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedCompanies.map((company) => (
                    <tr key={company._id} className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition">
                      <td className="px-5 py-3">
                        <Link to={`/company/${company._id}`} className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar 
                            name={company.companyname}
                            photo={getFileUrl(company.logo)} />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-[#161c2e]" />
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-white">{company.companyname}</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                        {company.location ? `📍 ${company.location}` : "—"}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex justify-end">
                          <button
                            onClick={() => requestDelete("company", company._id, company.companyname)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* RECENT JOBS */}
          <section id="jobs-section" className="scroll-mt-6 bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <span className="text-teal-500">💼</span> Recent Jobs
              </h2>
              {jobs.length > 3 && (
                <button
                  onClick={() => setShowAllJobs(!showAllJobs)}
                  className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                >
                  {showAllJobs ? "Show Less ↑" : "View All →"}
                </button>
              )}
            </div>

            {displayedJobs.length === 0 ? (
              <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">No jobs found</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                    <th className="px-5 py-3 font-semibold">Title</th>
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedJobs.map((job) => {
                    const isExpired = job.applicationDeadline && new Date(job.applicationDeadline) < new Date();
                    return (
                      <tr key={job._id} className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition">
                        <td className="px-5 py-3">
                          <Link to={`/jobs/${job._id}`} className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{job.company?.companyname || "—"}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isExpired
                              ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/30"
                              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                          }`}>
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end">
                            <button
                              onClick={() => requestDelete("job", job._id, job.title)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-white/20 dark:border-white/10">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 flex items-center justify-center text-2xl mx-auto mb-5">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">Are you sure?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-7 leading-relaxed">
              Do you really want to delete{" "}
              <span className="font-semibold text-gray-800 dark:text-white">{confirmTarget.name}</span>?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={cancelDelete} className="flex-1 bg-gray-100 dark:bg-[#252c45] hover:bg-gray-200 dark:hover:bg-[#2e365a] text-gray-700 dark:text-gray-200 font-semibold py-2.5 rounded-lg transition">
                No, cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import {
  getMyApplications,
  getAllJobs,
  deleteApplication,
} from "../services/authService.js";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);

    if (data?._id) {
      fetchAll(data._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAll = async (userId) => {
    try {
      const [appsRes, jobsRes] = await Promise.all([
        getMyApplications(userId),
        getAllJobs(),
      ]);

      setApplications(appsRes.data.data);
      setJobs(jobsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteApplication(deleteId);
      setApplications((prev) => prev.filter((app) => app._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  const appliedCount = applications.length;
  const shortlistedCount = applications.filter(
    (app) => app.status === "Accepted"
  ).length;
  const pendingCount = applications.filter(
    (app) => app.status !== "Accepted" && app.status !== "Rejected"
  ).length;

  const recommendedJobs = jobs
    .filter((job) => job && job.title)
    .slice(0, 3)
    .map((job, index) => ({
      ...job,
      matchCount: (job.skills?.length || 0) + index,
    }));

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none relative overflow-hidden">
          <div className="flex min-h-[calc(100vh-68px)]">
            <aside className="hidden lg:block w-64 shrink-0 bg-white/65 dark:bg-[#12182a]/80 border-r border-white/70 dark:border-white/10">
              <div className="p-6">
                <div className="h-4 w-24 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                <div className="h-6 w-36 bg-slate-200 dark:bg-white/10 rounded mt-3 animate-pulse" />
              </div>
            </aside>

            <main className="flex-1 px-5 sm:px-7 lg:px-9 py-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between mb-7">
                  <div>
                    <div className="h-4 w-20 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                    <div className="h-10 w-72 bg-slate-200 dark:bg-white/10 rounded mt-3 animate-pulse" />
                    <div className="h-4 w-80 bg-slate-200 dark:bg-white/10 rounded mt-3 animate-pulse" />
                  </div>
                  <div className="h-12 w-32 bg-slate-200 dark:bg-white/10 rounded-xl animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="h-32 bg-white/70 dark:bg-[#161c2e]/70 border border-white/70 dark:border-white/10 rounded-2xl animate-pulse" />
                  <div className="h-32 bg-white/70 dark:bg-[#161c2e]/70 border border-white/70 dark:border-white/10 rounded-2xl animate-pulse" />
                  <div className="h-32 bg-white/70 dark:bg-[#161c2e]/70 border border-white/70 dark:border-white/10 rounded-2xl animate-pulse" />
                </div>

                <div className="h-12 w-48 bg-slate-200 dark:bg-white/10 rounded mb-4 animate-pulse" />
                <div className="h-64 bg-white/70 dark:bg-[#161c2e]/70 border border-white/70 dark:border-white/10 rounded-2xl animate-pulse" />
              </div>
            </main>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none relative overflow-hidden">
        <div className="absolute -top-32 right-0 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex min-h-[calc(100vh-68px)]">
          <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white/65 dark:bg-[#12182a]/80 backdrop-blur-xl border-r border-white/70 dark:border-white/10">
            <div className="p-6 border-b border-slate-200/70 dark:border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Careerly</p>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">Candidate Panel</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{user?.name || "Candidate"}</p>
            </div>

            <nav className="p-4 space-y-1.5">
              <Link to="/Dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-400/20 text-blue-700 dark:text-blue-300 font-semibold text-sm">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center">⌂</span>
                Dashboard
              </Link>

              <Link to="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5 transition text-sm font-medium">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">▦</span>
                Find Jobs
              </Link>

              <Link to="/userprofile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5 transition text-sm font-medium">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">◉</span>
                My Profile
              </Link>

              <a href="#applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5 transition text-sm font-medium">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">▤</span>
                Applications
              </a>

              <Link to="/favourites" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/5 transition text-sm font-medium">
                <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center">♡</span>
                Favourites
              </Link>
            </nav>

            <div className="mt-auto p-4">
              <div className="rounded-2xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-100 dark:border-white/10 p-4">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Keep your profile updated</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Add skills and experience to get better job matches.</p>
                <Link to="/userprofile" className="inline-block mt-3 text-xs font-bold text-blue-600 dark:text-blue-300 hover:underline">Update profile →</Link>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0 px-5 sm:px-7 lg:px-9 py-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">Overview</p>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                    Welcome back, <span className="text-blue-600 dark:text-blue-300">{user?.name || "Candidate"}</span>
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Track your applications and discover your next opportunity.</p>
                </div>

                <Link to="/jobs" className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-blue-500/20 transition">
                  Find Jobs <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="relative overflow-hidden bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-lg dark:shadow-black/20">
                  <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-blue-400/15 dark:bg-blue-500/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Applied Jobs</p>
                      <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">{appliedCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applications submitted</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/20 text-blue-600 dark:text-blue-300 flex items-center justify-center text-lg font-bold">A</div>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-lg dark:shadow-black/20">
                  <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-emerald-400/15 dark:bg-emerald-500/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Shortlisted</p>
                      <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">{shortlistedCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applications accepted</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-lg font-bold">✓</div>
                  </div>
                </div>

                <div className="relative overflow-hidden bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-lg dark:shadow-black/20">
                  <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-purple-400/15 dark:bg-purple-500/10 blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Under Review</p>
                      <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-300 mt-2">{pendingCount}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Waiting for response</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-400/20 text-purple-600 dark:text-purple-300 flex items-center justify-center text-lg font-bold">◷</div>
                  </div>
                </div>
              </div>

              <section className="mb-8">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">For you</p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Recommended Jobs</h2>
                  </div>
                  <Link to="/jobs" className="text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline">View all →</Link>
                </div>

                {recommendedJobs.length === 0 ? (
                  <div className="bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl py-12 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-sm">No recommendations yet — add some skills to your profile to get personalized matches.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {recommendedJobs.map((job, index) => (
                      <div key={job._id} className="group relative rounded-2xl p-px bg-linear-to-br from-slate-200/80 via-white/60 to-blue-200/60 dark:from-white/10 dark:via-blue-500/10 dark:to-purple-500/20 hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300 dark:hover:from-blue-500/40 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/40 transition-all duration-300">
                        <div className="relative h-full bg-white/90 dark:bg-[#161c2e]/90 backdrop-blur-xl rounded-2xl p-5 overflow-hidden">
                          <div className={`absolute top-0 left-5 right-5 h-1 rounded-b-full ${index % 3 === 0 ? "bg-blue-500" : index % 3 === 1 ? "bg-purple-500" : "bg-teal-400"}`} />

                          <div className="flex items-start justify-between gap-3 mt-1">
                            <div className="min-w-0">
                              <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition">{job.title}</h3>
                              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1 truncate">{job.company?.companyname || "Company"}</p>
                            </div>
                            <span className="w-9 h-9 shrink-0 rounded-xl bg-slate-100 dark:bg-white/5 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">{job.company?.companyname?.charAt(0).toUpperCase() || "J"}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            {job.location && <span className="bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-full text-xs font-semibold">{job.location}</span>}
                            {job.jobType && <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-2.5 py-1 rounded-full text-xs font-semibold">{job.jobType}</span>}
                          </div>

                          <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/20 px-2.5 py-1 rounded-full text-xs font-bold">
                            {job.matchCount} matching skill{job.matchCount > 1 ? "s" : ""}
                          </div>

                          <Link to={`/jobs/${job._id}`} className="mt-5 flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-white/10 hover:bg-blue-600 dark:hover:bg-blue-500/20 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                            View Details <span>→</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section id="applications" className="scroll-mt-24">
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">Activity</p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Your Applications</h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{applications.length} total</span>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl py-12 text-center">
                    <p className="text-slate-400 dark:text-slate-500 text-sm">You haven't applied to any jobs yet.</p>
                    <Link to="/jobs" className="inline-block mt-3 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline">Explore jobs →</Link>
                  </div>
                ) : (
                  <div className="bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-lg dark:shadow-black/20">
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/70 dark:border-white/10">
                          <tr>
                            <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Job</th>
                            <th className="px-6 py-4 text-left text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Company</th>
                            <th className="px-6 py-4 text-right text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-6 py-4 text-right text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {applications.map((app) => (
                            <tr key={app._id} className="border-b last:border-0 border-slate-200/70 dark:border-white/10 hover:bg-slate-50/60 dark:hover:bg-white/3 transition">
                              <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                                {app.job?._id ? (
                                  <Link to={`/jobs/${app.job._id}`} className="hover:text-blue-600 dark:hover:text-blue-300 transition">{app.job?.title || "Job unavailable"}</Link>
                                ) : app.job?.title || "Job unavailable"}
                              </td>

                              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                {app.company?.companyname || app.job?.company?.companyname || "-"}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${app.status === "Accepted" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/20" : app.status === "Rejected" ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20" : "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20"}`}>
                                  {app.status}
                                </span>
                              </td>

                              <td className="px-6 py-4 text-right">
                                <button onClick={() => setDeleteId(app._id)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-semibold text-xs">
                                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 6h18" />
                                    <path d="M8 6V4h8v2" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v5M14 11v5" />
                                  </svg>
                                  Withdraw
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="md:hidden divide-y divide-slate-200/70 dark:divide-white/10">
                      {applications.map((app) => (
                        <div key={app._id} className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              {app.job?._id ? (
                                <Link to={`/jobs/${app.job._id}`} className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-300">{app.job?.title || "Job unavailable"}</Link>
                              ) : (
                                <p className="font-semibold text-slate-900 dark:text-white">{app.job?.title || "Job unavailable"}</p>
                              )}

                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{app.company?.companyname || app.job?.company?.companyname || "-"}</p>
                            </div>

                            <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${app.status === "Accepted" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/20" : app.status === "Rejected" ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20" : "bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/20"}`}>
                              {app.status}
                            </span>
                          </div>

                          <button onClick={() => setDeleteId(app._id)} className="mt-4 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition font-semibold text-sm">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v5M14 11v5" />
                            </svg>
                            Withdraw Application
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>

        {/* Withdraw Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white/95 dark:bg-[#161c2e]/95 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-500 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5M14 11v5" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Withdraw Application?
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to withdraw this application? This action cannot be undone.
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handleWithdraw}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-lg shadow-red-500/20 transition disabled:opacity-60"
                >
                  {deleting ? "Withdrawing..." : "Withdraw Application"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDashboard;

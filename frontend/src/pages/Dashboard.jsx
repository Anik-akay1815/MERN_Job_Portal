import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/authService.js";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setDashboard(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const company = JSON.parse(localStorage.getItem("user") || "null");

  const recentJobs = dashboard?.recentJobs || [];

  const filteredJobs = recentJobs.filter((job) =>
    job.title?.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const totalApplications = dashboard?.totalApplications ?? 0;
  const pending = dashboard?.pending ?? 0;
  const accepted = dashboard?.accepted ?? 0;
  const rejected = dashboard?.rejected ?? 0;
  const totalJobs = dashboard?.totalJobs ?? 0;

  const pct = (value) =>
    totalApplications > 0 ? Math.round((value / totalApplications) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] text-slate-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#2b353f] border-t-blue-500" />
          <p className="mt-4 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none text-slate-900 dark:text-white relative overflow-hidden">
      <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-blue-400/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ================= NAVBAR ================= */}
      <Navbar />

      <div className="flex">
        {/* ================= SIDEBAR ================= */}
        <aside className="sticky z-10 hidden lg:flex w-60 min-h-[calc(100vh-73px)] bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl border-r border-slate-200/70 dark:border-white/10 flex-col top-18.25">
          {/* Sidebar heading */}
          <div className="px-5 py-6 border-b border-slate-200/70 dark:border-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Workspace
            </p>

            <h2 className="text-lg font-bold mt-1 text-slate-900 dark:text-white">Careerly Company Panel</h2>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-2">
            <Link
              to="/Dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 border-l-2 border-blue-500 text-slate-900 dark:text-white"
            >
              <span className="text-blue-500 dark:text-blue-300">▣</span>
              Dashboard
            </Link>

            <Link
              to="/postjob"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/5 transition"
            >
              <span>＋</span>
              Post a Job
            </Link>

            <Link
              to="/myjobs"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/5 transition"
            >
              <span>▤</span>
              My Jobs
            </Link>

            <Link
              to="/companyprofile"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-white/5 transition"
            >
              <span>◉</span>
              Company Profile
            </Link>
          </div>

          {/* Bottom info */}
          <div className="mt-auto p-5 border-t border-[#27303a]">
            <p className="text-xs text-slate-500 dark:text-slate-400">Logged in as</p>

            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1 truncate">
              {company?.companyname || "Company"}
            </p>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="relative z-10 flex-1 min-w-0">
          <div className="max-w-350 mx-auto px-5 md:px-8 py-7">
            {/* ================= TOP HEADER ================= */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-blue-500 dark:text-blue-300 mb-2">
                  Overview
                </p>

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  Welcome back,{" "}
                  <span className="text-blue-500 dark:text-blue-300">
                    {company?.companyname || "Company"}
                  </span>
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Monitor your jobs and candidate applications.
                </p>
              </div>

              <Link
                to="/postjob"
                className="relative z-10 inline-flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 cursor-pointer"
              >
                <span className="text-lg">＋</span>
                Post New Job
              </Link>
            </div>

            {/* ================= STAT CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
              {/* Applications */}
              <div className="relative overflow-hidden bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-black/20">
                <div className="absolute right-0 top-0 w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600/5 rounded-full blur-2xl" />

                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Total Applications
                  </p>

                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-500 dark:text-blue-300">
                    ◈
                  </span>
                </div>

                <p className="text-3xl font-bold mt-4">{totalApplications}</p>

                <div className="mt-4 h-0.5 bg-slate-200 dark:bg-white/10">
                  <div className="h-full bg-linear-to-r from-blue-500 to-indigo-600 w-[70%]" />
                </div>
              </div>

              {/* Jobs */}
              <div className="relative overflow-hidden bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Jobs Posted
                  </p>

                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-500 dark:text-blue-300">
                    ▤
                  </span>
                </div>

                <p className="text-3xl font-bold mt-4">{totalJobs}</p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Active positions in your company
                </p>
              </div>

              {/* Accepted */}
              <div className="relative overflow-hidden bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Accepted
                  </p>

                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                    ✓
                  </span>
                </div>

                <p className="text-3xl font-bold mt-4 text-emerald-500 dark:text-emerald-400">
                  {accepted}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {pct(accepted)}% of total applications
                </p>
              </div>

              {/* Pending */}
              <div className="relative overflow-hidden bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-black/20">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Pending
                  </p>

                  <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-500 dark:text-blue-300">
                    ◷
                  </span>
                </div>

                <p className="text-3xl font-bold mt-4 text-blue-500 dark:text-blue-300">
                  {pending}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Waiting for review</p>
              </div>
            </div>

            {/* ================= MAIN GRID ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
              {/* ================= RECENT JOBS ================= */}
              <div className="xl:col-span-2 bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/20">
                <div className="px-5 py-4 border-b border-slate-200/70 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-500 dark:text-blue-300">
                      Activity
                    </p>

                    <h2 className="font-bold text-lg mt-1">
                      Recent Job Postings
                    </h2>
                  </div>

                  <Link
                    to="/myjobs"
                    className="text-xs text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition"
                  >
                    View All →
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <div className="py-14 text-center">
                    <div className="text-3xl text-slate-500 dark:text-slate-400 mb-3">▤</div>

                    <p className="text-slate-500 dark:text-slate-400">No jobs posted yet</p>

                    <Link
                      to="/postjob"
                      className="inline-block mt-4 text-xs text-blue-500 dark:text-blue-300 hover:underline"
                    >
                      Create your first job →
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200 dark:divide-white/10">
                    {recentJobs.slice(0, 5).map((job) => (
                      <div
                        key={job._id}
                        className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/60 dark:hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-300 font-bold"
                          >
                            {job.title?.charAt(0)?.toUpperCase() || "J"}
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">
                              {job.title}
                            </h3>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              📍 {job.location}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/jobs/${job._id}`}
                          className="text-xs font-semibold border border-slate-200 dark:border-white/10 px-4 py-2 rounded-md text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-300 hover:text-blue-500 transition"
                        >
                          View Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= APPLICATION BREAKDOWN ================= */}
              <div className="relative overflow-hidden bg-white/75 dark:bg-[#111820] backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-black/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-500 dark:text-blue-300">
                      Analytics
                    </p>

                    <h2 className="font-bold text-lg mt-1">Applications</h2>
                  </div>

                  <span className="text-xs text-slate-500 dark:text-slate-400">Overview</span>
                </div>

                {/* Fake circular visual */}
                <div className="flex justify-center mb-7">
                  <div
                    className="relative w-36 h-36 rounded-full flex items-center justify-center bg-slate-50/80 dark:bg-[#151d25] border-10 border-slate-200 dark:border-[#2b353f] shadow-[0_0_30px_rgba(59,130,246,0.08)]"
                  >
                    <div
                      className="absolute -inset-2.5 rounded-full border-10 border-transparent border-t-blue-500 border-r-blue-500 rotate-[-25deg]"
                    />

                    <div className="text-center relative z-10">
                      <p className="text-2xl font-bold">{totalApplications}</p>

                      <p className="text-[9px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Total
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pending */}
                <div className="flex items-center justify-between py-3 border-b border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-linear-to-r from-blue-500 to-indigo-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pending</span>
                  </div>

                  <span className="font-semibold">{pending}</span>
                </div>

                {/* Accepted */}
                <div className="flex items-center justify-between py-3 border-b border-slate-200/70 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Accepted</span>
                  </div>

                  <span className="font-semibold">{accepted}</span>
                </div>

                {/* Rejected */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Rejected</span>
                  </div>

                  <span className="font-semibold">{rejected}</span>
                </div>
              </div>
            </div>

            {/* ================= JOB LISTINGS ================= */}
            <div className="bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-black/20">
              {/* Header */}
              <div className="px-5 py-5 border-b border-slate-200/70 dark:border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-500 dark:text-blue-300">
                      Positions
                    </p>

                    <h2 className="text-lg font-bold mt-1">Job Listings</h2>
                  </div>

                  {/* Search */}
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search positions..."
                      className="w-full bg-white/70 dark:bg-[#0f1420]/80 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2] focus:ring-1 focus:ring-blue-400 transition"
                    />

                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
                    >
                      ⌕
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/80 dark:bg-white/5 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-4 text-left font-medium">
                        Position
                      </th>

                      <th className="px-5 py-4 text-left font-medium">
                        Location
                      </th>

                      <th className="px-5 py-4 text-left font-medium">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-5 py-12 text-center text-slate-500 dark:text-slate-400"
                        >
                          No positions found
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr
                          key={job._id}
                          className="border-t border-slate-200/70 dark:border-white/10 hover:bg-blue-50/60 dark:hover:bg-white/5 transition"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-md bg-slate-100 dark:bg-white/5 flex items-center justify-center text-blue-500 dark:text-blue-300 text-xs font-bold"
                              >
                                {job.title?.charAt(0)?.toUpperCase() || "J"}
                              </div>

                              <span className="font-semibold text-slate-900 dark:text-white">
                                {job.title}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                            📍 {job.location}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center gap-2 text-xs text-emerald-500 dark:text-emerald-400"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                              Active
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="inline-block text-xs font-semibold px-3 py-1.5 rounded-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-blue-400 dark:hover:border-blue-300 hover:text-blue-500 transition"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <span>Careerly • Company Dashboard</span>

              <span>Dashboard Overview</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

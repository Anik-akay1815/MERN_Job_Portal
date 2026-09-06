import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/authService.js";

function Dashboard() {
  const [Dashboard, setDashboard] = useState(null);
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

  const company = JSON.parse(localStorage.getItem("user"));

  const recentJobs = Dashboard?.recentJobs || [];
  const filteredJobs = recentJobs.filter((job) =>
    job.title?.toLowerCase().includes(search.trim().toLowerCase())
  );

  const totalApplications = Dashboard?.totalApplications ?? 0;
  const pending = Dashboard?.pending ?? 0;
  const accepted = Dashboard?.accepted ?? 0;
  const rejected = Dashboard?.rejected ?? 0;

  const pct = (value) =>
    totalApplications > 0 ? Math.round((value / totalApplications) * 100) : 0;

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hey {company?.companyname || "there"}! 👋
            </h1>
            <p className="text-gray-500 mt-1">
              Here's an overview of your job postings and applications
            </p>
          </div>
          <Link
            to="/postjob"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            + Post a Job
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center py-10">
            Loading Dashboard...
          </p>
        ) : (
          <>
            {/* Stat Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <p className="text-4xl font-bold relative">
                  {totalApplications}
                </p>
                <p className="text-indigo-100 font-medium mt-1 relative text-sm">
                  📄 Applicants
                </p>
              </div>

              <div className="relative overflow-hidden bg-linear-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-sky-200">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <p className="text-4xl font-bold relative">
                  {Dashboard?.totalJobs ?? 0}
                </p>
                <p className="text-sky-100 font-medium mt-1 relative text-sm">
                  💼 Jobs Posted
                </p>
              </div>

              <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <p className="text-4xl font-bold relative">{accepted}</p>
                <p className="text-emerald-100 font-medium mt-1 relative text-sm">
                  ✅ Accepted
                </p>
              </div>

              <div className="relative overflow-hidden bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 blur-xl" />
                <p className="text-4xl font-bold relative">{pending}</p>
                <p className="text-orange-50 font-medium mt-1 relative text-sm">
                  ⏳ Pending
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {/* Recent Jobs cards */}
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Jobs
                  </h2>
                  <Link
                    to="/myjobs"
                    className="text-slate-700 font-semibold hover:underline text-sm"
                  >
                    View All →
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
                    No jobs posted yet
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {recentJobs.map((job) => (
                      <div
                        key={job._id}
                        className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <h3 className="font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          📍 {job.location}
                        </p>
                        <Link
                          to={`/jobs/${job._id}`}
                          className="inline-block mt-3 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:underline"
                        >
                          View Details →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Application Breakdown */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
                <h2 className="text-base font-bold text-gray-900 mb-4">
                  Applications Breakdown
                </h2>

                <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-100 mb-5">
                  <div
                    className="bg-orange-400"
                    style={{ width: `${pct(pending)}%` }}
                  />
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${pct(accepted)}%` }}
                  />
                  <div
                    className="bg-red-400"
                    style={{ width: `${pct(rejected)}%` }}
                  />
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                      Pending
                    </span>
                    <span className="font-semibold text-gray-800">
                      {pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Accepted
                    </span>
                    <span className="font-semibold text-gray-800">
                      {accepted}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      Rejected
                    </span>
                    <span className="font-semibold text-gray-800">
                      {rejected}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings table with search */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Job Listings
              </h2>

              <div className="relative mb-4 max-w-sm">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search positions..."
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔍
                </span>
              </div>

              <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5 font-semibold">Position</th>
                      <th className="px-6 py-3.5 font-semibold">Location</th>
                      <th className="px-6 py-3.5 font-semibold text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-gray-400"
                        >
                          No positions found
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map((job) => (
                        <tr
                          key={job._id}
                          className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-800">
                            {job.title}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            📍 {job.location}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="text-xs font-semibold text-slate-700 border border-slate-200 bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
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
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
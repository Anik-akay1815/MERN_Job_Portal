import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getMyApplications, getAllJobs } from "../services/authService.js";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    setUser(data);
    if (data?._id) {
      fetchAll(data._id);
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

  if (loading || !user) {
    return (
      <>
        <Navbar />
        <h2 className="text-center mt-10">Loading...</h2>
      </>
    );
  }

  const appliedCount = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "Pending"
  ).length;

  const appliedJobIds = applications.map((a) => a.job?._id);

  // Recommend jobs whose required skills overlap with the user's own skills.
  const userSkills = (user.skills || []).map((s) => s.toLowerCase());
  const scoredJobs = jobs
    .filter((j) => !appliedJobIds.includes(j._id))
    .map((j) => {
      const jobSkills = (j.skillsRequired || []).map((s) => s.toLowerCase());
      const matchCount = jobSkills.filter((s) =>
        userSkills.includes(s)
      ).length;
      return { ...j, matchCount };
    });

  const hasSkillMatches = scoredJobs.some((j) => j.matchCount > 0);
  const recommendedJobs = hasSkillMatches
    ? scoredJobs
        .filter((j) => j.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 6)
    : scoredJobs.slice(0, 6);

  const statusBadge = (status) => {
    if (status === "Accepted") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "Rejected") {
      return "bg-red-50 text-red-600 border-red-200";
    }
    return "bg-orange-50 text-orange-600 border-orange-200";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 mb-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-500 mb-8">
          Here's an overview of your job search
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">
                  Applied Jobs
                </p>
                <p className="text-4xl font-bold mt-1">{appliedCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                📄
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">
                  Shortlisted
                </p>
                <p className="text-4xl font-bold mt-1">{shortlistedCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                ✅
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-orange-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-orange-50 text-sm font-medium">
                  Under Review
                </p>
                <p className="text-4xl font-bold mt-1">{pendingCount}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                ⏳
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recommended for You
            </h2>
            <Link
              to="/jobs"
              className="text-sm font-semibold text-slate-700 hover:underline"
            >
              View all jobs →
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-10 text-center border border-gray-100">
              <p className="text-gray-400 text-sm">
                No recommendations yet — add some skills to your profile to
                get personalized matches.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col"
                >
                  <h3 className="font-bold text-gray-900">{job.title}</h3>
                  <p className="text-slate-700 text-sm font-semibold mt-0.5">
                    {job.company?.companyname}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.location && (
                      <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                        📍 {job.location}
                      </span>
                    )}
                    {job.jobType && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                        🕒 {job.jobType}
                      </span>
                    )}
                  </div>

                  {job.matchCount > 0 && (
                    <p className="text-xs font-semibold text-emerald-600 mt-3">
                      🎯 {job.matchCount} matching skill
                      {job.matchCount > 1 ? "s" : ""}
                    </p>
                  )}

                  <Link
                    to={`/jobs/${job._id}`}
                    className="mt-4 text-center text-sm font-semibold bg-slate-700 hover:bg-slate-800 text-white py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Status */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Applications
          </h2>

          {applications.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl py-10 text-center border border-gray-100">
              <p className="text-gray-400 text-sm">
                You haven't applied to any jobs yet.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-[11px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Job</th>
                    <th className="px-6 py-3.5 font-semibold">Company</th>
                    <th className="px-6 py-3.5 font-semibold text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {app.job?._id ? (
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="hover:text-emerald-600 transition-colors"
                          >
                            {app.job?.title || "Job unavailable"}
                          </Link>
                        ) : (
                          app.job?.title || "Job unavailable"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {app.company?.companyname ||
                          app.job?.company?.companyname ||
                          "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
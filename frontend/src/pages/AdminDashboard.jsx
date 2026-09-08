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

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith("http")) return image;
    return `${import.meta.env.VITE_API_URL}${image.startsWith("/") ? image : `/${image}`}`;
  };

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

  const candidateUsers = users.filter((user) => user.role !== "admin");
  const activeJobs = jobs.filter(
    (job) => !job.applicationDeadline || new Date(job.applicationDeadline) >= new Date()
  );
  const expiredJobs = jobs.filter(
    (job) => job.applicationDeadline && new Date(job.applicationDeadline) < new Date()
  );

  const displayedUsers = showAllUsers ? candidateUsers : candidateUsers.slice(0, 3);
  const displayedCompanies = showAllCompanies ? companies : companies.slice(0, 3);
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 3);

  const requestDelete = (type, id, name) => {
    setConfirmTarget({ type, id, name });
  };

  const cancelDelete = () => {
    setConfirmTarget(null);
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;

    const { type, id } = confirmTarget;

    try {
      if (type === "user") {
        await deleteUserAdmin(id);
        setUsers((prev) => prev.filter((user) => user._id !== id));
      }

      if (type === "company") {
        await deleteCompanyAdmin(id);
        setCompanies((prev) => prev.filter((company) => company._id !== id));
      }

      if (type === "job") {
        await deleteJobAdmin(id);
        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setConfirmTarget(null);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <p className="text-sm font-semibold text-emerald-600 mb-1">
                ADMIN PANEL
              </p>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Monitor and manage your JobPortal platform
              </p>
            </div>

            <div className="mt-4 md:mt-0 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
              <p className="text-xs text-gray-400">Platform Status</p>
              <p className="text-sm font-semibold text-emerald-600 mt-1">
                ● System Active
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Candidates</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {candidateUsers.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Registered users
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                  👤
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Companies</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {companies.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Registered companies
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                  🏢
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {jobs.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    All job listings
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                  💼
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {activeJobs.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Currently available
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl">
                  📈
                </div>
              </div>
            </div>

          </div>

          {/* Overview */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Platform Overview
                </h2>
                <p className="text-sm text-gray-500">
                  Current platform activity
                </p>
              </div>
              <span className="text-sm text-gray-400">
                Updated just now
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Candidates</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {candidateUsers.length}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Companies</p>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {companies.length}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Active Jobs</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">
                  {activeJobs.length}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Expired Jobs</p>
                <p className="text-xl font-bold text-red-500 mt-1">
                  {expiredJobs.length}
                </p>
              </div>
            </div>
          </div>

          {/* Candidates */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  👤 Candidates
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Registered job seekers
                </p>
              </div>

              {candidateUsers.length > 3 && (
                <button
                  onClick={() => setShowAllUsers(!showAllUsers)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
                >
                  {showAllUsers ? "Show Less ↑" : `View All (${candidateUsers.length}) ↓`}
                </button>
              )}
            </div>

            {candidateUsers.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                No candidates found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {getImageUrl(user.profilePhoto) ? (
                        <img
                          src={getImageUrl(user.profilePhoto)}
                          alt={user.name}
                          className="w-14 h-14 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xl font-bold">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                      <Link
                        to={`/user/${user._id}`}
                        className="flex-1 text-center bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() =>
                          requestDelete("user", user._id, user.name)
                        }
                        className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Companies */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  🏢 Companies
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Companies registered on JobPortal
                </p>
              </div>

              {companies.length > 3 && (
                <button
                  onClick={() => setShowAllCompanies(!showAllCompanies)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
                >
                  {showAllCompanies ? "Show Less ↑" : `View All (${companies.length}) ↓`}
                </button>
              )}
            </div>

            {companies.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                No companies found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedCompanies.map((company) => (
                  <div
                    key={company._id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      {getImageUrl(company.logo) ? (
                        <img
                          src={getImageUrl(company.logo)}
                          alt={company.companyname}
                          className="w-14 h-14 rounded-xl object-contain border border-gray-200 bg-white p-1"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
                          {company.companyname?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">
                          {company.companyname}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {company.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                      <Link
                        to={`/company/${company._id}`}
                        className="flex-1 text-center bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition"
                      >
                        View Profile
                      </Link>

                      <button
                        onClick={() =>
                          requestDelete(
                            "company",
                            company._id,
                            company.companyname
                          )
                        }
                        className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 font-semibold transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Jobs */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  💼 Jobs
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Latest job listings posted by companies
                </p>
              </div>

              {jobs.length > 3 && (
                <button
                  onClick={() => setShowAllJobs(!showAllJobs)}
                  className="text-sm font-semibold text-slate-700 hover:text-emerald-600"
                >
                  {showAllJobs ? "Show Less ↑" : `View All (${jobs.length}) ↓`}
                </button>
              )}
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                No jobs found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {displayedJobs.map((job) => {
                  const isExpired =
                    job.applicationDeadline &&
                    new Date(job.applicationDeadline) < new Date();

                  return (
                    <div
                      key={job._id}
                      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-gray-900 truncate">
                            {job.title}
                          </h3>

                          <p className="text-slate-700 font-semibold mt-1 truncate">
                            {job.company?.companyname || "Company unavailable"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            isExpired
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}
                        >
                          {isExpired ? "Expired" : "Active"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {job.location && (
                          <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                            📍 {job.location}
                          </span>
                        )}

                        {job.jobType && (
                          <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                            🕒 {job.jobType}
                          </span>
                        )}

                        {job.category && (
                          <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                            📂 {job.category}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="flex-1 text-center bg-slate-700 text-white py-2.5 rounded-lg font-semibold hover:bg-slate-800 transition"
                        >
                          View Details
                        </Link>

                        <button
                          onClick={() =>
                            requestDelete("job", job._id, job.title)
                          }
                          className="px-4 py-2.5 rounded-lg border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 font-semibold transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full">

            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto mb-5">
              ⚠️
            </div>

            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Are you sure?
            </h3>

            <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
              Do you really want to delete{" "}
              <span className="font-semibold text-gray-800">
                {confirmTarget.name}
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg transition"
              >
                No, cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition"
              >
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
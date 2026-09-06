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

  const fetchAll = async () => {
    try {
      const [usersRes, companiesRes, jobsRes] = await Promise.all([
        getAllUsersAdmin(),
        getAllCompaniesAdmin(),
        getAllJobsAdmin(),
      ]);
      setUsers(usersRes.data.data);
      setCompanies(companiesRes.data.data);
      setJobs(jobsRes.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Exclude admin accounts from the candidate list — admins manage their own
  // profile via the navbar, not through this table.
  const candidateUsers = users.filter((u) => u.role !== "admin");

  const requestDelete = (type, id, name) => {
    setConfirmTarget({ type, id, name });
  };

  const cancelDelete = () => setConfirmTarget(null);

  const confirmDelete = async () => {
    const { type, id } = confirmTarget;
    try {
      if (type === "user") {
        await deleteUserAdmin(id);
        setUsers(users.filter((u) => u._id !== id));
      } else if (type === "company") {
        await deleteCompanyAdmin(id);
        setCompanies(companies.filter((c) => c._id !== id));
      } else if (type === "job") {
        await deleteJobAdmin(id);
        setJobs(jobs.filter((j) => j._id !== id));
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
        <h2 className="text-center mt-10">Loading...</h2>
      </>
    );
  }

  const chartData = [
    { name: "Users", count: candidateUsers.length, fill: "#6366f1" },
    { name: "Companies", count: companies.length, fill: "#0ea5e9" },
    { name: "Jobs", count: jobs.length, fill: "#10b981" },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto mt-10 mb-16 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Manage users, companies and job listings
        </p>
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          <div className="relative overflow-hidden bg-linear-to-br from-indigo-500 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">
                  Total Candidates
                </p>
                <p className="text-4xl font-bold mt-1">
                  {candidateUsers.length}
                </p>
                <p className="text-indigo-200 text-xs mt-1">
                  Registered on the platform
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                👤
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-sky-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sky-100 text-sm font-medium">
                  Total Companies
                </p>
                <p className="text-4xl font-bold mt-1">{companies.length}</p>
                <p className="text-sky-200 text-xs mt-1">
                  Actively hiring on the platform
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                🏢
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden bg-linear-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10 blur-xl" />
            <div className="absolute -right-2 -bottom-8 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">
                  Total Jobs
                </p>
                <p className="text-4xl font-bold mt-1">{jobs.length}</p>
                <p className="text-emerald-200 text-xs mt-1">
                  Listed across all companies
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0 shadow-inner">
                💼
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>👤</span> Candidates
            </h2>
            <span className="text-xs font-medium text-gray-400">
              {candidateUsers.length} total
            </span>
          </div>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Name</th>
                  <th className="px-6 py-3.5 font-semibold">Email</th>
                  <th className="px-6 py-3.5 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {candidateUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No candidates found
                    </td>
                  </tr>
                ) : (
                  candidateUsers.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/user/${u._id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-semibold text-xs shadow-sm shrink-0">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {u.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => requestDelete("user", u._id, u.name)}
                          className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Companies Table */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🏢</span> Companies
            </h2>
            <span className="text-xs font-medium text-gray-400">
              {companies.length} total
            </span>
          </div>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Company</th>
                  <th className="px-6 py-3.5 font-semibold">Location</th>
                  <th className="px-6 py-3.5 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No companies found
                    </td>
                  </tr>
                ) : (
                  companies.map((c) => (
                    <tr
                      key={c._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Link
                          to={`/company/${c._id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="w-9 h-9 rounded-full bg-linear-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm shrink-0">
                            {c.companyname?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 group-hover:text-sky-600 transition-colors">
                            {c.companyname}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        📍 {c.location}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            requestDelete("company", c._id, c.companyname)
                          }
                          className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jobs Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>💼</span> Jobs
            </h2>
            <span className="text-xs font-medium text-gray-400">
              {jobs.length} total
            </span>
          </div>
          <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 text-gray-500 text-left uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Title</th>
                  <th className="px-6 py-3.5 font-semibold">Company</th>
                  <th className="px-6 py-3.5 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  jobs.map((j) => (
                    <tr
                      key={j._id}
                      className="border-t border-gray-100 hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        <Link
                          to={`/jobs/${j._id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {j.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {j.company?.companyname || "-"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => requestDelete("job", j._id, j.title)}
                          className="text-xs font-semibold text-red-500 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Do you really want to delete{" "}
              <span className="font-semibold text-gray-700">
                {confirmTarget.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
              >
                No, cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
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

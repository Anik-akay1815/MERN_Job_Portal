import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import { getDashboard } from "../services/authService.js";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 mb-8">
          Overview of your job postings and applications
        </p>

        {loading ? (
          <p className="text-gray-500 text-center py-10">
            Loading dashboard...
          </p>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-slate-700">
                  {dashboard?.totalJobs ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">💼 Total Jobs</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-emerald-600">
                  {dashboard?.totalApplications ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">
                  📄 Total Applications
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-yellow-600">
                  {dashboard?.pending ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">⏳ Pending</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-green-600">
                  {dashboard?.accepted ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">✅ Accepted</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-red-600">
                  {dashboard?.rejected ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">❌ Rejected</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <p className="text-3xl font-bold text-slate-500">
                  {dashboard?.recentJobs?.length ?? 0}
                </p>
                <p className="text-gray-500 font-medium mt-1">🆕 Recent Jobs</p>
              </div>
            </div>

            {/* Recent jobs */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Recent Jobs
                </h2>
                <Link
                  to="/myjobs"
                  className="text-slate-700 font-semibold hover:underline"
                >
                  View All →
                </Link>
              </div>

              {!dashboard?.recentJobs || dashboard.recentJobs.length === 0 ? (
                <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
                  No jobs posted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {dashboard.recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex justify-between items-center flex-wrap gap-3"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                          📍 {job.location}
                        </p>
                      </div>
                      <Link
                        to={`/jobs/${job._id}`}
                        className="text-slate-700 font-semibold hover:text-slate-900 hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;

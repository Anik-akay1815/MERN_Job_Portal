import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import {
  deleteApplication,
  getUserApplications,
} from "../services/authService.js";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await getUserApplications(user._id);
      console.log(res.data);
      setApplications(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id) => {
    try {
      await deleteApplication(id);
      alert("Application Withdrawn successfully");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    }

    if (status === "Rejected") {
      return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20";
    }

    return "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] transition-colors duration-300">
        <div className="relative overflow-hidden max-w-6xl mx-auto px-4 py-10 pb-16">

          <div className="absolute -top-32 -right-20 w-80 h-80 bg-purple-300/25 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-72 -left-40 w-80 h-80 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-2">
                  Activity
                </p>

                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  My Applications
                </h1>

                <p className="text-slate-500 dark:text-slate-400 mt-2">
                  Track and manage all your job applications
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/70 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300">
                {applications.length} Application{applications.length !== 1 ? "s" : ""}
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl rounded-2xl py-16 text-center border border-white/70 dark:border-white/10 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 flex items-center justify-center text-2xl mb-4">
                  📄
                </div>

                <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                  No Applications Yet
                </h2>

                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Start applying to jobs and track them here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {applications.map((app, index) => (
                  <div
                    key={app._id}
                    className="group relative rounded-2xl p-px bg-linear-to-br from-slate-200/80 via-white/60 to-blue-200/60 dark:from-white/10 dark:via-blue-500/10 dark:to-purple-500/20 hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300 dark:hover:from-blue-500/40 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/40 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden bg-white/90 dark:bg-[#161c2e]/90 backdrop-blur-xl rounded-2xl p-5 h-full min-h-65 border border-white/70 dark:border-white/10 shadow-sm dark:shadow-black/20 group-hover:shadow-xl dark:group-hover:shadow-black/40 transition-all duration-300">

                      <div className={`absolute top-0 left-5 right-5 h-1 rounded-b-full ${
                        index % 3 === 0
                          ? "bg-blue-500"
                          : index % 3 === 1
                            ? "bg-purple-500"
                            : "bg-teal-400"
                      }`} />

                      {/* Job Details */}
                      {app.job ? (
                        <>
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
                                {app.job.title}
                              </h2>

                              <p className="text-slate-600 dark:text-slate-300 text-sm font-semibold mt-1">
                                {app.company?.companyname || "Company unavailable"}
                              </p>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-blue-500 dark:text-blue-400 font-bold shrink-0">
                              {app.company?.companyname?.charAt(0)?.toUpperCase() || "C"}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold">
                              📍 {app.company?.location || "Location unavailable"}
                            </span>

                            {app.job.jobType && (
                              <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                                💼 {app.job.jobType}
                              </span>
                            )}

                            {app.job.experienceLevel && (
                              <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                                🎓 {app.job.experienceLevel}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
                              ?
                            </div>

                            <div>
                              <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                Job no longer available
                              </h2>

                              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                                This job has been removed by the company.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Status + Withdraw */}
                      <div className="mt-auto pt-5">
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            Application Status
                          </span>

                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(app.status)}`}>
                            {app.status}
                          </span>
                        </div>

                        <button
                          className="w-full bg-white/80 dark:bg-white/5 border border-red-200 dark:border-red-500/20 text-red-500 dark:text-red-400 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 font-semibold"
                          onClick={() => handleWithdraw(app._id)}
                        >
                          Withdraw Application
                        </button>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyApplications;
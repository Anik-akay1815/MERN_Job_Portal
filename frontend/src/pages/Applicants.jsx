import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getJobApplications,
  updateApplicationStatus,
} from "../services/authService";
import Navbar from "../components/Navbar";

function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const fetchApplications = async () => {
    try {
      const res = await getJobApplications(jobId);
      setApplications(res.data.data);
      console.log(jobId);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  const handleStatus = async (IdleDeadline, status) => {
    try {
      await updateApplicationStatus(IdleDeadline, { status });
      alert("Staus Updated");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f7f7f5] dark:bg-[#0b0b0b] transition-colors duration-300">
        <div className="max-w-5xl mx-auto pt-10 pb-10 px-4">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Job Applicants
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Review and manage applications for your jobs
          </p>

          {applications.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-[#1c1c1c] border border-transparent dark:border-[#343434] rounded-xl py-10">
              No applications yet
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md dark:shadow-black/30 hover:shadow-lg dark:hover:shadow-black/50 transition-all duration-300 p-6 border border-gray-200 dark:border-[#343434]"
                >
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-600 dark:bg-slate-500 text-white flex items-center justify-center font-bold text-lg">
                        {app.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white hover:underline">
                          <Link to={`/user/${app.user._id}`}>
                            {app.user?.name}
                          </Link>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {app.user?.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        app.status === "accepted"
                          ? "bg-green-50 dark:bg-[#1c3a2c] text-green-700 dark:text-green-400 border-green-200 dark:border-[#2e5a42]"
                          : app.status === "rejected"
                            ? "bg-red-50 dark:bg-[#3a1c1c] text-red-700 dark:text-red-400 border-red-200 dark:border-[#5a2e2e]"
                            : "bg-yellow-50 dark:bg-[#3a341c] text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-[#5a512e]"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mt-4">
                    Applied for:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {app.job?.title}
                    </span>
                  </p>
                  {app.user?.resume && (
                    <a
                      href={`http://localhost:19116/${app.user.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      📄 View Resume
                    </a>
                  )}

                  <div className="mt-5 flex gap-3">
                    <button
                      className="bg-emerald-500 dark:bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-500 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                      onClick={() => handleStatus(app._id, "Accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-white dark:bg-transparent border border-red-300 dark:border-red-500/40 text-red-600 dark:text-red-400 px-5 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 font-semibold"
                      onClick={() => handleStatus(app._id, "Rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Applicants;
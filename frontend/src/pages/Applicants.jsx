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
      <div className="max-w-5xl mx-auto mt-10 mb-10 px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Job Applicants
        </h1>
        <p className="text-gray-500 mb-8">
          Review and manage applications for your jobs
        </p>

        {applications.length === 0 ? (
          <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
            No applications yet
          </p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-lg">
                      {app.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 hover:underline">
                        <Link to={`/user/${app.user._id}`}>
                          {app.user?.name}
                        </Link>
                      </h2>
                      <p className="text-gray-500 text-sm">{app.user?.email}</p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      app.status === "accepted"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : app.status === "rejected"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <p className="text-gray-600 mt-4">
                  Applied for:{" "}
                  <span className="font-semibold text-gray-900">
                    {app.job?.title}
                  </span>
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                    onClick={() => handleStatus(app._id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-white border border-red-300 text-red-600 px-5 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 font-semibold"
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
    </>
  );
}
export default Applicants;

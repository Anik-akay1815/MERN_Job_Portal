import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import {
  getCompanyById,
  deleteJob,
} from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const company = JSON.parse(localStorage.getItem("user"));

      const res = await getCompanyById(company._id);

      setJobs(res.data.data.jobs);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);

      alert("Job deleted successfully");

      fetchJobs();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto mt-10 mb-10 px-4">

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          My Jobs
        </h1>

        <p className="text-gray-500 mb-8">
          Manage all the jobs you've posted
        </p>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
            No jobs posted yet
          </p>
        ) : (
          <div className="space-y-5">

            {jobs.map((job) => {

              const isExpired =
                job.applicationDeadline &&
                new Date(job.applicationDeadline) <
                  new Date();

              const formattedDeadline =
                job.applicationDeadline
                  ? new Date(
                      job.applicationDeadline
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : null;

              return (
                <div
                  key={job._id}
                  className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300"
                >

                  {/* Title + Deadline */}
                  <div className="flex justify-between items-start gap-4">

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {job.title}
                      </h2>

                      {job.category && (
                        <p className="text-sm text-gray-500 mt-1">
                          {job.category}
                        </p>
                      )}
                    </div>

                    {/* Deadline */}
                    {job.applicationDeadline && (
                      <span
                        className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                          isExpired
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-orange-50 text-orange-600 border-orange-200"
                        }`}
                      >
                        {isExpired
                          ? "⛔ Expired"
                          : `⏳ ${formattedDeadline}`}
                      </span>
                    )}

                  </div>

                  {/* Job Details */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    {job.location && (
                      <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                        📍 {job.location}
                      </span>
                    )}

                    {job.salary && (
                      <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                        ₹ {job.salary}
                      </span>
                    )}

                    {job.jobType && (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
                        💼 {job.jobType}
                      </span>
                    )}

                    {job.experienceLevel && (
                      <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                        🎓 {job.experienceLevel}
                      </span>
                    )}

                    {job.numberOfOpenings && (
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
                        👥 {job.numberOfOpenings}{" "}
                        {job.numberOfOpenings === 1
                          ? "Opening"
                          : "Openings"}
                      </span>
                    )}

                  </div>

                  {/* Skills */}
                  {job.skillsRequired &&
                    job.skillsRequired.length > 0 && (
                      <div className="mt-4">

                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Required Skills
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {job.skillsRequired
                            .slice(0, 6)
                            .map((skill, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}

                          {job.skillsRequired.length > 6 && (
                            <span className="text-gray-400 text-xs px-1 py-1">
                              +
                              {job.skillsRequired.length - 6}{" "}
                              more
                            </span>
                          )}
                        </div>

                      </div>
                    )}

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">

                    {/* Applicants */}
                    <button
                      className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                      onClick={() =>
                        navigate(
                          `/applications/${job._id}`
                        )
                      }
                    >
                      View Applicants
                    </button>

                    {/* Edit */}
                    <button
                      className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
                      onClick={() =>
                        navigate(
                          `/editjob/${job._id}`
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    {/* Delete */}
                    <button
                      className="bg-red-50 border border-red-200 text-red-600 px-5 py-2 rounded-lg hover:bg-red-100 transition-all duration-300 font-semibold"
                      onClick={() =>
                        handleDelete(job._id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}
      </div>
    </>
  );
}

export default MyJobs;
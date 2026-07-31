import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getCompanyById } from "../services/authService.js";
import { deleteJob } from "../services/authService.js";
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
      alert(err.response?.data?.message || "Something went wrong");
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
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 mb-10 px-4">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">My Jobs</h1>
        <p className="text-gray-500 mb-8">Manage all the jobs you've posted</p>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
            No jobs posted yet
          </p>
        ) : (
          <div className="space-y-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200 rounded-2xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h2>

                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold">
                    📍 {job.location}
                  </span>
                  <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
                    ₹ {job.salary}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                    💼 {job.jobtype}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
                    onClick={() => navigate(`/applications/${job._id}`)}
                  >
                    View Applicants
                  </button>
                  <button
                    className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
                    onClick={() => {
                      navigate(`/editjob/${job._id}`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-50 border border-red-200 text-red-600 px-5 py-2 rounded-lg hover:bg-red-100 transition-all duration-300 font-semibold"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
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
export default MyJobs;

import Navbar from "../components/Navbar.jsx";
import JobCard from "../components/JobCard.jsx";
import { useEffect, useState } from "react";
import { getAllJobs } from "../services/authService.js";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Browse <span className="text-slate-700">Jobs</span>
          </h1>
          <p className="text-gray-500 mt-2">
            Find your next opportunity from top companies
          </p>
        </div>

        {/* Search bar */}
        <div className="bg-white shadow-lg rounded-2xl p-5 flex flex-col sm:flex-row gap-3 mb-10 border border-gray-100">
          <input
            type="text"
            placeholder="🔍 Search Jobs"
            className="flex-1 border border-gray-300 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
          />
          <input
            type="text"
            placeholder="📍 Location"
            className="flex-1 border border-gray-300 px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
          />
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            Search
          </button>
        </div>

        {/* Job count */}
        <p className="text-gray-500 mb-4">{jobs.length} jobs found</p>

        {/* Job grid */}
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
            No jobs found
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <JobCard
                jobId={job._id}
                key={job._id}
                title={job.title}
                company={job.company?.companyname}
                location={job.location}
                salary={job.salary}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
export default Jobs;

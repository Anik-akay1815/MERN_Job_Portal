import Navbar from "../components/Navbar.jsx";
import JobCard from "../components/JobCard.jsx";
import { useEffect, useState } from "react";
import { getAllJobs } from "../services/authService.js";
import { Link } from "react-router-dom";

function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetchJobs();
  }, []);
  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();
      setJobs(res.data.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };
  return (
    <>
      <section className="max-w-6xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold">
            Handpicked for you
          </span>
          <h2 className="text-4xl font-bold mt-4">
            Featured<span className="text-slate-700"> Jobs</span>
          </h2>
          <p className="text-lg font-medium text-gray-500 mt-3">
            Explore the latest opportunities from top companies
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map((job) => (
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
        <div className="flex justify-center mt-12">
          <Link
            to="/jobs"
            className="bg-emerald-500 text-white px-8 py-3 rounded-xl hover:bg-emerald-600 font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            View All Jobs →
          </Link>
        </div>
      </section>
    </>
  );
}
export default FeaturedJobs;

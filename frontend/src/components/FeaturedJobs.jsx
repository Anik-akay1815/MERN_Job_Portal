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
      console.log(res.data);
      console.log(res);
      setJobs(res.data.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <section className="bg-[#f5f6fa] dark:bg-[#0f1420] py-16 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">

          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold
              bg-white/70 dark:bg-[#161c2e]/70
              border border-white/60 dark:border-white/10
              backdrop-blur-xl
              text-blue-500 dark:text-[#7cc2f2]"
          >
            Handpicked for you
          </span>

          <h2 className="text-4xl font-bold mt-4 text-slate-900 dark:text-white">
            Featured{" "}
            <span className="text-blue-500 dark:text-[#7cc2f2]">
              Jobs
            </span>
          </h2>

          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 mt-3">
            Explore the latest opportunities from top companies
          </p>
        </div>

        {/* Jobs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.slice(0, 3).map((job) => (
            <JobCard
              key={job._id}
              jobId={job._id}
              title={job.title}
              company={job.company?.companyname}
              location={job.location}
              salary={job.salary}
              jobType={job.jobType}
              experienceLevel={job.experienceLevel}
              skillsRequired={job.skillsRequired}
              category={job.category}
              numberOfOpenings={job.numberOfOpenings}
              applicationDeadline={job.applicationDeadline}
            />
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center mt-12">
          <Link
            to="/jobs"
            className="px-8 py-3 rounded-xl
              bg-blue-500 hover:bg-blue-600
              dark:bg-[#249bea] dark:hover:bg-[#1688d4]
              text-white font-semibold
              transition-all duration-300
              shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            View All Jobs →
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedJobs;
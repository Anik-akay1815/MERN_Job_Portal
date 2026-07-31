import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getJobById } from "../services/authService";
import { applyJob } from "../services/authService";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  useEffect(() => {
    fetchJob();
  }, []);
  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJob(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleApply = async () => {
    try {
      const res = await applyJob(job._id);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  if (!job) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-20 mb-10 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-4xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-600 mt-2">
              Posted by{" "}
              <Link
                to={`/company/${job.company._id}`}
                className="text-slate-700 font-semibold hover:underline"
              >
                {job.company.companyname}
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold">
              📍 {job.location}
            </span>
            <span className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold">
              💼 {job.jobType}
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-semibold">
              ₹ {job.salary}
            </span>
          </div>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Job Description
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
          <button
            className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
            onClick={handleApply}
          >
            Apply Now
          </button>
        </div>
      </div>
    </>
  );
}

export default JobDetail;

import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getJobById, applyJob } from "../services/authService";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [id]);

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
    return (
      <>
        <Navbar />
        <h2 className="text-center mt-20 text-xl font-semibold">Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto mt-20 mb-10 px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8">
          {/* Job Header */}
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

          {/* Job Basic Details */}
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Location */}
            {job.location && (
              <span className="bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-full text-sm font-semibold">
                📍 {job.location}
              </span>
            )}

            {/* Job Type */}
            {job.jobType && (
              <span className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full text-sm font-semibold">
                💼 {job.jobType}
              </span>
            )}

            {/* Salary */}
            {job.salary && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-semibold">
                ₹ {job.salary}
              </span>
            )}

            {/* Experience */}
            {job.experienceLevel && (
              <span className="bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 rounded-full text-sm font-semibold">
                🎓 {job.experienceLevel}
              </span>
            )}

            {/* Category */}
            {job.category && (
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
                📂 {job.category}
              </span>
            )}
          </div>

          {/* Job Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Job Description
            </h2>

            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Job Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Experience Level</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {job.experienceLevel || "Not specified"}
                </p>
              </div>

              {/* Number of Openings */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Number of Openings</p>

                <p className="font-semibold text-gray-800 mt-1">
                  {job.numberOfOpenings || 1}
                </p>
              </div>

              {/* Category */}
              {job.category && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Category</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {job.category}
                  </p>
                </div>
              )}

              {/* Application Deadline */}
              {job.applicationDeadline && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Application Deadline</p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {new Date(job.applicationDeadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Apply Button */}
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

import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getJobById, applyJob } from "../services/authService";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState(null); // { title, message }

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

  const handleApplyClick = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token) {
      setNotice({
        title: "Login Required",
        message: "You have to login first to apply for this job.",
      });
      return;
    }
    if (user?.role !== "user") {
      setNotice({
        title: "Action Not Allowed",
        message: "Companies cannot apply for jobs. Please log in with a candidate account.",
      });
      return;
    }
    setShowConfirm(true);
  };

  const handleApply = async () => {
    setShowConfirm(false);
    try {
      const res = await applyJob(job._id);
      setNotice({ title: "Success", message: res.data.message });
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "Already Applied") {
        setNotice({
          title: "Already Applied",
          message: "You have already applied for this job.",
        });
      } else {
        setNotice({
          title: "Unable to Apply",
          message: msg || "Something went wrong",
        });
      }
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
          <div className="flex flex-wrap gap-3 mb-6">
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

          {/* Apply Button (kept near the top so applying doesn't need scrolling past the description) */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <button
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
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
          <div>
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
        </div>
      </div>

      {/* Confirm Apply Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl mx-auto mb-4">
              📄
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              Apply to this job?
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to apply for{" "}
              <span className="font-semibold text-gray-700">{job.title}</span>{" "}
              at{" "}
              <span className="font-semibold text-gray-700">
                {job.company.companyname}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Yes, Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Modal (login required / access denied / already applied / error / success) */}
      {notice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                notice.title === "Success"
                  ? "bg-emerald-50 text-emerald-500"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {notice.title === "Success" ? "✅" : "⚠️"}
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
              {notice.title}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              {notice.message}
            </p>
            {notice.title === "Login Required" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setNotice(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <Link
                  to="/login"
                  className="flex-1 text-center bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setNotice(null)}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                OK
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default JobDetail;
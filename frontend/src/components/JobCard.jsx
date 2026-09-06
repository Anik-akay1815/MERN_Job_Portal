import { useState } from "react";
import { Link } from "react-router-dom";
import { applyJob } from "../services/authService";

function JobCard({
  jobId,
  title,
  company,
  location,
  salary,
  jobType,
  experienceLevel,
  skillsRequired,
  category,
  numberOfOpenings,
  applicationDeadline,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState(null); // { title, message }

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
      const res = await applyJob(jobId);
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

  const isExpired =
    applicationDeadline && new Date(applicationDeadline) < new Date();

  const formattedDeadline = applicationDeadline
    ? new Date(applicationDeadline).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Title + Deadline */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>

            <p className="text-slate-700 font-semibold mt-1">{company}</p>
          </div>

          {/* Deadline Badge */}
          {applicationDeadline && (
            <span
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isExpired
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-orange-50 text-orange-600 border-orange-200"
              }`}
            >
              {isExpired ? "⛔ Expired" : `⏳ ${formattedDeadline}`}
            </span>
          )}
        </div>

        {/* Job Details */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Location */}
          {location && (
            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
              📍 {location}
            </span>
          )}

          {/* Salary */}
          {salary && (
            <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
              ₹ {salary}
            </span>
          )}

          {/* Job Type */}
          {jobType && (
            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold">
              🕒 {jobType}
            </span>
          )}

          {/* Experience */}
          {experienceLevel && (
            <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
              💼 {experienceLevel}
            </span>
          )}

          {/* Category */}
          {category && (
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold">
              📂 {category}
            </span>
          )}
        </div>

        {/* Skills */}
        {skillsRequired && skillsRequired.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Required Skills
            </p>

            <div className="flex flex-wrap gap-1.5">
              {skillsRequired.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}

              {skillsRequired.length > 3 && (
                <span className="text-gray-400 text-xs px-1 py-1">
                  +{skillsRequired.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Openings */}
        {numberOfOpenings && (
          <p className="text-sm text-gray-500 mt-4">
            👥{" "}
            <span className="font-medium text-gray-700">
              {numberOfOpenings}
            </span>{" "}
            {numberOfOpenings === 1 ? "Opening" : "Openings"}
          </p>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-center mt-6 pt-5 border-t border-gray-100">
        {/* Apply Button */}
        <button
          className={`px-5 py-2 rounded-lg transition-all duration-300 font-semibold shadow-sm ${
            isExpired
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md"
          }`}
          onClick={handleApplyClick}
          disabled={isExpired}
        >
          {isExpired ? "Applications Closed" : "Apply Now"}
        </button>

        {/* Details */}
        <Link
          to={`/jobs/${jobId}`}
          className="text-slate-700 font-semibold hover:text-slate-900 hover:underline transition-all duration-300"
        >
          View Details →
        </Link>
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
              <span className="font-semibold text-gray-700">{title}</span> at{" "}
              <span className="font-semibold text-gray-700">{company}</span>?
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
    </div>
  );
}

export default JobCard;
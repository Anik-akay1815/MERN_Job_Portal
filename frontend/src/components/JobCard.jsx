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
  const handleApply = async () => {
    try {
      const res = await applyJob(jobId);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);

      alert(err.response?.data?.message || "Something went wrong");
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
          onClick={handleApply}
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
    </div>
  );
}

export default JobCard;

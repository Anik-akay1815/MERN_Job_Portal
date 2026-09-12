import { useState } from "react";
import { Link } from "react-router-dom";
import { applyJob } from "../services/authService";

function JobCard({
  jobId,
  title,
  company,
  companyLogo,
  location,
  salary,
  jobType,
  experienceLevel,
  skillsRequired,
  category,
  numberOfOpenings,
  applicationDeadline,
  cardIndex = 0,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [notice, setNotice] = useState(null);
  const [logoFailed, setLogoFailed] = useState(false);

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
        message:
          "Companies cannot apply for jobs. Please log in with a candidate account.",
      });
      return;
    }

    setShowConfirm(true);
  };

  const handleApply = async () => {
    setShowConfirm(false);

    try {
      const res = await applyJob(jobId);

      setNotice({
        title: "Success",
        message: res.data.message,
      });
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

  const accents = [
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-blue-500",
    "from-teal-400 to-cyan-500",
  ];

  const accent = accents[cardIndex % accents.length];

  return (
    <>
      {/* JOB CARD */}
      <div
        className="group relative rounded-2xl p-px
          bg-linear-to-br from-slate-200/80 via-white/60 to-blue-200/60
          dark:from-white/10 dark:via-blue-500/10 dark:to-purple-500/20
          hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300
          dark:hover:from-blue-500/40 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/40
          transition-all duration-300"
      >

        {/* Glow */}
        <div
          className={`absolute -inset-1 bg-linear-to-r ${accent}
            opacity-0 group-hover:opacity-15 dark:group-hover:opacity-20
            blur-xl transition-opacity duration-500 rounded-2xl`}
        />

        <div
          className="relative overflow-hidden
            bg-white/85 dark:bg-[#161c2e]/85
            backdrop-blur-xl
            rounded-2xl p-4
            min-h-97.5
            border border-white/70 dark:border-white/10
            shadow-sm dark:shadow-black/20
            group-hover:shadow-xl dark:group-hover:shadow-black/40
            transition-all duration-300"
        >

          {/* Top accent */}
          <div
            className={`absolute top-0 left-5 right-5 h-1
              bg-linear-to-r ${accent}
              rounded-b-full opacity-80`}
          />

          {/* Decorative glow */}
          <div
            className={`absolute -top-16 -right-16 w-32 h-32
              rounded-full bg-linear-to-br ${accent}
              opacity-5 dark:opacity-10 blur-2xl`}
          />

          <div className="relative z-10 flex flex-col h-full">

            {/* TOP ROW */}
            <div className="flex justify-between items-start gap-3">

              <span
                className="bg-slate-100 dark:bg-white/10
                  border border-slate-200/60 dark:border-white/10
                  px-3 py-1.5 rounded-full
                  text-[11px] font-semibold
                  text-slate-600 dark:text-slate-300"
              >
                {applicationDeadline ? formattedDeadline : "Open now"}
              </span>

              <button
                type="button"
                className="w-9 h-9 rounded-full
                  bg-slate-100/80 dark:bg-white/10
                  border border-slate-200/60 dark:border-white/10
                  flex items-center justify-center
                  text-slate-600 dark:text-slate-200
                  hover:bg-blue-50 hover:text-blue-500
                  dark:hover:bg-blue-500/10 dark:hover:text-[#7cc2f2]
                  hover:scale-110 transition"
                title="Save job"
              >
                ♡
              </button>
            </div>

            {/* COMPANY + LOGO */}
            <div className="flex items-center justify-between mt-6">

              <div className="min-w-0 pr-3">

                <p className="text-xs font-semibold
                  text-blue-500 dark:text-[#7cc2f2]">
                  {company || "Company"}
                </p>

                <h3 className="text-xl font-bold leading-tight
                  text-slate-900 dark:text-white mt-1">
                  {title}
                </h3>
              </div>

              <div className="relative shrink-0">

                <div
                  className={`absolute inset-0 rounded-xl
                    bg-linear-to-br ${accent}
                    opacity-20 blur-md`}
                />

                <div
                  className="relative w-12 h-12 rounded-xl
                    bg-white dark:bg-[#252c3f]
                    border border-slate-200 dark:border-white/10
                    flex items-center justify-center
                    text-lg font-bold
                    text-slate-700 dark:text-white
                    shadow-sm overflow-hidden"
                >
                  {companyLogo && !logoFailed ? (
                    <img
                      src={companyLogo}
                      alt={company ? `${company} logo` : "Company logo"}
                      className="w-full h-full object-cover"
                      onError={() => setLogoFailed(true)}
                    />
                  ) : (
                    company?.charAt(0)?.toUpperCase() || "H"
                  )}
                </div>
              </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-1.5 mt-6">

              {jobType && (
                <span
                  className="bg-blue-50 dark:bg-blue-500/10
                    border border-blue-100 dark:border-blue-400/10
                    rounded-full px-2.5 py-1
                    text-[10px] font-semibold
                    text-blue-600 dark:text-blue-300"
                >
                  {jobType}
                </span>
              )}

              {experienceLevel && (
                <span
                  className="bg-indigo-50 dark:bg-indigo-500/10
                    border border-indigo-100 dark:border-indigo-400/10
                    rounded-full px-2.5 py-1
                    text-[10px] font-semibold
                    text-indigo-600 dark:text-indigo-300"
                >
                  {experienceLevel}
                </span>
              )}

              {category && (
                <span
                  className="bg-purple-50 dark:bg-purple-500/10
                    border border-purple-100 dark:border-purple-400/10
                    rounded-full px-2.5 py-1
                    text-[10px] font-semibold
                    text-purple-600 dark:text-purple-300"
                >
                  {category}
                </span>
              )}

              {location && (
                <span
                  className="bg-slate-100 dark:bg-white/10
                    border border-slate-200/60 dark:border-white/10
                    rounded-full px-2.5 py-1
                    text-[10px] font-semibold
                    text-slate-600 dark:text-slate-300"
                >
                  📍 {location}
                </span>
              )}
            </div>

            {/* SKILLS */}
            {skillsRequired && skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">

                {skillsRequired.slice(0, 2).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-100/80 dark:bg-white/10
                      rounded-full px-2.5 py-1
                      text-[10px]
                      text-slate-600 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}

                {skillsRequired.length > 2 && (
                  <span className="text-[10px] text-slate-400 px-1 py-1">
                    +{skillsRequired.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* BOTTOM INFO */}
            <div className="mt-auto pt-7">

              <div className="flex justify-between items-end">

                <div>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {salary ? `₹ ${salary}` : "Salary N/A"}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {location || "Location not specified"}
                  </p>
                </div>

                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {numberOfOpenings
                    ? `${numberOfOpenings} opening${
                        numberOfOpenings > 1 ? "s" : ""
                      }`
                    : ""}
                </span>
              </div>

              <div className="border-t border-slate-200/70 dark:border-white/10 mt-4 pt-4 flex items-center justify-between">

                <button
                  onClick={handleApplyClick}
                  disabled={isExpired}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold
                    transition-all duration-200 ${
                    isExpired
                      ? "bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed"
                      : "bg-blue-500 dark:bg-[#249bea] text-white hover:bg-blue-600 dark:hover:bg-[#1688d4] hover:shadow-lg hover:shadow-blue-500/20"
                  }`}
                >
                  {isExpired ? "Closed" : "Apply Now"}
                </button>

                <Link
                  to={`/jobs/${jobId}`}
                  className="text-xs font-bold
                    text-slate-600 dark:text-slate-200
                    hover:text-blue-500 dark:hover:text-[#7cc2f2]
                    transition"
                >
                  Details →
                </Link>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4">
          <div
            className="bg-white/95 dark:bg-[#161c2e]/95
              backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm w-full
              border border-white/60 dark:border-white/10"
          >
            <div
              className="w-12 h-12 rounded-full
                bg-blue-50 dark:bg-blue-500/10
                flex items-center justify-center
                text-xl text-blue-500 mx-auto mb-4"
            >
              ✓
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">
              Apply to this job?
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              Are you sure you want to apply for{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {title}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {company}
              </span>
              ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-100 dark:bg-white/10
                  hover:bg-slate-200 dark:hover:bg-white/15
                  text-slate-700 dark:text-slate-200
                  font-semibold py-2.5 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleApply}
                className="flex-1 bg-blue-500 dark:bg-[#249bea]
                  hover:bg-blue-600 dark:hover:bg-[#1688d4]
                  text-white font-semibold py-2.5 rounded-lg"
              >
                Yes, Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTICE MODAL */}
      {notice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4">
          <div
            className="bg-white/95 dark:bg-[#161c2e]/95
              backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm w-full
              border border-white/60 dark:border-white/10"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-4 ${
                notice.title === "Success"
                  ? "bg-teal-50 dark:bg-teal-500/10 text-teal-500"
                  : "bg-red-50 dark:bg-red-500/10 text-red-500"
              }`}
            >
              {notice.title === "Success" ? "✓" : "!"}
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
              {notice.title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              {notice.message}
            </p>

            {notice.title === "Login Required" ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setNotice(null)}
                  className="flex-1 bg-slate-100 dark:bg-white/10
                    hover:bg-slate-200 dark:hover:bg-white/15
                    text-slate-700 dark:text-slate-200
                    font-semibold py-2.5 rounded-lg"
                >
                  Cancel
                </button>

                <Link
                  to="/login"
                  className="flex-1 text-center bg-blue-500 dark:bg-[#249bea]
                    hover:bg-blue-600 dark:hover:bg-[#1688d4]
                    text-white font-semibold py-2.5 rounded-lg"
                >
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setNotice(null)}
                className="w-full bg-blue-500 dark:bg-[#249bea]
                  hover:bg-blue-600 dark:hover:bg-[#1688d4]
                  text-white font-semibold py-2.5 rounded-lg"
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

export default JobCard;
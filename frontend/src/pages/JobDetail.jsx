import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getJobById, applyJob } from "../services/authService";
const loggedInUser = JSON.parse(localStorage.getItem("user"));
const canApply = !loggedInUser || loggedInUser.role === "user";

function Icon({ name, size = 17 }) {
  const paths = {
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11h18M10 11v2h4v-2" />
      </>
    ),
    money: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15 9.5c-.7-.8-1.7-1.2-3-1.2-1.5 0-2.5.7-2.5 1.7s.8 1.5 2.5 1.8c1.7.3 2.5.9 2.5 1.9s-1 1.7-2.6 1.7c-1.3 0-2.4-.4-3.1-1.2M12 6.5v11" />
      </>
    ),
    graduation: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.2V15c2.8 2.2 7.2 2.2 10 0v-3.8M21 9v6" />
      </>
    ),
    folder: (
      <>
        <path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    alert: (
      <>
        <path d="m12 3 9 18H3L12 3Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

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
        <h2 className="text-center mt-20 text-xl font-semibold text-slate-700 dark:text-slate-200">
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-blue-400/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-black/40 overflow-hidden">
          <div className="h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />
          {/* Job Header */}
          <div className="px-7 sm:px-9 pt-7 pb-6 border-b border-slate-200/70 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-400 mb-2">
                  Job Opportunity
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {job.title}
                </h1>

                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2">
                  Posted by{" "}
                  <Link
                    to={`/company/${job.company._id}`}
                    className="text-blue-600 dark:text-blue-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors"
                  >
                    {job.company.companyname}
                  </Link>
                </p>
              </div>
              <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/20 items-center justify-center text-blue-600 dark:text-blue-300">
                <Icon name="briefcase" size={22} />
              </div>
            </div>
          </div>

          {/* Job Basic Details */}
          <div className="px-7 sm:px-9 pt-6 pb-5 flex flex-wrap gap-2.5">
            {/* Location */}
            {job.location && (
              <span className="bg-slate-100/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                <Icon name="pin" size={15} /> {job.location}
              </span>
            )}

            {/* Job Type */}
            {job.jobType && (
              <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                <Icon name="briefcase" size={15} /> {job.jobType}
              </span>
            )}

            {/* Salary */}
            {job.salary && (
              <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/20 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                <Icon name="money" size={15} /> ₹ {job.salary}
              </span>
            )}

            {/* Experience */}
            {job.experienceLevel && (
              <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-400/20 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                <Icon name="graduation" size={15} /> {job.experienceLevel}
              </span>
            )}

            {/* Category */}
            {job.category && (
              <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-400/20 px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-1.5">
                <Icon name="folder" size={15} /> {job.category}
              </span>
            )}
          </div>

          {/* Apply Button (kept near the top so applying doesn't need scrolling past the description) */}
          <div className="px-7 sm:px-9 py-5 border-y border-slate-200/70 dark:border-white/10 bg-slate-50/50 dark:bg-white/2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Interested in this role?
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Submit your application to get started.
              </p>
            </div>
            {canApply && (
              <button
                className="w-full sm:w-auto min-w-40 bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                onClick={handleApplyClick}
              >
                Apply Now
              </button>
            )}
          </div>

          {/* Job Description */}
          <div className="px-7 sm:px-9 pt-7 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-linear-to-b from-blue-500 to-purple-500" />
              Job Description
            </h2>

            <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>

          {/* Required Skills */}
          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <div className="px-7 sm:px-9 mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 rounded-full bg-linear-to-b from-purple-500 to-indigo-500" />
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Job Information */}
          <div className="px-7 sm:px-9 pb-9">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-linear-to-b from-indigo-500 to-blue-500" />
              Job Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Experience Level */}
              <div className="bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-400/20 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Experience Level
                </p>

                <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  {job.experienceLevel || "Not specified"}
                </p>
              </div>

              {/* Number of Openings */}
              <div className="bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-400/20 transition-colors">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Number of Openings
                </p>

                <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
                  {job.numberOfOpenings || 1}
                </p>
              </div>

              {/* Category */}
              {job.category && (
                <div className="bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-400/20 transition-colors">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Category
                  </p>

                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
                    {job.category}
                  </p>
                </div>
              )}

              {/* Application Deadline */}
              {job.applicationDeadline && (
                <div className="bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl p-4 hover:border-blue-200 dark:hover:border-blue-400/20 transition-colors">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Application Deadline
                  </p>

                  <p className="font-semibold text-slate-800 dark:text-slate-100 mt-1">
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/95 dark:bg-[#161c2e]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/70 dark:border-white/10">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center text-2xl mx-auto mb-4">
              <Icon name="file" size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
              Apply to this job?
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
              Are you sure you want to apply for{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {job.title}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {job.company.companyname}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/95 dark:bg-[#161c2e]/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-white/70 dark:border-white/10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                notice.title === "Success"
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {notice.title === "Success" ? (
                <Icon name="check" size={22} />
              ) : (
                <Icon name="alert" size={22} />
              )}
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
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 dark:text-slate-200 font-semibold py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <Link
                  to="/login"
                  className="flex-1 text-center bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <button
                onClick={() => setNotice(null)}
                className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
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

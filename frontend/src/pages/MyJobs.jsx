import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { getCompanyById, deleteJob } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

function Icon({ name, size = 16, className = "" }) {
  const paths = {
    briefcase: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11h18M10 11v2h4v-2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    work: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="2" />
        <path d="M8 6V4h8v2M3 11h18M10 11v2h4v-2" />
      </>
    ),
    graduation: (
      <>
        <path d="m3 9 9-5 9 5-9 5-9-5Z" />
        <path d="M7 11.2V15c2.8 2.2 7.2 2.2 10 0v-3.8M21 9v6" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 13a5 5 0 0 1 4 5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 9h18" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
        <path d="m13.5 7.5 3 3" />
      </>
    ),
    usersView: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 19a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 13a5 5 0 0 1 4 5" />
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
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const company = JSON.parse(localStorage.getItem("user"));
      const res = await getCompanyById(company._id);
      setJobs(res.data.data.jobs);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteJob(deleteId);
      setDeleteId(null);
      fetchJobs();
    } catch (err) {
      setDeleteId(null);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-20 w-96 h-96 bg-blue-400/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1.5 rounded-full text-xs font-semibold">
              <Icon name="briefcase" size={14} /> Careerly Jobs
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">
              My Jobs
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Manage all the jobs you've posted
            </p>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl rounded-2xl py-16 border border-white/70 dark:border-white/10 shadow-lg">
              <div className="flex justify-center mb-3 text-blue-500">
                <Icon name="briefcase" size={34} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No jobs posted yet
              </p>
              <button
                onClick={() => navigate("/postjob")}
                className="mt-5 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {jobs.map((job, index) => {
                const isExpired =
                  job.applicationDeadline &&
                  new Date(job.applicationDeadline) < new Date();
                const formattedDeadline = job.applicationDeadline
                  ? new Date(job.applicationDeadline).toLocaleDateString(
                      "en-IN",
                      { day: "2-digit", month: "short", year: "numeric" },
                    )
                  : null;
                const accents = [
                  "from-blue-400 to-indigo-500",
                  "from-purple-400 to-blue-500",
                  "from-teal-400 to-cyan-500",
                ];
                const accent = accents[index % accents.length];

                return (
                  <div
                    key={job._id}
                    className="group relative rounded-2xl p-px bg-linear-to-br from-slate-200/80 via-white/60 to-blue-200/60 dark:from-white/10 dark:via-blue-500/10 dark:to-purple-500/20 hover:from-blue-300 hover:via-indigo-300 hover:to-purple-300 dark:hover:from-blue-500/40 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/40 transition-all duration-300"
                  >
                    <div className="relative h-full overflow-hidden bg-white/85 dark:bg-[#161c2e]/85 backdrop-blur-xl rounded-2xl p-5 border border-white/70 dark:border-white/10 shadow-sm dark:shadow-black/20 group-hover:shadow-xl dark:group-hover:shadow-black/40 group-hover:-translate-y-1 transition-all duration-300">
                      <div
                        className={`absolute top-0 left-8 right-8 h-1 rounded-b-full bg-linear-to-r ${accent}`}
                      />

                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {job.title}
                          </h2>
                          {job.category && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {job.category}
                            </p>
                          )}
                        </div>
                        {job.applicationDeadline && (
                          <span
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${isExpired ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-400/20" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-400/20"}`}
                          >
                            {isExpired ? (
                              <>
                                <Icon name="calendar" size={13} /> Expired
                              </>
                            ) : (
                              formattedDeadline
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-5">
                        {job.location && (
                          <span className="bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
                            <Icon name="pin" size={13} /> {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-400/20 px-3 py-1 rounded-full text-xs font-semibold">
                            ₹ {job.salary}
                          </span>
                        )}
                        {job.jobType && (
                          <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
                            <Icon name="work" size={13} /> {job.jobType}
                          </span>
                        )}
                        {job.experienceLevel && (
                          <span className="bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-400/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
                            <Icon name="graduation" size={13} />{" "}
                            {job.experienceLevel}
                          </span>
                        )}
                        {job.numberOfOpenings && (
                          <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-400/20 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
                            <Icon name="users" size={13} />{" "}
                            {job.numberOfOpenings}{" "}
                            {job.numberOfOpenings === 1
                              ? "Opening"
                              : "Openings"}
                          </span>
                        )}
                      </div>

                      {job.skillsRequired && job.skillsRequired.length > 0 && (
                        <div className="mt-5">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                            Required Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {job.skillsRequired
                              .slice(0, 6)
                              .map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-lg text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            {job.skillsRequired.length > 6 && (
                              <span className="text-slate-400 dark:text-slate-500 text-xs px-1 py-1">
                                +{job.skillsRequired.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-200/70 dark:border-white/10">
                        <button
                          className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition font-semibold shadow-md shadow-blue-500/15 cursor-pointer inline-flex items-center justify-center gap-1.5"
                          onClick={() => navigate(`/applications/${job._id}`)}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="usersView" size={15} /> View Applicants
                          </span>
                        </button>
                        <button
                          className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-white/10 transition font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5"
                          onClick={() => navigate(`/editjob/${job._id}`)}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="edit" size={15} />
                          </span>
                        </button>
                        <button
                          className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-300 px-5 py-2.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5"
                          onClick={() => setDeleteId(job._id)}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="trash" size={15} />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 px-4">
          <div className="w-full max-w-md bg-white/90 dark:bg-[#161c2e]/95 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 flex items-center justify-center">
                <Icon name="trash" size={19} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Delete Job
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-6 mb-6">
              Are you sure you want to delete this job?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold shadow-md shadow-red-500/20 transition cursor-pointer"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyJobs;

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getJobApplications, updateApplicationStatus } from "../services/authService";
import Navbar from "../components/Navbar";

function Icon({ name, size = 17 }) {
  const paths = {
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 13a5 5 0 0 1 4 5" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const fetchApplications = async () => {
    try {
      const res = await getJobApplications(jobId);
      setApplications(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, { status });
      alert("Status Updated");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-40 -right-24 w-96 h-96 bg-purple-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-blue-400/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="mb-7">
            <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1.5 rounded-full text-xs font-semibold"><Icon name="users" size={14} /> Candidate Applications</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-4">Job Applicants</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review candidates and manage applications for this position.</p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-white/75 dark:bg-[#161c2e]/75 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl p-12 text-center shadow-xl dark:shadow-black/30">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center"><Icon name="users" size={25} /></div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mt-4">No applications yet</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Applications for this job will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app._id} className="group bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl rounded-2xl border border-white/70 dark:border-white/10 shadow-lg dark:shadow-black/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
                  <div className="h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-80" />
                  <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-start flex-wrap gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20 shrink-0">{app.user?.name?.charAt(0).toUpperCase()}</div>
                        <div className="min-w-0">
                          <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate"><Link to={`/user/${app.user._id}`} className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">{app.user?.name}</Link></h2>
                          <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{app.user?.email}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold border capitalize ${app.status === "accepted" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/20" : app.status === "rejected" ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/20" : "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-400/20"}`}>{app.status}</span>
                    </div>

                    <div className="mt-5 bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl px-4 py-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Applied for</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{app.job?.title}</p>
                    </div>

                    {app.user?.resume && (
                      <a href={`http://localhost:19116/${app.user.resume}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 dark:text-blue-300 font-semibold hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors"><Icon name="file" size={16} /> View Resume</a>
                    )}

                    <div className="mt-5 pt-5 border-t border-slate-200/70 dark:border-white/10 flex flex-wrap gap-3">
                      <button className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg cursor-pointer" onClick={() => handleStatus(app._id, "Accepted")}><Icon name="check" size={16} /> Accept</button>
                      <button className="inline-flex items-center gap-2 bg-white/70 dark:bg-white/5 border border-red-200 dark:border-red-400/20 text-red-600 dark:text-red-300 px-5 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 font-semibold cursor-pointer" onClick={() => handleStatus(app._id, "Rejected")}><Icon name="close" size={16} /> Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Applicants;

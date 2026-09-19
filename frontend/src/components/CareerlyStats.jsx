import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Icon({ name, size = 24 }) {
  const icons = {
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
    building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 10h4a1 1 0 0 1 1 1v10M8 7h4M8 11h4M8 15h4M8 19h4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.6-3.5 2.5-5 6-5s5.4 1.5 6 5M15 15c3 0 4.8 1.4 5.5 4" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function CareerlyStats() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || null);
  }, []);

  const stats = [
    { icon: "briefcase", value: "500+", label: "Jobs Available" },
    { icon: "building", value: "100+", label: "Companies" },
    { icon: "users", value: "1K+", label: "Candidates" },
    { icon: "file", value: "2K+", label: "Applications" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#f5f6fa] dark:bg-[#0f1420]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-72 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="rounded-3xl bg-linear-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 dark:from-indigo-500/10 dark:via-purple-500/5 dark:to-blue-500/5 backdrop-blur-xl border border-white/70 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="text-center mb-9">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-600 dark:text-blue-300 text-sm font-semibold">
                Careerly at a Glance
              </span>

              <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                Growing together, one opportunity at a time
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0">
              {stats.map((stat, index) => (
                <div key={index} className="group flex items-center justify-center gap-4 p-5 rounded-2xl lg:rounded-none bg-white/35 dark:bg-white/2 lg:bg-transparent lg:dark:bg-transparent border border-white/60 dark:border-white/5 lg:border-0 hover:bg-white/50 dark:hover:bg-white/4 transition-all">
                  <div className="hidden sm:flex w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 items-center justify-center shrink-0">
                    <Icon name={stat.icon} size={21} />
                  </div>

                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs md:text-sm text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {role !== "admin" && (
            <div className="relative border-t border-white/60 dark:border-white/10 bg-white/25 dark:bg-white/2 p-7 md:p-9">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-purple-500/10 to-blue-500/5" />

              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Ready to take the next step?
                  </h3>

                  <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400">
                    {role === "company"
                      ? "Find talented people and build your team with Careerly."
                      : "Discover new opportunities and take your career forward with Careerly."}
                  </p>
                </div>

                {role === "company" ? (
                  <Link to="/postjobs" className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all shrink-0">
                    Post a Job
                    <Icon name="arrow" size={17} />
                  </Link>
                ) : (
                  <Link to="/jobs" className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all shrink-0">
                    Find Jobs
                    <Icon name="arrow" size={17} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default CareerlyStats;
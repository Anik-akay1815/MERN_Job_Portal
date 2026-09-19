function Icon({ name, size = 24 }) {
  const icons = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h6" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    user: <><circle cx="9" cy="8" r="3" /><path d="M3 20c.6-3.5 2.5-5 6-5s5.4 1.5 6 5" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
    users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 20c.6-3.5 2.5-5 6-5s5.4 1.5 6 5M15 15c3 0 4.8 1.4 5.5 4" /></>,
    chart: <><path d="M4 19V5" /><path d="M4 19h16" /><path d="m7 15 3-4 3 2 5-6" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "search",
      title: "Search",
      text: "Explore jobs based on your skills, location and career interests.",
      bg: "from-indigo-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-indigo-500/15",
      iconColor: "text-indigo-600 dark:text-indigo-300",
      border: "border-indigo-200/60 dark:border-indigo-500/15",
    },
    {
      number: "02",
      icon: "file",
      title: "Apply",
      text: "Apply to opportunities that match your profile through a simple process.",
      bg: "from-purple-500/10 via-fuchsia-500/5 to-transparent",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-600 dark:text-purple-300",
      border: "border-purple-200/60 dark:border-purple-500/15",
    },
    {
      number: "03",
      icon: "check",
      title: "Get Hired",
      text: "Connect with companies and move closer to your next opportunity.",
      bg: "from-teal-500/10 via-cyan-500/5 to-transparent",
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-600 dark:text-teal-300",
      border: "border-teal-200/60 dark:border-teal-500/15",
    },
  ];

  const candidateServices = [
    { icon: "search", title: "Find Jobs", text: "Search and discover relevant opportunities." },
    { icon: "file", title: "Easy Applications", text: "Apply to jobs through a simple process." },
    { icon: "chart", title: "Track Applications", text: "Keep track of your application progress." },
    { icon: "target", title: "Favourite Jobs", text: "Save opportunities you want to revisit." },
  ];

  const companyServices = [
    { icon: "briefcase", title: "Post Jobs", text: "Create and publish job opportunities." },
    { icon: "users", title: "Find Candidates", text: "View candidates who apply to your jobs." },
    { icon: "check", title: "Manage Applications", text: "Accept or reject applications easily." },
    { icon: "chart", title: "Manage Jobs", text: "Control and update your job listings." },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none">
      <div className="absolute top-20 -right-30 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -left-25 w-72 h-72 bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-600 dark:text-purple-300 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            How It Works
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your next opportunity is just a few steps away
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg">
            A simple experience designed for both candidates and companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {steps.map((step, index) => (
            <div key={index} className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${step.bg} bg-white/50 dark:bg-[#161c2e]/50 backdrop-blur-xl border ${step.border} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/30 dark:bg-white/5 blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className="relative flex items-center justify-between mb-6">
                <div className={`w-13 h-13 rounded-2xl ${step.iconBg} ${step.iconColor} border border-white/50 dark:border-white/10 flex items-center justify-center`}>
                  <Icon name={step.icon} size={24} />
                </div>

                <span className="text-3xl font-bold text-slate-200 dark:text-white/10">
                  {step.number}
                </span>
              </div>

              <h3 className="relative text-xl font-semibold text-slate-900 dark:text-white">
                {step.title}
              </h3>

              <p className="relative mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {step.text}
              </p>

              <div className="absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        <div className="relative rounded-3xl bg-white/45 dark:bg-[#161c2e]/45 backdrop-blur-xl border border-white/70 dark:border-white/10 p-6 md:p-8 shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="relative text-center mb-9">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
              Careerly Services
            </span>

            <h3 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Everything you need in one place
            </h3>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Powerful tools for candidates and companies.
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-linear-to-br from-indigo-500/10 to-blue-500/5 dark:from-indigo-500/10 dark:to-blue-500/5 border border-indigo-200/50 dark:border-indigo-500/15 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                  <Icon name="user" size={22} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">For Candidates</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Build your career with Careerly</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {candidateServices.map((item, index) => (
                  <div key={index} className="group flex gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/2 border border-transparent hover:border-indigo-200/50 dark:hover:border-indigo-500/10 transition-all">
                    <div className="text-indigo-600 dark:text-indigo-300 mt-0.5">
                      <Icon name={item.icon} size={19} />
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</h5>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-linear-to-br from-purple-500/10 to-fuchsia-500/5 dark:from-purple-500/10 dark:to-fuchsia-500/5 border border-purple-200/50 dark:border-purple-500/15 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Icon name="briefcase" size={22} />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">For Companies</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Find and manage great talent</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {companyServices.map((item, index) => (
                  <div key={index} className="group flex gap-3 p-3 rounded-xl bg-white/40 dark:bg-white/2 border border-transparent hover:border-purple-200/50 dark:hover:border-purple-500/10 transition-all">
                    <div className="text-purple-600 dark:text-purple-300 mt-0.5">
                      <Icon name={item.icon} size={19} />
                    </div>

                    <div>
                      <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</h5>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
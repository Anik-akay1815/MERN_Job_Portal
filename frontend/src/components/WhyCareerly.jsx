function Icon({ name, size = 24 }) {
  const icons = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    zap: <><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" /></>,
    shield: <><path d="M12 3 20 7v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V7l8-4Z" /><path d="m9 12 2 2 4-4" /></>,
    growth: <><path d="M4 19V9" /><path d="M10 19V5" /><path d="M16 19v-7" /><path d="M22 19V2" /></>,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

function WhyCareerly() {
  const benefits = [
    {
      icon: "search",
      title: "Smart Job Search",
      text: "Find opportunities that match your skills, experience and career goals.",
      bg: "from-indigo-500/10 via-blue-500/5 to-transparent",
      iconBg: "bg-indigo-500/15",
      iconColor: "text-indigo-600 dark:text-indigo-300",
      border: "border-indigo-200/60 dark:border-indigo-500/15",
    },
    {
      icon: "zap",
      title: "Easy Applications",
      text: "Discover jobs and apply quickly with a simple and streamlined process.",
      bg: "from-purple-500/10 via-fuchsia-500/5 to-transparent",
      iconBg: "bg-purple-500/15",
      iconColor: "text-purple-600 dark:text-purple-300",
      border: "border-purple-200/60 dark:border-purple-500/15",
    },
    {
      icon: "shield",
      title: "Trusted Opportunities",
      text: "Explore relevant job listings from companies looking for the right talent.",
      bg: "from-teal-500/10 via-cyan-500/5 to-transparent",
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-600 dark:text-teal-300",
      border: "border-teal-200/60 dark:border-teal-500/15",
    },
    {
      icon: "growth",
      title: "Career Growth",
      text: "Build your profile, discover new opportunities and take the next step in your career.",
      bg: "from-blue-500/10 via-indigo-500/5 to-transparent",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-300",
      border: "border-blue-200/60 dark:border-blue-500/15",
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-[#f5f6fa] dark:bg-[#0f1420]">
      <div className="absolute top-10 -left-30 w-72 h-72 bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-25 w-80 h-80 bg-purple-300/20 dark:bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Why Careerly?
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Everything you need to move your career forward
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
            Careerly connects talented people with meaningful opportunities through a simple and modern job platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((item, index) => (
            <div key={index} className={`group relative overflow-hidden rounded-2xl bg-linear-to-br ${item.bg} bg-white/50 dark:bg-[#161c2e]/50 backdrop-blur-xl border ${item.border} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/30 dark:bg-white/5 blur-2xl group-hover:scale-125 transition-transform duration-500" />

              <div className={`relative w-13 h-13 rounded-2xl ${item.iconBg} ${item.iconColor} border border-white/50 dark:border-white/10 flex items-center justify-center mb-6`}>
                <Icon name={item.icon} size={24} />
              </div>

              <div className="relative">
                <span className="text-[11px] font-semibold tracking-widest text-slate-400 dark:text-slate-500">
                  0{index + 1}
                </span>

                <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {item.text}
                </p>
              </div>

              <div className="absolute bottom-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-indigo-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyCareerly;
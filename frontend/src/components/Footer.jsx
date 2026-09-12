function Footer() {
  return (
    <footer className="mt-auto bg-[#f5f6fa] dark:bg-[#0f1420] text-slate-600 dark:text-slate-300 border-t border-white/60 dark:border-white/10">

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 rounded-lg bg-linear-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              C
            </span>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Career<span className="text-blue-500 dark:text-[#7cc2f2]">ly</span>
            </h2>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Connecting talented professionals with top companies. Find your
            dream job or hire the perfect candidate.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/jobs" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Browse Jobs
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Register
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Login
              </a>
            </li>
          </ul>
        </div>

        {/* For companies */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-4">
            For Companies
          </h3>

          <ul className="space-y-2 text-sm">
            <li>
              <a href="/company/register" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Register Company
              </a>
            </li>
            <li>
              <a href="/postjob" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Post a Job
              </a>
            </li>
            <li>
              <a href="/Dashboard" className="hover:text-blue-500 dark:hover:text-[#7cc2f2] transition-colors">
                Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold mb-4">
            Contact Us
          </h3>

          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>📧 support@careerly.com</li>
            <li>📞 +91 666 999 8873</li>
            <li>📍 Dehradun, Uttarakhand, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200/70 dark:border-white/10 py-5 text-center text-sm text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} HireNest. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
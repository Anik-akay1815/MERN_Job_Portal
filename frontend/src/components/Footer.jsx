function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-9 h-9 bg-slate-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              J
            </span>
            <h2 className="text-xl font-bold text-white">
              Job<span className="text-emerald-400">Portal</span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Connecting talented professionals with top companies. Find your
            dream job or hire the perfect candidate.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/jobs"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Browse Jobs
              </a>
            </li>
            <li>
              <a
                href="/register"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Register
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Login
              </a>
            </li>
          </ul>
        </div>

        {/* For companies */}
        <div>
          <h3 className="text-white font-semibold mb-4">For Companies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/company/register"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Register Company
              </a>
            </li>
            <li>
              <a
                href="/postjob"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Post a Job
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className="hover:text-emerald-400 transition-colors duration-200"
              >
                Dashboard
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📧 support@jobportal.com</li>
            <li>📞 +91 666 999 8873</li>
            <li>📍 Dehradun, Uttarakhand, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} JobPortal. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

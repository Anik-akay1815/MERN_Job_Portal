import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link } from "react-router-dom";
import {
  getAllUsersAdmin,
  deleteUserAdmin,
  getAllCompaniesAdmin,
  deleteCompanyAdmin,
  getAllJobsAdmin,
  deleteJobAdmin,
  getAllApplicationsAdmin,
  deleteApplication,
} from "../services/authService.js";

/* Lightweight inline SVG icons — no external icon package needed */
const iconProps = (size, strokeWidth) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round",
  strokeLinejoin: "round",
});

function LayoutDashboard({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function UsersIcon({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Building2({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M6 22V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v18Z" />
      <path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2" />
      <path d="M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2" />
      <path d="M10 6h2M10 10h2M10 14h2M10 18h2" />
    </svg>
  );
}

function Briefcase({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <path d="M2 13h20" />
    </svg>
  );
}

function FileText({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8M8 17h8M8 9h2" />
    </svg>
  );
}

function BarChart3({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-4" />
    </svg>
  );
}

function SettingsIcon({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  );
}

function LogOut({ size = 18, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function MapPin({ size = 14, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function Trash2({ size = 16, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function AlertTriangle({ size = 26, strokeWidth = 2, className }) {
  return (
    <svg {...iconProps(size, strokeWidth)} className={className}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function Sparkline({ color }) {
  return (
    <svg
      viewBox="0 0 100 30"
      className="w-full h-8 mt-3"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="0,25 15,20 30,22 45,12 60,15 75,6 100,8"
      />
    </svg>
  );
}

function Avatar({ name, photo }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-indigo-500 text-white font-semibold">
      {initial}
    </div>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [applicationDeleteTarget, setApplicationDeleteTarget] = useState(null);

  const fetchAll = async () => {
    try {
      const [usersRes, companiesRes, jobsRes, applicationsRes] =
        await Promise.all([
          getAllUsersAdmin(),
          getAllCompaniesAdmin(),
          getAllJobsAdmin(),
          getAllApplicationsAdmin(),
        ]);
      setUsers(usersRes.data.data || []);
      setCompanies(companiesRes.data.data || []);
      setJobs(jobsRes.data.data || []);
      setApplications(applicationsRes.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const candidateUsers = users.filter((u) => u.role !== "admin");
  const activeJobs = jobs.filter(
    (job) =>
      !job.applicationDeadline ||
      new Date(job.applicationDeadline) >= new Date(),
  );

  const displayedUsers = showAllUsers
    ? candidateUsers
    : candidateUsers.slice(0, 3);
  const displayedCompanies = showAllCompanies
    ? companies
    : companies.slice(0, 3);
  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 3);
  const displayedApplications = showAllApplications
    ? applications
    : applications.slice(0, 4);

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const getFileUrl = (file) => {
    if (!file) return null;
    if (file.startsWith("http")) return file;
    return `${fileBaseUrl}/${file.replace(/^\/+/, "")}`;
  };

  const requestDelete = (type, id, name) =>
    setConfirmTarget({ type, id, name });
  const cancelDelete = () => setConfirmTarget(null);

  const confirmApplicationDelete = async () => {
    if (!applicationDeleteTarget) return;

    try {
      await deleteApplication(applicationDeleteTarget.id);
      setApplications((prev) =>
        prev.filter((app) => app._id !== applicationDeleteTarget.id),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setApplicationDeleteTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (!confirmTarget) return;
    const { type, id } = confirmTarget;
    try {
      if (type === "user") {
        await deleteUserAdmin(id);
        setUsers((prev) => prev.filter((u) => u._id !== id));
      }
      if (type === "company") {
        await deleteCompanyAdmin(id);
        setCompanies((prev) => prev.filter((c) => c._id !== id));
      }
      if (type === "job") {
        await deleteJobAdmin(id);
        setJobs((prev) => prev.filter((j) => j._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setConfirmTarget(null);
    }
  };

  const scrollToSection = (id) => {
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sidebarItems = [
    { label: "Dashboard", Icon: LayoutDashboard, id: null },
    { label: "Users", Icon: UsersIcon, id: "users-section" },
    { label: "Companies", Icon: Building2, id: "companies-section" },
    { label: "Jobs", Icon: Briefcase, id: "jobs-section" },
    { label: "Applications", Icon: FileText, id: "applications-section" },
    { label: "Analytics", Icon: BarChart3, id: null },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] dark:bg-[#0f1420] transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
            Loading...
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* page bg matches the reference image: soft light-gray in light mode, deep navy in dark mode */}
      <div className="relative min-h-screen overflow-hidden bg-[#f5f6fa] dark:bg-[#0f1420] text-[#111111] dark:text-white transition-colors duration-300">
        {/* glass blobs — same soft glow as the reference image, blurred and sitting behind the cards */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-400/30 dark:bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-32 w-md h-112 rounded-full bg-blue-400/25 dark:bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-purple-400/20 dark:bg-purple-500/15 blur-3xl" />

        <div className="relative flex">
          {/* SIDEBAR — scrolls to sections on this same page, no new routes */}
          <aside className="hidden md:flex md:flex-col fixed left-0 top-0 w-64 h-screen bg-linear-to-b from-white/80 via-indigo-50/25 to-blue-50/30 dark:from-[#161c2e]/80 dark:via-indigo-950/10 dark:to-blue-950/10 backdrop-blur-xl border-r border-white/60 dark:border-white/10 py-6 px-4 z-40">
            <nav className="flex-1 space-y-1">
              {sidebarItems.map((item, idx) => {
                const isActive = idx === 0; // Dashboard highlighted, matches reference image
                const { Icon } = item;
                return (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-300"
                    }`}
                  >
                    <Icon size={18} strokeWidth={2} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 mt-4 border-t border-white/40 dark:border-white/10 space-y-1">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5 transition-all">
                <SettingsIcon size={18} strokeWidth={2} />
                Settings
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} strokeWidth={2} />
                Logout
              </button>
            </div>
          </aside>

          <div className="min-w-0 flex-1 max-w-7xl mx-auto px-5 md:px-8 py-8 md:ml-64">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-[#3aa0e8] dark:text-[#7cc2f2] mb-2">
                  ADMIN PANEL
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Monitor and manage your JobPortal platform
                </p>
              </div>

              <div className="bg-linear-to-br from-white/80 via-indigo-50/50 to-blue-50/60 dark:from-[#161c2e]/80 dark:via-indigo-950/20 dark:to-blue-950/20 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-xl px-4 py-3 shadow-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                    Platform Active
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-400 leading-tight">
                    All systems running smoothly
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
              <div className="bg-linear-to-br from-white/80 via-indigo-50/60 to-blue-50/60 dark:from-[#161c2e]/80 dark:via-indigo-950/20 dark:to-blue-950/20 backdrop-blur-xl rounded-2xl border border-indigo-100/70 dark:border-indigo-500/15 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {candidateUsers.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                      ↑ 12%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                    <UsersIcon size={20} strokeWidth={2} />
                  </div>
                </div>
                <Sparkline color="#6366f1" />
              </div>

              <div className="bg-linear-to-br from-white/80 via-blue-50/50 to-cyan-50/60 dark:from-[#161c2e]/80 dark:via-blue-950/20 dark:to-cyan-950/20 backdrop-blur-xl rounded-2xl border border-blue-100/70 dark:border-blue-500/15 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Companies
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {companies.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                      ↑ 8%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                    <Building2 size={20} strokeWidth={2} />
                  </div>
                </div>
                <Sparkline color="#3b82f6" />
              </div>

              <div className="bg-linear-to-br from-white/80 via-purple-50/50 to-fuchsia-50/60 dark:from-[#161c2e]/80 dark:via-purple-950/20 dark:to-fuchsia-950/20 backdrop-blur-xl rounded-2xl border border-purple-100/70 dark:border-purple-500/15 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Jobs
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {jobs.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                      ↑ 18%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <Briefcase size={20} strokeWidth={2} />
                  </div>
                </div>
                <Sparkline color="#a855f7" />
              </div>

              <div className="bg-linear-to-br from-white/80 via-teal-50/50 to-cyan-50/60 dark:from-[#161c2e]/80 dark:via-teal-950/20 dark:to-cyan-950/20 backdrop-blur-xl rounded-2xl border border-teal-100/70 dark:border-teal-500/15 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Active Jobs
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeJobs.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                      ↑ 24%
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center">
                    <BarChart3 size={20} strokeWidth={2} />
                  </div>
                </div>
                <Sparkline color="#14b8a6" />
              </div>
              <div className="bg-linear-to-br from-white/80 via-purple-50/50 to-indigo-50/60 dark:from-[#161c2e]/80 dark:via-purple-950/20 dark:to-indigo-950/20 backdrop-blur-xl rounded-2xl border border-purple-100/70 dark:border-purple-500/15 p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Applications
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {applications.length}
                    </p>
                    <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-1">
                      All Applications
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                    <FileText size={20} strokeWidth={2} />
                  </div>
                </div>
                <Sparkline color="#a855f7" />
              </div>
            </div>

            {/* RECENT USERS */}
            <section
              id="users-section"
              className="scroll-mt-6 bg-linear-to-br from-white/80 via-indigo-50/35 to-blue-50/45 dark:from-[#161c2e]/80 dark:via-indigo-950/20 dark:to-blue-950/15 backdrop-blur-xl border border-indigo-100/60 dark:border-indigo-500/15 rounded-2xl shadow-sm mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <UsersIcon size={18} className="text-indigo-500" /> Recent
                  Users
                </h2>
                {candidateUsers.length > 3 && (
                  <button
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                  >
                    {showAllUsers ? "Show Less ↑" : "View All →"}
                  </button>
                )}
              </div>

              {displayedUsers.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">
                  No users found
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                      <th className="px-5 py-3 font-semibold">Name</th>
                      <th className="px-5 py-3 font-semibold">Email</th>
                      <th className="px-5 py-3 font-semibold">Role</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition"
                      >
                        <td className="px-5 py-3">
                          <Link
                            to={`/user/${user._id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="relative">
                              <Avatar
                                name={user.name}
                                photo={getFileUrl(user.profilePhoto)}
                              />
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-[#161c2e]" />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {user.name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-5 py-3">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20">
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                requestDelete("user", user._id, user.name)
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* RECENT COMPANIES */}
            <section
              id="companies-section"
              className="scroll-mt-6 bg-linear-to-br from-white/80 via-blue-50/35 to-cyan-50/45 dark:from-[#161c2e]/80 dark:via-blue-950/20 dark:to-cyan-950/15 backdrop-blur-xl border border-blue-100/60 dark:border-blue-500/15 rounded-2xl shadow-sm mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Building2 size={18} className="text-blue-500" /> Recent
                  Companies
                </h2>
                {companies.length > 3 && (
                  <button
                    onClick={() => setShowAllCompanies(!showAllCompanies)}
                    className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                  >
                    {showAllCompanies ? "Show Less ↑" : "View All →"}
                  </button>
                )}
              </div>

              {displayedCompanies.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">
                  No companies found
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                      <th className="px-5 py-3 font-semibold">Company</th>
                      <th className="px-5 py-3 font-semibold">Location</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCompanies.map((company) => (
                      <tr
                        key={company._id}
                        className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition"
                      >
                        <td className="px-5 py-3">
                          <Link
                            to={`/company/${company._id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="relative">
                              <Avatar
                                name={company.companyname}
                                photo={getFileUrl(company.logo)}
                              />
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-[#161c2e]" />
                            </div>
                            <span className="font-semibold text-gray-800 dark:text-white">
                              {company.companyname}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                          {company.location ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={14} className="text-red-400" />{" "}
                              {company.location}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end">
                            <button
                              onClick={() =>
                                requestDelete(
                                  "company",
                                  company._id,
                                  company.companyname,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                            >
                              <Trash2 size={16} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* RECENT APPLICATIONS */}
            <section
              id="applications-section"
              className="scroll-mt-6 bg-linear-to-br from-white/80 via-purple-50/35 to-fuchsia-50/45 dark:from-[#161c2e]/80 dark:via-purple-950/20 dark:to-fuchsia-950/15 backdrop-blur-xl border border-purple-100/60 dark:border-purple-500/15 rounded-2xl shadow-sm mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <FileText size={18} className="text-purple-500" /> Recent
                  Applications
                </h2>
                {applications.length > 4 && (
                  <button
                    onClick={() => setShowAllApplications(!showAllApplications)}
                    className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                  >
                    {showAllApplications ? "Show Less ↑" : "View All →"}
                  </button>
                )}
              </div>

              {applications.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">
                  No applications found
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-175">
                    <thead>
                      <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                        <th className="px-5 py-3 font-semibold">Candidate</th>
                        <th className="px-5 py-3 font-semibold">Job</th>
                        <th className="px-5 py-3 font-semibold">Company</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedApplications.map((application) => (
                        <tr
                          key={application._id}
                          className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition"
                        >
                          <td className="px-5 py-3">
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">
                                {application.user?.name || "—"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {application.user?.email || "—"}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-semibold text-gray-800 dark:text-white">
                            {application.job?.title || "—"}
                          </td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                            {application.company?.companyname || "—"}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                application.status === "Accepted"
                                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                                  : application.status === "Rejected"
                                    ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/30"
                                    : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-200 dark:border-amber-500/30"
                              }`}
                            >
                              {application.status || "Pending"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  setApplicationDeleteTarget({
                                    id: application._id,
                                    name:
                                      application.user?.name ||
                                      "this application",
                                  })
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                                title="Delete application"
                              >
                                <Trash2 size={16} strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* RECENT JOBS */}
            <section
              id="jobs-section"
              className="scroll-mt-6 bg-linear-to-br from-white/80 via-teal-50/35 to-cyan-50/45 dark:from-[#161c2e]/80 dark:via-teal-950/20 dark:to-cyan-950/15 backdrop-blur-xl border border-teal-100/60 dark:border-teal-500/15 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Briefcase size={18} className="text-teal-500" /> Recent Jobs
                </h2>
                {jobs.length > 3 && (
                  <button
                    onClick={() => setShowAllJobs(!showAllJobs)}
                    className="text-sm font-semibold text-[#3aa0e8] dark:text-[#7cc2f2] hover:underline"
                  >
                    {showAllJobs ? "Show Less ↑" : "View All →"}
                  </button>
                )}
              </div>

              {displayedJobs.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-gray-400 dark:text-gray-500">
                  No jobs found
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 dark:text-gray-500 uppercase border-t border-gray-100 dark:border-[#252c45]">
                      <th className="px-5 py-3 font-semibold">Title</th>
                      <th className="px-5 py-3 font-semibold">Company</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedJobs.map((job) => {
                      const isExpired =
                        job.applicationDeadline &&
                        new Date(job.applicationDeadline) < new Date();
                      return (
                        <tr
                          key={job._id}
                          className="border-t border-gray-100 dark:border-[#252c45] hover:bg-gray-50 dark:hover:bg-[#1b2238] transition"
                        >
                          <td className="px-5 py-3">
                            <Link
                              to={`/jobs/${job._id}`}
                              className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white"
                            >
                              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                              {job.title}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                            {job.company?.companyname || "—"}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                isExpired
                                  ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-300 border-red-200 dark:border-red-500/30"
                                  : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30"
                              }`}
                            >
                              {isExpired ? "Expired" : "Active"}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end">
                              <button
                                onClick={() =>
                                  requestDelete("job", job._id, job.title)
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 dark:text-red-300 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
                              >
                                <Trash2 size={16} strokeWidth={2} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* APPLICATION DELETE MODAL */}
      {applicationDeleteTarget && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-white/20 dark:border-white/10">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={26} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Delete Application?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-7 leading-relaxed">
              Do you really want to delete the application of{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {applicationDeleteTarget.name}
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setApplicationDeleteTarget(null)}
                className="flex-1 bg-gray-100 dark:bg-[#252c45] hover:bg-gray-200 dark:hover:bg-[#2e365a] text-gray-700 dark:text-gray-200 font-semibold py-2.5 rounded-lg transition"
              >
                No, cancel
              </button>
              <button
                onClick={confirmApplicationDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {confirmTarget && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl rounded-2xl shadow-2xl p-7 max-w-sm w-full border border-white/20 dark:border-white/10">
            <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-300 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={26} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-7 leading-relaxed">
              Do you really want to delete{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {confirmTarget.name}
              </span>
              ?
              <br />
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-100 dark:bg-[#252c45] hover:bg-gray-200 dark:hover:bg-[#2e365a] text-gray-700 dark:text-gray-200 font-semibold py-2.5 rounded-lg transition"
              >
                No, cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition"
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;

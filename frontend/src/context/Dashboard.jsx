// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar.jsx";
// import { Link } from "react-router-dom";
// import { getDashboard } from "../services/authService.js";

// function Dashboard() {
//   const [Dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   const fetchDashboard = async () => {
//     try {
//       const res = await getDashboard();
//       setDashboard(res.data.data);
//     } catch (err) {
//       alert(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const company = JSON.parse(localStorage.getItem("user"));

//   const recentJobs = Dashboard?.recentJobs || [];

//   const filteredJobs = recentJobs.filter((job) =>
//     job.title?.toLowerCase().includes(search.trim().toLowerCase()),
//   );

//   const totalApplications = Dashboard?.totalApplications ?? 0;
//   const pending = Dashboard?.pending ?? 0;
//   const accepted = Dashboard?.accepted ?? 0;
//   const rejected = Dashboard?.rejected ?? 0;
//   const totalJobs = Dashboard?.totalJobs ?? 0;

//   const pct = (value) =>
//     totalApplications > 0 ? Math.round((value / totalApplications) * 100) : 0;

//   return (
//     <div className="min-h-screen bg-[#080d12] text-white">
//       {/* ================= NAVBAR ================= */}
//       <Navbar />

//       <div className="flex">
//         {/* ================= SIDEBAR ================= */}
//         <aside className="hidden lg:flex w-60 min-h-[calc(100vh-73px)] bg-[#111820] border-r border-[#27303a] flex-col sticky top-[73px]">
//           {/* Sidebar heading */}
//           <div className="px-5 py-6 border-b border-[#27303a]">
//             <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
//               Workspace
//             </p>

//             <h2 className="text-lg font-bold mt-1 text-white">Company Panel</h2>
//           </div>

//           {/* Menu */}
//           <div className="p-4 space-y-2">
//             <Link
//               to="/Dashboard"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#202932] border-l-2 border-[#f5c542] text-white"
//             >
//               <span className="text-[#f5c542]">▣</span>
//               Dashboard
//             </Link>

//             <Link
//               to="/postjob"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1b232c] transition"
//             >
//               <span>＋</span>
//               Post a Job
//             </Link>

//             <Link
//               to="/myjobs"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1b232c] transition"
//             >
//               <span>▤</span>
//               My Jobs
//             </Link>

//             <Link
//               to="/companyprofile"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1b232c] transition"
//             >
//               <span>◉</span>
//               Company Profile
//             </Link>
//           </div>

//           {/* Bottom info */}
//           <div className="mt-auto p-5 border-t border-[#27303a]">
//             <p className="text-xs text-gray-500">Logged in as</p>

//             <p className="text-sm font-semibold text-gray-300 mt-1 truncate">
//               {company?.companyname || "Company"}
//             </p>
//           </div>
//         </aside>

//         {/* ================= MAIN ================= */}
//         <main className="flex-1 min-w-0">
//           <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-7">
//             {/* ================= TOP HEADER ================= */}
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
//               <div>
//                 <p className="text-xs uppercase tracking-[0.18em] text-[#f5c542] mb-2">
//                   Overview
//                 </p>

//                 <h1 className="text-2xl md:text-3xl font-bold text-white">
//                   Welcome back,{" "}
//                   <span className="text-[#f5c542]">
//                     {company?.companyname || "Company"}
//                   </span>
//                 </h1>

//                 <p className="text-sm text-gray-500 mt-2">
//                   Monitor your jobs and candidate applications.
//                 </p>
//               </div>

//               <Link
//                 to="/postjob"
//                 className="
//                   inline-flex items-center justify-center gap-2
//                   bg-[#f5c542]
//                   hover:bg-[#ffd45e]
//                   text-[#101419]
//                   font-bold
//                   px-5 py-3
//                   rounded-lg
//                   shadow-[0_0_25px_rgba(245,197,66,0.15)]
//                   transition-all duration-200
//                 "
//               >
//                 <span className="text-lg">＋</span>
//                 Post New Job
//               </Link>
//             </div>

//             {/* ================= STAT CARDS ================= */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
//               {/* Applications */}
//               <div className="relative overflow-hidden bg-[#151d25] border border-[#2b353f] rounded-xl p-5">
//                 <div className="absolute right-0 top-0 w-20 h-20 bg-[#f5c542]/5 rounded-full blur-2xl" />

//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] uppercase tracking-widest text-gray-500">
//                     Total Applications
//                   </p>

//                   <span className="w-8 h-8 rounded-lg bg-[#252d35] flex items-center justify-center text-[#f5c542]">
//                     ◈
//                   </span>
//                 </div>

//                 <p className="text-3xl font-bold mt-4">{totalApplications}</p>

//                 <div className="mt-4 h-[2px] bg-[#27313a]">
//                   <div className="h-full bg-[#f5c542] w-[70%]" />
//                 </div>
//               </div>

//               {/* Jobs */}
//               <div className="relative overflow-hidden bg-[#151d25] border border-[#2b353f] rounded-xl p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] uppercase tracking-widest text-gray-500">
//                     Jobs Posted
//                   </p>

//                   <span className="w-8 h-8 rounded-lg bg-[#252d35] flex items-center justify-center text-[#f5c542]">
//                     ▤
//                   </span>
//                 </div>

//                 <p className="text-3xl font-bold mt-4">{totalJobs}</p>

//                 <p className="text-xs text-gray-500 mt-2">
//                   Active positions in your company
//                 </p>
//               </div>

//               {/* Accepted */}
//               <div className="relative overflow-hidden bg-[#151d25] border border-[#2b353f] rounded-xl p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] uppercase tracking-widest text-gray-500">
//                     Accepted
//                   </p>

//                   <span className="w-8 h-8 rounded-lg bg-[#252d35] flex items-center justify-center text-green-400">
//                     ✓
//                   </span>
//                 </div>

//                 <p className="text-3xl font-bold mt-4 text-green-400">
//                   {accepted}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-2">
//                   {pct(accepted)}% of total applications
//                 </p>
//               </div>

//               {/* Pending */}
//               <div className="relative overflow-hidden bg-[#151d25] border border-[#2b353f] rounded-xl p-5">
//                 <div className="flex items-center justify-between">
//                   <p className="text-[10px] uppercase tracking-widest text-gray-500">
//                     Pending
//                   </p>

//                   <span className="w-8 h-8 rounded-lg bg-[#252d35] flex items-center justify-center text-[#f5c542]">
//                     ◷
//                   </span>
//                 </div>

//                 <p className="text-3xl font-bold mt-4 text-[#f5c542]">
//                   {pending}
//                 </p>

//                 <p className="text-xs text-gray-500 mt-2">Waiting for review</p>
//               </div>
//             </div>

//             {/* ================= MAIN GRID ================= */}
//             <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-7">
//               {/* ================= RECENT JOBS ================= */}
//               <div className="xl:col-span-2 bg-[#111820] border border-[#27313a] rounded-xl overflow-hidden">
//                 <div className="px-5 py-4 border-b border-[#27313a] flex items-center justify-between">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest text-[#f5c542]">
//                       Activity
//                     </p>

//                     <h2 className="font-bold text-lg mt-1">
//                       Recent Job Postings
//                     </h2>
//                   </div>

//                   <Link
//                     to="/myjobs"
//                     className="text-xs text-gray-400 hover:text-[#f5c542] transition"
//                   >
//                     View All →
//                   </Link>
//                 </div>

//                 {recentJobs.length === 0 ? (
//                   <div className="py-14 text-center">
//                     <div className="text-3xl text-gray-600 mb-3">▤</div>

//                     <p className="text-gray-400">No jobs posted yet</p>

//                     <Link
//                       to="/postjob"
//                       className="inline-block mt-4 text-xs text-[#f5c542] hover:underline"
//                     >
//                       Create your first job →
//                     </Link>
//                   </div>
//                 ) : (
//                   <div className="divide-y divide-[#27313a]">
//                     {recentJobs.slice(0, 5).map((job) => (
//                       <div
//                         key={job._id}
//                         className="
//                           px-5 py-4
//                           flex flex-col sm:flex-row
//                           sm:items-center
//                           justify-between
//                           gap-4
//                           hover:bg-[#151e27]
//                           transition
//                         "
//                       >
//                         <div className="flex items-center gap-4">
//                           <div
//                             className="
//                             w-10 h-10
//                             rounded-lg
//                             bg-[#242d36]
//                             border border-[#39434d]
//                             flex items-center justify-center
//                             text-[#f5c542]
//                             font-bold
//                           "
//                           >
//                             {job.title?.charAt(0)?.toUpperCase() || "J"}
//                           </div>

//                           <div>
//                             <h3 className="font-semibold text-gray-200">
//                               {job.title}
//                             </h3>

//                             <p className="text-xs text-gray-500 mt-1">
//                               📍 {job.location}
//                             </p>
//                           </div>
//                         </div>

//                         <Link
//                           to={`/jobs/${job._id}`}
//                           className="
//                             text-xs font-semibold
//                             border border-[#39434d]
//                             px-4 py-2
//                             rounded-md
//                             text-gray-300
//                             hover:border-[#f5c542]
//                             hover:text-[#f5c542]
//                             transition
//                           "
//                         >
//                           View Details
//                         </Link>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* ================= APPLICATION BREAKDOWN ================= */}
//               <div className="bg-[#111820] border border-[#27313a] rounded-xl p-5">
//                 <div className="flex items-center justify-between mb-6">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest text-[#f5c542]">
//                       Analytics
//                     </p>

//                     <h2 className="font-bold text-lg mt-1">Applications</h2>
//                   </div>

//                   <span className="text-xs text-gray-500">Overview</span>
//                 </div>

//                 {/* Fake circular visual */}
//                 <div className="flex justify-center mb-7">
//                   <div
//                     className="
//                     relative
//                     w-36 h-36
//                     rounded-full
//                     flex items-center justify-center
//                     bg-[#151d25]
//                     border-[10px]
//                     border-[#2b353f]
//                     shadow-[0_0_30px_rgba(245,197,66,0.08)]
//                   "
//                   >
//                     <div
//                       className="
//                       absolute inset-[-10px]
//                       rounded-full
//                       border-[10px]
//                       border-transparent
//                       border-t-[#f5c542]
//                       border-r-[#f5c542]
//                       rotate-[-25deg]
//                     "
//                     />

//                     <div className="text-center relative z-10">
//                       <p className="text-2xl font-bold">{totalApplications}</p>

//                       <p className="text-[9px] uppercase tracking-widest text-gray-500">
//                         Total
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Pending */}
//                 <div className="flex items-center justify-between py-3 border-b border-[#27313a]">
//                   <div className="flex items-center gap-3">
//                     <span className="w-2.5 h-2.5 rounded-full bg-[#f5c542]" />
//                     <span className="text-sm text-gray-400">Pending</span>
//                   </div>

//                   <span className="font-semibold">{pending}</span>
//                 </div>

//                 {/* Accepted */}
//                 <div className="flex items-center justify-between py-3 border-b border-[#27313a]">
//                   <div className="flex items-center gap-3">
//                     <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
//                     <span className="text-sm text-gray-400">Accepted</span>
//                   </div>

//                   <span className="font-semibold">{accepted}</span>
//                 </div>

//                 {/* Rejected */}
//                 <div className="flex items-center justify-between py-3">
//                   <div className="flex items-center gap-3">
//                     <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
//                     <span className="text-sm text-gray-400">Rejected</span>
//                   </div>

//                   <span className="font-semibold">{rejected}</span>
//                 </div>
//               </div>
//             </div>

//             {/* ================= JOB LISTINGS ================= */}
//             <div className="bg-[#111820] border border-[#27313a] rounded-xl overflow-hidden">
//               {/* Header */}
//               <div className="px-5 py-5 border-b border-[#27313a]">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                   <div>
//                     <p className="text-[10px] uppercase tracking-widest text-[#f5c542]">
//                       Positions
//                     </p>

//                     <h2 className="text-lg font-bold mt-1">Job Listings</h2>
//                   </div>

//                   {/* Search */}
//                   <div className="relative w-full md:w-72">
//                     <input
//                       type="text"
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       placeholder="Search positions..."
//                       className="
//                         w-full
//                         bg-[#0b1117]
//                         border border-[#303b45]
//                         text-white
//                         placeholder:text-gray-600
//                         rounded-lg
//                         pl-10 pr-4 py-2.5
//                         text-sm
//                         outline-none
//                         focus:border-[#f5c542]
//                         focus:ring-1
//                         focus:ring-[#f5c542]
//                         transition
//                       "
//                     />

//                     <span
//                       className="
//                       absolute left-3 top-1/2
//                       -translate-y-1/2
//                       text-gray-500
//                     "
//                     >
//                       ⌕
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-[#151d25] text-[10px] uppercase tracking-widest text-gray-500">
//                     <tr>
//                       <th className="px-5 py-4 text-left font-medium">
//                         Position
//                       </th>

//                       <th className="px-5 py-4 text-left font-medium">
//                         Location
//                       </th>

//                       <th className="px-5 py-4 text-left font-medium">
//                         Status
//                       </th>

//                       <th className="px-5 py-4 text-right font-medium">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredJobs.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={4}
//                           className="px-5 py-12 text-center text-gray-600"
//                         >
//                           No positions found
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredJobs.map((job) => (
//                         <tr
//                           key={job._id}
//                           className="
//                             border-t border-[#27313a]
//                             hover:bg-[#151e27]
//                             transition
//                           "
//                         >
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-3">
//                               <div
//                                 className="
//                                 w-8 h-8
//                                 rounded-md
//                                 bg-[#242d36]
//                                 flex items-center justify-center
//                                 text-[#f5c542]
//                                 text-xs
//                                 font-bold
//                               "
//                               >
//                                 {job.title?.charAt(0)?.toUpperCase() || "J"}
//                               </div>

//                               <span className="font-semibold text-gray-200">
//                                 {job.title}
//                               </span>
//                             </div>
//                           </td>

//                           <td className="px-5 py-4 text-gray-500">
//                             📍 {job.location}
//                           </td>

//                           <td className="px-5 py-4">
//                             <span
//                               className="
//                               inline-flex items-center gap-2
//                               text-xs
//                               text-green-400
//                             "
//                             >
//                               <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
//                               Active
//                             </span>
//                           </td>

//                           <td className="px-5 py-4 text-right">
//                             <Link
//                               to={`/jobs/${job._id}`}
//                               className="
//                                 inline-block
//                                 text-xs
//                                 font-semibold
//                                 px-3 py-1.5
//                                 rounded-md
//                                 border border-[#39434d]
//                                 text-gray-300
//                                 hover:border-[#f5c542]
//                                 hover:text-[#f5c542]
//                                 transition
//                               "
//                             >
//                               View
//                             </Link>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* ================= FOOTER ================= */}
//             <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2 text-[10px] uppercase tracking-widest text-gray-600">
//               <span>Job Portal • Company Dashboard</span>

//               <span>Dashboard Overview</span>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

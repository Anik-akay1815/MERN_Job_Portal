import Navbar from "../components/Navbar.jsx";
import JobCard from "../components/JobCard.jsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllJobs } from "../services/authService.js";

function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    jobType: "",
    experienceLevel: "",
  });

  useEffect(() => {
    fetchJobs(filters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchJobs = async (appliedFilters, page = 1) => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(
          ([, value]) => value && value.trim() !== "",
        ),
      );
      const res = await getAllJobs({ ...cleanFilters, page, limit: 6 });
      setJobs(res.data.data);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setTotalJobs(res.data.totalJobs);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(filters, 1);
  };

  const handleApplyFilters = () => {
    fetchJobs(filters, 1);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: "",
      location: "",
      jobType: "",
      experienceLevel: "",
    };
    setFilters(resetFilters);
    setSortBy("");
    fetchJobs(resetFilters, 1);
  };

  const extractSalaryNumber = (salaryStr) => {
    const match = salaryStr?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "salary-desc")
      return extractSalaryNumber(b.salary) - extractSalaryNumber(a.salary);
    if (sortBy === "salary-asc")
      return extractSalaryNumber(a.salary) - extractSalaryNumber(b.salary);
    return 0;
  });

  const activeFilterCount = [
    filters.jobType,
    filters.experienceLevel,
    sortBy,
  ].filter(Boolean).length;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchJobs(filters, page);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar currentPage="jobs" />

      {/* Search Header */}
      <section className="relative overflow-hidden bg-[#f5f6fa] dark:bg-[#0f1420]">
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-blue-200/30 dark:bg-blue-600/10 blur-3xl" />
        <div className="absolute -top-20 right-10 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-indigo-200/20 dark:bg-indigo-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 tracking-tight">
              Find your{" "}
              <span className="text-blue-500 dark:text-[#7cc2f2]">
                dream job
              </span>
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-3 text-base md:text-lg">
              Search thousands of opportunities and take the next step in your
              career.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="max-w-5xl mx-auto bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-2xl border border-white/70 dark:border-white/10 rounded-2xl p-2 shadow-xl shadow-slate-300/20 dark:shadow-black/20"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr_auto] gap-2">
              <div className="flex items-center bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl px-4 focus-within:border-blue-400 dark:focus-within:border-[#7cc2f2] transition">
                <span className="text-lg text-slate-400 mr-3">🔍</span>
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Job title, skills, or keywords"
                  className="w-full py-3.5 bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-xl px-4 focus-within:border-blue-400 dark:focus-within:border-[#7cc2f2] transition">
                <span className="text-lg text-slate-400 mr-3">📍</span>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Location"
                  className="w-full py-3.5 bg-transparent outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 dark:bg-[#249bea] dark:hover:bg-[#1688d4] text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Search Jobs →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr] gap-8">
          {/* Filters */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white/60 dark:bg-[#161c2e]/50 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Filters
                </h2>

                {activeFilterCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-blue-500 dark:bg-[#249bea] text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <div className="pb-6 border-b border-slate-200/70 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                  Working schedule
                </p>

                {[
                  ["Full Time", "Full time"],
                  ["Part Time", "Part time"],
                  ["Intern", "Internship"],
                  ["Remote", "Remote"],
                ].map(([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2.5 text-sm mb-3 cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value={value}
                      checked={filters.jobType === value}
                      onChange={handleFilterChange}
                      className="accent-blue-500"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="py-6 border-b border-slate-200/70 dark:border-white/10">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                  Experience
                </p>

                {[
                  "Fresher",
                  "0-1 years",
                  "1-3 years",
                  "3-5 years",
                  "5+ years",
                ].map((level) => (
                  <label
                    key={level}
                    className="flex items-center gap-2.5 text-sm mb-3 cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    <input
                      type="radio"
                      name="experienceLevel"
                      value={level}
                      checked={filters.experienceLevel === level}
                      onChange={handleFilterChange}
                      className="accent-blue-500"
                    />
                    {level}
                  </label>
                ))}
              </div>

              <div className="py-6">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                  Sort by salary
                </p>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2] transition"
                >
                  <option
                    value=""
                    className="bg-white dark:bg-[#161c2e] text-slate-700 dark:text-white"
                  >
                    Recommended
                  </option>
                  <option
                    value="salary-desc"
                    className="bg-white dark:bg-[#161c2e] text-slate-700 dark:text-white"
                  >
                    Highest to Lowest
                  </option>
                  <option
                    value="salary-asc"
                    className="bg-white dark:bg-[#161c2e] text-slate-700 dark:text-white"
                  >
                    Lowest to Highest
                  </option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 rounded-xl py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-500 dark:bg-[#249bea] text-white rounded-xl py-2 text-xs font-semibold hover:bg-blue-600 dark:hover:bg-[#1688d4] transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Jobs */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  Recommended jobs
                </h2>
                <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-[#161c2e]/70 border border-white/70 dark:border-white/10 backdrop-blur-xl text-sm font-semibold text-blue-500 dark:text-[#7cc2f2]">
                  {totalJobs}
                </span>
              </div>

              <div className="lg:hidden">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-200 dark:border-white/10 rounded-xl bg-white/70 dark:bg-[#161c2e]/70 backdrop-blur-xl text-slate-700 dark:text-slate-200 px-3 py-2 text-sm outline-none"
                >
                  <option value="">Recommended</option>
                  <option value="salary-desc">Highest salary</option>
                  <option value="salary-asc">Lowest salary</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl py-20 text-center">
                <div className="text-3xl mb-3">⏳</div>
                <p className="text-slate-500 dark:text-slate-400">
                  Finding the best jobs for you...
                </p>
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl py-20 text-center">
                <div className="text-4xl mb-3">🔎</div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  No jobs found
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={handleReset}
                  className="mt-5 bg-blue-500 dark:bg-[#249bea] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-600 dark:hover:bg-[#1688d4] transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedJobs.map((job, index) => (
                    <JobCard
                      key={job._id}
                      jobId={job._id}
                      title={job.title}
                      company={job.company?.companyname}
                      companyLogo={job.company?.logo}
                      location={job.location}
                      salary={job.salary}
                      jobType={job.jobType}
                      experienceLevel={job.experienceLevel}
                      skillsRequired={job.skillsRequired}
                      category={job.category}
                      numberOfOpenings={job.numberOfOpenings}
                      applicationDeadline={job.applicationDeadline}
                      cardIndex={index}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${currentPage === 1 ? "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 cursor-not-allowed" : "bg-white/70 dark:bg-[#161c2e]/70 text-slate-700 dark:text-slate-200 border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10"}`}
                    >
                      ←
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition ${currentPage === page ? "bg-blue-500 dark:bg-[#249bea] text-white shadow-lg shadow-blue-500/20" : "bg-white/70 dark:bg-[#161c2e]/70 text-slate-700 dark:text-slate-200 border border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10"}`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition ${currentPage === totalPages ? "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10 cursor-not-allowed" : "bg-white/70 dark:bg-[#161c2e]/70 text-slate-700 dark:text-slate-200 border-white/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10"}`}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Jobs;

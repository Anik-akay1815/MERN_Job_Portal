import Navbar from "../components/Navbar.jsx";
import JobCard from "../components/JobCard.jsx";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllJobs } from "../services/authService.js";

function Jobs() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const panelRef = useRef(null);

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

  // Close the filter popover when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchJobs = async (appliedFilters, page = 1) => {
    setLoading(true);

    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(appliedFilters).filter(([, v]) => v && v.trim() !== ""),
      );

      const res = await getAllJobs({
        ...cleanFilters,
        page,
        limit: 6,
      });

      setJobs(res.data.data);

      // Pagination data from backend
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
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();

    // Search always starts from page 1
    fetchJobs(filters, 1);
  };

  const handleApplyFilters = () => {
    // Filters start from page 1
    fetchJobs(filters, 1);
    setShowFilters(false);
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

    // Reset starts from page 1
    fetchJobs(resetFilters, 1);

    setShowFilters(false);
  };

  // Extract a numeric value from strings like "12 LPA"
  // for client-side sorting
  const extractSalaryNumber = (salaryStr) => {
    const match = salaryStr?.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === "salary-desc") {
      return extractSalaryNumber(b.salary) - extractSalaryNumber(a.salary);
    }

    if (sortBy === "salary-asc") {
      return extractSalaryNumber(a.salary) - extractSalaryNumber(b.salary);
    }

    return 0;
  });

  const activeFilterCount = [
    filters.jobType,
    filters.experienceLevel,
    sortBy,
  ].filter(Boolean).length;

  // Pagination handler
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    fetchJobs(filters, page);
  };

  return (
    <>
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">
            Browse <span className="text-slate-700">Jobs</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Find your next opportunity from top companies
          </p>
        </div>

        {/* Compact Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 mb-8 relative"
        >
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>

            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Search Jobs"
              className="w-full border border-gray-300 pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
            />
          </div>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              📍
            </span>

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Location"
              className="w-full border border-gray-300 pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-600 font-semibold transition-all duration-300 shadow-sm hover:shadow-md text-sm whitespace-nowrap"
          >
            Search
          </button>

          {/* Filter icon button + popover */}
          <div className="relative" ref={panelRef}>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                showFilters
                  ? "bg-slate-700 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              title="Filters"
            >
              <span className="text-base">✎</span>

              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-200 p-4 z-20">
                <div className="space-y-3">
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  >
                    <option value="">Job Type (Any)</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Intern">Intern</option>
                    <option value="Remote">Remote</option>
                  </select>

                  <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  >
                    <option value="">Experience (Any)</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 px-3 py-2 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  >
                    <option value="">Sort by Salary</option>
                    <option value="salary-desc">Highest to Lowest</option>
                    <option value="salary-asc">Lowest to Highest</option>
                  </select>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-50 font-semibold transition-all duration-300 text-xs"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-800 font-semibold transition-all duration-300 text-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Job count */}
        <p className="text-gray-500 mb-4">
          {loading ? "Searching..." : `${totalJobs} jobs found`}
        </p>

        {/* Job grid */}
        {!loading && sortedJobs.length === 0 ? (
          <p className="text-gray-500 text-center bg-gray-50 rounded-xl py-10">
            No jobs found
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sortedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  jobId={job._id}
                  title={job.title}
                  company={job.company?.companyname}
                  location={job.location}
                  salary={job.salary}
                  jobType={job.jobType}
                  experienceLevel={job.experienceLevel}
                  skillsRequired={job.skillsRequired}
                  category={job.category}
                  numberOfOpenings={job.numberOfOpenings}
                  applicationDeadline={job.applicationDeadline}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                {/* Previous */}
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-300 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      currentPage === page
                        ? "bg-emerald-500 text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all duration-300 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default Jobs;

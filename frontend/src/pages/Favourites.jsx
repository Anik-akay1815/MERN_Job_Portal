import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import { getFavourites } from "../services/authService";

function FavouriteJobs() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavourites = async () => {
    try {
      setError("");
      const res = await getFavourites();
      setFavourites(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load favourite jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "user") {
      setLoading(false);
      setError("Please login with a candidate account to view your favourite jobs.");
      return;
    }

    fetchFavourites();

    window.addEventListener("favouriteChanged", fetchFavourites);
    return () => window.removeEventListener("favouriteChanged", fetchFavourites);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] transition-colors">
      <Navbar currentPage="favourites" />
      <div className="fixed -top-24 -left-20 w-72 h-72 bg-purple-400/10 dark:bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="fixed top-40 -right-24 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/10 text-blue-600 dark:text-blue-300 text-xs font-semibold mb-4">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.7 4.7 0 0 1 8 4.1c1.5 0 3 .7 4 1.9 1-1.2 2.5-1.9 4-1.9a4.7 4.7 0 0 1 4.8 4.7Z" />
            </svg>
            Saved Jobs
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Favourite Jobs
          </h1>
          <p className="mt-2 text-sm md:text-base text-slate-500 dark:text-slate-400">
            Keep track of the opportunities you want to apply for.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((item) => (
              <div key={item} className="min-h-97.5 rounded-2xl bg-white/70 dark:bg-[#161c2e]/60 border border-white/60 dark:border-white/10 backdrop-blur-xl p-5 animate-pulse">
                <div className="h-6 w-24 bg-slate-200 dark:bg-white/10 rounded-full" />
                <div className="h-12 w-12 bg-slate-200 dark:bg-white/10 rounded-xl mt-6" />
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-white/10 rounded mt-4" />
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-white/10 rounded mt-3" />
                <div className="h-10 w-full bg-slate-200 dark:bg-white/10 rounded-full mt-12" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 p-8 text-center">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
            <Link to="/login" className="inline-flex mt-5 px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition">
              Login
            </Link>
          </div>
        ) : favourites.length === 0 ? (
          <div className="rounded-2xl bg-white/70 dark:bg-[#161c2e]/60 backdrop-blur-xl border border-white/60 dark:border-white/10 p-10 md:p-14 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-400/10 flex items-center justify-center text-blue-500 dark:text-[#7cc2f2]">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.7 4.7 0 0 1 8 4.1c1.5 0 3 .7 4 1.9 1-1.2 2.5-1.9 4-1.9a4.7 4.7 0 0 1 4.8 4.7Z" />
              </svg>
            </div>
            <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">No favourite jobs yet</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Save jobs you are interested in and find them here later.</p>
            <Link to="/jobs" className="inline-flex mt-6 px-5 py-2.5 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition">
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {favourites.map((item, index) => {
              const job = item.job;
              if (!job) return null;

              return (
                <JobCard
                  key={item._id || job._id}
                  jobId={job._id}
                  title={job.title}
                  company={typeof job.company === "object" ? job.company?.companyname : "Company"}
                  companyLogo={typeof job.company === "object" ? job.company?.logo : ""}
                  location={job.location}
                  salary={job.salary}
                  jobType={job.jobType}
                  experienceLevel={job.experienceLevel}
                  skillsRequired={job.skillsRequired}
                  category={job.category}
                  numberOfOpenings={job.numberOfOpenings}
                  applicationDeadline={job.applicationDeadline}
                  cardIndex={index}
                  initialFavourite={true}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default FavouriteJobs;

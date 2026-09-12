import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroGirl from "../assets/hero-girl.png";

function Hero() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (keyword.trim()) params.set("keyword", keyword.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/jobs?${params.toString()}`);
  };

  const handleTagClick = (tag) => {
    navigate(`/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  const tags = ["React", "Java", "MERN", "Python", "DevOps", "AI/ML"];

  return (
    <section className="relative min-h-[60vh] overflow-hidden bg-[#f5f6fa] dark:bg-[#0f1420]">

      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-200/30 dark:bg-indigo-600/10 blur-3xl" />
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blue-200/30 dark:bg-blue-600/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-purple-200/20 dark:bg-purple-600/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 py-14">

        <div className="grid lg:grid-cols-[1fr_0.7fr] items-center gap-8">

          {/* LEFT CONTENT */}
          <div>

            <div className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full
              bg-white/70 dark:bg-[#161c2e]/70
              border border-white/60 dark:border-white/10
              backdrop-blur-xl text-sm text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Your career, your next move
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold
              tracking-tight text-slate-900 dark:text-white leading-tight">
              Find the right job.
              <br />
              Build your{" "}
              <span className="text-blue-500 dark:text-[#7cc2f2]">
                future.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base md:text-lg
              text-slate-600 dark:text-slate-300">
              Explore opportunities from top companies and take the next
              step in your career.
            </p>

            {/* SEARCH */}
            <form
              onSubmit={handleSearch}
              className="mt-7 flex flex-col md:flex-row items-stretch md:items-center
                bg-white/80 dark:bg-[#161c2e]/70
                border border-white/60 dark:border-white/10
                backdrop-blur-xl rounded-2xl p-2
                shadow-lg dark:shadow-black/20 max-w-2xl"
            >
              <div className="flex-1 flex items-center px-4">
                <span className="text-slate-400 mr-3">⌕</span>
                <input
                  type="text"
                  placeholder="Job title, skills, or keywords"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full bg-transparent outline-none
                    text-slate-800 dark:text-white
                    placeholder:text-slate-400"
                />
              </div>

              <div className="hidden md:block h-8 w-px bg-slate-200 dark:bg-white/10" />

              <div className="flex-1 flex items-center px-4 mt-2 md:mt-0">
                <span className="text-slate-400 mr-3">⌖</span>
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none
                    text-slate-800 dark:text-white
                    placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 md:mt-0 px-7 py-3 rounded-xl
                  bg-blue-500 hover:bg-blue-600
                  dark:bg-[#249bea] dark:hover:bg-[#1688d4]
                  text-white font-semibold transition"
              >
                Find Jobs
              </button>
            </form>

            {/* TAGS */}
            <div className="flex flex-wrap items-center gap-2 mt-4 text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Popular:
              </span>

              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1.5 rounded-full
                    bg-white/70 dark:bg-[#161c2e]/70
                    border border-white/60 dark:border-white/10
                    text-slate-600 dark:text-slate-300
                    hover:text-blue-500 dark:hover:text-[#7cc2f2]
                    transition"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-8 mt-8">
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  1X,XXX+
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Jobs Posted
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  5XX+
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Companies
                </p>
              </div>

              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  5,XXX+
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Candidates
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT CHARACTER */}
          <div className="relative flex justify-center lg:justify-end items-end">

            <div className="absolute w-72 h-72 rounded-full
              bg-blue-200/40 dark:bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <img
                src={heroGirl}
                alt="Professional woman"
                className="w-65 md:w-75 lg:w-6xl
                  h-auto object-contain drop-shadow-2xl"
              />

              <div className="absolute top-8 -right-8
                text-blue-600 dark:text-[#7cc2f2]
                text-lg font-medium rotate-[-8deg]">
                <span className="block">Better</span>
                <span className="block">Careers</span>
                <span className="block">Brighter</span>
                <span className="block">Futures</span>
              </div>
            </div>
          </div>

        </div>

        {/* TRUSTED COMPANIES
        <div className="mt-12 pt-7 border-t border-slate-200/70 dark:border-white/10">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Trusted by leading companies
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {["TechWor", "Microsoft", "Amazon", "Meta", "Adobe", "TCS"].map(
              (company) => (
                <div
                  key={company}
                  className="h-14 flex items-center justify-center
                    rounded-xl
                    bg-white/70 dark:bg-[#161c2e]/60
                    border border-white/60 dark:border-white/10
                    backdrop-blur-xl
                    font-semibold text-slate-700 dark:text-slate-200"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div> */}

      </div>
    </section>
  );
}

export default Hero;
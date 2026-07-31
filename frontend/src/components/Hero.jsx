import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      <section className="min-h-[60vh] bg-linear-to-br from-slate-50 via-gray-50 to-emerald-50">
        <div className="flex flex-col items-center justify-center text-center py-24 max-w-screen-2xl mx-auto px-6">
          <span className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🚀 Over 1000+ jobs posted
          </span>

          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            Find Your<span className="text-slate-700"> Dream Job</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            Discover thousands of jobs from top companies and start your career
            today
          </p>

          <div className="mt-10 flex w-full max-w-3xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
            <input
              type="text"
              placeholder="Job title, keyword..."
              className="flex-1 px-5 py-4 outline-none text-lg font-medium"
            />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 px-5 py-4 border-l border-gray-200 outline-none text-lg font-medium"
            />
            <button className="bg-emerald-500 m-1.5 text-white px-10 py-3.5 font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg">
              Search
            </button>
          </div>

          <div className="mt-8 flex items-center gap-3 flex-wrap justify-center">
            <span className="text-gray-500 text-sm font-medium">Popular:</span>
            {["React", "NodeJS", "Express", "MERN", "AI/ML"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 cursor-pointer transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;

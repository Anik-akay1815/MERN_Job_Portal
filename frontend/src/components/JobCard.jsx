import { Link } from "react-router-dom";

import { applyJob } from "../services/authService";

function JobCard({ jobId, title, company, location, salary }) {
  const handleApply = async () => {
    try {
      const res = await applyJob(jobId);
      alert(res.data.message);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="border border-gray-200 rounded-2xl bg-white p-6 min-h-60 flex flex-col justify-between shadow-md hover:shadow-xl hover:border-slate-300 transition-all duration-300">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-slate-700 font-semibold mt-1">{company}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
              📍 {location}
            </span>
            <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-semibold">
              ₹ {salary}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-emerald-500 text-white px-5 py-2 rounded-lg hover:bg-emerald-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-md"
            onClick={handleApply}
          >
            Apply Now
          </button>
          <Link
            to={`/jobs/${jobId}`}
            className="text-slate-700 font-semibold hover:text-slate-900 hover:underline transition-all duration-300"
          >
            View Details →
          </Link>
        </div>
      </div>
    </>
  );
}
export default JobCard;

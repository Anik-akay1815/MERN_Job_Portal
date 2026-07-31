import Navbar from "../components/Navbar.jsx";
import { useEffect, useState } from "react";
import {
  deleteApplication,
  getUserApplications,
} from "../services/authService.js";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const fetchApplications = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await getUserApplications(user._id);
      console.log(res.data);
      setApplications(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  const handleWithdraw = async (id) => {
    try {
      await deleteApplication(id);
      alert("Application Withdrawn successfully");
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Applications</h1>
        {applications.length === 0 ? (
          <div className="text-center text-gray-500 text-xl mt-20">
            No Applications Yet
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-gray-800 transition"
              >
                <h2 className="text-xl font-bold text-slate-700">
                  {app.job.title}
                </h2>
                <p className="mt-2 text-gray-700">
                  <span className="font-semibold">Company:</span>{" "}
                  {app.company.companyname}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Location:</span>{" "}
                  {app.company.location}
                </p>
                <div className="mt-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
          ${
            app.status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : app.status === "Accepted"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
          }`}
                  >
                    {app.status}
                  </span>
                </div>
                <button
                  className="mt-5 w-full bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-300 font-semibold"
                  onClick={() => handleWithdraw(app._id)}
                >
                  Withdraw Application
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
export default MyApplications;

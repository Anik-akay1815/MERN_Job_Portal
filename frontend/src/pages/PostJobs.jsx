import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { createJob, getJobById, updateJob } from "../services/authService.js";
import { useNavigate, useParams } from "react-router-dom";

function PostJobs() {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    salary: "",
    jobType: "",
    location: "",
  });
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateJob(id, jobData);
        alert("Job updated Successfully");
      } else {
        await createJob(jobData);
        alert("Job created Successfully");
      }
      navigate("/myjobs");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      setJobData({
        title: res.data.data.title,
        salary: res.data.data.salary,
        location: res.data.data.location,
        jobType: res.data.data.jobType,
        description: res.data.data.description,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Post Job Vacancies
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Fill in the details to publish a new job
            </p>
            <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-4"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 5 lpa"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Job Type
                </label>
                <input
                  type="text"
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  placeholder="e.g. Full-time"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g. Remote / Delhi"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and requirements..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-semibold text-white py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              {id ? "Update Job" : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
export default PostJobs;

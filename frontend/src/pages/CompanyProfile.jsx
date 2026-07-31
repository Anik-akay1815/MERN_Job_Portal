import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getCompanyById, updateCompany } from "../services/authService.js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    password: "",
    location: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (id) {
      fetchCompany();
    } else {
      const data = JSON.parse(localStorage.getItem("user"));
      setCompany(data);
      if (data?._id) {
        fetchCompany(data._id);
      }
    }
  }, []);
  useEffect(() => {
    if (company) {
      setFormData({
        companyname: company.companyname || "",
        email: company.email || "",
        location: company.location || "",
        description: company.description || "",
        password: "",
      });
    }
  }, [company]);
  const fetchCompany = async (companyId = id) => {
    try {
      const res = await getCompanyById(companyId);
      setCompany(res.data.data.company);
      setJobs(res.data.data.jobs);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password; // empty password mat bhejo
      }
      const res = await updateCompany(company._id, payload);
      setCompany(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  if (!company) {
    return <h2>Loading...</h2>;
  }
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 mb-10 px-4">
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-slate-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
              {company?.companyname?.charAt(0).toUpperCase()}
            </div>
            {editMode ? (
              <input
                type="text"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 text-center border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {company?.companyname}
              </h1>
            )}
            <span className="mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-semibold">
              {company?.role}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2 mb-5">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  📧 Email
                </p>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 text-right break-all">
                    {company?.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  📍 Location
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 text-right">
                    {company?.location}
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg px-4 py-2.5">
                <p className="text-sm text-gray-500 font-medium mb-1">
                  📝 Description
                </p>
                {editMode ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 leading-relaxed">
                    {company?.description}
                  </p>
                )}
              </div>

              {editMode && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                  <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                    🔒 New Password
                  </p>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              )}
            </div>

            {editMode && (
              <div className="flex justify-center mb-5">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Posted Jobs
            </h2>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center bg-gray-50 rounded-lg py-4 text-sm">
                No jobs posted yet
              </p>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => (
                  <Link
                    to={`/jobs/${job._id}`}
                    key={job._id}
                    className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2.5 hover:border-slate-400 hover:shadow-sm transition-all duration-300"
                  >
                    <h3 className="text-sm font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-xs">📍 {job.location}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {!id && (
            <div className="mt-5 flex justify-center">
              <button
                className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-1.5 rounded-lg text-sm"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit profile"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default CompanyProfile;

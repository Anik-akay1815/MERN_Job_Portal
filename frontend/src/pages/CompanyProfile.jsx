import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getCompanyById, updateCompany } from "../services/authService.js";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // NEW: about section expand/collapse
  const [aboutExpanded, setAboutExpanded] = useState(false);

  // NEW: logo modal (view full image)
  const [showLogoModal, setShowLogoModal] = useState(false);

  const [formData, setFormData] = useState({
    companyname: "",
    email: "",
    password: "",
    location: "",
    description: "",
    website: "",
    industry: "",
    companySize: "",
    linkedin: "",
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
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
        website: company.website || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        linkedin: company.linkedin || "",
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
      const fd = new FormData();
      fd.append("companyname", formData.companyname);
      fd.append("email", formData.email);
      if (formData.password) fd.append("password", formData.password);
      fd.append("location", formData.location);
      fd.append("description", formData.description);
      fd.append("website", formData.website);
      fd.append("industry", formData.industry);
      fd.append("companySize", formData.companySize);
      fd.append("linkedin", formData.linkedin);

      if (logoFile) fd.append("logo", logoFile);

      const res = await updateCompany(company._id, fd);
      setCompany(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
      setLogoFile(null);
      setLogoPreview(null);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };
  if (!company) {
    return <h2>Loading...</h2>;
  }

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const logoSrc = logoPreview || (company?.logo ? `${fileBaseUrl}/${company.logo}` : null);

  // NEW: clicking the avatar — editMode opens file picker, otherwise opens preview modal
  const handleLogoClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    } else if (logoSrc) {
      setShowLogoModal(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 mb-10 px-4">
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-gray-200">
            <div
              className={`relative w-16 h-16 mb-2 ${
                editMode || logoSrc ? "cursor-pointer group" : ""
              }`}
              onClick={handleLogoClick}
            >
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt="Logo"
                  className="w-16 h-16 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  {company?.companyname?.charAt(0).toUpperCase()}
                </div>
              )}

              {(editMode || logoSrc) && (
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {editMode ? "Change" : "View"}
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="hidden"
              />
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

            {editMode ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="About the company"
                className="w-full mt-2 text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              company?.description && (
                <div className="w-full mt-1 max-w-md">
                  <p
                    className={`text-sm text-gray-600 whitespace-pre-line ${
                      aboutExpanded ? "" : "line-clamp-2"
                    }`}
                  >
                    {company.description}
                  </p>
                  {company.description.length > 100 && (
                    <button
                      type="button"
                      onClick={() => setAboutExpanded(!aboutExpanded)}
                      className="text-emerald-600 text-xs font-semibold mt-1 hover:underline"
                    >
                      {aboutExpanded ? "Read less" : "Read more"}
                    </button>
                  )}
                </div>
              )
            )}

            <span className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-semibold">
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

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  🌐 Website
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : company?.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-600 text-right break-all hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-800 text-right">-</p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  🏭 Industry
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. IT Services"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 text-right">
                    {company?.industry || "-"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  👥 Company Size
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    placeholder="e.g. 11-50 employees"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 text-right">
                    {company?.companySize || "-"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  🔗 LinkedIn
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="LinkedIn company page URL"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : company?.linkedin ? (
                  <a
                    href={company.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-600 text-right break-all hover:underline"
                  >
                    {company.linkedin}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-800 text-right">-</p>
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

      {/* NEW: Logo preview modal */}
      {showLogoModal && logoSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setShowLogoModal(false)}
        >
          <div
            className="relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogoModal(false)}
              className="absolute -top-10 right-0 text-white text-2xl font-bold"
            >
              ✕
            </button>
            <img
              src={logoSrc}
              alt="Company Logo"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-xl bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
export default CompanyProfile;

import { useParams, useLocation, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { getCompanyById, updateCompany } from "../services/authService.js";
import { useEffect, useState, useRef } from "react";

function CompanyProfile() {
  const { id } = useParams();
  const location = useLocation();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  const [editMode, setEditMode] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (location.hash === "#jobs" && jobs.length > 0) {
      const el = document.getElementById("jobs");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash, jobs]);

  const fetchCompany = async (companyId = id) => {
    try {
      const res = await getCompanyById(companyId);
      setCompany(res.data.data.company);
      setJobs(res.data.data.jobs);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowUpdateConfirm(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setShowUpdateConfirm(false);

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
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!company) {
    return <h2>Loading...</h2>;
  }

  const fileBaseUrl = import.meta.env.VITE_API_URL;

  const DESCRIPTION_LIMIT = 120;
  const descriptionText = company?.description || "";
  const isDescriptionLong = descriptionText.length > DESCRIPTION_LIMIT;
  const displayedDescription =
    isDescriptionLong && !showFullDescription
      ? descriptionText.slice(0, DESCRIPTION_LIMIT) + "..."
      : descriptionText;

  const handleLogoClick = () => {
    if (editMode) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-black/40 overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 border-b border-slate-200/70 dark:border-white/10">
                <div
                  className={`relative w-24 h-24 shrink-0 ${editMode ? "cursor-pointer group" : ""}`}
                  onClick={handleLogoClick}
                >
                  {logoPreview || company?.logo ? (
                    <img
                      src={logoPreview || `${fileBaseUrl}/${company.logo}`}
                      alt="Logo"
                      className="w-24 h-24 rounded-2xl object-cover border border-white dark:border-white/10 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20">
                      {company?.companyname?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {editMode && (
                    <div className="absolute inset-0 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        Change logo
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

                <div className="min-w-0 flex-1">
                  {editMode ? (
                    <input
                      type="text"
                      name="companyname"
                      value={formData.companyname}
                      onChange={handleChange}
                      className="w-full max-w-lg text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                    />
                  ) : (
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {company?.companyname}
                    </h1>
                  )}

                  {editMode ? (
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="About the company"
                      className="w-full mt-3 text-sm text-slate-700 dark:text-slate-200 bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 resize-none"
                    />
                  ) : (
                    descriptionText && (
                      <div className="mt-2 max-w-2xl">
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {displayedDescription}
                        </p>
                        {isDescriptionLong && (
                          <button
                            type="button"
                            onClick={() =>
                              setShowFullDescription(!showFullDescription)
                            }
                            className="mt-1 text-blue-600 dark:text-blue-300 text-xs font-semibold hover:underline"
                          >
                            {showFullDescription ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    )
                  )}

                  <span className="inline-flex mt-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-bold capitalize">
                    {company?.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-7">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                      Company details
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Profile Information
                    </h2>
                  </div>

                  {!id && !editMode && (
                    <button
                      type="button"
                      onClick={() => setEditMode(true)}
                      className="bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Email
                    </p>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100 break-all">
                        {company?.email}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Location
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        {company?.location || "-"}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Website
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : company?.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-2 font-semibold text-blue-600 dark:text-blue-300 break-all hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        -
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Industry
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="e.g. IT Services"
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        {company?.industry || "-"}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Company Size
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        placeholder="e.g. 11-50 employees"
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        {company?.companySize || "-"}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      LinkedIn
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="LinkedIn company page URL"
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : company?.linkedin ? (
                      <a
                        href={company.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="block mt-2 font-semibold text-blue-600 dark:text-blue-300 break-all hover:underline"
                      >
                        {company.linkedin}
                      </a>
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        -
                      </p>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="mt-3 bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      New Password
                    </p>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                )}

                {editMode && (
                  <div className="flex gap-3 justify-end mt-5">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>

              <div
                id="jobs"
                className="mt-8 pt-7 border-t border-slate-200/70 dark:border-white/10 scroll-mt-24"
              >
                <div className="flex items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
                      Opportunities
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      Posted Jobs
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {jobs.length} {jobs.length === 1 ? "position" : "positions"}
                  </span>
                </div>

                {jobs.length === 0 ? (
                  <div className="bg-slate-50/70 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    No jobs posted yet
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {jobs.map((job) => (
                      <Link
                        to={`/jobs/${job._id}`}
                        key={job._id}
                        className="group bg-white/70 dark:bg-white/3 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4 hover:-translate-y-0.5 hover:border-blue-300 dark:hover:border-blue-400/30 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {job.location || "Location not specified"}
                            </p>
                          </div>
                          <span className="text-blue-600 dark:text-blue-300 text-lg shrink-0">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUpdateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white/95 dark:bg-[#161c2e]/95 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Update Profile?
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to save these changes to your company
              profile?
            </p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowUpdateConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateProfile}
                className="flex-1 px-4 py-2.5 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/20 transition cursor-pointer"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyProfile;

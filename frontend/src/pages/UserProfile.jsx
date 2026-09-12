import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateUser } from "../services/authService.js";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    skills: "",
    bio: "",
    gitHub: "",
    experience: [],
  });
  const fetchUser = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const res = await getUserById(id);
    const profileUser = res.data.data;

    if (profileUser?.role === "admin" && currentUser?.role !== "admin") {
      alert("Admin profile can only be viewed by an admin.");
      navigate("/");
      return;
    }

    setUser(profileUser);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  const handleExperienceChange = (index, e) => {
    const updatedExperience = [...formData.experience];

    updatedExperience[index] = {
      ...updatedExperience[index],
      [e.target.name]: e.target.value,
    };

    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          jobTitle: "",
          company: "",
          years: "",
          description: "",
        },
      ],
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = formData.experience.filter((_, i) => i !== index);

    setFormData({
      ...formData,
      experience: updatedExperience,
    });
  };
  useEffect(() => {
    if (id) {
      fetchUser();
    } else {
      const data = JSON.parse(localStorage.getItem("user"));
      setUser(data);
    }
  }, []);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        location: user.location || "",
        skills: user.skills ? user.skills.join(", ") : "",
        bio: user.bio || "",
        gitHub: user.gitHub || "",
        experience: user.experience || [],
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("email", formData.email);
      if (formData.password) fd.append("password", formData.password);
      fd.append("phone", formData.phone);
      fd.append("location", formData.location);
      fd.append("bio", formData.bio);
      fd.append("gitHub", formData.gitHub);

      const skillsArray = formData.skills
        ? formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
      fd.append("skills", JSON.stringify(skillsArray));

      const experienceArray = formData.experience.filter(
        (exp) => exp.jobTitle && exp.jobTitle.trim() !== ""
      );
      fd.append("experience", JSON.stringify(experienceArray));

      if (resumeFile) fd.append("resume", resumeFile);
      if (profilePhotoFile) fd.append("profilePhoto", profilePhotoFile);

      const res = await updateUser(user._id, fd);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
      setResumeFile(null);
      setProfilePhotoFile(null);
      setPhotoPreview(null);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] flex items-center justify-center text-slate-600 dark:text-slate-300">Loading...</div>;
  }

  const BIO_LIMIT = 160;
  const bioText = user?.bio || "";
  const isBioLong = bioText.length > BIO_LIMIT;
  const displayedBio =
    isBioLong && !showFullBio ? bioText.slice(0, BIO_LIMIT) + "..." : bioText;

  const fileBaseUrl = import.meta.env.VITE_API_URL;
  const isAdminProfile = user?.role === "admin";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] px-4 py-10">
        <div className="relative max-w-2xl mx-auto overflow-hidden bg-white/75 dark:bg-[#161c2e]/70 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl dark:shadow-black/30 rounded-3xl p-6 md:p-8">
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-slate-200/70 dark:border-white/10">
            <div
              className={`relative w-20 h-20 mb-3 ${
                editMode ? "cursor-pointer group" : ""
              }`}
              onClick={() => editMode && fileInputRef.current.click()}
            >
              {photoPreview || user?.profilePhoto ? (
                <img
                  src={photoPreview || `${fileBaseUrl}/${user.profilePhoto}`}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-500/20"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {editMode && (
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    Change
                  </span>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
            </div>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-2xl font-bold text-slate-900 dark:text-white text-center bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
              />
            ) : (
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {id ? (isAdminProfile ? "Admin Profile" : "Applicant Profile") : user?.name}
              </h1>
            )}
            <span className="mt-2 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {user?.role}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  📧 Email
                </p>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                  />
                ) : (
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-right break-all">
                    {user?.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  🛡️ Role
                </p>
                <p className="font-semibold text-slate-800 dark:text-slate-100 text-right">
                  {user?.role}
                </p>
              </div>

              <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  📱 Phone
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                  />
                ) : (
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-right">
                    {user?.phone || "-"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                  📍 Location
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                  />
                ) : (
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-right">
                    {user?.location || "-"}
                  </p>
                )}
              </div>

              {(!isAdminProfile || editMode) && (
                <>
                  {/* Skills */}
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">
                      🛠️ Skills
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, MongoDB"
                        className="w-full font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                      />
                    ) : user?.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-sm">No skills added</p>
                    )}
                  </div>
                </>
              )}

              {(!isAdminProfile || editMode) && (
                <>
                  {/* Bio */}
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">📝 Bio</p>
                    {editMode ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full font-medium text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                      />
                    ) : (
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                          {displayedBio || "-"}
                        </p>
                        {isBioLong && (
                          <button
                            type="button"
                            onClick={() => setShowFullBio(!showFullBio)}
                            className="mt-1 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline"
                          >
                            {showFullBio ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {(!isAdminProfile || editMode) && (
                <>
                  {/* Experience */}
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">
                      💼 Experience
                    </p>

                    {editMode ? (
                      <div className="space-y-3">
                        {formData.experience.map((exp, index) => (
                          <div
                            key={index}
                            className="border border-slate-200 dark:border-white/10 rounded-xl p-3 bg-white/70 dark:bg-white/5 space-y-2"
                          >
                            <input
                              type="text"
                              name="jobTitle"
                              placeholder="Job Title"
                              value={exp.jobTitle}
                              onChange={(e) => handleExperienceChange(index, e)}
                              className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                            />
                            <input
                              type="text"
                              name="company"
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(index, e)}
                              className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                            />
                            <input
                              type="number"
                              name="years"
                              placeholder="Years"
                              value={exp.years}
                              onChange={(e) => handleExperienceChange(index, e)}
                              className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                            />
                            <textarea
                              name="description"
                              placeholder="Description"
                              value={exp.description}
                              onChange={(e) => handleExperienceChange(index, e)}
                              rows={2}
                              className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                            />
                            <button
                              type="button"
                              onClick={() => removeExperience(index)}
                              className="text-red-500 text-xs font-semibold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addExperience}
                          className="text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline"
                        >
                          + Add Experience
                        </button>
                      </div>
                    ) : user?.experience && user.experience.length > 0 ? (
                      <div className="space-y-2">
                        {user.experience.map((exp, idx) => (
                          <div key={idx} className="text-sm text-slate-700 dark:text-slate-300">
                            <p className="font-semibold">
                              {exp.jobTitle}
                              {exp.company ? ` @ ${exp.company}` : ""}
                            </p>
                            {exp.years ? (
                              <p className="text-slate-500 dark:text-slate-400">{exp.years} year(s)</p>
                            ) : null}
                            {exp.description ? (
                              <p className="text-slate-600 dark:text-slate-400">{exp.description}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-sm">No experience added</p>
                    )}
                  </div>
                </>
              )}

              {(!isAdminProfile || editMode) && (
                <>
                  {/* Resume */}
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">
                      📄 Resume (PDF)
                    </p>
                    {editMode ? (
                      <div>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleResumeChange}
                          className="w-full text-sm"
                        />
                        {resumeFile && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Selected: {resumeFile.name}
                          </p>
                        )}
                        {!resumeFile && user?.resume && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Current file will be kept unless you choose a new one.
                          </p>
                        )}
                      </div>
                    ) : user?.resume ? (
                      <a
                        href={`${fileBaseUrl}/${user.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="text-slate-400 dark:text-slate-500 text-sm">No resume uploaded</p>
                    )}
                  </div>
                </>
              )}

              {(!isAdminProfile || editMode) && (
                <>
                  <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                      💻 GitHub
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="gitHub"
                        value={formData.gitHub}
                        onChange={handleChange}
                        placeholder="GitHub profile URL"
                        className="flex-1 text-right font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                      />
                    ) : user?.gitHub ? (
                      <a
                        href={user.gitHub}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 dark:text-blue-300 text-right break-all hover:underline"
                      >
                        {user.gitHub}
                      </a>
                    ) : (
                      <p className="font-semibold text-slate-800 dark:text-slate-100 text-right break-all">
                        -
                      </p>
                    )}
                  </div>
                </>
              )}

              {editMode && (
                <div className="flex items-center justify-between bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-xl px-4 py-3 gap-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                    🔒 New Password
                  </p>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    className="flex-1 text-right font-semibold text-slate-800 dark:text-slate-100 bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-400 dark:focus:border-[#7cc2f2]"
                  />
                </div>
              )}
            </div>

            {editMode && (
              <div className="flex justify-center mb-2">
                <button
                  type="submit"
                  className="bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

          {(!id || isAdminProfile) && (
            <div className="mt-5 flex justify-center">
              <button
                className="bg-slate-700 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
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
export default UserProfile;
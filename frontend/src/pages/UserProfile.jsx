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
        (exp) => exp.jobTitle && exp.jobTitle.trim() !== "",
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
    return (
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] flex items-center justify-center text-slate-600 dark:text-slate-300">
        Loading...
      </div>
    );
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

      <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-[#161c2e]/80 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-black/40 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-7 border-b border-slate-200/70 dark:border-white/10">
                <div
                  className={`relative w-24 h-24 shrink-0 ${editMode ? "cursor-pointer group" : ""}`}
                  onClick={() => editMode && fileInputRef.current.click()}
                >
                  {photoPreview || user?.profilePhoto ? (
                    <img
                      src={
                        photoPreview || `${fileBaseUrl}/${user.profilePhoto}`
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover border border-white/70 dark:border-white/10 shadow-xl"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {editMode && (
                    <div className="absolute inset-0 rounded-2xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        Change photo
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

                <div className="min-w-0 flex-1">
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full max-w-lg text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400"
                    />
                  ) : (
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {id
                        ? isAdminProfile
                          ? "Admin Profile"
                          : "Applicant Profile"
                        : user?.name}
                    </h1>
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {isAdminProfile
                      ? "Administrator account"
                      : "Professional profile"}
                  </p>
                  <span className="inline-flex mt-3 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    {user?.role}
                  </span>
                </div>

                {!editMode && (!id || isAdminProfile) && (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="self-start sm:self-center bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-7">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
                    Profile details
                  </p>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    Personal Information
                  </h2>
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
                        {user?.email}
                      </p>
                    )}
                  </div>
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Role
                    </p>
                    <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Phone
                    </p>
                    {editMode ? (
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full mt-2 font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    ) : (
                      <p className="mt-2 font-semibold text-slate-800 dark:text-slate-100">
                        {user?.phone || "-"}
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
                        {user?.location || "-"}
                      </p>
                    )}
                  </div>
                </div>

                {!isAdminProfile || editMode ? (
                  <>
                    <div className="mt-7 mb-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">
                        Professional
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        Skills & About
                      </h2>
                    </div>
                    <div className="grid gap-3">
                      <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          Skills
                        </p>
                        {editMode ? (
                          <input
                            type="text"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            className="w-full font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                          />
                        ) : user?.skills?.length ? (
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
                          <p className="text-sm text-slate-400 dark:text-slate-500">
                            No skills added
                          </p>
                        )}
                      </div>
                      <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          Bio
                        </p>
                        {editMode ? (
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={4}
                            className="w-full font-medium text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
                          />
                        ) : (
                          <>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                              {displayedBio || "-"}
                            </p>
                            {isBioLong && (
                              <button
                                type="button"
                                onClick={() => setShowFullBio(!showFullBio)}
                                className="mt-1 text-blue-600 dark:text-blue-300 text-xs font-semibold hover:underline"
                              >
                                {showFullBio ? "Show less" : "Read more"}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-7 mb-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600 dark:text-purple-300">
                        Career
                      </p>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                        Experience
                      </h2>
                    </div>
                    <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                      {editMode ? (
                        <div className="space-y-3">
                          {formData.experience.map((exp, index) => (
                            <div
                              key={index}
                              className="bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 space-y-2"
                            >
                              <div className="grid sm:grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  name="jobTitle"
                                  placeholder="Job Title"
                                  value={exp.jobTitle}
                                  onChange={(e) =>
                                    handleExperienceChange(index, e)
                                  }
                                  className="w-full bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                                />

                                <input
                                  type="text"
                                  name="company"
                                  placeholder="Company"
                                  value={exp.company}
                                  onChange={(e) =>
                                    handleExperienceChange(index, e)
                                  }
                                  className="w-full bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                                />
                              </div>
                              <input
                                type="number"
                                name="years"
                                placeholder="Years"
                                value={exp.years}
                                onChange={(e) =>
                                  handleExperienceChange(index, e)
                                }
                                className="w-full bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400"
                              />

                              <textarea
                                name="description"
                                placeholder="Description"
                                value={exp.description}
                                onChange={(e) =>
                                  handleExperienceChange(index, e)
                                }
                                rows={2}
                                className="w-full bg-white dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 resize-none"
                              />

                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className="text-red-500 text-xs font-semibold hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={addExperience}
                            className="text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline cursor-pointer"
                          >
                            + Add Experience
                          </button>
                        </div>
                      ) : user?.experience?.length ? (
                        <div className="space-y-3">
                          {user.experience.map((exp, idx) => (
                            <div
                              key={idx}
                              className="border-l-2 border-blue-400 pl-4"
                            >
                              <p className="font-semibold text-slate-800 dark:text-white">
                                {exp.jobTitle}
                                {exp.company ? ` @ ${exp.company}` : ""}
                              </p>
                              {exp.years ? (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  {exp.years} year(s)
                                </p>
                              ) : null}
                              {exp.description ? (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {exp.description}
                                </p>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                          No experience added
                        </p>
                      )}
                    </div>

                    <div className="mt-7 grid sm:grid-cols-2 gap-3">
                      <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          Resume (PDF)
                        </p>
                        {editMode ? (
                          <>
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={handleResumeChange}
                              className="w-full text-sm text-slate-600 dark:text-slate-300"
                            />
                            {resumeFile && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                Selected: {resumeFile.name}
                              </p>
                            )}
                          </>
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
                          <p className="text-sm text-slate-400 dark:text-slate-500">
                            No resume uploaded
                          </p>
                        )}
                      </div>
                      <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          GitHub
                        </p>
                        {editMode ? (
                          <input
                            type="text"
                            name="gitHub"
                            value={formData.gitHub}
                            onChange={handleChange}
                            placeholder="GitHub profile URL"
                            className="w-full font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                          />
                        ) : user?.gitHub ? (
                          <a
                            href={user.gitHub}
                            target="_blank"
                            rel="noreferrer"
                            className="block text-blue-600 dark:text-blue-300 text-sm font-semibold break-all hover:underline"
                          >
                            {user.gitHub}
                          </a>
                        ) : (
                          <p className="text-sm text-slate-400 dark:text-slate-500">
                            -
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                ) : null}

                {editMode && (
                  <div className="mt-7 pt-6 border-t border-slate-200/70 dark:border-white/10">
                    <div className="bg-slate-50/80 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 rounded-2xl p-4">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                        New Password
                      </p>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Leave blank to keep current"
                        className="w-full font-semibold text-slate-800 dark:text-white bg-white/80 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-5">
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
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default UserProfile;

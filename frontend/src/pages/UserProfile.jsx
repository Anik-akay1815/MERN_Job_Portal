import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar.jsx";
import { useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/authService.js";

function UserProfile() {
  const { id } = useParams();
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
    const res = await getUserById(id);
    setUser(res.data.data);
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
    return <h2>Loading...</h2>;
  }

  const BIO_LIMIT = 160;
  const bioText = user?.bio || "";
  const isBioLong = bioText.length > BIO_LIMIT;
  const displayedBio =
    isBioLong && !showFullBio ? bioText.slice(0, BIO_LIMIT) + "..." : bioText;

  const fileBaseUrl = import.meta.env.VITE_API_URL;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 mb-10 px-4">
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl p-8">
          <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-200">
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
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-slate-600 to-slate-800 text-white flex items-center justify-center text-3xl font-bold shadow-md">
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
                className="text-2xl font-bold text-gray-900 text-center border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? "Applicant Profile" : user?.name}
              </h1>
            )}
            <span className="mt-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
              {id ? "Applicant" : user?.role}
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
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
                    {user?.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  🛡️ Role
                </p>
                <p className="font-semibold text-gray-800 text-right">
                  {id ? "Applicant" : user?.role}
                </p>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  📱 Phone
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <p className="font-semibold text-gray-800 text-right">
                    {user?.phone || "-"}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
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
                    {user?.location || "-"}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  🛠️ Skills
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className="w-full font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : user?.skills && user.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No skills added</p>
                )}
              </div>

              {/* Bio */}
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-500 font-medium mb-2">📝 Bio</p>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full font-medium text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : (
                  <div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {displayedBio || "-"}
                    </p>
                    {isBioLong && (
                      <button
                        type="button"
                        onClick={() => setShowFullBio(!showFullBio)}
                        className="mt-1 text-emerald-600 text-sm font-semibold hover:underline"
                      >
                        {showFullBio ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Experience */}
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  💼 Experience
                </p>

                {editMode ? (
                  <div className="space-y-3">
                    {formData.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 bg-white space-y-2"
                      >
                        <input
                          type="text"
                          name="jobTitle"
                          placeholder="Job Title"
                          value={exp.jobTitle}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <input
                          type="text"
                          name="company"
                          placeholder="Company"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <input
                          type="number"
                          name="years"
                          placeholder="Years"
                          value={exp.years}
                          onChange={(e) => handleExperienceChange(index, e)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <textarea
                          name="description"
                          placeholder="Description"
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, e)}
                          rows={2}
                          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                      className="text-emerald-600 text-sm font-semibold hover:underline"
                    >
                      + Add Experience
                    </button>
                  </div>
                ) : user?.experience && user.experience.length > 0 ? (
                  <div className="space-y-2">
                    {user.experience.map((exp, idx) => (
                      <div key={idx} className="text-sm text-gray-700">
                        <p className="font-semibold">
                          {exp.jobTitle}
                          {exp.company ? ` @ ${exp.company}` : ""}
                        </p>
                        {exp.years ? (
                          <p className="text-gray-500">{exp.years} year(s)</p>
                        ) : null}
                        {exp.description ? (
                          <p className="text-gray-600">{exp.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No experience added</p>
                )}
              </div>

              {/* Resume */}
              <div className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-500 font-medium mb-2">
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
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {resumeFile.name}
                      </p>
                    )}
                    {!resumeFile && user?.resume && (
                      <p className="text-xs text-gray-500 mt-1">
                        Current file will be kept unless you choose a new one.
                      </p>
                    )}
                  </div>
                ) : user?.resume ? (
                  <a
                    href={`${fileBaseUrl}/${user.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 text-sm font-semibold hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm">No resume uploaded</p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  💻 GitHub
                </p>
                {editMode ? (
                  <input
                    type="text"
                    name="gitHub"
                    value={formData.gitHub}
                    onChange={handleChange}
                    placeholder="GitHub profile URL"
                    className="flex-1 text-right font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                ) : user?.gitHub ? (
                  <a
                    href={user.gitHub}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-emerald-600 text-right break-all hover:underline"
                  >
                    {user.gitHub}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-800 text-right break-all">
                    -
                  </p>
                )}
              </div>

              {editMode && (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3">
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
              <div className="flex justify-center mb-2">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>

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
export default UserProfile;
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { createJob, getJobById, updateJob } from "../services/authService.js";
import { useNavigate, useParams } from "react-router-dom";

const SKILLS_BY_CATEGORY = {
  Frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular", "Svelte", "Tailwind CSS", "Redux", "jQuery"],
  Backend: ["Node.js", "Express.js", "Django", "Flask", "Spring Boot", "FastAPI", "Laravel", "Ruby on Rails", "ASP.NET", "GraphQL", "REST API"],
  "Full Stack": ["MERN", "MEAN", "Java Full Stack", "Python Full Stack", "React", "Node.js", "Express.js", "MongoDB", "MySQL", "REST API"],
  "Data / AI": ["Python", "Machine Learning", "Deep Learning", "Data Analysis", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Data Visualization", "Power BI", "Tableau", "Excel"],
  "DevOps / Cloud": ["Git", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "CI/CD", "Linux", "Nginx", "Terraform"],
  Mobile: ["React Native", "Flutter", "Android", "Kotlin", "Java", "iOS", "Swift", "Dart"],
  Testing: ["Manual Testing", "Automation Testing", "Selenium", "Jest", "Cypress", "Postman"],
  Design: ["UI/UX Design", "Figma", "Adobe XD", "Photoshop"],
};

function PostJobs() {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    salary: "",
    jobType: "Full Time",
    location: "",
    skillsRequired: [],
    experienceLevel: "Fresher",
    category: "",
    numberOfOpenings: 1,
    applicationDeadline: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    setJobData({
      ...jobData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSkill = (skill) => {
    setJobData((prev) => {
      const alreadySelected = prev.skillsRequired.includes(skill);

      return {
        ...prev,
        skillsRequired: alreadySelected
          ? prev.skillsRequired.filter((s) => s !== skill)
          : [...prev.skillsRequired, skill],
      };
    });
  };

  const handleCategoryChange = (e) => {
    setJobData((prev) => ({
      ...prev,
      category: e.target.value,
      skillsRequired: [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...jobData,
        numberOfOpenings: Number(jobData.numberOfOpenings),
      };

      if (id) {
        await updateJob(id, payload);
        alert("Job updated successfully");
      } else {
        await createJob(payload);
        alert("Job created successfully");
      }

      navigate("/myjobs");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const fetchJob = async () => {
    try {
      const res = await getJobById(id);
      const job = res.data.data;

      setJobData({
        title: job.title || "",
        description: job.description || "",
        salary: job.salary || "",
        jobType: job.jobType || "Full Time",
        location: job.location || "",
        skillsRequired: Array.isArray(job.skillsRequired)
          ? job.skillsRequired
          : [],
        experienceLevel: job.experienceLevel || "Fresher",
        category: job.category || "",
        numberOfOpenings: job.numberOfOpenings || 1,
        applicationDeadline: job.applicationDeadline
          ? job.applicationDeadline.split("T")[0]
          : "",
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

  const categorySkills = SKILLS_BY_CATEGORY[jobData.category] || [];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
        <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl border border-gray-100">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? "Update Job" : "Post Job Vacancies"}
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              {id
                ? "Update the details of your job"
                : "Fill in the details to publish a new job"}
            </p>

            <div className="w-16 h-1 bg-emerald-500 rounded-full mx-auto mt-4"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Job Title */}
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
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Salary + Job Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Salary
                </label>

                <input
                  type="text"
                  name="salary"
                  value={jobData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 5 LPA"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Job Type
                </label>

                <select
                  name="jobType"
                  value={jobData.jobType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Intern">Intern</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={jobData.location}
                onChange={handleChange}
                placeholder="e.g. Delhi / Bangalore / Remote"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Experience + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Experience Level
                </label>

                <select
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Job Category
                </label>

                <select
                  name="category"
                  value={jobData.category}
                  onChange={handleCategoryChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Category</option>

                  {Object.keys(SKILLS_BY_CATEGORY).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}

                  {jobData.category &&
                    !SKILLS_BY_CATEGORY[jobData.category] && (
                      <option value={jobData.category}>
                        {jobData.category}
                      </option>
                    )}
                </select>
              </div>
            </div>

            {/* Skills */}
            {jobData.category && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Required Skills
                  </label>

                  <span className="text-xs text-gray-400">
                    {jobData.skillsRequired.length} selected
                  </span>
                </div>

                {categorySkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => {
                      const selected = jobData.skillsRequired.includes(skill);

                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                              : "bg-gray-50 text-gray-700 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50"
                          }`}
                        >
                          {skill}

                          {selected && <span className="ml-1.5">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-700">
                      This is an older job category. Select a new category to
                      choose predefined skills.
                    </p>
                  </div>
                )}

                {/* Existing old skills remain visible */}
                {jobData.skillsRequired.length > 0 &&
                  categorySkills.length === 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {jobData.skillsRequired.map((skill) => (
                        <span
                          key={skill}
                          className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Openings + Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Number of Openings
                </label>

                <input
                  type="number"
                  name="numberOfOpenings"
                  value={jobData.numberOfOpenings}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Application Deadline
                </label>

                <input
                  type="date"
                  name="applicationDeadline"
                  value={jobData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Job Description
              </label>

              <textarea
                name="description"
                value={jobData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities and requirements..."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 transition-all duration-300 font-semibold text-white py-3 rounded-lg cursor-pointer shadow-md hover:shadow-lg"
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

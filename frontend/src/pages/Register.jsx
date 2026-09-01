import { useState, useRef, useEffect } from "react";
import { registerUser } from "../services/authService.js";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const SKILL_OPTIONS = [
  // Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "C", "Go",
  "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Dart", "Scala", "R",
  // Frontend
  "HTML", "CSS", "React", "Next.js", "Vue.js", "Angular", "Svelte",
  "Tailwind CSS", "Redux", "jQuery",
  // Backend
  "Node.js", "Express.js", "Django", "Flask", "Spring Boot", "FastAPI",
  "Laravel", "Ruby on Rails", "ASP.NET", "GraphQL", "REST API",
  // Mobile
  "React Native", "Flutter", "Android (Kotlin/Java)", "iOS (Swift)",
  // Databases
  "MongoDB", "MySQL", "PostgreSQL", "SQLite", "Redis", "Firebase",
  "Oracle", "Microsoft SQL Server",
  // DevOps / Cloud
  "Git", "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud",
  "CI/CD", "Linux", "Nginx", "Terraform",
  // Data / AI
  "Machine Learning", "Deep Learning", "Data Analysis", "Pandas",
  "NumPy", "TensorFlow", "PyTorch", "Data Visualization", "Excel",
  "Power BI", "Tableau",
  // Design
  "UI/UX Design", "Figma", "Adobe XD", "Photoshop",
  // Testing
  "Manual Testing", "Automation Testing", "Selenium", "Jest",
  // Soft / Business
  "Project Management", "Agile/Scrum", "Communication", "Team Leadership",
  "Problem Solving", "Digital Marketing", "SEO", "Content Writing",
  "Sales", "Customer Support",
];

function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [skillsOpen, setSkillsOpen] = useState(false);
  const skillsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (skillsRef.current && !skillsRef.current.contains(e.target)) {
        setSkillsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const already = prev.skills.includes(skill);
      return {
        ...prev,
        skills: already
          ? prev.skills.filter((s) => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const filteredSkills = SKILL_OPTIONS.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1.5";

  return (
    <>
      <Navbar currentPage="register" />
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left branding panel */}
        <div className="lg:w-2/5 bg-slate-900 text-white px-8 py-14 lg:py-0 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-sm mx-auto lg:mx-0">
            <span className="inline-block bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
              For Job Seekers
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mt-5 leading-tight">
              Your next role is closer than you think
            </h1>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Build your profile once, and let the right companies find you
              while you apply to the roles you want.
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Apply to jobs in a couple of clicks
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Showcase your skills to real employers
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[11px] font-bold shrink-0">
                  ✓
                </span>
                <p className="text-sm text-slate-300">
                  Track every application from one place
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="lg:w-3/5 bg-white flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-8">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-semibold"
              >
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Your name"
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="you@example.com"
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Create a password"
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="+91 XXXXX XXXXX"
                    required
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  placeholder="City, Country"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              {/* Skills multi-select */}
              <div ref={skillsRef} className="relative">
                <label className={labelClass}>Skills</label>

                <div
                  onClick={() => setSkillsOpen(true)}
                  className={`min-h-11.5 w-full border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-1.5 cursor-text transition-all duration-200 ${
                    skillsOpen
                      ? "ring-2 ring-emerald-500 border-emerald-500"
                      : ""
                  }`}
                >
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(skill);
                        }}
                        className="hover:text-emerald-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    onFocus={() => setSkillsOpen(true)}
                    placeholder={
                      formData.skills.length === 0
                        ? "Search and select your skills"
                        : ""
                    }
                    className="flex-1 min-w-30 text-sm outline-none placeholder:text-gray-400"
                  />
                </div>

                {skillsOpen && (
                  <div className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    {filteredSkills.length === 0 ? (
                      <p className="text-sm text-gray-400 px-4 py-3">
                        No skills match "{skillSearch}"
                      </p>
                    ) : (
                      filteredSkills.map((skill) => {
                        const selected = formData.skills.includes(skill);
                        return (
                          <button
                            type="button"
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 ${
                              selected ? "text-emerald-700 font-semibold" : "text-gray-700"
                            }`}
                          >
                            {skill}
                            {selected && <span>✓</span>}
                          </button>
                        );
                      })
                    )}
                  </div>
                )}

                {formData.skills.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Select at least one skill
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || formData.skills.length === 0}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-white py-3 rounded-lg shadow-sm hover:shadow-md"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>

              <p className="text-center text-sm text-gray-500">
                Hiring instead?{" "}
                <Link
                  to="/company/register"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Register as a company
                </Link>
              </p>

              <p className="text-xs text-gray-400 text-center pt-1">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default RegisterUser;

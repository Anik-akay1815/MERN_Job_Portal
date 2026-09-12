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

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#161c2e]/70 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-100 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/20";
  const labelClass =
    "block text-sm font-medium text-slate-700 dark:text-slate-200";

  const filteredSkills = SKILL_OPTIONS.filter(
    (skill) =>
      skill.toLowerCase().includes(skillSearch.toLowerCase()) &&
      !formData.skills.includes(skill)
  );

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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((item) => item !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.skills.length) return;

    setLoading(true);

    try {
      await registerUser({
        ...formData,
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar currentPage="register" />
      <div className="min-h-screen bg-[#f5f6fa] dark:bg-[#0f1420] relative overflow-hidden flex items-center justify-center px-5 py-12">
        <div className="absolute -top-32 -left-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative w-full max-w-6xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-white/70 dark:border-white/10 bg-white/60 dark:bg-[#161c2e]/60 backdrop-blur-xl shadow-2xl dark:shadow-black/40">
          <div className="relative flex flex-col justify-center px-8 md:px-12 py-12 bg-[#10182b]/95 text-white overflow-hidden">
            <div className="absolute -top-24 -right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-28 -left-20 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-full border border-white/30 bg-white/10 flex items-center justify-center text-xl font-bold">C</div>
                <div><h1 className="text-2xl font-bold">Careerly</h1><p className="text-xs text-slate-400">Find • Connect • Grow</p></div>
              </div>
              <span className="inline-flex bg-white/10 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15">🚀 For Job Seekers</span>
              <h1 className="text-3xl lg:text-4xl font-bold mt-6 leading-tight">Your next role is closer than you think</h1>
              <p className="text-slate-300 mt-4 text-sm leading-relaxed max-w-md">Build your profile once, and let the right companies find you while you apply to the roles you want.</p>
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Apply to jobs in a couple of clicks</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Showcase your skills to real employers</p></div>
                <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</span><p className="text-sm text-slate-300">Track every application from one place</p></div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-6 py-10 md:px-10 lg:px-12">
            <div className="w-full max-w-xl">
              <div className="lg:hidden flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">C</div>
                <div><h1 className="text-xl font-bold text-slate-900 dark:text-white">Careerly</h1><p className="text-xs text-slate-500 dark:text-slate-400">Find • Connect • Grow</p></div>
              </div>
              <span className="inline-flex bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 text-xs font-semibold px-3 py-1.5 rounded-full">✨ Candidate Registration</span>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-5">Create your account</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-7">Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-300 hover:underline font-semibold">Log in</Link></p>

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

                <div ref={skillsRef} className="relative">
                  <label className={labelClass}>Skills</label>

                  <div
                    onClick={() => setSkillsOpen(true)}
                    className={`min-h-11 w-full bg-white/80 dark:bg-[#161c2e]/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 flex flex-wrap gap-1.5 cursor-text transition-all duration-200 ${
                      skillsOpen ? "ring-2 ring-blue-400 border-blue-400" : ""
                    }`}
                  >
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="flex items-center gap-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 text-xs font-semibold pl-2.5 pr-1.5 py-1 rounded-full"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSkill(skill);
                          }}
                          className="hover:text-blue-900 dark:hover:text-blue-200"
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
                      className="flex-1 min-w-30 text-sm outline-none placeholder:text-slate-400 dark:text-slate-500"
                    />
                  </div>

                  {skillsOpen && (
                    <div className="absolute z-20 mt-1.5 w-full max-h-56 overflow-y-auto bg-white/95 dark:bg-[#161c2e] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl">
                      {filteredSkills.length === 0 ? (
                        <p className="text-sm text-slate-400 dark:text-slate-500 px-4 py-3">
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
                              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-500/10 ${
                                selected
                                  ? "text-blue-700 dark:text-blue-300 font-semibold"
                                  : "text-gray-700"
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
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                      Select at least one skill
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || formData.skills.length === 0}
                  className="w-full bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-white py-3 rounded-xl shadow-lg shadow-blue-500/20"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Hiring instead?{" "}
                  <Link
                    to="/company/register"
                    className="text-emerald-600 hover:text-blue-700 dark:text-blue-300 font-semibold"
                  >
                    Register as a company
                  </Link>
                </p>

                <p className="text-xs text-slate-400 dark:text-slate-500 text-center pt-1">
                  By registering, you agree to our Terms of Service and Privacy
                  Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterUser;


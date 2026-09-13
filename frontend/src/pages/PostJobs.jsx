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

function Icon({ name, size = 17 }) {
  const paths = {
    briefcase: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 11h18M10 11v2h4v-2" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    money: <><circle cx="12" cy="12" r="9" /><path d="M15 9.5c-.7-.8-1.7-1.2-3-1.2-1.5 0-2.5.7-2.5 1.7s.8 1.5 2.5 1.8c1.7.3 2.5.9 2.5 1.9s-1 1.7-2.6 1.7c-1.3 0-2.4-.4-3.1-1.2M12 6.5v11" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 19a6 6 0 0 1 12 0M16 11a3 3 0 1 0 0-6M17 13a5 5 0 0 1 4 5" /></>,
    calendar: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 9h18" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    file: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function PostJobs() {
  const [jobData, setJobData] = useState({
    title: "", description: "", salary: "", jobType: "Full Time", location: "",
    skillsRequired: [], experienceLevel: "Fresher", category: "", numberOfOpenings: 1, applicationDeadline: "",
  });

  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => setJobData({ ...jobData, [e.target.name]: e.target.value });

  const toggleSkill = (skill) => {
    setJobData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.includes(skill) ? prev.skillsRequired.filter((s) => s !== skill) : [...prev.skillsRequired, skill],
    }));
  };

  const handleCategoryChange = (e) => setJobData((prev) => ({ ...prev, category: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...jobData, numberOfOpenings: Number(jobData.numberOfOpenings) };
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
        title: job.title || "", description: job.description || "", salary: job.salary || "",
        jobType: job.jobType || "Full Time", location: job.location || "",
        skillsRequired: Array.isArray(job.skillsRequired) ? job.skillsRequired : [],
        experienceLevel: job.experienceLevel || "Fresher", category: job.category || "",
        numberOfOpenings: job.numberOfOpenings || 1,
        applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split("T")[0] : "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const skillCategories = Object.entries(SKILLS_BY_CATEGORY);
  const selectedSkillSet = new Set(jobData.skillsRequired);
  const inputClass = "w-full bg-white/80 dark:bg-[#161c2e]/75 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 dark:focus:border-[#7cc2f2] transition";
  const selectClass = `${inputClass} cursor-pointer`;
  const labelClass = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-[#f5f6fa] via-[#f1efff] to-[#eef2ff] dark:bg-[#0f1420] dark:bg-none px-5 py-10 relative overflow-hidden">
        <div className="absolute -top-40 -right-24 w-96 h-96 bg-purple-400/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-blue-400/15 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[0.72fr_1.5fr] gap-6 items-start">
          <div className="hidden lg:block sticky top-24 rounded-3xl overflow-hidden bg-[#10182b] text-white border border-white/10 shadow-2xl">
            <div className="absolute w-64 h-64 -top-20 -right-20 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute w-64 h-64 -bottom-24 -left-20 bg-purple-500/15 rounded-full blur-3xl" />
            <div className="relative p-8">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/20">C</div>
                <div><h2 className="text-xl font-bold">Careerly</h2><p className="text-[10px] tracking-[0.2em] text-slate-400">FIND · CONNECT · GROW</p></div>
              </div>
              <span className="inline-flex items-center gap-2 bg-white/10 text-blue-200 border border-white/10 px-3 py-1.5 rounded-full text-xs font-semibold"><Icon name="briefcase" size={14} /> {id ? "Edit position" : "Create a position"}</span>
              <h1 className="text-3xl font-bold leading-tight mt-6">{id ? "Keep your job post up to date." : "Reach the right talent with a better job post."}</h1>
              <p className="text-sm text-slate-300 leading-relaxed mt-4">Give candidates the information they need to understand the role, your expectations, and why they should apply.</p>

              <div className="mt-9 space-y-5">
                <div className="flex gap-3"><span className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0"><Icon name="check" size={15} /></span><div><p className="text-sm font-semibold">Clear role details</p><p className="text-xs text-slate-400 mt-0.5">Title, salary, type and location</p></div></div>
                <div className="flex gap-3"><span className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0"><Icon name="layers" size={15} /></span><div><p className="text-sm font-semibold">Relevant skills</p><p className="text-xs text-slate-400 mt-0.5">Help the right candidates find you</p></div></div>
                <div className="flex gap-3"><span className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-300 flex items-center justify-center shrink-0"><Icon name="users" size={15} /></span><div><p className="text-sm font-semibold">Better applications</p><p className="text-xs text-slate-400 mt-0.5">Set expectations before candidates apply</p></div></div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Careerly employers</p>
                <p className="text-sm text-slate-300 mt-2">Create focused listings that are easier to discover and easier to trust.</p>
              </div>
            </div>
          </div>

          <div className="relative bg-white/75 dark:bg-[#161c2e]/75 backdrop-blur-xl border border-white/70 dark:border-white/10 rounded-3xl shadow-2xl dark:shadow-black/40 overflow-hidden">
            <div className="px-6 md:px-8 pt-7 pb-5 border-b border-slate-200/70 dark:border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1.5 rounded-full text-xs font-semibold"><Icon name="file" size={14} /> Job details</span>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">{id ? "Update Job" : "Post a New Job"}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{id ? "Review and update the information candidates see." : "Create a professional listing and start attracting candidates."}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500" /> All changes saved when you submit</div>
              </div>
            </div>

            <form className="p-6 md:p-8 space-y-7" onSubmit={handleSubmit}>
              <section>
                <div className="flex items-center gap-2 mb-4"><span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 flex items-center justify-center"><Icon name="briefcase" size={16} /></span><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Position information</h3><p className="text-xs text-slate-400 dark:text-slate-500">Start with the basics of the role.</p></div></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className={labelClass}>Job Title</label><input type="text" name="title" value={jobData.title} onChange={handleChange} placeholder="e.g. Senior Full Stack Developer" required className={inputClass} /></div>
                  <div><label className={labelClass}>Job Category</label><select name="category" value={jobData.category} onChange={handleCategoryChange} className={selectClass}><option value="" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Select Category</option>{Object.keys(SKILLS_BY_CATEGORY).map((category) => <option key={category} value={category} className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">{category}</option>)}{jobData.category && !SKILLS_BY_CATEGORY[jobData.category] && <option value={jobData.category} className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">{jobData.category}</option>}</select></div>
                  <div><label className={labelClass}>Location</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="pin" size={15} /></span><input type="text" name="location" value={jobData.location} onChange={handleChange} placeholder="e.g. Delhi / Bangalore / Remote" className={`${inputClass} pl-10`} /></div></div>
                </div>
              </section>

              <section className="pt-6 border-t border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-2 mb-4"><span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center"><Icon name="money" size={16} /></span><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Employment details</h3><p className="text-xs text-slate-400 dark:text-slate-500">Help candidates understand the opportunity.</p></div></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Salary</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span><input type="text" name="salary" value={jobData.salary} onChange={handleChange} placeholder="e.g. 5 - 8 LPA" required className={`${inputClass} pl-10`} /></div></div>
                  <div><label className={labelClass}>Job Type</label><select name="jobType" value={jobData.jobType} onChange={handleChange} className={selectClass}><option value="Full Time" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Full Time</option><option value="Part Time" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Part Time</option><option value="Intern" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Intern</option><option value="Remote" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Remote</option></select></div>
                  <div><label className={labelClass}>Experience Level</label><select name="experienceLevel" value={jobData.experienceLevel} onChange={handleChange} className={selectClass}><option value="Fresher" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">Fresher</option><option value="0-1 years" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">0-1 years</option><option value="1-3 years" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">1-3 years</option><option value="3-5 years" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">3-5 years</option><option value="5+ years" className="bg-white dark:bg-[#161c2e] text-slate-800 dark:text-white">5+ years</option></select></div>
                  <div><label className={labelClass}>Number of Openings</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="users" size={15} /></span><input type="number" name="numberOfOpenings" value={jobData.numberOfOpenings} onChange={handleChange} min="1" required className={`${inputClass} pl-10`} /></div></div>
                </div>
              </section>

              <section className="pt-6 border-t border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-2 mb-4"><span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 flex items-center justify-center"><Icon name="layers" size={16} /></span><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">Skills & timeline</h3><p className="text-xs text-slate-400 dark:text-slate-500">Choose the skills you want candidates to have.</p></div></div>
                <div>
                  <div className="flex items-center justify-between mb-3"><label className={labelClass}>Required Skills</label><span className="text-xs text-slate-400 dark:text-slate-500">{jobData.skillsRequired.length} selected</span></div>
                  <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-white/5 p-4 space-y-4 max-h-80 overflow-y-auto">
                    {skillCategories.map(([category, skills]) => (
                      <div key={category}>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{category}</p>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill) => {
                            const selected = selectedSkillSet.has(skill);
                            return <button type="button" key={skill} onClick={() => toggleSkill(skill)} className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer ${selected ? "bg-linear-to-r from-blue-500 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20" : "bg-white/80 dark:bg-[#161c2e]/70 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"}`}>{skill}{selected && <span className="ml-1.5">✓</span>}</button>;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {jobData.skillsRequired.length > 0 ? (
                    <div className="mt-4">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Selected Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {jobData.skillsRequired.map((skill) => <button type="button" key={skill} onClick={() => toggleSkill(skill)} className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/20 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-500/10 dark:hover:text-red-300 dark:hover:border-red-400/20 transition cursor-pointer">{skill}<span className="text-sm leading-none">×</span></button>)}
                      </div>
                    </div>
                  ) : <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">Select skills from any category. You can mix Frontend, Backend, Data, DevOps and other skills.</div>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-5">
                  <div><label className={labelClass}>Application Deadline</label><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Icon name="calendar" size={15} /></span><input type="date" name="applicationDeadline" value={jobData.applicationDeadline} onChange={handleChange} className={`${inputClass} pl-10`} /></div></div>
                </div>
              </section>

              <section className="pt-6 border-t border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-2 mb-4"><span className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-300 flex items-center justify-center"><Icon name="file" size={16} /></span><div><h3 className="text-sm font-bold text-slate-900 dark:text-white">About the role</h3><p className="text-xs text-slate-400 dark:text-slate-500">Give candidates enough context to make an informed decision.</p></div></div>
                <textarea name="description" value={jobData.description} onChange={handleChange} placeholder="Describe the role, responsibilities, requirements and what success looks like..." rows={7} className={`${inputClass} resize-none`} />
              </section>

              <div className="pt-2">
                <button type="submit" className="w-full bg-linear-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 font-bold text-white py-3.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25">{id ? "Update Job" : "Publish Job"}</button>
                <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">Your listing will be visible to candidates after publishing.</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostJobs;

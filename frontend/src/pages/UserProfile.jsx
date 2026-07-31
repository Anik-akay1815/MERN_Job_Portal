import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { Link, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/authService.js";

function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
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
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) {
        delete payload.password;
      }
      const res = await updateUser(user._id, payload);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-12 mb-10 px-4">
        <div className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-2xl p-6">
          <div className="flex flex-col items-center text-center mb-5 pb-5 border-b border-gray-200">
            <div className="w-16 h-16 rounded-full bg-slate-600 text-white flex items-center justify-center text-2xl font-bold mb-2">
              {user?.name?.charAt(0).toUpperCase()}
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
            <span className="mt-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-xs font-semibold">
              {id ? "Applicant" : user?.role}
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
                    {user?.email}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5 gap-3">
                <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                  🛡️ Role
                </p>
                <p className="font-semibold text-gray-800 text-right">
                  {id ? "Applicant" : user?.role}
                </p>
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

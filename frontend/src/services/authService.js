import axios from "axios";
import App from "../App";

const API = axios.create({ baseURL: "https://mern-job-portal-j4by.onrender.com" });

export const loginUser = (userData) => {
  return API.post("/user/login", userData);
};
export const registerUser = (userData) => {
  return API.post("/user/register", userData);
};
export const loginCompany = (companyData) => {
  return API.post("/company/login", companyData);
};
export const registerCompany = (companyData) => {
  return API.post("/company/register", companyData);
};
export const getAllJobs = () => {
  return API.get("/job/all");
};
export const getJobById = (id) => {
  return API.get(`/job/${id}`);
};
export const getCompanyById = (id) => {
  return API.get(`/company/${id}`);
};
export const updateCompany = (id, formData) => {
  return API.put(`/company/${id}`, formData);
};
export const updateUser = (id, formData) => {
  return API.put(`/user/${id}`, formData);
};
export const createJob = (jobData) => {
  const token = localStorage.getItem("token");
  return API.post("/job/create", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const applyJob = (jobId) => {
  const token = localStorage.getItem("token");
  return API.post(
    `/application/apply`,
    { jobId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
export const getUserById = (id) => {
  const token = localStorage.getItem("token");
  return API.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUserApplications = (userId) => {
  const token = localStorage.getItem("token");
  return API.get(`/application/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteJob = (id) => {
  const token = localStorage.getItem("token");
  return API.delete(`/job/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateJob = (id, jobData) => {
  const token = localStorage.getItem("token");
  return API.put(`/job/${id}`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getJobApplications = (jobId) => {
  const token = localStorage.getItem("token");
  return API.get(`application/job/${jobId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateApplicationStatus = (id, data) => {
  const token = localStorage.getItem("token");
  return API.put(`/application/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteApplication = (id) => {
  const token = localStorage.getItem("token");
  return API.delete(`/application/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getDashboard = () => {
  const token = localStorage.getItem("token");
  return API.get('/job/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default API;

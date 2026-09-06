const express = require("express");

const adminRouter = express.Router();

const { verifyToken, authorizeRole } = require("../middleware/auth");

const userController = require("../controllers/usercontroller");
const companyController = require("../controllers/companycontroller");
const jobController = require("../controllers/jobcontroller");

adminRouter.use(verifyToken,authorizeRole("admin"));


adminRouter.get("/users",userController.getallusers);
adminRouter.get("/users/:id",userController.getbyID);
adminRouter.put("/users/:id",userController.updateUser);
adminRouter.delete("/users/:id",userController.deleteUser);


adminRouter.get("/companies",companyController.getallCompany);
adminRouter.get("/companies/:id",companyController.getbyID);
adminRouter.put("/companies/:id",companyController.updateCompany);
adminRouter.delete("/companies/:id",companyController.deleteCompany);


adminRouter.get("/jobs",jobController.getallJobs);
adminRouter.get("/jobs/:id",jobController.getJobByID);
adminRouter.put("/jobs/:id",jobController.updateJob);
adminRouter.delete("/jobs/:id",jobController.deleteJob);


module.exports = adminRouter;
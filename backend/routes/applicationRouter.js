const express = require('express');
const applicationRouter = express.Router();
const{verifyToken,authorizeRole}=require('../middleware/auth');

const applicationController=require('../controllers/applicationcontroller');

// jobRouter.post('/create',jobController.createJob);
applicationRouter.post('/apply',verifyToken,authorizeRole("user"),applicationController.applyJob);

applicationRouter.get('/all',applicationController.getAllApplications);

applicationRouter.get('/job/:jobId',verifyToken,authorizeRole("company"),applicationController.getJobApplications);
applicationRouter.get('/company/:companyId',verifyToken,authorizeRole("company"),applicationController.getCompanyApplications);
applicationRouter.get('/user/:userId',verifyToken,authorizeRole("user"),applicationController.getUserApplications);

applicationRouter.get('/:id',applicationController.getApplicationByID);
applicationRouter.put('/:id',verifyToken,authorizeRole("company"),applicationController.updateApplication);
applicationRouter.delete('/:id',verifyToken,authorizeRole("user"),applicationController.deleteApplication);

module.exports = applicationRouter;
const express = require('express');
const jobRouter = express.Router();
const{verifyToken,authorizeRole}=require('../middleware/auth');

const jobController=require('../controllers/jobcontroller');

jobRouter.post('/create',verifyToken,authorizeRole("company"),jobController.createJob);

jobRouter.get('/all',jobController.getallJobs);
jobRouter.get('/available',jobController.getAvailableJobs);
jobRouter.get('/dashboard',verifyToken,authorizeRole('company'),jobController.getDashboard)

jobRouter.get('/:id',jobController.getJobByID);
jobRouter.put('/:id',verifyToken,authorizeRole("company"),jobController.updateJob);
jobRouter.delete('/:id',verifyToken,authorizeRole("company"),jobController.deleteJob);

module.exports = jobRouter;
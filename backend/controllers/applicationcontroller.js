const Application = require("../models/application");
const Job = require("../models/job");
const Company=require("../models/company");
const User=require("../models/user");
const company = require("../models/company");

exports.getAllApplications = async (req, res, next) => {
  try {
    const allApplications = await Application.find();
    res.status(200).json({
      success: true,
      message: "All Applications",
      data: allApplications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Applications",
      err,
    });
  }
};

exports.getApplicationByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const applicationID = await Application.findById(id);
    if (!applicationID) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Application found",
      data: applicationID,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error finding Application",
      err,
    });
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedApplication = await Application.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Application updated",
      data: updatedApplication,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error finding Application",
      err,
    });
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteApplication = await Application.findByIdAndDelete(id);
    if (!deleteApplication) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
      data: deleteApplication,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Finding Application",
    });
  }
};

exports.applyJob = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    if(!job){
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    const alreadyApplied=await Application.findOne({
      user:userId,
      job:jobId,
    })
    if(alreadyApplied){
       return res.status(400).json({
        success:false,
        message:"Already Applied",
      })
    }
    const application = await Application.create({
      user:userId,
      job:jobId,
      company:job.company,
    })
    res.status(201).json({
      success:true,
      message:"Applied Successfully",
      data:application,
    })
  } catch (err) {
    res.status(500).json({
      success:false,
      message:"Error applying for Job",
      err
    })
  }
};

exports.getJobApplications=async(req,res,next)=>{
  try{
    const {jobId}=req.params;
    const job=await Job.findById(jobId);
    if(!job){
      return res.status(404).json({
      success:false,
      message:"Job not found",
    })
    }
    if(job.company.toString()!==req.user.id){
      return res.status(403).json({
      success:false,
      message:"Access denied",
    })
    }
    const applications= await Application.find({job:jobId})
    .populate("user","name email role")
    .populate("job",'title location')
    .populate("company","companyname email location");
    res.status(200).json({
      success:true,
      message:"All applications of selected Job",
      data:applications,
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error finding applications",
      err
    })
  }
}

exports.getCompanyApplications=async(req,res,next)=>{
  try{
    const {companyId}=req.params;
    if(req.user.id!==companyId){
      return res.status(403).json({
      success:false,
      message:"Access Denied",
  
    })
    }
  const applications=await Application.find({company:companyId})
  .populate("user","name email role")
    .populate("job","title salary location description")
    .populate("company","companyname email");
    res.status(200).json({
      success:true,
      message:"All applications from selected company",
      data:applications,
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error finding company applications",
      err
    })
  }
}

exports.getUserApplications=async(req,res,next)=>{
  try{
    const {userId}=req.params;
    if(req.user.id!==userId){
      return res.status(403).json({
      success:false,
      message:"Access Denied",
  
    })
    }
    const applications=await Application.find({user:userId})
    .populate("user","name")
    .populate("job","title")
    .populate("company","companyname location");
    res.status(200).json({
      success:true,
      message:"All applications of User",
      data:applications,
    })
  }catch(err){
    res.status(500).json({
      success:false,
      message:"Error finding user applications",
      err
    })
  }
}
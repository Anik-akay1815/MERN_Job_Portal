const Job = require("../models/job");
const Application = require('../models/application')

exports.createJob = async (req, res, next) => {
  try {
    const companyId = req.user.id;
    req.body.company=companyId;
    const jobData = await Job.create(req.body);
    res.json({
      success: true,
      message: "Job Created Successfully",
      data: jobData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while saving data",
      err,
    });
  }
};

exports.getallJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      jobType,
      experienceLevel,
      category,
      skills,
      page = 1,
      limit = 6,
    } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { skillsRequired: { $regex: keyword, $options: "i" } },
      ];
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }
    if (skills) {
      const skillList = skills.split(",").map((skill) => skill.trim()).filter(Boolean);
      if (skillList.length > 0) {
        query.skillsRequired = {
          $in: skillList,
        };
      }
    }

    const skip = (page - 1) * limit;
    const totalJobs = await Job.countDocuments(query);

    const allJobs = await Job.find(query)
      .populate("company", "companyname")
      .skip(skip)
      .limit(Number(limit));

    const totalPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: allJobs,
      currentPage: Number(page),
      totalPages,
      totalJobs,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching Jobs",
      error: err.message,
    });
  }
};

exports.getJobByID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const jobData = await Job.findById(id).populate('company','companyname');
    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: "Job does not Exists",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job found",
      data: jobData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Finding Job",
    });
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job updated",
      data: updatedJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating Job",
      err: err.message,
    });
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteJob = await Job.findByIdAndDelete(id);
    if (!deleteJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
      data: deleteJob,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAvailableJobs = async(req,res,next)=>{
  try{
    const jobs = await Job.find().populate("company");
    res.status(200).json({
      success:true,
      message:"Available jobs",
      data:jobs
    })
  }catch(err){
    res.status(500).json({
      success: false,
      message: "Error Finding Job",
    });
  }
}

exports.getDashboard = async(req,res,next)=>{
  try{
    const jobs = await Job.find({company:req.user.id});
    const totalJobs=jobs.length;

    const jobIds = jobs.map(job=>job._id);

    const applications= await Application.find({job:{$in:jobIds}});
    const totalApplications = applications.length;

    const accepted = applications.filter(app=>app.status ==='Accepted').length;
    const rejected = applications.filter(app=>app.status ==='Rejected').length;
    const pending = applications.filter(app=>app.status ==='Pending').length;

    const recentJobs = jobs.slice(-5).reverse();

    res.status(200).json({
      success:true,
      data:{
        totalJobs,totalApplications,accepted,rejected,pending,recentJobs
      }
    })
  }catch(err){
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
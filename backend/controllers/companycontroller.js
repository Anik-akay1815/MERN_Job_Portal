const Company=require("../models/company");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Job = require('../models/job');

exports.register = async (req, res, next) => {
  try {
    const {password} = req.body;
    const hashedPassword= await bcrypt.hash(password,12);
    req.body.password=hashedPassword;

    const companydata = await Company.create(req.body);
    res.json({
      success: true,
      message: "Company data registered",
      data: companydata,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error while saving data",
      err,
    });
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const company = await Company.findOne({ email });
  if (!company) {
    return res.status(404).json({
      success: false,
      message: "Company does not exists",
    });
  }
  const isMatch=await bcrypt.compare(password,company.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect Credentials",
    });
  }
  const token=jwt.sign({
      id:company._id,
      role:company.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn:'7d'
    }
  )
  res.status(200).json({
    success: true,
    message: "Company Login successful",
    token,
    data: {
      _id:company._id,
      companyname:company.companyname,
      email:company.email,
      location:company.location,
      description:company.description,
      role:company.role
    },
  });
};


exports.getallCompany = async (req, res, next) => {
  try {
    const allCompanies = await Company.find();
    res.status(200).json({
      success: true,
      message: "All registered Companies",
      data: allCompanies,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
    });
  }
};

exports.getbyID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const company = await Company.findById(id);
    const jobs = await Job.find({company:id});
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company does not Exists",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company found",
      data: {company,jobs}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCompany = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  if (data.password) {
    data.password = await bcrypt.hash(data.password, 12);
  } else {
    delete data.password;
  }
  const updatedCompany = await Company.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedCompany) {
    return res.status(404).json({
      success: false,
      message: "Company not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "Company updated",
    data: updatedCompany,
  });
};

exports.deleteCompany = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteCompany = await Company.findByIdAndDelete(id);
    if (!deleteCompany) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
      data: deleteCompany,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Finding Company",
    });
  }
};

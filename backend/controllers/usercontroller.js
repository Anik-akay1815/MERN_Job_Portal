const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const {password} = req.body;
    const hashedPassword= await bcrypt.hash(password,12);
    req.body.password=hashedPassword;

    const userdata = await User.create(req.body);
    res.json({
      success: true,
      message: "User registered successfully",
      data: {
        _id:userdata._id,
        name:userdata.name,
        email:userdata.email,
        role:userdata.role
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error while saving data",
      err,
    });
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User does not exists",
    });
  }
  const isMatch=await bcrypt.compare(password,user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect Credentials",
    });
  }
  const token=jwt.sign({
    id:user._id,
    role:user.role
  },
  process.env.JWT_SECRET,
  {
    expiresIn:'7d'
  }
)
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: {
      _id:user._id,
      name:user.name,
      email:user.email,
      role:user.role
    },
  });
};

exports.getallusers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      success: true,
      message: "All registered users",
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

exports.getbyID = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not Exists",
      });
    }
    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Finding User",
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;

  if(data.password){
    data.password=await bcrypt.hash(data.password,12);
  }
  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators:true,
  });
  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    message: "User updated",
    data: updatedUser,
  });
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deleteUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error Finding User",
    });
  }
};

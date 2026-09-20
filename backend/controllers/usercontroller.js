const User = require("../models/user");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");

const { deleteCacheByPattern, getCache, setCache } = require("../utils/redisCache");

exports.register = async (req, res, next) => {
  try {
    const {password} = req.body;
    const hashedPassword= await bcrypt.hash(password,12);
    req.body.password=hashedPassword;

    const userdata = await User.create(req.body);

    await deleteCacheByPattern("/users:*");

    res.json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: userdata._id,
        name: userdata.name,
        email: userdata.email,
        role: userdata.role,
        phone: userdata.phone,
        location: userdata.location,
        bio: userdata.bio,
        skills: userdata.skills,
        gitHub: userdata.gitHub,
        experience: userdata.experience,
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
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Incorrect Credentials",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

  const userData = user.toObject();
  delete userData.password;

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: userData,
  });
};

exports.getallusers = async (req, res, next) => {
  try {
    const cacheKey = "/users:all";

    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return res.status(200).json({
        success: true,
        message: "All registered users",
        data: JSON.parse(cachedData),
      });
    }

    const allUsers = await User.find().select("-password");

    await setCache(cacheKey, allUsers, 240);

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

    const cacheKey = `/users:${id}`;

    const cachedData = await getCache(cacheKey);

    if (cachedData) {

      return res.status(200).json({
        success: true,
        message: "User found",
        data: JSON.parse(cachedData),
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not Exists",
      });
    }

    await setCache(cacheKey, user, 240);

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
  try {
    const id = req.params.id;

    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const data = { ...req.body };

    let oldProfilePhoto = null;
    let oldResume = null;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 12);
    } else {
      delete data.password;
    }
    if (req.files?.profilePhoto) {
      oldProfilePhoto = existingUser.profilePhoto;
      data.profilePhoto = req.files.profilePhoto[0].path;
    }
    if (req.files?.resume) {
      oldResume = existingUser.resume;
      data.resume = req.files.resume[0].path;
    }
    if (data.skills) {
      data.skills = JSON.parse(data.skills);
    }
    if (data.experience) {
      data.experience = JSON.parse(data.experience);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
    if (oldProfilePhoto && oldProfilePhoto !== data.profilePhoto) {
      const oldPath = path.isAbsolute(oldProfilePhoto)
        ? oldProfilePhoto
        : path.join(process.cwd(), oldProfilePhoto);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    if (oldResume && oldResume !== data.resume) {
      const oldPath = path.isAbsolute(oldResume)
        ? oldResume
        : path.join(process.cwd(), oldResume);

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await deleteCacheByPattern("/users:*");

    res.status(200).json({
      success: true,
      message: "User updated",
      data: updatedUser,
    });

  } catch (err) {
    next(err);
  }
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

    await deleteCacheByPattern("/users:*");

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

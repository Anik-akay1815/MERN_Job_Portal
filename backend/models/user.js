const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  phone: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  skills:{
    type:[String],
    default:[]
  },
  resume: {
    type: String,
    default: "",
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  gitHub: {
    type: String,
    default: "",
  },
  experience: [{
    jobTitle: {
      type: String,
      required: true
    },
    company: {
      type: String,
      default: ""
    },
    years: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ""
    }
  }],
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

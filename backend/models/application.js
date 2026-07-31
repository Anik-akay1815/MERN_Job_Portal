const mongoose = require('mongoose');

const applicationSchema=mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Company",
    required:true
  },
  job:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Job",
    required:true
  },
  status:{
    type:String,
    enum:["Pending","Accepted","Rejected"],
    default:"Pending"
  }
})

module.exports=mongoose.model('Application',applicationSchema);
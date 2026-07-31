const mongoose = require('mongoose');

const jobSchema=mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    default:""
  },
  location:{
    type:String,
    default:""
  },
  salary:{
    type:String,
    required:true
  },
  jobType:{
    type:String,
    required:true,
    enum:["Full Time","Part Time", "Intern","Remote"],
    default:"Full Time"
  },
  company:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Company",
    required:true
  }
})

module.exports=mongoose.model('Job',jobSchema);
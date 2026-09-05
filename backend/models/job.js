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
  skillsRequired:{
    type:[String],
    default:[]
  },
  experienceLevel:{
    type:String,
    enum:["0-1 years","1-3 years","3-5 years","5+ years"],
    default:"0-1 years"
  },
  category:{
    type:String,
    default:""
  },
  numberOfOpenings:{
    type:Number,
    default:1
  },
  applicationDeadline:{
    type:Date,
  },
  isActive:{
    type:Boolean,
    default:true
  },
  company:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Company",
    required:true
  }
})

module.exports=mongoose.model('Job',jobSchema);
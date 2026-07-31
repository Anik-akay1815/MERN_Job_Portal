const mongoose = require('mongoose');

const companySchema=mongoose.Schema({
  companyname:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  location:{
    type:String,
    required:true,
  },
  description:{
    type:String,
    default:"",
  },
  role:{
    type:String,
    default:'company'
  },
})

module.exports=mongoose.model('Company',companySchema);
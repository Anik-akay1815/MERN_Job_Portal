//import express
const express = require('express');
const app=express();
app.use(express.json());

//import cors
const cors = require('cors');
app.use(cors());

//establish redis connection
const redis = require('./config/redis');

//establish db connection
const mongoose=require('mongoose');
require('dotenv').config();
const connectDB=require('./config/db');
connectDB();
const PORT=process.env.PORT;

//import routers
const userRouter = require('./routes/userRouter');
const companyRouter = require('./routes/companyRouter');
const jobRouter=require('./routes/jobrouter');
const applicationRouter = require("./routes/applicationRouter");
const adminRouter = require('./routes/adminRouter');


app.use('/user',userRouter);
app.use('/company',companyRouter);
app.use('/job',jobRouter);
app.use('/application',applicationRouter);
app.use('/admin', adminRouter)
app.use('/uploads', express.static('uploads'));

app.get('/',(req,res)=>{
  res.send("Job Portal Running...");
})

app.listen(PORT, () => {
console.log(`Server running address is http://localhost:${PORT}`);
});
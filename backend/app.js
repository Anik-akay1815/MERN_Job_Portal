const express = require('express');
require('dotenv').config();
const mongoose=require('mongoose');
const connectDB=require('./config/db');
const userRouter = require('./routes/userRouter');
const companyRouter = require('./routes/companyRouter');
const jobRouter=require('./routes/jobrouter');
const applicationRouter = require("./routes/applicationRouter");
const cors = require('cors');


const app=express();
app.use(express.json());
app.use(cors());

connectDB();
const PORT=process.env.PORT;

app.use('/user',userRouter);
app.use('/company',companyRouter);
app.use('/job',jobRouter);
app.use('/application',applicationRouter);

app.get('/',(req,res)=>{
  res.send("Job Portal Running...");
})

app.listen(PORT, () => {
console.log(`Server running address is http://localhost:${PORT}`);
});
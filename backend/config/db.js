require('dotenv').config();
const mongoose=require('mongoose');

const DBPath=process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(DBPath);
    console.log("Mongoose Connected");
  } catch (err) {
    console.log("Error while connecting:err");
  }
};

module.exports= connectDB;
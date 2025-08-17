import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.CON_STR);

    console.log("MongoDB connected Successfully!");
  } catch (error) {
    console.log(`MongoDB connection ${error}`);
  }
};

export default connectDB;

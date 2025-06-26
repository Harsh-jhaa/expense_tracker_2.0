import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error connecting the database: ${error.message}`);
    // Exit process with failure code 1 is for failure and 0 is for success
    // process.exit(1) is used to exit the process with a failure code
    process.exit(1);
  }
};

export default connectDB;

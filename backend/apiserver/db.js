import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME
    });
    console.log(`API Server connected to MongoDB/${process.env.DB_NAME}`);
};

export default connectDB;

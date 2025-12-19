import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

if(!mongoURI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
}

export const connectDb = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
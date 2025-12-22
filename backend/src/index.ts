import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser" 
import { type Request, type Response } from "express"
import path from "path"
import { connectDb } from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000;
const _dirname = path.resolve();

// middlewares
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(express.json({
    limit: "5mb"
}))

// routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);

// start server
const startServer = async () => {
    try {
        connectDb();
        app.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
        
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
startServer();



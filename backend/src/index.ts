import express from "express"
import cors from "cors"
import dotenv from "dotenv"; dotenv.config();
import cookieParser from "cookie-parser" 
import path from "path"

import { connectDb } from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import { app, server } from "./lib/socket.js"

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// middlewares
app.use(express.json({
    limit: "5mb"
}))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))


// routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat', chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// start server
const startServer = async () => {
    try {
        console.log("Connecting to database...");
        await connectDb();
        server.listen(PORT, ()=>{
            console.log(`Server is running on port ${PORT}`);
        })
        
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}
startServer();



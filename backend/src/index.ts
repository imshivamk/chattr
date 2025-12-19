// external/library imports
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser" 
import { type Request, type Response } from "express"

// local imports
import { connectDb } from "./lib/db.js"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"

// express
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())


//  route handlers

// check connection
app.post("/greet", (req:Request, res:Response) => {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: "Name is required" });
    }
    const greeting = `Hello, ${name}! Hope you're having a great day.`;
    return res.json({ greeting });
});

// healthcheck route
app.get('/healthcheck', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running...'
    })
})

// auth routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/user', userRoutes);




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



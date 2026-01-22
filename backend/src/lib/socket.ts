import express from "express"
import { Server } from "socket.io";
import http from "http"
import dotenv from "dotenv"
import { verifySocketToken } from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import { IAuthSocket } from "../types/types.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Your frontend URL
    credentials: true, 
  },
});
//  socket auth middleware
io.use(verifySocketToken);
// online users hashmap
const userSocketMap:Record<string, string> = {};

io.on("connection", async (socket: IAuthSocket) => {
  console.log("io.on");
    const user = await User.findById(socket.userId);
  console.log("user: ", user);

    if(!user) {
        console.log("User not found for socket, disconnecting");
        return socket.disconnect();
    }
    console.log("New user connected:", user.name, "Socket ID:", socket.id, "User ID:", socket.userId);

    let key = socket.userId as string;
    let val = socket.id as string;
    console.log(key);
    console.log(val);
    userSocketMap[socket.userId as string] = socket.id as string;

    console.log("Current online users:", Object.keys(userSocketMap));

    // send events to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // listen for events from clients
    socket.on("disconnect", ()=> {
        console.log("A User disconnected:", user.name);
        delete userSocketMap[socket.userId as string];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})

export const getReceiverSocketId = (userId: string) => {
  console.log("user", userId);
  console.log("usersocket",userSocketMap[userId])
  return userSocketMap[userId];
}


export {io, app, server}
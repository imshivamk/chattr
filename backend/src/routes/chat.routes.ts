import express, { Request, Response } from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { getAllContacts, getChats, GetMessagesByUserId, sendMessage } from "../controllers/chat.controllers.js";

const router = express.Router();

router.use(rateLimiter, verifyToken);

router.get("/contacts", getAllContacts);
router.get("/chats", getChats);
router.get("/:id", GetMessagesByUserId);
router.post("/send/:id", sendMessage);  

export default router;
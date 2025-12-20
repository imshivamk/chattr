import express from "express"
import { verifyToken } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { getAllContacts, getChatPartners, GetMessagesByUserId, sendMessage } from "../controllers/message.controllers.js";

const router = express.Router();

router.use(rateLimiter, verifyToken);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", GetMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
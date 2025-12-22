import express, { Request, Response } from "express"
import { getUserInfo } from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(verifyToken, rateLimiter)

router.get('/me', getUserInfo);

export default router;
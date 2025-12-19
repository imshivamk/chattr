import express, { Request, Response } from "express"
import { getUserInfo } from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get('/me', verifyToken, getUserInfo);

export default router;
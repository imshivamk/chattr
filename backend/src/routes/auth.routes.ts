import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from '../controllers/auth.controllers.js';
import { IAuthRequest } from '../types/types.js';
import User from '../models/User.js';

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Auth route is working!");
});

router.get('/check-auth', verifyToken, checkAuth);
router.get('/check', verifyToken, (req:IAuthRequest, res:Response) => {
  res.status(200).json(
    User.findById(req.userId).select('-password -verificationCode -resetPasswordCode')
  )
})

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetPasswordCode', resetPassword);

router.put("/update-profile", verifyToken, updateProfile)

export default router;

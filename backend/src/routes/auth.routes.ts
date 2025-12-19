import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controllers.js';

const router = express.Router();

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("Auth route is working!");
});

router.get('/check-auth', verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post('/login', login);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetPasswordCode', resetPassword);

export default router;

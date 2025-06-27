import express from 'express';
import { signupUser, googleAuth } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/google", googleAuth);

export default userRouter;
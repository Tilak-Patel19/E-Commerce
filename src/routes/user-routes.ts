import express from 'express';
import { signup, login } from '../controllers/user-controllers';

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout', login);

export default userRouter;

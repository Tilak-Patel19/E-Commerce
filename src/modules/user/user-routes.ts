import express from 'express';
import { signup, login } from './user-auth-controllers';
import { getUserById, updateUser, deleteUser, listUsers, resetPassword, changeUserPassword } from './user-controllers';
import { isLogin, restrictTo } from './user-middleware';

const userRouter = express.Router();

userRouter.use(isLogin);

userRouter.post('/signup', signup);
userRouter.post('/login', login);

userRouter.get('/profile/:userId', getUserById);
userRouter.put('/profile/:userId', updateUser);
userRouter.delete('/profile/:userId', restrictTo('admin'), deleteUser);
userRouter.get('/users', restrictTo('admin'), listUsers);
userRouter.put('/reset-password/:userId', resetPassword);
userRouter.post('/change-password', changeUserPassword);

export default userRouter;

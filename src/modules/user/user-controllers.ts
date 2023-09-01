import { User } from './user-model';
import jwt from 'jwt-simple';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userLoginSchema, userSignupSchema } from '../validator';
import { errorHandler } from '../utils/catch-async';
import { sendResponse } from '../utils/response';
import AppError from '../utils/app-error';
dotenv.config({ path: './../../.env' });
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const signup = errorHandler(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, status, role } = req.body;
    const { error } = userSignupSchema.validate({ name, email, password, confirmPassword, status, role });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }
    let userExist = await User.findOne({ where: { email: email } });
    if (userExist) {
        return res.status(404).json({
            isError: true,
            message: 'Email already already exists!',
        });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const data = { name, email, password: hashPassword, status, role };
    const user = await User.create(data);
    if (!user) {
        const errorMessage = 'User not created';
        throw new AppError(errorMessage, 401);
    }
    const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);

    sendResponse(res, 201, 'User created successfully', { user, token });
});

export const login = errorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { error } = userLoginSchema.validate({ email, password });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }
    const user = await User.findOne({
        where: { email: email },
    });

    if (!user) {
        return res.status(401).json({
            isError: true,
            message: 'User not found',
        });
    }

    const validPassword = await bcrypt.compare(password, user.dataValues.password);

    const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);
    if (!validPassword) {
        const errorMessage = 'Invalid password';
        throw new AppError(errorMessage, 401);
    }
    sendResponse(res, 200, 'User login successful', { token });
});

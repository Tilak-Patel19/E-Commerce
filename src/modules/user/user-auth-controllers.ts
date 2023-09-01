import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import { User } from './user-model';
import { userLoginSchema, userSignupSchema } from '../validator';
import { sendResponse } from '../utils/response';
import AppError from '../utils/app-error';
import { errorHandler } from '../utils/catch-async';

export const signup = errorHandler(async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, status, role } = req.body;
    const { error } = userSignupSchema.validate({ name, email, password, confirmPassword, status, role });

    if (error) {
        throw new AppError(error.message, 400);
    }

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
        throw new AppError('Email already exists!', 404);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const data = { name, email, password: hashPassword, status, role };
    const user = await User.create(data);
    if (!user) {
        throw new AppError('User not created', 401);
    }

    const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);

    sendResponse(res, 201, 'User created successfully', { user, token });
});

export const login = errorHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { error } = userLoginSchema.validate({ email, password });

    if (error) {
        throw new AppError(error.message, 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new AppError('User not found', 401);
    }

    const validPassword = await bcrypt.compare(password, user.dataValues.password);
    if (!validPassword) {
        throw new AppError('Invalid password', 401);
    }

    const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);
    sendResponse(res, 200, 'User login successful', { token });
});

import { User } from './user-model';
import jwt from 'jwt-simple';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userLoginSchema, userSignupSchema } from '../validator';
dotenv.config({ path: './../../.env' });
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const signup = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, status, role } = req.body;
    const { error } = userSignupSchema.validate({ name, email, password, confirmPassword, status, role });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }
    try {
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
            return res.status(401).json({
                isError: true,
                message: 'User not created',
            });
        }
        const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);

        return res.status(201).json({
            isError: false,
            message: 'User created successfully',
            data: user,
            token: token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isError: true,
            message: 'An error during registration',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { error } = userLoginSchema.validate({ email, password });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }
    try {
        const user = await User.findOne({
            where: { email: email },
        });

        if (!user) {
            return res.status(401).json({
                status: 'Fail',
                message: 'User not found',
            });
        }

        const validPassword = await bcrypt.compare(password, user.dataValues.password);

        if (validPassword) {
            const token = jwt.encode({ id: user.dataValues.id }, process.env.JWT_SECRET as string);
            return res.status(200).json({
                status: 'Success',
                message: 'User login successful',
                token: token,
            });
        } else {
            return res.status(401).json({
                status: 'Fail',
                message: 'Invalid password',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            isError: true,
            message: 'An error during login',
        });
    }
};

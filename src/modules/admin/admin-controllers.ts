import { Vendor } from '../vendor/vendor-model';
import { Request, Response } from 'express';
import { vendorSignupSchema } from '../validator';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { errorHandler } from '../utils/catch-async';
import AppError from '../utils/app-error';
import { sendResponse } from '../utils/response';

dotenv.config({ path: './../../.env' });

export const vendorSignup = errorHandler(async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword, status } = req.body;
    const { error } = vendorSignupSchema.validate({ username, email, password, confirmPassword, status });
    if (error) {
        throw new AppError(error.message, 400);
    }
    const vendorExist = await Vendor.findOne({ where: [{ email }, { username }] });
    if (vendorExist) {
        throw new AppError('Email/Username already exists!', 404);
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const data = { username, email, password: hashPassword, status };
    const vendor = await Vendor.create(data);
    if (!vendor) {
        throw new AppError('Vendor not created', 401);
    }
    const token = jwt.encode(
        { id: vendor.dataValues.id, username: vendor.dataValues.username, email: vendor.dataValues.email },
        process.env.JWT_SECRET as string
    );

    sendResponse(res, 201, 'Vendor created successfully', { data: vendor, token });
});

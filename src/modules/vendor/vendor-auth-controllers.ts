import { Vendor } from './vendor-model';
import { Request, Response } from 'express';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { vendorLoginSchema } from '../validator';
import { Op } from 'sequelize';
import { errorHandler } from '../utils/catch-async';
import AppError from '../utils/app-error';
import { sendResponse } from '../utils/response';

dotenv.config({ path: './../../.env' });

export const vendorLogin = errorHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const { error } = vendorLoginSchema.validate({ username, email, password });
    if (error) {
        throw new AppError(error.message, 400);
    }

    const whereCondition: Record<string, string> = {};
    if (username) {
        whereCondition['username'] = username;
    }
    if (email) {
        whereCondition['email'] = email;
    }

    const vendor = await Vendor.findOne({
        where: {
            [Op.or]: [whereCondition],
        },
    });

    if (!vendor) {
        throw new AppError('Vendor not found', 401);
    }

    const validPassword = await bcrypt.compare(password, vendor.dataValues.password);

    if (validPassword) {
        const token = jwt.encode(
            { id: vendor.dataValues.id, username: vendor.dataValues.username, email: vendor.dataValues.email },
            process.env.JWT_SECRET as string
        );

        sendResponse(res, 200, 'Vendor login successful', { token });
    } else {
        throw new AppError('Invalid password', 401);
    }
});

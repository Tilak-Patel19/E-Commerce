import { Vendor } from './vendor-model';
import { Request, Response } from 'express';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { vendorLoginSchema } from '../validator';
import { Op } from 'sequelize';

dotenv.config({ path: './../../.env' });

export const vendorLogin = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    const { error } = vendorLoginSchema.validate({ username, email, password });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }

    try {
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
            return res.status(401).json({
                status: 'Fail',
                message: 'Vendor not found',
            });
        }

        const validPassword = await bcrypt.compare(password, vendor.dataValues.password);

        if (validPassword) {
            const token = jwt.encode(
                { username: vendor.dataValues.username, email: vendor.dataValues.email },
                process.env.JWT_SECRET as string
            );

            return res.status(200).json({
                status: 'Success',
                message: 'Vendor login successful',
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
            message: 'An error occurred during login',
        });
    }
};

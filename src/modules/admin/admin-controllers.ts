import { Vendor } from '../vendor/vendor-model';
import { Request, Response } from 'express';
import { vendorSignupSchema } from '../validator';
import jwt from 'jwt-simple';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
// import { Op } from 'sequelize';
dotenv.config({ path: './../../.env' });

export const vendorSignup = async (req: Request, res: Response) => {
    const { username, email, password, confirmPassword, status } = req.body;
    const { error } = vendorSignupSchema.validate({ username, email, password, confirmPassword, status });
    if (error) {
        return res.status(400).json({
            isError: true,
            message: error.message,
        });
    }
    try {
        let vendorExist = await Vendor.findOne({ where: [{ email: email }, { username: username }] });
        if (vendorExist) {
            return res.status(404).json({
                isError: true,
                message: 'Email/Username already already exists!',
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const data = { username, email, password: hashPassword, status };
        const vendor = await Vendor.create(data);
        if (!vendor) {
            return res.status(401).json({
                isError: true,
                message: 'Vendor not created',
            });
        }
        const token = jwt.encode(
            { username: vendor.dataValues.username, email: vendor.dataValues.email },
            process.env.JWT_SECRET as string
        );

        return res.status(201).json({
            isError: false,
            message: 'Vendor created successfully',
            data: vendor,
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

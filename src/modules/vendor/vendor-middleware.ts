import { Request, Response, NextFunction } from 'express';
import jwt from 'jwt-simple';
import { Vendor } from './vendor-model';
import AppError from '../utils/app-error';
import { sendResponse } from '../utils/response';

export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')?.replace('bearer ', '')?.trim();
    if (!token) {
        return sendResponse(res, 404, 'Token missing');
    }

    const decode = jwt.decode(token as string, process.env.JWT_SECRET as string);
    if (!decode || !decode.id) {
        return sendResponse(res, 401, 'Invalid token');
    }

    const currentVendor = await Vendor.findOne({
        where: {
            id: decode.id,
        },
    });

    if (!currentVendor) {
        return sendResponse(res, 401, 'Vendor not found');
    }

    req.user = currentVendor;
    next();
};

export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const currentVendor = req.user;

        if (!currentVendor) {
            return sendResponse(res, 401, 'Vendor not found');
        }

        if (!roles.includes(currentVendor.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

import { Request, Response, NextFunction } from 'express';
import User from './user-model';
import { errorHandler } from '../utils/catch-async';
import jwt from 'jwt-simple';
import AppError from '../utils/app-error';
import { sendResponse } from '../utils/response';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
export const isLogin = errorHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')?.replace('bearer ', '')?.trim();
    if (!token) {
        return sendResponse(res, 404, 'Token missing');
    }

    const decode = jwt.decode(token as string, process.env.JWT_SECRET as string);
    if (!decode || !decode.id) {
        return sendResponse(res, 401, 'Invalid token');
    }

    const currentUser = await User.findOne({
        where: {
            id: decode.id,
        },
    });

    if (!currentUser) {
        return sendResponse(res, 401, 'User not found');
    }

    req.user = currentUser;
    return next();
});

export const restrictTo = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

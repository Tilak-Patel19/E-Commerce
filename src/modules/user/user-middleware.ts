import { Request, Response, NextFunction } from 'express';
import { User } from './user-model';
import jwt from 'jwt-simple';

export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.replace('Bearer ', '')?.replace('bearer ', '').trim();
    if (!token) {
        return res.status(404).json({
            isError: true,
            message: 'Token missing',
        });
    }
    try {
        const decode = jwt.decode(token as string, process.env.JWT_SECRET as string);
        if (!decode || !decode.id) {
            return res.status(401).json({
                isError: true,
                message: 'Invalid token',
            });
        }
        const currentUser = await User.findOne({
            where: {
                id: decode.id,
            },
        });

        if (!currentUser) {
            return res.status(401).json({
                status: 'Fail',
                message: 'User not found',
            });
        }

        req.user = currentUser;
        return next();
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            message: 'An error occurred during token decoding',
        });
    }
};

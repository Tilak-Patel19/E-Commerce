import { Request, Response, NextFunction } from 'express';
import { Product } from './product-model';
import AppError from '../utils/app-error';

declare global {
    namespace Express {
        interface Request {
            product?: any;
        }
    }
}
export const checkProductExists = async (req: Request, _res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    req.product = product;
    next();
};

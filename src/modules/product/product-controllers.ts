import { Request, Response } from 'express';
import Product from './product-model';
import { errorHandler } from '../utils/catch-async';
import { sendResponse } from '../utils/response';
import AppError from '../utils/app-error';

export const createProduct = errorHandler(async (req: Request, res: Response) => {
    const { name, category, image, description, amount, quantity, status } = req.body;

    const product = await Product.create({ name, category, image, description, amount, quantity, status });

    sendResponse(res, 201, 'Product created successfully', { product });
});

export const getProductById = errorHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    sendResponse(res, 200, 'Product found', { product });
});

export const updateProduct = errorHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const updatedData = req.body;

    const product = await Product.findByPk(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    Object.assign(product, updatedData);
    await product.save();

    sendResponse(res, 200, 'Product updated successfully', { product });
});

export const deleteProduct = errorHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId;
    const product = await Product.findByPk(productId);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    await product.destroy();

    sendResponse(res, 204, 'Product deleted successfully');
});

export const listProducts = errorHandler(async (_, res: Response) => {
    const products = await Product.findAll();

    sendResponse(res, 200, 'List of products', { products });
});

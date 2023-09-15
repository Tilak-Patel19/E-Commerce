import express from 'express';
import { createProduct, getProductById, updateProduct, deleteProduct, listProducts } from './product-controllers';
import { checkProductExists, isAdminOrVendor } from './product-middleware';
const productRouter = express.Router();

productRouter.post('/', isAdminOrVendor, createProduct);

productRouter.get('/:productId', checkProductExists, getProductById);

productRouter.put('/:productId', isAdminOrVendor, checkProductExists, updateProduct);

productRouter.delete('/:productId', isAdminOrVendor, checkProductExists, deleteProduct);

productRouter.get('/', listProducts);

export default productRouter;

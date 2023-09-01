import express from 'express';
import { createProduct, getProductById, updateProduct, deleteProduct, listProducts } from './product-controllers';
import { checkProductExists } from './product-middleware';

const productRouter = express.Router();

productRouter.post('/', createProduct);

productRouter.get('/:productId', checkProductExists, getProductById);

productRouter.put('/:productId', checkProductExists, updateProduct);

productRouter.delete('/:productId', checkProductExists, deleteProduct);

productRouter.get('/', listProducts);

export default productRouter;

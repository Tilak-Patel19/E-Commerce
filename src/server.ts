import express from 'express';
import db from './modules/auth/db.config';
import userRouter from './modules/user/user-routes';
import vendorRouter from './modules/vendor/vendor-routes';
import productRouter from './modules/product/product-routes';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: './../.env' });

app.use(express.json());

// user
app.use('/api/user', userRouter);

// admin

// vendor
app.use('/api/vendor', vendorRouter);

// product
app.use('/api/product', productRouter);

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'Fail',
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});

db.authenticate()
    .then(() => {
        console.log('E-Commerce database connected successfully.');
    })
    .catch((error: string) => {
        console.error('Unable to connect to the E-Commerce database: ', error);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`E-commerce website run on ${PORT}`);
});

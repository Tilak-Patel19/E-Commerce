import express from 'express';
import db from './modules/auth/db.config';
import userRouter from './modules/user/user-routes';
import vendorRouter from './modules/vendor/vendor-routes';
import dotenv from 'dotenv';
import morgan from 'morgan';

const app = express();

dotenv.config({ path: './../.env' });

app.use(express.json());
app.use(morgan('dev'));

// user
app.use('/api/user', userRouter);

// admin

// vendor
app.use('/api/vendor', vendorRouter);

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
db.sync();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`E-commerce website run on ${PORT}`);
});

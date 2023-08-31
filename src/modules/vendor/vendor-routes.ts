import express from 'express';
import { vendorLogin } from './vendor-controllers';
import { vendorSignup } from '../admin/admin-controllers';

const vendorRouter = express.Router();

vendorRouter.post('/login', vendorLogin);
vendorRouter.post('/signup', vendorSignup);

export default vendorRouter;

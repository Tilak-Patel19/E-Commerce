import express from 'express';
import { vendorLogin } from '../controllers/vendor-controllers';
import { vendorSignup } from '../controllers/admin-controllers';

const vendorRouter = express.Router();

vendorRouter.post('/login', vendorLogin);
vendorRouter.post('/signup', vendorSignup);

export default vendorRouter;

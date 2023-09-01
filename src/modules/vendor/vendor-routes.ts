import express from 'express';
import { vendorLogin } from './vendor-auth-controllers';
import { vendorSignup } from '../admin/admin-controllers';
import { getVendorById, updateVendor, deleteVendor, listVendors, resetVendorPassword, changeVendorPassword } from './vendor-controllers';
import { isLogin, restrictTo } from './vendor-middleware';
const vendorRouter = express.Router();

vendorRouter.use(isLogin);

vendorRouter.post('/login', vendorLogin);
vendorRouter.post('/signup', vendorSignup);

vendorRouter.get('/:vendorId', getVendorById);
vendorRouter.put('/:vendorId', restrictTo('vendor', 'admin'), updateVendor);
vendorRouter.delete('/:vendorId', restrictTo('admin'), deleteVendor);
vendorRouter.get('/', restrictTo('vendor', 'admin'), listVendors);
vendorRouter.post('/reset-password/:vendorId', restrictTo('vendor', 'admin'), resetVendorPassword);
vendorRouter.post('/change-password', restrictTo('vendor', 'admin'), changeVendorPassword);

export default vendorRouter;

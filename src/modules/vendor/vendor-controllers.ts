import { Request, Response } from 'express';
import { Vendor } from './vendor-model';
import { errorHandler } from '../utils/catch-async';
import { sendResponse } from '../utils/response';
import AppError from '../utils/app-error';
import bcrypt from 'bcrypt';

export const getVendorById = errorHandler(async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new AppError('Vendor not found', 404);
    }

    sendResponse(res, 200, 'Vendor found', { vendor });
});

export const updateVendor = errorHandler(async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const { username, email, status } = req.body;
    const updatedData = { username, email, status };

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new AppError('Vendor not found', 404);
    }

    Object.assign(vendor, updatedData);
    await vendor.save();

    sendResponse(res, 200, 'Vendor  updated successfully', { vendor });
});

export const deleteVendor = errorHandler(async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new AppError('Vendor not found', 404);
    }

    await vendor.destroy();

    sendResponse(res, 204, 'Vendor deleted successfully');
});

export const listVendors = errorHandler(async (_, res: Response) => {
    const vendors = await Vendor.findAll();

    sendResponse(res, 200, 'List of vendors', { vendors });
});

export const resetVendorPassword = errorHandler(async (req: Request, res: Response) => {
    const vendorId = req.params.vendorId;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        throw new AppError('Passwords do not match', 400);
    }

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) {
        throw new AppError('Vendor not found', 404);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    vendor.dataValues.password = hashPassword;
    await vendor.save();

    sendResponse(res, 200, 'Password reset successfully');
});

export const changeVendorPassword = errorHandler(async (req: Request, res: Response) => {
    const vendor = req.user;

    if (!vendor) {
        throw new AppError('Vendor not found', 404);
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const validPassword = await bcrypt.compare(currentPassword, vendor.dataValues.password);

    if (!validPassword) {
        throw new AppError('Current password is incorrect', 400);
    }

    if (newPassword !== confirmPassword) {
        throw new AppError('New passwords do not match', 400);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    vendor.dataValues.password = hashPassword;
    await vendor.save();

    sendResponse(res, 200, 'Password changed successfully');
});

import { User } from './user-model';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/catch-async';
import { sendResponse } from '../utils/response';
import AppError from '../utils/app-error';

export const getUserById = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    sendResponse(res, 200, 'User found', { user });
});

export const updateUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { name, email, status, role } = req.body;
    const updatedData = { name, email, status, role };

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    Object.assign(user, updatedData);
    await user.save();

    sendResponse(res, 200, 'User updated successfully', { user });
});

export const deleteUser = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    await user.destroy();

    sendResponse(res, 204, 'User deleted successfully');
});

export const listUsers = errorHandler(async (_, res: Response) => {
    const users = await User.findAll();

    sendResponse(res, 200, 'List of users', { users });
});

export const resetPassword = errorHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        throw new AppError('Passwords do not match', 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.dataValues.password = hashPassword;
    await user.save();

    sendResponse(res, 200, 'Password reset successfully');
});

export const changeUserPassword = errorHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new AppError('User not found', 404);
    }

    const { currentPassword, newPassword, confirmPassword } = req.body;

    const validPassword = await bcrypt.compare(currentPassword, user.dataValues.password);

    if (!validPassword) {
        throw new AppError('Current password is incorrect', 400);
    }

    if (newPassword !== confirmPassword) {
        throw new AppError('New passwords do not match', 400);
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.dataValues.password = hashPassword;
    await user.save();

    sendResponse(res, 200, 'Password changed successfully');
});

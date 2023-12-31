import { DataTypes } from 'sequelize';
import vendorDB from '../db.config';

export const Vendor = vendorDB.define('Vendor', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
});

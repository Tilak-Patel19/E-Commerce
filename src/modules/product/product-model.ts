import { DataTypes } from 'sequelize';
import userDB from '../auth/db.config';

export const Product = userDB.define('Product', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    description: { type: DataTypes.STRING },
    amount: { type: DataTypes.NUMBER },
    quantity: { type: DataTypes.NUMBER },
    status: { type: DataTypes.STRING },
});

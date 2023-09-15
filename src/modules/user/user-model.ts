import { DataTypes } from 'sequelize';
import userDB from '../db.config';

const User = userDB.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    status: { type: DataTypes.STRING },
});
export default User;

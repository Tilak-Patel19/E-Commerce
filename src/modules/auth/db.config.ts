import { Sequelize } from 'sequelize';
export default new Sequelize('E-Commerce', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql',
});

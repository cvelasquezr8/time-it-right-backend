import { Sequelize } from 'sequelize';
import { envs } from '@/config/envs';

export const sequelize: Sequelize = new Sequelize({
	database: envs.database.name,
	username: envs.database.username,
	password: envs.database.password,
	host: envs.database.host,
	port: envs.database.port,
	dialect: 'postgres',
	logging: false,
});

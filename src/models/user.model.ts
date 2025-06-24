import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/data/sequelize.database';

export class User extends Model {
	public id!: string;
	public userName!: string;
	public email!: string;
	public password!: string;
}

User.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userName: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'users',
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'updated',
		deletedAt: 'deleted',
		paranoid: true,
	},
);

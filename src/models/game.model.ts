import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/data/sequelize.database';

export class Game extends Model {
	public id!: string;
	public userId!: string;
	public startTime!: number;
	public stopTime!: number | null;
	public deviation!: number | null;
	public isSuccess!: boolean | null;
	public expiresAt!: Date;
}

Game.init(
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: 'users',
				key: 'id',
			},
			onDelete: 'CASCADE',
		},
		startTime: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		stopTime: {
			type: DataTypes.BIGINT,
			allowNull: true,
		},
		deviation: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		isSuccess: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		expiresAt: {
			type: DataTypes.DATE,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Game',
		tableName: 'games',
		timestamps: true,
		createdAt: 'created',
		updatedAt: 'updated',
		deletedAt: 'deleted',
		paranoid: true,
	},
);

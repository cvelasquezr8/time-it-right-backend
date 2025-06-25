import { CustomError, createLogger } from '@/config';
import { User, Game } from '@/models';

interface IGame {
	id: string;
	expiredAt: Date;
}

const logger = createLogger('services/game');

export class GameService {
	getUserByID(id: string): Promise<User | null> {
		return User.findByPk(id);
	}

	getGameSessionByID(id: string): Promise<Game | null> {
		return Game.findByPk(id);
	}

	async createGame(userId: string): Promise<[string?, IGame?]> {
		try {
			const user = await this.getUserByID(userId);
			if (!user)
				throw CustomError.notFound('User not found with id ' + userId);

			const startTime = Date.now();
			const expiredAt = new Date(startTime + 30 * 60 * 1000);

			const game = await Game.create({
				userId,
				startTime,
				expiresAt: expiredAt,
			});

			logger.info(`Game session created successfully for user ${userId}`);
			return [
				undefined,
				{
					id: game.id,
					expiredAt: game.expiresAt,
				},
			];
		} catch (error) {
			const errorMessage =
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [createGame]';

			logger.error(`Error in [createGame]: ${errorMessage}`);
			return [errorMessage];
		}
	}

	async stopGame(userId: string, gameId: string): Promise<[string?, any?]> {
		try {
			const user = await this.getUserByID(userId);
			if (!user)
				throw CustomError.notFound('User not found with id ' + userId);

			const game = await this.getGameSessionByID(gameId);
			if (!game)
				throw CustomError.notFound(
					'Game session not found with id ' + gameId,
				);

			if (game.userId !== userId)
				throw CustomError.forbidden(
					'You do not have permission to stop this game',
				);

			const now = new Date();
			if (game.expiresAt < now)
				throw CustomError.badRequest('The game session has expired');

			if (game.stopTime)
				throw CustomError.badRequest(
					'The game has already been stopped',
				);

			const stopTime = Date.now();
			const deviation = Math.abs(stopTime - game.startTime - 10000);
			const isSuccess = deviation <= 500;

			game.stopTime = stopTime;
			game.deviation = deviation;
			game.isSuccess = isSuccess;
			await game.save();

			const gameUpdated = await this.getGameSessionByID(gameId);

			logger.info(
				`Game session stopped successfully for user ${userId} with game ID ${gameId}`,
			);
			return [undefined, gameUpdated];
		} catch (error) {
			const errorMessage =
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [stopGame]';

			logger.error(`Error in [stopGame]: ${errorMessage}`);
			return [errorMessage];
		}
	}
}

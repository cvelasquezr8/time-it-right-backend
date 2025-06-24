import { Request, Response } from 'express';
import { GameService } from '@/services';
import { CustomError, GeneralFunctions, createLogger } from '@/config';

const logger = createLogger('controllers/game');
export class GameController {
	constructor(private readonly gameService: GameService) {}

	startGame = async (req: Request, res: Response): Promise<any> => {
		try {
			const userId = (req as any).user?.id;
			if (GeneralFunctions.isEmpty(userId))
				throw CustomError.badRequest('User ID is required');

			const [errorService, game] = await this.gameService.createGame(
				userId,
			);

			if (errorService) throw CustomError.badRequest(errorService);
			if (!game) throw CustomError.notFound('Game session not created');

			return res.status(201).json({
				message: 'Game started successfully',
				game,
			});
		} catch (error) {
			const isCustom = error instanceof CustomError;
			const statusCode = isCustom ? error.statusCode : 500;
			const errorMessage = isCustom
				? error.message
				: 'Internal Server Error';

			logger.error(`Error in [startGame]: ${errorMessage}`);
			return res.status(statusCode).json({ message: errorMessage });
		}
	};

	stopGame = async (req: Request, res: Response): Promise<any> => {
		try {
			const userId = (req as any).user?.id;
			if (GeneralFunctions.isEmpty(userId))
				throw CustomError.badRequest('User ID is required');

			const { gameId } = req.params;
			if (GeneralFunctions.isEmpty(gameId))
				throw CustomError.badRequest('Game ID is required');

			const [errorService] = await this.gameService.stopGame(
				userId,
				gameId,
			);

			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(200).json({
				message: 'Game stopped successfully',
			});
		} catch (error) {
			const isCustom = error instanceof CustomError;
			const statusCode = isCustom ? error.statusCode : 500;
			const errorMessage = isCustom
				? error.message
				: 'Internal Server Error';

			logger.error(`Error in [startGame]: ${errorMessage}`);
			return res.status(statusCode).json({ message: errorMessage });
		}
	};
}

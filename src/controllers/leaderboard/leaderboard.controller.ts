import { Request, Response } from 'express';
import { LeaderboardService } from '@/services';
import { CustomError, createLogger } from '@/config';

const logger = createLogger('controllers/leaderboard');

export class LeaderboardController {
	constructor(private readonly leaderboardService: LeaderboardService) {}

	getLeaderboard = async (_: Request, res: Response): Promise<any> => {
		try {
			const [errorService, leaderboard] =
				await this.leaderboardService.getLeaderboard();

			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(200).json({
				message: 'Leaderboard retrieved successfully',
				leaderboard,
			});
		} catch (error) {
			const isCustom = error instanceof CustomError;
			const statusCode = isCustom ? error.statusCode : 500;
			const errorMessage = isCustom
				? error.message
				: 'Internal Server Error';

			logger.error(`Error in [getLeaderboard]: ${errorMessage}`);
			return res.status(statusCode).json({ message: errorMessage });
		}
	};
}

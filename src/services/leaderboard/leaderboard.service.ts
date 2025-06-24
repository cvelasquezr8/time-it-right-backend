import { CustomError, createLogger } from '@/config';
import { sequelize } from '@/data/sequelize.database';
import { LeaderboardMapper } from '@/mappers/leaderboard/leaderboard.mapper';

const logger = createLogger('services/leaderboard');

export class LeaderboardService {
	async getLeaderboard(): Promise<[string?, LeaderboardMapper[]?]> {
		try {
			const [leaderboard] = await sequelize.query(`
			  SELECT
			  	g."userId",
			  	u."userName",
			  	COUNT(*) AS "totalGames",
			  	ROUND(AVG(g."deviation")) AS "averageDeviation",
			  	MIN(g."deviation") AS "bestDeviation"
			  FROM games g
			  JOIN users u ON g."userId" = u."id"
			  WHERE g."deviation" IS NOT NULL
			  GROUP BY g."userId", u."userName"
			  ORDER BY "averageDeviation" ASC
			  LIMIT 10;
		  `);

			const parsed = LeaderboardMapper.fromArray(leaderboard);
			return [undefined, parsed];
		} catch (error) {
			const errorMessage =
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [getLeaderboard]';

			logger.error(`Error in [getLeaderboard]: ${errorMessage}`);
			return [errorMessage];
		}
	}
}

jest.mock('@/data/sequelize.database', () => ({
	sequelize: {
		query: jest.fn(),
	},
}));

jest.mock('@/mappers/leaderboard/leaderboard.mapper', () => ({
	LeaderboardMapper: {
		fromArray: jest
			.fn()
			.mockImplementation((data) => data.map((item: any) => item)),
	},
}));

jest.mock('@/config/logger', () => ({
	createLogger: () => ({
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
		debug: jest.fn(),
	}),
}));

import { LeaderboardService } from '@/services/leaderboard/leaderboard.service';
import { sequelize } from '@/data/sequelize.database';
import { LeaderboardMapper } from '@/mappers/leaderboard/leaderboard.mapper';

describe('LeaderboardService', () => {
	const service = new LeaderboardService();

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return the parsed leaderboard data', async () => {
		const rawData = [
			{
				userId: 'user-1',
				userName: 'Carlos',
				totalGames: 5,
				averageDeviation: 123,
				bestDeviation: 5,
			},
		];

		(sequelize.query as jest.Mock).mockResolvedValue([rawData]);

		const [error, result] = await service.getLeaderboard();

		expect(error).toBeUndefined();
		expect(result).toEqual(rawData);
		expect(sequelize.query).toHaveBeenCalledTimes(1);
		expect(LeaderboardMapper.fromArray).toHaveBeenCalledWith(rawData);
	});

	it('should return an error if query fails', async () => {
		(sequelize.query as jest.Mock).mockRejectedValue(new Error('DB Error'));

		const [error, result] = await service.getLeaderboard();

		expect(error).toBe('Unexpected error occurred in [getLeaderboard]');
		expect(result).toBeUndefined();
		expect(LeaderboardMapper.fromArray).not.toHaveBeenCalled();
	});
});

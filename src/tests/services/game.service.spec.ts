import { GameService } from '@/services';
import { User, Game } from '@/models';

jest.mock('@/models', () => ({
	User: { findByPk: jest.fn() },
	Game: {
		findByPk: jest.fn(),
		create: jest.fn(),
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

describe('GameService', () => {
	const gameService = new GameService();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('createGame', () => {
		it('should create a game successfully', async () => {
			const userId = 'user-123';
			const gameMock = {
				id: 'game-456',
				expiresAt: new Date(),
			};

			(User.findByPk as jest.Mock).mockResolvedValue({ id: userId });
			(Game.create as jest.Mock).mockResolvedValue(gameMock);

			const [error, result] = await gameService.createGame(userId);

			expect(error).toBeUndefined();
			expect(result).toEqual({
				id: gameMock.id,
				expiredAt: gameMock.expiresAt,
			});
		});

		it('should return error if user not found', async () => {
			(User.findByPk as jest.Mock).mockResolvedValue(null);

			const [error] = await gameService.createGame('invalid-user');

			expect(error).toBe('User not found with id invalid-user');
		});
	});

	describe('stopGame', () => {
		it('should stop a game successfully', async () => {
			const userId = 'user-123';
			const gameId = 'game-456';
			const gameMock: any = {
				id: gameId,
				userId,
				startTime: Date.now() - 10000,
				expiresAt: new Date(Date.now() + 10000),
				stopTime: null,
				save: jest.fn(),
			};

			(User.findByPk as jest.Mock).mockResolvedValue({ id: userId });
			(Game.findByPk as jest.Mock).mockResolvedValue(gameMock);

			const [error] = await gameService.stopGame(userId, gameId);

			expect(error).toBeUndefined();
			expect(gameMock.save).toHaveBeenCalled();
			expect(typeof gameMock.deviation).toBe('number');
			expect(typeof gameMock.isSuccess).toBe('boolean');
		});

		it('should return error if game not found', async () => {
			(User.findByPk as jest.Mock).mockResolvedValue({ id: 'user-123' });
			(Game.findByPk as jest.Mock).mockResolvedValue(null);

			const [error] = await gameService.stopGame('user-123', 'not-found');

			expect(error).toBe('Game session not found with id not-found');
		});

		it('should return error if user is not owner of the game', async () => {
			const gameMock = { userId: 'another-user' };
			(User.findByPk as jest.Mock).mockResolvedValue({ id: 'user-123' });
			(Game.findByPk as jest.Mock).mockResolvedValue(gameMock);

			const [error] = await gameService.stopGame('user-123', 'game-456');

			expect(error).toBe('You do not have permission to stop this game');
		});
	});
});

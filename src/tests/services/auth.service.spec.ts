import { AuthService } from '@/services';
import { User } from '@/models';
import { BcryptAdapter, JwtAdapter } from '@/config';
import { UserMapper } from '@/mappers/auth/user.mapper';

jest.mock('@/models', () => ({
	User: { findOne: jest.fn(), create: jest.fn() },
}));

jest.mock('@/config/bcrypt', () => ({
	BcryptAdapter: {
		hash: jest.fn(),
		compare: jest.fn(),
	},
}));

jest.mock('@/config/jwt', () => ({
	JwtAdapter: {
		generateToken: jest.fn(),
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

jest.mock('@/mappers/auth/user.mapper', () => ({
	UserMapper: {
		fromObject: jest.fn().mockImplementation((user) => ({
			id: user.id,
			userName: user.userName,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})),
	},
}));

describe('AuthService', () => {
	const authService = new AuthService();

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('registerUser', () => {
		it('should register a new user successfully', async () => {
			const dto = {
				userName: 'test',
				email: 'test@example.com',
				password: '123456',
			};
			const createdUser = {
				...dto,
				id: 'uuid',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			(User.findOne as jest.Mock).mockResolvedValue(null);
			(BcryptAdapter.hash as jest.Mock).mockResolvedValue(
				'hashedPassword',
			);
			(User.create as jest.Mock).mockResolvedValue(createdUser);

			const [error, result] = await authService.registerUser(dto);

			expect(error).toBeUndefined();
			expect(result).toEqual(
				expect.objectContaining({ id: 'uuid', email: dto.email }),
			);
		});

		it('should return error if user already exists', async () => {
			(User.findOne as jest.Mock).mockResolvedValue({});

			const [error] = await authService.registerUser({
				userName: 'existing',
				email: 'existing@example.com',
				password: '123456',
			});

			expect(error).toBe('This email or username is already in use.');
		});
	});

	describe('loginUser', () => {
		it('should login user successfully', async () => {
			const dto = { email: 'test@example.com', password: '123456' };
			const mockUser = {
				id: 'uuid',
				userName: 'test',
				email: 'test@example.com',
				password: 'hashed',
				createdAt: new Date(),
				updatedAt: new Date(),
			};

			(User.findOne as jest.Mock).mockResolvedValue(mockUser);
			(BcryptAdapter.compare as jest.Mock).mockResolvedValue(true);
			(JwtAdapter.generateToken as jest.Mock).mockResolvedValue(
				'mockToken',
			);

			const [error, result] = await authService.loginUser(dto);

			expect(error).toBeUndefined();
			expect(result).toEqual(
				expect.objectContaining({
					token: 'mockToken',
					email: mockUser.email,
				}),
			);
		});

		it('should return error for invalid credentials', async () => {
			(User.findOne as jest.Mock).mockResolvedValue(null);

			const [error] = await authService.loginUser({
				email: 'bad@example.com',
				password: 'wrong',
			});

			expect(error).toBe('Invalid credentials');
		});

		it('should return error for invalid password', async () => {
			const mockUser = {
				id: 'uuid',
				userName: 'test',
				email: 'test@example.com',
				password: 'hashed',
			};

			(User.findOne as jest.Mock).mockResolvedValue(mockUser);
			(BcryptAdapter.compare as jest.Mock).mockResolvedValue(false);

			const [error] = await authService.loginUser({
				email: 'test@example.com',
				password: 'bad',
			});

			expect(error).toBe('Invalid credentials');
		});
	});
});

import { BcryptAdapter, CustomError, JwtAdapter, createLogger } from '@/config';
import { LoginUserDto, RegisterUserDto } from '@/dtos';
import { UserMapper } from '@/mappers';
import { User } from '@/models';
import { Op } from 'sequelize';

type LoginResponse = UserMapper & { token: string };
type HashFunction = (password: string) => string;
type ComparePassword = (password: string, hashed: string) => boolean;
type SignToken = (payload: Object, duration?: string) => Promise<string | null>;

const logger = createLogger('services/auth');

export class AuthService {
	constructor(
		private readonly hashFunction: HashFunction = BcryptAdapter.hash,
		private readonly comparePassword: ComparePassword = BcryptAdapter.compare,
		private readonly signToken: SignToken = JwtAdapter.generateToken,
	) {}

	findUserByEmailOrUserName(value: string): Promise<User | null> {
		return User.findOne({
			where: {
				[Op.or]: [{ email: value }, { userName: value }],
			},
		});
	}

	async registerUser(
		registerUserDto: RegisterUserDto,
	): Promise<[string?, LoginResponse?]> {
		try {
			const { userName, email, password } = registerUserDto;
			const userFound = await this.findUserByEmailOrUserName(email);
			if (userFound)
				throw CustomError.badRequest(
					'This email or username is already in use.',
				);

			const hashedPassword = await this.hashFunction(password);
			const user = await User.create({
				userName,
				email,
				password: hashedPassword,
			});

			const token = await this.signToken({ id: user.id });
			const userResponse = UserMapper.fromObject(user);

			logger.info(`User registered successfully: ${user.email}`);
			return [
				undefined,
				{
					...userResponse,
					token: token || '',
				},
			];
		} catch (error) {
			const errorMessage =
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [registerUser]';

			logger.error(`Error in [registerUser]: ${errorMessage}`);
			return [errorMessage];
		}
	}

	async loginUser(
		loginUserDto: LoginUserDto,
	): Promise<[string?, LoginResponse?]> {
		try {
			const { userName, password } = loginUserDto;
			const userFound = await this.findUserByEmailOrUserName(userName);
			if (!userFound) throw CustomError.badRequest('Invalid credentials');

			const isPasswordValid = await this.comparePassword(
				password,
				userFound.password,
			);

			if (!isPasswordValid)
				throw CustomError.badRequest('Invalid credentials');

			const token = await this.signToken({ id: userFound.id });
			const userResponse = UserMapper.fromObject(userFound);

			logger.info(`User logged in successfully: ${userFound.email}`);
			return [
				undefined,
				{
					...userResponse,
					token: token || '',
				},
			];
		} catch (error) {
			const errorMessage =
				error instanceof CustomError
					? error.message
					: 'Unexpected error occurred in [loginUser]';

			logger.error(`Error in [loginUser]: ${errorMessage}`);
			return [errorMessage];
		}
	}
}

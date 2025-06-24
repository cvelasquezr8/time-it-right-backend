import { Request, Response } from 'express';
import { RegisterUserDto, LoginUserDto } from '@/dtos';
import { CustomError, createLogger } from '@/config';
import { AuthService } from '@/services';
import { UserMapper } from '@/mappers';

type LoginResponse = UserMapper & { token: string };
const logger = createLogger('controllers/auth');

export class AuthController {
	constructor(private readonly authService: AuthService) {}

	registerUser = async (
		req: Request,
		res: Response,
	): Promise<UserMapper | any> => {
		try {
			const [errorDto, userDto] = RegisterUserDto.create(req.body);
			if (errorDto) throw CustomError.badRequest(errorDto);

			const [errorService, userCreated] =
				await this.authService.registerUser(userDto!);

			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(201).json({
				message: 'User registered successfully',
				user: userCreated,
			});
		} catch (error) {
			const isCustom = error instanceof CustomError;
			const statusCode = isCustom ? error.statusCode : 500;
			const errorMessage = isCustom
				? error.message
				: 'Internal Server Error';

			logger.error(`Error in [registerUser]: ${errorMessage}`);
			return res.status(statusCode).json({ message: errorMessage });
		}
	};

	loginUser = async (
		req: Request,
		res: Response,
	): Promise<LoginResponse | any> => {
		try {
			const [errorDto, userDto] = LoginUserDto.create(req.body);
			if (errorDto) throw CustomError.badRequest(errorDto);

			const [errorService, userLogin] = await this.authService.loginUser(
				userDto!,
			);
			if (errorService) throw CustomError.badRequest(errorService);

			return res.status(200).json({
				message: 'User logged in successfully',
				user: userLogin,
			});
		} catch (error) {
			const isCustom = error instanceof CustomError;
			const statusCode = isCustom ? error.statusCode : 500;
			const errorMessage = isCustom
				? error.message
				: 'Internal Server Error';

			logger.error(`Error in [loginUser]: ${errorMessage}`);
			return res.status(statusCode).json({ message: errorMessage });
		}
	};
}

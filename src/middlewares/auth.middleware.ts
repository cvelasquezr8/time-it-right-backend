import { Request, Response, NextFunction } from 'express';
import { JwtAdapter, CustomError, createLogger } from '@/config';

const logger = createLogger('middlewares/auth');

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<any> => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		throw CustomError.unauthorized('Token missing or invalid');
	}

	const token = authHeader.split(' ')[1];

	try {
		const payload = await JwtAdapter.validateToken(token);
		if (!payload) throw CustomError.unauthorized('Invalid token');

		(req as any).user = payload;

		next();
	} catch (error) {
		const errorMessage =
			error instanceof CustomError
				? error.message
				: 'Unauthorized access';

		logger.error(`Error in [authMiddleware]: ${errorMessage}`);
		if (error instanceof CustomError) {
			return res.status(error.statusCode).json({ message: errorMessage });
		}
		return res.status(401).json({ message: errorMessage });
	}
};

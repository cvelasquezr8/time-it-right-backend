import jwt from 'jsonwebtoken';
import { envs } from '.';

export class JwtAdapter {
	static async generateToken(
		payload: Object,
		duration: string = '2h',
	): Promise<string | null> {
		return new Promise((resolve) => {
			jwt.sign(
				payload,
				envs.jwtSecret,
				{ expiresIn: duration as jwt.SignOptions['expiresIn'] },
				(err, token) => {
					if (err) return resolve(null);
					resolve(token!);
				},
			);
		});
	}

	static validateToken<T>(token: string): Promise<T | null> {
		return new Promise((resolve) => {
			jwt.verify(token, envs.jwtSecret, (err, decoded) => {
				if (err) return resolve(null);
				resolve(decoded as T);
			});
		});
	}

	static decodeToken<T = any>(token: string): T | null {
		try {
			const decoded = jwt.decode(token) as T;
			return decoded;
		} catch (error) {
			return null;
		}
	}
}

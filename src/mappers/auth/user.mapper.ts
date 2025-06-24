import { CustomError } from '@/config';

export class UserMapper {
	private constructor(
		public id: string,
		public userName: string,
		public email: string,
		public createdAt: Date,
		public updatedAt: Date,
	) {}

	static fromObject(object: { [key: string]: any }): UserMapper {
		const { id, userName, password, email, createdAt, updatedAt } = object;
		if (!id) throw CustomError.badRequest('User ID is required');
		if (!userName) throw CustomError.badRequest('User Name is required');
		if (!email) throw CustomError.badRequest('Email is required');
		if (!password) throw CustomError.badRequest('Password is required');
		return new UserMapper(id, userName, email, createdAt, updatedAt);
	}
}

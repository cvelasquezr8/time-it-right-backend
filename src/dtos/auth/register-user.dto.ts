import { Validators } from '@/config';

export class RegisterUserDto {
	private constructor(
		public userName: string,
		public email: string,
		public password: string,
	) {}

	static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
		const { userName, email, password } = object;
		if (!userName) return ['User Name is required'];
		if (!email) return ['Email is required'];
		if (!password) return ['Password is required'];
		if (!Validators.email.test(email)) return ['Email is invalid'];
		return [undefined, new RegisterUserDto(userName, email, password)];
	}
}

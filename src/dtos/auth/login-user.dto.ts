import { Validators } from '@/config';

export class LoginUserDto {
	private constructor(public userName: string, public password: string) {}

	static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
		const { userName, password } = object;
		if (!userName) return ['User Name is required'];
		if (!password) return ['Password is required'];
		return [undefined, new LoginUserDto(userName, password)];
	}
}

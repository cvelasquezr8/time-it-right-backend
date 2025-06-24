import { compareSync, hashSync } from 'bcryptjs';

export class BcryptAdapter {
	static hash(password: string): string {
		return hashSync(password, 10);
	}

	static compare(password: string, hashed: string): boolean {
		return compareSync(password, hashed);
	}
}

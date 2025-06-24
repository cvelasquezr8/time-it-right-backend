import { CustomError } from '@/config';

export class LeaderboardMapper {
	private constructor(
		public userId: string,
		public userName: string,
		public totalGames: number,
		public averageDeviation: number,
		public bestDeviation: number,
	) {}

	static fromObject(obj: { [key: string]: any }): LeaderboardMapper {
		const {
			userId,
			userName,
			totalGames,
			averageDeviation,
			bestDeviation,
		} = obj;

		if (!userId) throw CustomError.badRequest('userId is required');
		if (!userName) throw CustomError.badRequest('userName is required');
		if (totalGames === undefined)
			throw CustomError.badRequest('totalGames is required');
		if (averageDeviation === undefined)
			throw CustomError.badRequest('averageDeviation is required');
		if (bestDeviation === undefined)
			throw CustomError.badRequest('bestDeviation is required');

		return new LeaderboardMapper(
			userId,
			userName,
			Number(totalGames),
			Number(averageDeviation),
			Number(bestDeviation),
		);
	}

	static fromArray(array: any[]): LeaderboardMapper[] {
		return array.map(this.fromObject);
	}
}

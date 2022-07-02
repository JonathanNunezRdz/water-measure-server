import { IsInt } from 'class-validator';

export class GetCisternDto {
	@IsInt()
	id: number;
}

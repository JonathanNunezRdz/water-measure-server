import { IsInt, IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class SensorDistanceDto {
	@IsNumber({}, { each: true })
	@IsNotEmpty()
	distances: number[];

	@IsInt()
	@IsNotEmpty()
	id: number;

	@IsISO8601()
	@IsNotEmpty()
	date: string;

	@IsInt()
	@IsNotEmpty()
	cisternId: number;
}

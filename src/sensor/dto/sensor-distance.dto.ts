import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class SensorDistanceDto {
	@IsNumber({}, { each: true })
	@IsNotEmpty()
	distances: number[];

	@IsInt()
	@IsNotEmpty()
	id: number;

	@Type(() => Date)
	@IsDate()
	@IsNotEmpty()
	date: Date;

	@IsInt()
	@IsNotEmpty()
	cisternId: number;
}

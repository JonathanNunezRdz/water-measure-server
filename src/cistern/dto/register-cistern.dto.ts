import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RegisterCisternDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	length: number;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	width: number;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	maxWaterHeight: number;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	minWaterHeight: number;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	waterLevelThreshold: number;

	@IsNumber()
	@Min(0)
	@IsNotEmpty()
	sensorHeight: number;

	@IsNumber()
	@IsNotEmpty()
	sensorOffset: number;
}

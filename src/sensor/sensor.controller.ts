import { Body, Controller, Post } from '@nestjs/common';
import { SensorDistanceDto } from './dto';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
	constructor(private sensorService: SensorService) {}

	@Post('distance')
	registerDistance(@Body() dto: SensorDistanceDto) {
		return this.sensorService.registerDistance(dto);
	}

	@Post('test')
	test(@Body() dto: SensorDistanceDto) {
		return this.sensorService.test(dto);
	}
}

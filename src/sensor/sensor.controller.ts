import { Controller, Get } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
	constructor(private sensorService: SensorService) {}

	@Get('/test')
	getTest() {
		return 'I got you';
	}
}

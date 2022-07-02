import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CisternService } from './cistern.service';
import { RegisterCisternDto } from './dto';

@Controller('cistern')
export class CisternController {
	constructor(private cisternService: CisternService) {}

	@Get('all')
	getAllCisterns() {
		return this.cisternService.getAllCisterns();
	}

	@Get(':id')
	getCistern(@Param('id') id: number) {
		return this.cisternService.getCistern(id);
	}

	@Post('register')
	registerCistern(@Body() dto: RegisterCisternDto) {
		return this.cisternService.registerCistern(dto);
	}
}

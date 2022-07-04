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

	@Get(':name')
	getCistern(@Param('name') name: string) {
		return this.cisternService.getCistern(name);
	}

	@Post('register')
	registerCistern(@Body() dto: RegisterCisternDto) {
		return this.cisternService.registerCistern(dto);
	}
}

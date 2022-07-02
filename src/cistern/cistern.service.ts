import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterCisternDto } from './dto';

@Injectable()
export class CisternService {
	constructor(private prisma: PrismaService) {}

	async getAllCisterns() {
		return this.prisma.cistern.findMany({
			select: {
				id: true,
				name: true,
			},
		});
	}

	async getCistern(id: number) {
		return this.prisma.cistern.findUnique({
			where: {
				id,
			},
			include: {
				waterLevel: {
					take: 10,
				},
			},
		});
	}

	async registerCistern(dto: RegisterCisternDto) {
		const cistern = await this.prisma.cistern.create({
			data: {
				name: dto.name,
				length: dto.length,
				width: dto.width,
				maxWaterHeight: dto.maxWaterHeight,
				minWaterHeight: dto.minWaterHeight,
				waterLevelThreshold: dto.waterLevelThreshold,
				sensor: {
					create: {
						height: dto.sensorHeight,
						offset: dto.sensorOffset,
					},
				},
			},
			include: {
				sensor: true,
			},
		});

		return cistern;
	}
}

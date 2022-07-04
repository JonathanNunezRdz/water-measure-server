import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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

	async getCistern(name: string) {
		return this.prisma.cistern.findUnique({
			where: {
				name,
			},
			include: {
				sensor: true,
				waterLevel: {
					take: 10,
				},
			},
		});
	}

	async registerCistern(dto: RegisterCisternDto) {
		try {
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
					waterLevel: {
						take: 10,
					},
				},
			});

			return cistern;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						`Name: "${dto.name}" is already registered`
					);
				}
			}
		}
	}
}

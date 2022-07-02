import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorDistanceDto } from './dto';

@Injectable()
export class SensorService {
	constructor(private prisma: PrismaService) {}

	async registerDistance(dto: SensorDistanceDto) {
		const { distances } = dto;

		const sensor = await this.prisma.sensor.findUnique({
			where: {
				id_cisternId: {
					id: dto.id,
					cisternId: dto.cisternId,
				},
			},
			select: {
				height: true,
				offset: true,
			},
		});

		const distance =
			distances.reduce((prev, curr) => prev + curr) / distances.length +
			sensor.offset;

		await this.prisma.distance.create({
			data: {
				distance: distance,
				createdAt: dto.date,
				sensor: {
					connect: {
						id_cisternId: {
							cisternId: dto.cisternId,
							id: dto.id,
						},
					},
				},
			},
		});

		const waterHeight = sensor.height - distance;

		await this.prisma.waterLevel.create({
			data: {
				level: waterHeight,
				cistern: {
					connect: {
						id: dto.cisternId,
					},
				},
			},
		});
	}
}

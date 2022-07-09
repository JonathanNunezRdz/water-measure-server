import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorDistanceDto } from './dto';

@Injectable()
export class SensorService {
	constructor(private prisma: PrismaService) {}

	async registerDistance(dto: SensorDistanceDto) {
		const { distances, id, cisternId } = dto;

		const sensor = await this.prisma.sensor.findUnique({
			where: {
				id_cisternId: {
					id,
					cisternId,
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

		const waterHeight = sensor.height - distance;

		await this.prisma.$transaction([
			this.prisma.distance.create({
				data: {
					distance: distance,
					createdAt: dto.date,
					sensor: {
						connect: {
							id_cisternId: {
								cisternId,
								id,
							},
						},
					},
				},
			}),
			this.prisma.waterLevel.create({
				data: {
					level: waterHeight,
					cistern: {
						connect: {
							id: cisternId,
						},
					},
				},
			}),
		]);
	}

	test(dto: SensorDistanceDto) {
		console.log({ dto });
	}
}

import { Injectable } from '@nestjs/common';
import { createObjectCsvWriter } from 'csv-writer';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorCalibrateDto, SensorDistanceDto } from './dto';

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
				intercept: true,
				coefficient: true,
			},
		});

		const rawDistance =
			distances.reduce((prev, curr) => prev + curr) / distances.length;
		const distance = rawDistance * sensor.coefficient + sensor.intercept;

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

	async calibrate(dto: SensorCalibrateDto) {
		dto.calibrationData.forEach((val) => console.log(val));
		const file = join(__dirname, 'calibration', `sensor_${dto.id}.csv`);
		console.log({ file });

		if (existsSync(file)) {
			console.log('doesnt exist');
			unlinkSync(file);
		}

		writeFileSync(file, '');
		const writer = createObjectCsvWriter({
			path: file,
			header: [{ id: 'distance', title: 'distance' }],
		});
		const data = dto.calibrationData.map((distance) => ({
			distance,
		}));
		await writer.writeRecords(data);
	}
}

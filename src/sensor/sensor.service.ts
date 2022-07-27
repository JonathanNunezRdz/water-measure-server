import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { createObjectCsvWriter } from 'csv-writer';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorCalibrateDto, SensorDistanceDto, SensorScript } from './dto';

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

	async test(dto: SensorDistanceDto) {
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

		console.log({ distance, rawDistance });

		// const waterHeight = sensor.height - distance;

		// await this.prisma.$transaction([
		// 	this.prisma.distance.create({
		// 		data: {
		// 			distance: distance,
		// 			createdAt: dto.date,
		// 			sensor: {
		// 				connect: {
		// 					id_cisternId: {
		// 						cisternId,
		// 						id,
		// 					},
		// 				},
		// 			},
		// 		},
		// 	}),
		// 	this.prisma.waterLevel.create({
		// 		data: {
		// 			level: waterHeight,
		// 			cistern: {
		// 				connect: {
		// 					id: cisternId,
		// 				},
		// 			},
		// 		},
		// 	}),
		// ]);
	}

	async calibrate(dto: SensorCalibrateDto) {
		const file = join(__dirname, 'calibration', `sensor_${dto.id}.csv`);

		if (existsSync(file)) {
			try {
				unlinkSync(file);
			} catch (error) {
				Logger.error(`Unlink file error: ${error}`, 'SENSOR');
			}
		}

		try {
			writeFileSync(file, '');
		} catch (error) {
			Logger.error(`Write file error: ${error}`, 'SENSOR');
		}

		const writer = createObjectCsvWriter({
			path: file,
			header: [
				{ id: 'realDistance', title: 'real distance' },
				{ id: 'supposedDistance', title: 'supposed distance' },
			],
		});
		const data: { realDistance: number; supposedDistance: number }[] = [];
		for (let i = 0; i < dto.calibrationData.length; i++) {
			data.push({
				realDistance: dto.calibrationData[i],
				supposedDistance: dto.supposedDistance[i],
			});
		}
		await writer.writeRecords(data);

		const getRegression = () =>
			new Promise<SensorScript>((resolve, reject) => {
				const regression: SensorScript = {} as SensorScript;
				const calibrationScript = join(
					__dirname,
					'calibration',
					'get_regression.py'
				);
				const pythonProcess = spawn('py', [
					calibrationScript,
					'-f',
					file,
				]);

				pythonProcess.stdout.on('data', (data) => {
					const info: { coef: number; intercept: number } =
						JSON.parse(data.toString().trim());
					regression.coef = info.coef;
					regression.intercept = info.intercept;
				});

				pythonProcess.stderr.on('data', (data) => {
					Logger.error(`Python error: ${data.toString()}`, 'SENSOR');
				});

				pythonProcess.on('close', (code) => {
					if (code === 0) resolve(regression);
					else reject('Python script error');
				});
			});

		const res = await getRegression();

		await this.prisma.sensor.update({
			where: {
				id_cisternId: {
					id: dto.id,
					cisternId: dto.cisternId,
				},
			},
			data: {
				coefficient: res.coef,
				intercept: res.intercept,
			},
		});
	}
}

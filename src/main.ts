import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// const allowedOrigins = ['http://localhost:3000', '192.168.0.103'];

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		})
	);

	// app.enableCors({
	// 	origin: (requestOrigin, callback) => {
	// 		if (!requestOrigin) return callback;
	// 		if (allowedOrigins.indexOf(requestOrigin) === -1)
	// 			return callback(
	// 				new Error(
	// 					'The CORS policy for this site does not allow access from the specified Origin.'
	// 				),
	// 				false
	// 			);
	// 		return callback(null, true);
	// 	},
	// });
	app.enableCors();

	const globalPrefix = 'api/v1';
	app.setGlobalPrefix(globalPrefix);

	const port = process.env.PORT || 4001;
	await app.listen(port);
	Logger.log(
		`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
	);
}
bootstrap();

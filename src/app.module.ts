import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CisternModule } from './cistern/cistern.module';
import { AppLoggerMiddleware } from './middleware/app-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		SensorModule,
		PrismaModule,
		CisternModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}

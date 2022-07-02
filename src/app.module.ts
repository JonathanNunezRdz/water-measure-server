import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppLoggerMiddleware } from './middleware/app-logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { SensorModule } from './sensor/sensor.module';
import { CisternModule } from './cistern/cistern.module';

@Module({
	imports: [SensorModule, PrismaModule, CisternModule],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(AppLoggerMiddleware).forRoutes('*');
	}
}

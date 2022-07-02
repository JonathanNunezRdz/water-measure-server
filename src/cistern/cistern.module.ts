import { Module } from '@nestjs/common';
import { CisternController } from './cistern.controller';
import { CisternService } from './cistern.service';

@Module({
  controllers: [CisternController],
  providers: [CisternService]
})
export class CisternModule {}

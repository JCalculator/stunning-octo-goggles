import { Module } from '@nestjs/common';
import { RequestLogService } from './request_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './entities/request_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  controllers: [],
  providers: [RequestLogService],
})
export class RequestLogModule {}

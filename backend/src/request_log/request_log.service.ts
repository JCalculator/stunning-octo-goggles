import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestLogDto } from './dto/create-request_log.dto';
import { RequestLog } from './entities/request_log.entity';

@Injectable()
export class RequestLogService {
  constructor(
    @InjectRepository(RequestLog)
    private readonly repository: Repository<RequestLog>,
  ) {}

  create(createRequestLogDto: CreateRequestLogDto) {
    const requestLog = new RequestLog();
    requestLog.method = createRequestLogDto.method;
    requestLog.url = createRequestLogDto.url;
    requestLog.data = createRequestLogDto.data;
    requestLog.type = createRequestLogDto.type;
    requestLog.status = createRequestLogDto.status;
    return this.repository.save(requestLog);
  }
}

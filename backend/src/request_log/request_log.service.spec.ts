import { Test, TestingModule } from '@nestjs/testing';
import { CreateRequestLogDto } from './dto/create-request_log.dto';
import { RequestLogService } from './request_log.service';
import { RequestLog } from './entities/request_log.entity';

const requestLogId = 1;

const repositoryMock = {
  save: jest.fn((requestLog: RequestLog) => ({
    ...requestLog,
    id: requestLogId,
  })),
};

const createRequestLogDto = new CreateRequestLogDto();
createRequestLogDto.method = 'GET';
createRequestLogDto.url = 'https://example.com';
createRequestLogDto.data = 'Sample data';
createRequestLogDto.type = 'REQUEST';
createRequestLogDto.status = 200;

const requestLog = new RequestLog();
requestLog.method = createRequestLogDto.method;
requestLog.url = createRequestLogDto.url;
requestLog.data = createRequestLogDto.data;
requestLog.type = createRequestLogDto.type;
requestLog.status = createRequestLogDto.status;

describe('RequestLogService', () => {
  let requestLogService: RequestLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLogService,
        {
          provide: 'RequestLogRepository',
          useValue: repositoryMock,
        },
      ],
    }).compile();

    requestLogService = module.get<RequestLogService>(RequestLogService);
  });

  it('should be defined', () => {
    expect(requestLogService).toBeDefined();
  });

  it('should create a new RequestLog entity and save it to the repository when create() method is called with valid CreateRequestLogDto input', async () => {
    const result = await requestLogService.create(createRequestLogDto);

    expect(repositoryMock.save).toHaveBeenCalledWith(requestLog);

    expect(result.id).toBe(requestLogId);
  });
});

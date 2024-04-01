import { CreateRequestMiddleware } from '../middlewares/request.middleware';
import { RequestLogService } from '../request_log/request_log.service';
import { Request, Response } from 'express';

const requestLogService = {
  create: jest.fn(),
} as unknown as RequestLogService;

const logRequestSpy = jest.fn();

jest.mock('../request.logger/request.logger.service', () => {
  return {
    RequestLoggerService: class {
      logRequest(request: Request, response: Response) {
        logRequestSpy(request, response);
      }
    },
  };
});

describe('CreateRequestMiddleware', () => {
  it('should call logRequest method and then call next function', () => {
    const request = {} as Request;
    const response = {} as Response;
    const next = jest.fn();

    CreateRequestMiddleware(requestLogService)(request, response, next);

    expect(logRequestSpy).toHaveBeenCalledWith(request, response);
    expect(next).toHaveBeenCalled();
  });
});

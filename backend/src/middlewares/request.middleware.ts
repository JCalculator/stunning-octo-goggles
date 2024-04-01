import { RequestLoggerService } from '../request.logger/request.logger.service';
import { RequestLogService } from '../request_log/request_log.service';
import { Request, Response, NextFunction } from 'express';

export function CreateRequestMiddleware(requestLogService: RequestLogService) {
  return (request: Request, response: Response, next: NextFunction): void => {
    const logger = new RequestLoggerService(requestLogService);
    logger.logRequest(request, response);
    next();
  };
}

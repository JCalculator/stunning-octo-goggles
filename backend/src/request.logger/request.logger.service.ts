import { AxiosError } from 'axios';
import { Request, Response } from 'express';
import { RequestLogService } from '../request_log/request_log.service';

export class RequestLoggerService {
  constructor(private readonly requestLogService: RequestLogService) {}

  logToDatabase(
    method: string,
    url: string,
    type: string,
    status: number,
    data: string,
  ) {
    this.requestLogService.create({
      method,
      url,
      type,
      status,
      data,
    });
  }

  logRequest(request: Request, response: Response) {
    this.logToDatabase(
      request.method,
      request.url,
      'REQUEST',
      response.statusCode,
      JSON.stringify({
        headers: request.headers,
        url: request.url,
        method: request.method,
        body: request.body,
        originalUrl: request.originalUrl,
      }),
    );
  }
  logError(error: string, request: Request) {
    this.logToDatabase(request.method, request.url, 'ERROR', 500, error);
  }
  logAxiosError(error: AxiosError) {
    let method, url, status;
    try {
      if (error.response) {
        method = error.response.config.method;
        url = error.response.config.url;
        status = error.response.status;
      } else {
        method = error.request.method;
        url = error.request.url;
        status = error.request.status;
      }
    } catch {
      method = 'GET';
      url = `UNKNOWN URL. Here is the error message: ${error.message}`;
      status = 500;
    }
    this.logToDatabase(
      method.toUpperCase(),
      url,
      'ERROR',
      status,
      JSON.stringify({
        message: error.message,
        response: {
          data: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
        },
        request: {
          headers: error.request?.headers,
          method: error.request?.method,
          url: error.request?.url,
          data: error.request?.data,
        },
      }),
    );
  }
}

import { Request, Response } from 'express';
import { RequestLoggerService } from './request.logger.service';
import { RequestLogService } from '../request_log/request_log.service';
import { AxiosError } from 'axios';

describe('RequestLoggerService', () => {
  let requestLoggerService: RequestLoggerService;
  let requestLogService: RequestLogService;

  beforeEach(() => {
    requestLogService = { create: jest.fn() } as unknown as RequestLogService;
    requestLoggerService = new RequestLoggerService(requestLogService);
  });

  describe('logToDatabase', () => {
    it('should log the request details to the database', () => {
      requestLoggerService.logToDatabase(
        'GET',
        '/test',
        'REQUEST',
        200,
        JSON.stringify({
          headers: {},
          url: '/test',
          method: 'GET',
          body: {},
          originalUrl: '/test',
        }),
      );

      expect(requestLogService.create).toHaveBeenCalled();
    });
  });

  describe('logRequest', () => {
    it('should log request data to database when logRequest is called', () => {
      const request = {
        method: 'GET',
        url: '/test',
        headers: {},
        body: {},
        originalUrl: '/test',
      };
      const response = {
        statusCode: 200,
      };

      requestLoggerService.logRequest(request as Request, response as Response);

      expect(requestLogService.create).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        type: 'REQUEST',
        status: 200,
        data: JSON.stringify({
          headers: {},
          url: '/test',
          method: 'GET',
          body: {},
          originalUrl: '/test',
        }),
      });
    });
  });

  describe('logError', () => {
    it('should log the error details', () => {
      const request = {
        method: 'GET',
        url: '/test',
        headers: {},
        body: {},
        originalUrl: '/test',
      };
      const error = 'Error message';
      requestLoggerService.logError(error, request as Request);

      expect(requestLogService.create).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        type: 'ERROR',
        status: 500,
        data: error,
      });
    });
  });

  describe('logAxiosError', () => {
    it('should log error with correct method, url, status, and data when error has response', () => {
      const error = {
        response: {
          config: {
            method: 'GET',
            url: 'https://example.com/api',
          },
          status: 404,
        },
        message: 'Not Found',
      };

      requestLoggerService.logAxiosError(error as unknown as AxiosError);

      expect(requestLogService.create).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://example.com/api',
        type: 'ERROR',
        status: 404,
        data: JSON.stringify({
          message: 'Not Found',
          response: {
            status: 404,
          },
          request: {},
        }),
      });
    });
  });
});

//main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { HttpExceptionFilter } from './filters/http.exception.filter';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { RequestLoggerService } from './request.logger/request.logger.service';
import { AxiosError } from 'axios';
import { RequestLogService } from './request_log/request_log.service';
import { CreateRequestMiddleware } from './middlewares/request.middleware';
declare const module: any;

async function bootstrap() {
  const httpService = new HttpService();
  const app = await NestFactory.create(AppModule);
  const requestLogService = await app.resolve(RequestLogService);
  const logger = new RequestLoggerService(requestLogService);

  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.use(CreateRequestMiddleware(requestLogService));
  app.useGlobalPipes(new ValidationPipe());

  httpService.axiosRef.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      logger.logAxiosError(error);
      throw new InternalServerErrorException();
    },
  );

  app.enableCors();
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  // });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestLogModule } from './request_log/request_log.module';
import { RequestLog } from './request_log/entities/request_log.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      entities: [RequestLog],
      database: process.env.POSTGRES_DB,
      synchronize: true,
      logging: true,
    }),
    HttpModule,
    RequestLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

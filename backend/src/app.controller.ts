import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import {
  IsNumberString,
  IsNumber,
  Length,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FeedResult } from './types/common';

class FeedRequest {
  @IsOptional()
  @IsNumberString()
  @Length(4)
  year: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31) // This is not accurate because months have different days, but it's good enough for now
  @Type(() => Number)
  day: string;
}

class TranslateFeedRequest extends FeedRequest {
  @IsOptional()
  @Length(2)
  language: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/feed/translate/:language?/:year?/:month?/:day?')
  async getFeedWithTranslation(
    @Param() { language, year, month, day }: TranslateFeedRequest,
  ): Promise<FeedResult> {
    const data = await getRequestContent(this.appService, year, month, day);
    const translatedData = await translate(this.appService, data, language);
    return translatedData;
  }
  @Get('/feed/:year?/:month?/:day?')
  async getFeed(
    @Param() { year, month, day }: FeedRequest,
  ): Promise<FeedResult> {
    const data = await getRequestContent(this.appService, year, month, day);
    return data;
  }
  @Get('/available-languages')
  async availableLanguages(): Promise<string> {
    const stuff = await this.appService.getAvailableLanguages();
    return JSON.stringify(stuff);
  }
}

function translate(
  service: AppService,
  data: FeedResult,
  language: string,
): Promise<FeedResult> {
  return service.translate(data, language);
}

async function getRequestContent(
  service: AppService,
  year: string,
  month: string,
  day: string,
): Promise<FeedResult> {
  if (!day) {
    day = '1';
  }
  if (!month) {
    month = (new Date().getMonth() + 1).toString();
  }
  if (!year) {
    year = new Date().getFullYear().toString();
  }
  const data = await service.getFeed(
    year,
    padWithZero(month),
    padWithZero(day),
  );
  return data;
}

function padWithZero(value: string): string {
  const intValue = parseInt(value);
  if (intValue < 10) {
    return `0${intValue}`;
  }
  return value;
}

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FeedResult, AvailableLanguage } from './types/common';
import { firstValueFrom } from 'rxjs';
import { translateFeedResult } from './utils/translations';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  async getFeed(year: string, month: string, day: string): Promise<FeedResult> {
    const { data } = await firstValueFrom(
      this.httpService.get<FeedResult>(
        `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`,
      ),
    );
    return data;
  }

  async getAvailableLanguages(): Promise<AvailableLanguage[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<AvailableLanguage[]>(
        `${process.env.TRANSLATE_API_URL}/languages`,
      ),
    );
    return data;
  }

  async translate(result: FeedResult, language: string): Promise<FeedResult> {
    return translateFeedResult(this.httpService, result, language);
  }
}

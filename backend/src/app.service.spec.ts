import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { HttpService } from '@nestjs/axios';

jest.mock('rxjs', () => {
  const original = jest.requireActual('rxjs');
  return {
    ...original,
    firstValueFrom: async (v) => v,
  };
});

describe('AppService', () => {
  let appService: AppService;
  const translatedTitle = 'TranslatedTitle';
  const englishTitle = 'EnglishTitle';
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(async () => {
              return {
                data: {
                  translatedText: [translatedTitle],
                },
              };
            }),
            source: {
              subscribe: jest.fn(),
            },
            get: jest.fn(async (url) => {
              if (url.includes('wikimedia.org')) {
                return {
                  data: {
                    tfa: { titles: { normalized: englishTitle } },
                  },
                };
              }
              return {
                data: languages,
              };
            }),
          },
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return a FeedResult object when given valid parameters', async () => {
      const year = '2022';
      const month = '12';
      const day = '31';

      const result = await appService.getFeed(year, month, day);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('tfa');
      expect(result.tfa.titles.normalized).toBe(englishTitle);
    });

    it('should be able to translate a FeedResult object when given valid parameters', async () => {
      const language = 'en';
      const feedResult = {
        tfa: {
          titles: { normalized: englishTitle, canonical: '' },
          type: '',
          content_urls: undefined,
          timestamp: '',
          description: '',
          extract: '',
          tid: '',
        },
      };

      const result = await appService.translate(feedResult, language);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('tfa');
      expect(result.tfa.titles.normalized).toBe(translatedTitle);
    });

    it('should return a stringified JSON object of available languages when the service call succeeds', async () => {
      const result = await appService.getAvailableLanguages();

      expect(result).toEqual(languages);
    });
  });
});

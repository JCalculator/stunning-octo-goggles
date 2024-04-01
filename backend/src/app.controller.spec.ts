import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const translatedTitle = 'TranslatedTitle';
  const englishTitle = 'EnglishTitle';
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getFeed: jest.fn(async () => ({
              tfa: { titles: { normalized: englishTitle } },
              mostread: [],
              onthisday: [],
            })),
            translate: jest.fn(async () => ({
              tfa: { titles: { normalized: translatedTitle } },
              mostread: [],
              onthisday: [],
            })),
            getAvailableLanguages: jest.fn(() => languages),
          },
        },
        {
          provide: 'HttpService',
          useValue: {
            get: jest.fn(() => {}),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be able to translate a FeedResult object when given valid parameters', async () => {
      const language = 'en';
      const year = '2022';
      const month = '12';
      const day = '31';

      const result = await appController.getFeedWithTranslation({
        language,
        year,
        month,
        day,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('tfa');
      expect(result).toHaveProperty('mostread');
      expect(result).toHaveProperty('onthisday');
      expect(result.tfa.titles.normalized).toBe(translatedTitle);
    });

    it('should return a FeedResult object when given valid parameters', async () => {
      const year = '2022';
      const month = '12';
      const day = '31';

      const result = await appController.getFeed({
        year,
        month,
        day,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('tfa');
      expect(result).toHaveProperty('mostread');
      expect(result).toHaveProperty('onthisday');
      expect(result.tfa.titles.normalized).toBe(englishTitle);
    });

    it('should return a stringified JSON object of available languages when the service call succeeds', async () => {
      const expected = JSON.stringify(languages);

      const result = await appController.availableLanguages();

      expect(result).toEqual(expected);
    });
  });
});

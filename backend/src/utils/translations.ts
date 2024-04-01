import { HttpService } from '@nestjs/axios';
import { FeedResult, Article, TranslationResult } from '../types/common';
import { firstValueFrom } from 'rxjs';

export async function translateFeedResult(
  httpService: HttpService,
  result: FeedResult,
  language: string,
): Promise<FeedResult> {
  const translatedArray = await constructTranslatedArray(
    httpService,
    result,
    language,
  );
  return useTranslationArray(result, translatedArray);
}

function useTranslationArray(
  result: FeedResult,
  translatedArray: string[],
): FeedResult {
  let index = 0;

  result.onthisday?.forEach((onthisday) => {
    onthisday.text = translatedArray[index++];
    onthisday.pages.forEach((article) => {
      index = setArticleTranslationArray(article, translatedArray, index);
    });
  });

  result.mostread?.articles?.forEach((article) => {
    index = setArticleTranslationArray(article, translatedArray, index);
  });
  setArticleTranslationArray(result.tfa, translatedArray, index);
  return result;
}
async function constructTranslatedArray(
  httpService: HttpService,
  result: FeedResult,
  language: string,
): Promise<string[]> {
  const translateArray: string[] = [];
  result.onthisday?.forEach((onthisday) => {
    if (!onthisday) {
      return;
    }
    translateArray.push(onthisday.text);
    onthisday.pages.forEach((article) =>
      translateArray.push(...getArticleTranslationArray(article)),
    );
  });
  result.mostread?.articles.forEach((article) =>
    translateArray.push(...getArticleTranslationArray(article)),
  );

  translateArray.push(...getArticleTranslationArray(result.tfa));

  return await getTranslations(httpService, translateArray, language);
}

async function getTranslations(
  httpService: HttpService,
  translateArray: string[],
  language: string,
): Promise<string[]> {
  const length = translateArray.length;
  const translatedChunks = [];
  const chunkSize = 100;
  for (let n = 0; n < length; n += chunkSize) {
    const chunk = translateArray.slice(n, n + chunkSize);
    const { data } = await firstValueFrom(
      httpService.post<TranslationResult>(
        `${process.env.TRANSLATE_API_URL}/translate`,
        {
          source: 'en',
          target: language,
          q: chunk,
          format: 'text',
          api_key: '',
        },
      ),
    );
    translatedChunks.push(
      Array.isArray(data.translatedText)
        ? data.translatedText
        : [data.translatedText],
    );
  }
  return translatedChunks.flat();
}
function setArticleTranslationArray(
  article: Article,
  translateArray: string[],
  index: number,
): number {
  if (!article) {
    return index;
  }
  article.titles.normalized = translateArray[index++];
  article.description = translateArray[index++];
  return index;
}
function getArticleTranslationArray(article: Article): string[] {
  if (!article) {
    return [];
  }
  return [
    article.titles.normalized ?? '',
    article.description ?? article.extract ?? '',
  ];
}

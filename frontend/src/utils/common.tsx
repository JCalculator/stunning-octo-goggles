export interface AvailableLanguage {
  code: string;
  name: string;
}
export interface FeedItem {
  id: string;
  title: string;
  thumbnailSrc: string;
  description: string;
  url: string;
}

export interface FeedResult {
  tfa?: Article;
  mostread?: MostReadArticles;
  onthisday?: OnThisDay[];
  date: string;
}

export interface Article {
  type: string;
  titles: ArticleTitles;
  thumbnail?: Thumbnail;
  content_urls: ContentUrls;
  timestamp: string;
  description: string;
  tid: string;
}

interface Thumbnail {
  source: string;
  width: number;
  height: number;
}

interface MostReadArticles {
  date: string;
  articles: MostReadArticle[];
}

export interface MostReadArticle extends Article {
  views: number;
  rank: number;
}

export interface OnThisDay {
  text: string;
  year: string;
  pages: Article[];
}

interface ContentUrls {
  desktop: Url;
  mobile: Url;
}

interface Url {
  page: string;
}

interface ArticleTitles {
  canonical: string;
  normalized: string;
}
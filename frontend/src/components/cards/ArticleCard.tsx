import React, { useCallback, useMemo } from 'react';
import { Article } from '../../utils/common';
import useVisibilityStore from '../hooks/useVisibilityStore';
import { isMobile } from 'react-device-detect';

interface ArticleCardProps {
  item: Article;
  footer?: JSX.Element;
  tag?: string;
  subtitle?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ item, footer, tag, subtitle }) => {

  const {isVisited, markAsVisited} = useVisibilityStore();

  const url = useMemo(() => {
    return isMobile ? item.content_urls.mobile.page : item.content_urls.desktop.page;
  }, [item]);

  const handleVisit = useCallback(() => {
    markAsVisited(url);
  }, [url, markAsVisited]);
  
  return (
    <div className="article-card max-w-sm relative w-[390px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-500">
      {tag && <div className="absolute right-2 top-2 rounded-lg p-1 text-xs uppercase bg-blue-600 text-white">{tag}</div>}
      {item.thumbnail && <div className="h-96">
        <img className="rounded-t-lg object-cover h-96" src={item.thumbnail.source} width="100%" alt={item.titles.canonical} />
      </div>}
      <div className={`p-5 ${!item.thumbnail && 'mt-8'}`}>
          <h5 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.titles.normalized}</h5>
          {subtitle && <div className="text-center rounded-lg p-1 text-xs uppercase text-gray-700 dark:text-white my-4">{subtitle}</div>}
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-200">{item.description}</p>
          <a onClick={handleVisit} href={url} target='_blank' className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
              </svg>
          </a>
      </div>
      {footer}
      {isVisited(url) && <Visited />}
    </div>
  );
};

const Visited = () => {
  return (<>
    <div className="mb-12"></div>
    <div title="READ" className="absolute bottom-0 w-full flex flex-row justify-center p-2 uppercase bg-slate-100 dark:bg-slate-700 rounded-b-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
      </svg>
    </div>
  </>);
};

export default ArticleCard;


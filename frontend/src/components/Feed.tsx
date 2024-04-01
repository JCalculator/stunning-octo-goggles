import React, { useState, useEffect, useRef, useCallback } from "react";
import Loader from "./Loader";
import { FeedResult, AvailableLanguage } from "../utils/common";
import FeaturedArticleCard from "./cards/FeaturedArticleCard";
import MostReadArticleCard from "./cards/MostReadArticleCard";
import OnThisDayCard from "./cards/OnThisDayCard";
import moment from "moment";

const getUrl = (languageCode: string, currentDate: string) => {
  currentDate = moment(currentDate).format('YYYY/MM/DD');
  if (languageCode === 'en') {
    return `${import.meta.env.VITE_FEED_API}/feed/${currentDate}`;
  }
  return `${import.meta.env.VITE_FEED_API}/feed/translate/${languageCode}/${currentDate}`;
};

interface FeedProps {
  date: string;
  language: AvailableLanguage;
}

const Feed = React.memo(({language, date}: FeedProps) => {
  const [results, setResults] = useState<FeedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(1);
  const [currentDate, setCurrentDate] = useState(date);
  const loaderRef = useRef(null);
  const [lastLanguage, setLastLanguage] = useState<AvailableLanguage | null>(null);
  const [lastDate, setLastDate] = useState<string>();
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  
  
  const fetchData = useCallback(async () => {
    if (isLoading || index < 0 || !currentDate) {
      return;
    }
    setIsLoading(true);
    const url = getUrl(language.code, currentDate);

    const possibleResult = results.find((result) => result.date === currentDate);
    if (possibleResult) {
      return;
    }
    
    fetch(url)
      .then((response) => response.json())
      .then((data: FeedResult) => {
        setResults((prevResults) => {
          const possibleResult = prevResults.find((result) => result.date === currentDate);
          if (possibleResult) {
            return prevResults;
          }
          data.date = currentDate;
          prevResults.push(data);
          return prevResults;
        });
        setCurrentDate(moment(currentDate).subtract(1, "days").format('YYYY-MM-DD'));
        setIndex((prevIndex) => prevIndex + 1);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch((error) => console.log(error));
  }, [currentDate, index, isLoading, language.code, results]);
  
  useEffect(() => {
    if ((lastLanguage && lastLanguage.code !== language.code) || date !== lastDate) {
      setCurrentDate(date);
      setResults([]);
      setIndex(1);
      setLastLanguage(language);
      setLastDate(date);
      itemsRef.current = [];
    }
  }, [lastLanguage, language, setLastLanguage, date, currentDate, lastDate]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        fetchData();
      }
    });

    const currentRef = loaderRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }

    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
    };
  }, [fetchData]);

  const scrollTo = (element: HTMLElement|null) => {
    if (!element) {
      return;
    }
    const yOffset = -250; 
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
  return (
    <div>
      <div className="flex flex-col pl-[100px]">
        <div className="fixed left-3 w-[100px]">
          {itemsRef.current.length > 0 && <div id="navigation" className="rounded-md border p-2">
            <h3 className="font-bold text-sm uppercase text-center">go to</h3>
            {itemsRef.current.map((item, index) => (
              <div key={index} onClick={() => scrollTo(item)} className="cursor-pointer w-full border-b-2 center block my-5">{item?.innerHTML}</div>
            ))}
          </div>}
        </div>
        {results.map((result, resultIndex) => (
          <>
            {result.date && <>
              <h2 ref={el => itemsRef.current[resultIndex] = el}  className="w-full text-2xl font-bold text-center my-5">{result.date}</h2>
            </>}
            <div className="flex flex-wrap w-full gap-4 justify-center">
              {result.tfa && <FeaturedArticleCard item={result.tfa} />}
              {result.mostread && result.mostread.articles.map((article, i) => <MostReadArticleCard item={article} key={`mostread-${i}`} />)}
              {result.onthisday && result.onthisday.map(onThisDay => (<>
                <OnThisDayCard item={onThisDay} key={`onthisday-${onThisDay.year}`} />
              </>))}
            </div>
          </>
        ))}
      </div>
      <div className="w-full my-5" ref={loaderRef}>{isLoading && <Loader />}</div>
    </div>
  );
});

export default Feed;

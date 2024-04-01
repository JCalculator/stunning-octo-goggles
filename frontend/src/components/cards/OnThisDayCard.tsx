import React from 'react';
import { OnThisDay } from '../../utils/common';
import ArticleCard from './ArticleCard';

interface OnThisDayCardProps {
  item: OnThisDay;
}

const OnThisDayCard: React.FC<OnThisDayCardProps> = ({ item }) => {

  return <>
    {item.pages.map(article => <ArticleCard item={article} subtitle={`${item.text}`} tag={`On this day in ${item.year}`} />)}
  </>;
};

export default OnThisDayCard;

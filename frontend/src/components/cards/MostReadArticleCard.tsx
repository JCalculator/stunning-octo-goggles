import React from 'react';
import { MostReadArticle } from '../../utils/common';
import ArticleCard from './ArticleCard';

interface MostReadArticleCardProps {
  item: MostReadArticle;
}

const MostReadArticleCard: React.FC<MostReadArticleCardProps> = ({ item }) => {

  return (
    <ArticleCard item={item} tag={`Most Read - Rank ${item.rank} - ${item.views} views`} />
  );
};

export default MostReadArticleCard;

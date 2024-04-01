import React, { useMemo } from 'react';
import { Article } from '../../utils/common';
import ArticleCard from './ArticleCard';

interface FeaturedArticleCardProps {
  item: Article;
}

const FeaturedArticleCard: React.FC<FeaturedArticleCardProps> = ({ item }) => {
  return (
    <ArticleCard item={item} tag="Featured" />
  );
};

export default FeaturedArticleCard;

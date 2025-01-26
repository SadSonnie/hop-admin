import React from 'react';
import { Review } from '../../types';
import { RatingStars } from '../RatingStars/RatingStars';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{review.authorName}</span>
          <span className="text-sm text-gray-500">{review.date}</span>
        </div>
        <RatingStars rating={review.rating} size="small" />
      </div>
      <p className="text-gray-700">{review.content}</p>
    </div>
  );
};

export default ReviewCard;

import React from 'react';
import { Rate } from 'antd';
import { ExtendedReview } from '../../types/index';

interface ReviewCardProps {
  review: ExtendedReview;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="mb-4">
      {/* Аватар и информация о пользователе */}
      <div className="flex items-center gap-2 mb-2">
        {review.authorAvatar && (
          <img 
            src={review.authorAvatar} 
            alt={review.authorName || 'User'}
            className="w-[36px] h-[36px] rounded-[100px] object-cover object-center" 
          />
        )}
        <div>
          <div className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203]">
            {review.authorName || 'Anonymous User'}
          </div>
          <div className="text-[14px] font-[400] leading-[16.77px] tracking-[-0.02em] text-[#7D7D80]">
            {review.date || 'No date'}
          </div>
        </div>
      </div>

      {/* Рейтинг */}
      <div className="flex gap-[2px] mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Rate
            key={star}
            className={`w-3 h-3 ${
              star <= review.rating ? 'text-[#2846ED] fill-[#2846ED]' : 'text-[#C8C8CC] fill-[#C8C8CC]'
            }`}
          />
        ))}
      </div>

      {/* Тема отзыва */}
      {review.title && (
        <div className="text-[16px] font-[500] leading-[17.6px] tracking-[-0.04em] text-[#020203] mb-1">
          {review.title}
        </div>
      )}

      {/* Текст отзыва */}
      <div className="text-[14px] font-[400] leading-[15.4px] tracking-[-0.02em] text-[#020203] mb-2">
        {review.content}
      </div>

      {/* Фотографии */}
      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {review.photos.map((photo: { photo_url: string }, index: number) => (
            <img
              key={index}
              src={photo.photo_url}
              alt={`Review photo ${index + 1}`}
              className="w-full h-[100px] object-cover rounded-lg"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
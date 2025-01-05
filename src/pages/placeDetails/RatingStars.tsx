import { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  onRatingChange?: (rating: number) => void;
}

export const RatingStars = ({ onRatingChange }: RatingStarsProps) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-[36px] h-[36px] cursor-pointer ${
            star <= (hover || rating) ? 'text-[#1E47F7] fill-[#1E47F7]' : 'text-[#C8C8CC] fill-[#C8C8CC]'
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => handleRatingChange(star)}
        />
      ))}
    </div>
  );
};

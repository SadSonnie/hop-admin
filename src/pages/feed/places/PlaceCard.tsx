import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';
import { DEFAULT_PLACE_IMAGE } from './constants';

interface PlaceCardProps {
  id: number;
  name: string;
  address: string;
  category_id?: number;
  description?: string;
  rating?: number;
  distance?: string;
  imageUrl: string;
  isPremium?: boolean;
  priceLevel?: number;
  onClick?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  id,
  name,
  address,
  category_id,
  description,
  rating,
  distance,
  imageUrl,
  isPremium = false,
  priceLevel = 1,
  onClick
}) => {
  const navigate = useNavigate();
  const { getCategoryName } = useCategories();
  const categoryName = getCategoryName(category_id);
  const ratingStyles = 'flex items-center gap-1 text-sm';

  const handleClick = () => {
    navigate(`/places/${id}`);
    onClick?.();
  };

  const renderPriceLevel = () => {
    return Array(3).fill(0).map((_, index) => (
      <span 
        key={index} 
        className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.04em] text-white" 
        style={{ opacity: index < (priceLevel ?? 0) ? 1 : 0.5 }}
      >
        ₽
      </span>
    ));
  };

  return (
    <div 
      onClick={handleClick}
      className={`w-full overflow-hidden rounded-xl cursor-pointer ${isPremium ? 'text-[#fefefe]' : 'text-black'}`}
      style={{ backgroundColor: isPremium ? '#2846ED' : '#fefefe' }}
    >
      {/* Изображение с метриками */}
      <div className="relative h-[140px] rounded-xl overflow-hidden mx-4 mt-4">
        <img
          src={imageUrl || DEFAULT_PLACE_IMAGE}
          alt={name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_PLACE_IMAGE;
          }}
        />
        {/* Метрики поверх изображения */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {rating && (
            <div 
              className="h-[22px] backdrop-blur-[8px] px-2 rounded-[100px] flex items-center gap-1"
              style={{ background: 'rgba(30, 71, 247, 0.2)' }}
            >
              <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-white">{rating}</span>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
          )}
          {priceLevel && (
            <div 
              className="h-[22px] backdrop-blur-[8px] px-2 rounded-[100px] flex items-center"
              style={{ background: 'rgba(30, 71, 247, 0.2)' }}
            >
              <div className="flex items-center">
                {renderPriceLevel()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Информация */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">
          {categoryName ? `${categoryName} ${name}` : name}
        </h3>
        {description && <p className="text-sm opacity-80">{description}</p>}
      </div>
    </div>
  );
};

export default PlaceCard;
import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Place } from '../../../types';

interface PlaceCardProps {
  id: number;
  name: string;
  mainTag?: string;
  description?: string;
  rating?: number;
  distance?: string;
  imageUrl: string;
  isPremium?: boolean;
  priceLevel?: number;
  onClick?: () => void;
}

const PlaceCard = ({ 
  id,
  name, 
  mainTag,
  description, 
  rating, 
  distance, 
  imageUrl, 
  isPremium, 
  priceLevel,
  onClick 
}: PlaceCardProps) => {
  const navigate = useNavigate();
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
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-xl"
        />
        {/* Метрики поверх изображения */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {/* Тег оценки */}
          <div 
            className="h-[22px] backdrop-blur-[8px] px-2 rounded-[100px] flex items-center gap-1"
            style={{ background: 'rgba(30, 71, 247, 0.2)' }}
          >
            <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-white">{rating}</span>
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          {/* Тег цены */}
          <div 
            className="h-[22px] backdrop-blur-[8px] px-2 rounded-[100px] flex items-center"
            style={{ background: 'rgba(30, 71, 247, 0.2)' }}
          >
            <div className="flex items-center">
              {renderPriceLevel()}
            </div>
          </div>
          {/* Тег расстояния */}
          <div 
            className="h-[22px] backdrop-blur-[8px] px-2 rounded-[100px] flex items-center"
            style={{ background: 'rgba(30, 71, 247, 0.2)' }}
          >
            <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-white">{distance}</span>
          </div>
        </div>
      </div>

      {/* Информация */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-1">{`${mainTag} ${name}`}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
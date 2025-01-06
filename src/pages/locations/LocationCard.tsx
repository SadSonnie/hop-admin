import React from 'react';
import { Star } from 'lucide-react';
import { Place } from '../../types';

interface LocationCardProps extends Place {
  onClick?: () => void;
  onDelete?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  id,
  name, 
  mainTag,
  description, 
  rating, 
  imageUrl, 
  isPremium, 
  priceLevel = 1,
  onClick,
  onDelete
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of the card
    if (onDelete) {
      onDelete();
    }
  };

  const renderPriceLevel = () => {
    return Array(3).fill(0).map((_, index) => (
      <span 
        key={index} 
        className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.04em] text-white" 
        style={{ opacity: index < priceLevel ? 1 : 0.5 }}
      >
        ₽
      </span>
    ));
  };

  return (
    <div 
      onClick={onClick}
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
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
            title="Удалить место"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
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

export default LocationCard;

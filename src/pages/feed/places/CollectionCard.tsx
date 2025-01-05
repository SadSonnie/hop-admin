import React from 'react';
import { Star, MapPin } from 'lucide-react';
import type { Place } from '../../types';

interface CollectionCardProps {
  place: Place;
  onClick: () => void;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ place, onClick }) => {
  const renderPriceLevel = () => {
    return Array(3).fill(0).map((_, index) => {
      if (place.isPremium) {
        const color = index < (place.priceLevel || 1) ? '#1e47f7' : '#9aacfb';
        return (
          <span 
            key={index} 
            className="text-sm font-medium leading-none" 
            style={{ color }}
          >
            ₽
          </span>
        );
      } else {
        const color = index < (place.priceLevel || 1) ? 'white' : '#8d8d8e';
        return (
          <span 
            key={index} 
            className="text-sm font-medium leading-none" 
            style={{ color }}
          >
            ₽
          </span>
        );
      }
    });
  };

  const metricStyles = place.isPremium ? {
    background: '#eceffd',
    textColor: '#1e47f7',
    iconColor: '#1e47f7'
  } : {
    background: 'rgba(0, 0, 0, 0.1)',
    textColor: 'white',
    iconColor: 'white'
  };

  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-64 mx-2 cursor-pointer rounded-2xl overflow-hidden ${
        place.isPremium ? 'shadow-[0_0_15px_rgba(30,71,247,0.15)]' : ''
      }`}
    >
      <div className="relative h-48">
        <img
          src={place.imageUrl}
          alt={place.name}
          className={`w-full h-full object-cover ${
            place.isPremium ? 'brightness-105' : ''
          }`}
        />
        {/* Премиальный градиент */}
        {place.isPremium && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e47f7]/20 via-transparent to-[#1e47f7]/5" />
        )}
        {/* Основной градиент для текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Метрики в левом нижнем углу */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div 
            className="h-[22px] backdrop-blur-md px-2.5 rounded-[100px] flex items-center gap-1"
            style={{ background: metricStyles.background }}
          >
            <span 
              className="text-[12px] font-medium leading-[14.38px] tracking-[-0.02em]" 
              style={{ color: metricStyles.textColor }}
            >
              {place.rating}
            </span>
            <Star className="w-[14px] h-[14px] fill-current" style={{ color: metricStyles.iconColor }} />
          </div>
          <div 
            className="h-[22px] backdrop-blur-md px-2.5 rounded-[100px] flex items-center"
            style={{ background: metricStyles.background }}
          >
            <MapPin className="w-[14px] h-[14px]" style={{ color: metricStyles.iconColor }} />
            <span 
              className="ml-1 text-[12px] font-medium leading-[14.38px] tracking-[-0.02em]" 
              style={{ color: metricStyles.textColor }}
            >
              {`${place.distance}`}
            </span>
          </div>
          <div 
            className="h-[22px] backdrop-blur-md px-2.5 rounded-[100px] flex items-center gap-0.5"
            style={{ background: metricStyles.background }}
          >
            {renderPriceLevel()}
          </div>
        </div>

        {/* Текст поверх градиента */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-lg text-white mb-1">{place.name}</h3>
          <p className="text-sm text-gray-200">{place.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
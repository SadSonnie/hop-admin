import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../../hooks/useCategories';

// Импортируем все иконки
import tagFriends from '/icons/tag_friends.svg';
import tagPets from '/icons/tag_pets.svg';
import tagPartner from '/icons/tag_partner.svg';
import tagFamily from '/icons/tag_family.svg';
import tagSelfDevelopment from '/icons/tag_self_development.svg';
import tagAlone from '/icons/tag_alone.svg';
import tagShopping from '/icons/tag_shopping.svg';
import tagKids from '/icons/tag_kids.svg';
import tagSpa from '/icons/tag_spa.svg';
import tagFood from '/icons/tag_food.svg';
import tagEntertainment from '/icons/tag_entertainment.svg';
import tagCulture from '/icons/tag_culture.svg';
import tagActiveLeisure from '/icons/tag_active_leisure.svg';

// Создаем маппинг иконок
const tagIcons: { [key: string]: string } = {
  "1": tagFriends,
  "2": tagPets,
  "3": tagPartner,
  "4": tagFamily,
  "5": tagSelfDevelopment,
  "6": tagAlone,
  "7": tagShopping,
  "8": tagKids,
  "9": tagSpa,
  "10": tagFood,
  "11": tagEntertainment,
  "12": tagCulture,
  "13": tagActiveLeisure,
};

interface PlaceCardProps {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isPremium?: boolean;
  priceLevel?: number;
  rating?: number;
  distance?: number;
  tagIds?: number[];
  main_photo_url?: string;
  category_id?: number;
  address?: string;
  onClick?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  id,
  name, 
  description, 
  rating = 0, 
  distance = 0, 
  imageUrl,
  main_photo_url,
  isPremium, 
  priceLevel = 1,
  tagIds = [],
  category_id,
  address,
  onClick 
}) => {
  const navigate = useNavigate();
  const { getCategoryName } = useCategories();
  const categoryName = category_id ? getCategoryName(category_id) : '';

  const handleClick = () => {
    navigate(`/places/${id}`);
    onClick?.();
  };

  const renderPriceLevel = () => {
    return Array(3).fill(0).map((_, index) => (
      <span 
        key={`price-${id}-${index}`} 
        className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.04em] text-white" 
        style={{ opacity: index < priceLevel ? 1 : 0.5 }}
      >
        ₽
      </span>
    ));
  };

  const displayTags = (tagIds || [])
    .slice(0, 4)
    .map((id: number) => ({
      ...{ id, name: '' },
      iconSrc: tagIcons[id]
    }))
    .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined);

  return (
    <div 
      onClick={handleClick}
      className={`w-full overflow-hidden rounded-xl cursor-pointer ${isPremium ? 'text-[#fefefe]' : 'text-black'}`}
      style={{ backgroundColor: isPremium ? '#2846ED' : '#fefefe' }}
    >
      {/* Изображение с метриками */}
      <div className="relative h-[140px] rounded-xl overflow-hidden mx-4 mt-4">
        <img
          key={`place-image-${id}`}
          src={main_photo_url || imageUrl}
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
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-medium">{categoryName ? `${categoryName} ${name}` : name}</h3>
          <div className="flex items-center gap-2">
            {displayTags.map((tag, index: number) => (
              <img 
                key={`tag-${id}-${tag?.id || index}`} 
                src={tag?.iconSrc} 
                alt={tag?.name}
                title={tag?.name}
                className={`w-6 h-6 ${isPremium ? 'brightness-0 invert' : ''}`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm opacity-80">{description}</p>
        <p className="text-sm opacity-80">{address}</p>
      </div>
    </div>
  );
};

export default PlaceCard;
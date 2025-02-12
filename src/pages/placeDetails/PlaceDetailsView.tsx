import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, MapPin, Star, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Place } from '@/types';
import type { ExtendedReview } from '@/types/index';
import api from '../../utils/api';
import ReviewCard from './ReviewCard';
import { RatingStars } from './RatingStars';

// Импортируем все иконки
const tagIcons: { [key: string]: string } = {
  "1": "/icons/tag_friends.svg",
  "2": "/icons/tag_pets.svg",
  "3": "/icons/tag_partner.svg",
  "4": "/icons/tag_family.svg",
  "5": "/icons/tag_self_development.svg",
  "6": "/icons/tag_alone.svg",
  "7": "/icons/tag_shopping.svg",
  "8": "/icons/tag_kids.svg",
  "9": "/icons/tag_spa.svg",
  "10": "/icons/tag_food.svg",
  "11": "/icons/tag_entertainment.svg",
  "12": "/icons/tag_culture.svg",
  "13": "/icons/tag_active_leisure.svg",
};

interface PlaceWithExtendedProps extends Place {
  reviews?: ExtendedReview[];
  instagram?: string;
  email?: string;
  images?: string[];
  imageUrl?: string;
  mainTag?: string;
  tags?: Array<{ id: string; name: string }>;
  rating?: number;
  distance?: string;
}

const PlaceDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<PlaceWithExtendedProps | null>(null);
  const [, setCategories] = useState<any[]>([]);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [wasHere, setWasHere] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Загружаем категории
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data.items);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      
      try {
        const placeData = await api.getPlace(id);
        
        setPlace({
          ...placeData,
          imageUrl: placeData.main_photo_url,
          images: placeData.photos.map((photo: { url: string }) => photo.url),
          mainTag: placeData.Category.name,
          tags: placeData.PlaceTags.map((tag: { tag_id: number; placesItems: { name: string } }) => ({
            id: tag.tag_id.toString(),
            name: tag.placesItems.name
          })),
          coordinates: placeData.latitude && placeData.longitude ? {
            lat: parseFloat(placeData.latitude),
            lng: parseFloat(placeData.longitude)
          } : undefined,
          rating: 0,
          distance: '0 км',
        });
      } catch (error) {
        console.error('Error fetching place:', error);
      }
    };

    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (place?.images) {
      // Предварительная загрузка всех изображений
      place.images.forEach((src: string) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [place?.images]);

  const handleBack = () => {
    navigate('/');
  };

  const images = place?.images || [place?.imageUrl];
  const imageIndex = Math.abs(page % images.length);
  const nextImageIndex = Math.abs((page + 1) % images.length);
  const prevImageIndex = Math.abs((page - 1) % images.length);

  // Расчет средней оценки и количества отзывов
  const reviews = place?.reviews || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum: number, review: ExtendedReview) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDotClick = (index: number) => {
    const newDirection = index > imageIndex ? 1 : -1;
    setPage([index, newDirection]);
  };

  const renderPriceLevel = () => {
    return Array(3).fill(0).map((_, index: number) => (
      <span 
        key={index} 
        className={`text-sm font-medium leading-none ${place?.isPremium ? 'text-white' : ''}`}
        style={{ 
          color: place?.isPremium 
            ? 'white' 
            : index < (place?.priceLevel ?? 0) 
              ? '#1e47f7' 
              : '#9aacfb' 
        }}
      >
        ₽
      </span>
    ));
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      zIndex: 1
    }),
    center: {
      x: 0,
      zIndex: 2
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      zIndex: 0
    })
  };

  if (!place) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Хедер */}
      <header className={`sticky top-0 z-50 ${place.isPremium ? 'bg-[#2846ED]' : 'bg-white'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className={`w-6 h-6 ${place.isPremium ? 'text-white' : 'text-black'}`} />
          </button>
          <button>
            <Share2 className={`w-6 h-6 ${place.isPremium ? 'text-white' : 'text-black'}`} />
          </button>
        </div>
      </header>

      <div className="pb-20">
        {/* Основной блок */}
        <div className={`${place.isPremium ? 'bg-[#2846ED]' : 'bg-white'} rounded-b-2xl mb-1`}>
          <div className="h-[46px] flex flex-col justify-between px-4">
            <p className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] ${place.isPremium ? 'text-white/80' : 'text-[#020203]'}`}>
              {place.mainTag}
            </p>
            <h1 className={`text-[24px] font-[500] leading-[28.75px] tracking-[-0.02em] ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>
              {place.name}
            </h1>
          </div>
          {/* Слайдер изображений */}
          <div className="relative h-72 overflow-hidden rounded-xl mx-4 mb-4">
            {/* Теги над слайдером */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-0.5">
              {place.tags?.map(tag => (
                <div
                  key={tag.id}
                  className="h-[28px] backdrop-blur-[10px] px-2 py-1 rounded-[100px] flex items-center gap-0.5 bg-[#FEFEFE33]"
                  style={{ 
                    backgroundColor: 'rgba(254, 254, 254, 0.2)',
                    padding: '4px 8px'
                  }}
                >
                  <img 
                    src={tagIcons[tag.id]} 
                    alt=""
                    className="w-[18px] h-[18px] brightness-0 invert"
                  />
                  <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-white">
                    {tag.name}
                  </span>
                </div>
              ))}
            </div>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={page}
                className="absolute inset-0"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(_, { offset, velocity }) => {
                  setIsDragging(false);
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '12px'
                }}
              >
                <img
                  src={images[imageIndex]}
                  alt={place.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </motion.div>
              {isDragging && (
                <>
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      x: '-100%',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px'
                    }}
                  >
                    <img
                      src={images[prevImageIndex]}
                      alt={place.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0"
                    style={{ 
                      x: '100%',
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '12px'
                    }}
                  >
                    <img
                      src={images[nextImageIndex]}
                      alt={place.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Индикаторы слайдера */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => !isDragging && handleDotClick(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === imageIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Информация о заведении */}
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setWasHere(!wasHere)}
              className={`w-[32vw] min-w-[125px] h-[7.1vw] min-h-[30px] rounded-full text-[2.8vw] min-text-[12px] font-medium leading-[1.2] tracking-[-0.02em] transition-colors whitespace-nowrap
                ${wasHere 
                  ? 'bg-blue-600 text-white' 
                  : place.isPremium
                    ? 'bg-[#2846ED] text-white border border-white'
                    : 'bg-white text-[#020203] border border-[#969699]'
                }`}
            >
              {wasHere ? 'Я здесь был(а)' : 'Я здесь не был(а)'}
            </button>
            
            <div className="flex items-center gap-2">
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center gap-1"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className={`text-[2.8vw] min-text-[12px] font-[500] leading-[120%] tracking-[-0.02em] ${place.isPremium ? 'text-white' : 'text-blue-600'}`}>{place.rating}</span>
                <Star className={`w-4 h-4 ${place.isPremium ? 'text-white' : 'text-blue-600'} fill-${place.isPremium ? 'white' : 'blue-600'}`} />
              </div>
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center gap-0.5"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className={`font-medium ${place.isPremium ? 'text-white' : ''}`}>{renderPriceLevel()}</span>
              </div>
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className={`text-[2.8vw] min-text-[12px] font-[500] leading-[120%] tracking-[-0.02em] ${place.isPremium ? 'text-white' : 'text-blue-600'}`}>{place.distance}</span>
              </div>
            </div>
          </div>

          {/* Описание */}
          <p className={`text-[#020203] text-[14px] leading-[15.4px] tracking-[-0.02em] font-normal px-4 py-3 ${place.isPremium ? 'text-white/80' : ''}`}>{place.description}</p>
        </div>

        {/* Дополнительно */}
        <div className={`${place.isPremium ? 'bg-[#2846ED]' : 'bg-white'} rounded-2xl px-4 py-3 mb-1`}>
          <h2 className={`text-[16px] font-[500] leading-[19.17px] tracking-[-0.02em] text-[#020203] mb-4 ${place.isPremium ? 'text-white' : ''}`}>Дополнительно</h2>
          
          {/* Построить маршрут */}
          <button 
            className={`w-full flex items-center justify-center py-3 px-4 rounded-[100px] mb-4 ${
              place.isPremium 
                ? 'bg-[#2846ED] text-white border border-white' 
                : 'bg-[#F9F9FE] text-[#1E47F7] border border-[#1E47F7]'
            }`}
          >
            <span>Построить маршрут</span>
          </button>

          {/* Адрес и контакты */}
          <div className="flex flex-col gap-4">
            {/* Адрес */}
            <div className="flex items-start gap-3">
              <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-[100px] ${place.isPremium ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                <MapPin className={`w-6 h-6 ${place.isPremium ? 'text-[#2846ED]' : 'text-[#020203]'}`} />
              </div>
              <span className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] pt-2.5 ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>{place.address}</span>
            </div>

            {/* Телефон (только для премиум) */}
            {place.phone && (
              <div className="flex items-start gap-3">
                <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-[100px] ${place.isPremium ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                  <Phone className={`w-6 h-6 ${place.isPremium ? 'text-[#2846ED]' : 'text-[#020203]'}`} />
                </div>
                <span className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] pt-2.5 ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>{place.phone}</span>
              </div>
            )}
          </div>

          {/* Социальные сети */}
          <div>
            {place.email && (
              <div className="flex items-center gap-3 py-3">
                <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-[100px] ${place.isPremium ? 'bg-white' : 'bg-[#FAFAFA]'}`}>
                  <Mail className={`w-6 h-6 ${place.isPremium ? 'text-[#2846ED]' : 'text-[#020203]'}`} />
                </div>
                <a href={`mailto:${place.email}`} className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>{place.email}</a>
              </div>
            )}
            {place.instagram && (
              <div className="flex items-center gap-3 py-3">
                <a href={`https://instagram.com/${place.instagram}`} className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>@{place.instagram}</a>
              </div>
            )}
          </div>
        </div>

        {/* Отзывы */}
        <div className={`${place.isPremium ? 'bg-[#2846ED]' : 'bg-white'} rounded-2xl p-4`}>
          <div className={`text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] mb-4 ${place.isPremium ? 'text-white' : 'text-[#020203]'}`}>
            {reviews.length} отзыва
          </div>
            
          {/* Блок рейтинга */}
          <div className="w-[358px] h-[197px] bg-[#FAFAFA] rounded-xl p-4">
            <div className="flex justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[40px] font-[500] leading-[47.92px] tracking-[-0.02em] text-[#020203]">
                  {averageRating}
                </span>
                <span className="text-[16px] font-[500] leading-[19.17px] tracking-[-0.02em] text-[#969999] ml-1">из 5</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203]">
                  {reviews.length} отзывов
                </span>
                <div className="w-[80px] h-[16px] flex gap-[2px]">
                  {[...Array(5)].map((_, index: number) => (
                    <Star
                      key={index}
                      size={16}
                      className={index < Math.round(parseFloat(averageRating))
                        ? 'text-[#1E47F7] fill-[#1E47F7]'
                        : 'text-[#969699]'
                      }
                    />
                  ))}
                </div>
                <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-[#020203] mt-1">394 оценок</span>
              </div>
            </div>
            
            {/* Форма отзыва */}
            <div className="mt-4 flex flex-col items-center">
              <img 
                src="/path/to/avatar.jpg" 
                alt="User avatar" 
                className="w-[32px] h-[32px] rounded-[100px] mb-2 object-cover object-center"
              />
              <span className="text-[14px] font-[400] leading-[16.77px] tracking-[-0.02em] text-[#7D7D80] mb-2">
                Оцените и напишите отзыв
              </span>
              <RatingStars />
            </div>
          </div>

          {/* Список отзывов */}
          <div className="mt-4">
            {place.isPremium ? (
              reviews.map((review, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src={review.authorAvatar} 
                      alt={review.authorName} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-white">
                        {review.authorName}
                      </p>
                      <p className="text-[12px] font-[400] leading-[14.38px] tracking-[-0.02em] text-white/60">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex gap-[2px] mb-1">
                      {[...Array(5)].map((_, star: number) => (
                        <Star 
                          key={star}
                          className={`w-3 h-3 text-white fill-white ${
                            star < review.rating ? '' : 'opacity-30'
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] mb-1 text-white">
                      {review.title}
                    </h3>
                    <p className="text-[14px] font-[400] leading-[16.77px] tracking-[-0.02em] text-white">
                      {review.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              reviews.map((review: any) => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsView;
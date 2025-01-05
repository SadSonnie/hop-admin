import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ArrowLeft, MapPin, Star, Phone, Mail, Instagram, Users, Coffee, Wine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Place } from '../../types';
import { fetchPlaceById } from '../../services/feedService';
import ReviewCard from './ReviewCard';
import { RatingStars } from './RatingStars';

const PlaceDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const [wasHere, setWasHere] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const loadPlace = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      
      setLoading(true);
      try {
        const placeData = await fetchPlaceById(parseInt(id, 10));
        if (!placeData) {
          throw new Error('Place not found');
        }
        setPlace(placeData);
      } catch (error) {
        console.error('Failed to load place:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    loadPlace();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Place not found</div>
      </div>
    );
  }

  // Расчет средней оценки
  const averageRating = place.reviews?.length 
    ? Number((place.reviews.reduce((sum, review) => sum + review.rating, 0) / place.reviews.length).toFixed(1))
    : 0;

  const handleBack = () => {
    navigate('/');
  };

  const imagesLength = place.images?.length || 1;
  const imageIndex = ((page % imagesLength) + imagesLength) % imagesLength;
  const nextImageIndex = ((imageIndex + 1) % imagesLength);
  const prevImageIndex = ((imageIndex - 1 + imagesLength) % imagesLength);

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
    const level = typeof place.priceLevel === 'string' ? parseInt(place.priceLevel, 10) : 0;
    return Array(3).fill(0).map((_, index) => (
      <span 
        key={index} 
        className="text-sm font-medium leading-none" 
        style={{ color: index < level ? '#1e47f7' : '#9aacfb' }}
      >
        ₽
      </span>
    ));
  };

  const getTagIcon = (tagName: string) => {
    switch (tagName.toLowerCase()) {
      case 'cafe':
        return <Coffee className="w-4 h-4 text-white" />;
      case 'bar':
        return <Wine className="w-4 h-4 text-white" />;
      case 'restaurant':
        return <Users className="w-4 h-4 text-white" />;
      default:
        return null;
    }
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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Хедер */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={handleBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button>
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="pb-20">
        {/* Основной блок */}
        <div className="bg-white rounded-2xl mb-2">
          <div className="h-[46px] flex flex-col justify-between px-4">
            <p className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203]">{place.mainTag?.name}</p>
            <h1 className="text-[24px] font-[500] leading-[28.75px] tracking-[-0.02em] text-[#020203]">{place.name}</h1>
          </div>
          {/* Слайдер изображений */}
          <div className="relative h-72 overflow-hidden rounded-xl mx-4 mb-4">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              {place.images?.[imageIndex] && (
                <motion.div
                  key={page}
                  className="absolute inset-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
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
                  aria-label={`Image ${imageIndex + 1} of ${place.images?.length}`}
                  role="img"
                >
                  <img
                    src={place.images[imageIndex]}
                    alt={`${place.name} - фото ${imageIndex + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.div>
              )}
              {isDragging && place.images && (
                <>
                  {place.images[prevImageIndex] && (
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
                        src={place.images[prevImageIndex]}
                        alt={`${place.name} - предыдущее фото`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </motion.div>
                  )}
                  {place.images[nextImageIndex] && (
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
                        src={place.images[nextImageIndex]}
                        alt={`${place.name} - следующее фото`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
            {/* Теги заведения */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
              {place.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-2"
                  style={{ background: 'rgba(0, 0, 0, 0.1)' }}
                >
                  {getTagIcon(tag.name)}
                  <span className="text-sm font-medium text-white">{tag.name}</span>
                </div>
              ))}
            </div>
            {/* Индикаторы слайдера */}
            {place.images && place.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {place.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === imageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => handleDotClick(index)}
                    aria-label={`Перейти к фото ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Информация о заведении */}
          <div className="px-4 py-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setWasHere(!wasHere)}
              className={`w-[32vw] min-w-[125px] h-[7.1vw] min-h-[30px] rounded-full text-[2.8vw] min-text-[12px] font-medium leading-[1.2] tracking-[-0.02em] transition-colors whitespace-nowrap
                ${wasHere 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-[#020203] border border-[#969699] hover:bg-gray-50'
                }`}
              aria-pressed={wasHere}
            >
              {wasHere ? 'Я здесь был(а)' : 'Я здесь не был(а)'}
            </button>
            
            <div className="flex items-center gap-2">
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center gap-1"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className="text-[2.8vw] min-text-[12px] font-[500] leading-[120%] tracking-[-0.02em] text-blue-600">{place.rating}</span>
                <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
              </div>
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center gap-0.5"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className="font-medium">{renderPriceLevel()}</span>
              </div>
              <div 
                className="h-[5.2vw] min-h-[22px] backdrop-blur-md px-[0.5rem] rounded-[100px] flex items-center"
                style={{ background: 'rgba(30, 71, 247, 0.08)' }}
              >
                <span className="text-[2.8vw] min-text-[12px] font-[500] leading-[120%] tracking-[-0.02em] text-blue-600">{place.distance}</span>
              </div>
            </div>
          </div>

          {/* Описание */}
          <p className="text-[#020203] text-[14px] leading-[15.4px] tracking-[-0.02em] font-normal px-4 py-3">{place.description}</p>
        </div>

        {/* Дополнительно */}
        <div className="bg-white rounded-2xl px-4 py-3">
          <h2 className="text-[16px] font-[500] leading-[19.17px] tracking-[-0.02em] text-[#020203] mb-4">Дополнительно</h2>
          
          {/* Построить маршрут */}
          <button 
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl mb-4 transition-colors"
            onClick={() => {
              // Handle route building logic here
              console.log('Building route to:', place.address);
            }}
          >
            <MapPin className="w-5 h-5" />
            <span>Построить маршрут</span>
          </button>

          {/* Адрес и контакты */}
          <div className="flex flex-col gap-4">
            {/* Адрес */}
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#FAFAFA] rounded-[100px]">
                <MapPin className="w-6 h-6 text-[#020203]" />
              </div>
              <span className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203] pt-2.5">{place.address}</span>
            </div>

            {/* Телефон (только для премиум) */}
            {place.isPremium && place.phone && (
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#FAFAFA] rounded-[100px]">
                  <Phone className="w-6 h-6 text-[#020203]" />
                </div>
                <span className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203] pt-2.5">{place.phone}</span>
              </div>
            )}
          </div>

          {/* Контакты (только для премиум) */}
          {place.isPremium && (
            <div>
              {place.email && (
                <div className="flex items-center gap-3 py-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${place.email}`} className="text-gray-700 font-medium">{place.email}</a>
                </div>
              )}
              {place.instagram && (
                <div className="flex items-center gap-3 py-3">
                  <Instagram className="w-5 h-5 text-gray-400" />
                  <a href={`https://instagram.com/${place.instagram}`} className="text-gray-700 font-medium">@{place.instagram}</a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Отзывы */}
        <div className="bg-white rounded-2xl p-4">
          <div className="text-[14px] font-[500] leading-[16.77px] tracking-[-0.02em] text-[#020203] mb-4">
            {place.reviews?.length 
              ? `${place.reviews.length} ${place.reviews.length === 1 ? 'отзыв' : 'отзыва'}`
              : 'Нет отзывов'}
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
                  {place.reviews?.length} отзывов
                </span>
                <div className="w-[80px] h-[16px] flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-3 h-3 text-[#2846ED] fill-[#2846ED]"
                    />
                  ))}
                </div>
                <span className="text-[12px] font-[500] leading-[14.38px] tracking-[-0.02em] text-[#020203] mt-1">394 оценок</span>
              </div>
            </div>
            
            {/* Форма отзыва */}
            <div className="mt-4 flex flex-col items-center">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60" 
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
            {place.reviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsView;
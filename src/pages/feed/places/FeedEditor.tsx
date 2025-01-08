import React, { useState, useEffect } from 'react';
import { PenSquare, Plus, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import PlaceCard from './PlaceCard';
import FeaturedCollection from './FeaturedCollection';
import { fetchFeedItems, fetchAllPlaces } from '../../../services/feedService';
import type { Place, FeedItem, Collection } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AddContentModal } from './AddContentModal';
import { api } from '../../../utils/api';

const FeedItem = React.memo(({ item, index, isEditing, feedItems, setFeedItems }: {
  item: FeedItem;
  index: number;
  isEditing: boolean;
  feedItems: FeedItem[];
  setFeedItems: (items: FeedItem[]) => void;
}) => {
  const moveItem = (toIndex: number) => {
    const newItems = feedItems.map(item => ({
      ...item,
      data: { ...item.data } // Глубокое копирование данных
    }));
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(toIndex, 0, movedItem);
    setFeedItems(newItems);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative mb-4"
    >
      {isEditing && (
        <div className="absolute -right-14 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-100 py-2 px-1.5">
          <button
            onClick={() => index > 0 && moveItem(index - 1)}
            className={`p-1 rounded transition-colors ${index > 0 ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}`}
            title={index > 0 ? "Переместить вверх" : "Нельзя переместить вверх"}
            disabled={!index > 0}
          >
            <ArrowUp className={`w-5 h-5 ${index > 0 ? '' : 'text-gray-300'}`} />
          </button>
          
          <button
            onClick={() => {
              const newItems = feedItems.map(item => ({
                ...item,
                data: { ...item.data } // Глубокое копирование данных
              }));
              newItems.splice(index, 1);
              setFeedItems(newItems);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Удалить"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>

          <button
            onClick={() => index < feedItems.length - 1 && moveItem(index + 1)}
            className={`p-1 rounded transition-colors ${index < feedItems.length - 1 ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}`}
            title={index < feedItems.length - 1 ? "Переместить вниз" : "Нельзя переместить вниз"}
            disabled={!(index < feedItems.length - 1)}
          >
            <ArrowDown className={`w-5 h-5 ${index < feedItems.length - 1 ? '' : 'text-gray-300'}`} />
          </button>
        </div>
      )}
      <div>
        {item.type === 'collection' ? (
          <FeaturedCollection collection={item.data} />
        ) : (
          <PlaceCard place={item.data} />
        )}
      </div>
    </motion.div>
  );
});

FeedItem.displayName = 'FeedItem';

const AddNewPlaceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <button
        onClick={onClick}
        className="w-full p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Добавить</span>
      </button>
    </div>
  );
};

const FeedEditor: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await api.getFeed();
        // Сохраняем все данные как есть, без преобразований
        setFeedItems(response.items);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Загрузка доступных мест при открытии модального окна
  useEffect(() => {
    const loadAvailablePlaces = async () => {
      try {
        const allPlaces = await fetchAllPlaces();
        console.log('All places loaded:', allPlaces);
        
        // Фильтруем места, которые уже есть в ленте
        const existingPlaceIds = new Set(
          feedItems
            .filter(item => item.type === 'place')
            .map(item => {
              const placeId = (item.data as Place).id;
              console.log('Existing place ID:', placeId);
              return placeId;
            })
        );
        console.log('Existing place IDs set:', existingPlaceIds);

        const filtered = allPlaces.filter(place => {
          const shouldInclude = !existingPlaceIds.has(place.id);
          console.log(`Place ${place.id} (${place.name}) should be included:`, shouldInclude);
          return shouldInclude;
        });
        
        console.log('Filtered places:', filtered);
        setAvailablePlaces(filtered);
      } catch (error) {
        console.error('Failed to load available places:', error);
      }
    };

    if (isModalOpen) {
      loadAvailablePlaces();
    }
  }, [isModalOpen, feedItems]);

  const handleAddPlace = (place: Place) => {
    const newItem: FeedItem = {
      id: `${Date.now()}`,
      type: 'place',
      order: feedItems.length + 1,
      data: place,
    };
    setFeedItems(prevItems => [...prevItems, newItem]);
    setIsModalOpen(false);
  };

  const handleAddCollection = async (collection: Collection) => {
    try {
      // Получаем места для подборки
      const places = await Promise.all(
        (collection.places_ids || []).map(id => api.getPlace(id))
      );
      
      const newItem: FeedItem = {
        id: `${Date.now()}`,
        type: 'collection',
        order: feedItems.length + 1,
        data: {
          ...collection,
          places // Добавляем места в подборку
        },
      };
      setFeedItems(prevItems => [...prevItems, newItem]);
    } catch (error) {
      console.error('Failed to load places for collection:', error);
    }
    setIsModalOpen(false);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...feedItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setFeedItems(newItems);
    // TODO: Save new order to backend
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-semibold">Лента</h1>
        <button
          onClick={async () => {
            if (isEditing) {
              try {
                // Отправляем элементы ленты, сохраняя ID из оригинальных данных
                const items = feedItems.map(item => ({
                  type: item.type,
                  data: {
                    ...item.data,
                    id: parseInt(item.id) // Используем ID из item для всех типов
                  }
                }));

                console.log('Saving feed items:', items);
                console.log('Original feedItems:', feedItems);

                await api.saveFeed(items);
                console.log('Feed saved successfully');
              } catch (error) {
                console.error('Failed to save feed:', error);
                return; // Не выходим из режима редактирования при ошибке
              }
            }
            setIsEditing(!isEditing);
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isEditing ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <PenSquare className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 bg-[#fafafa] overflow-y-auto">
        <div className={`container mx-auto p-4 ${isEditing ? 'pr-20' : ''}`}>
          <AnimatePresence>
            {feedItems.map((item, index) => (
              <FeedItem
                key={`${item.type}-${item.id}`}
                item={item}
                index={index}
                isEditing={isEditing}
                feedItems={feedItems}
                setFeedItems={setFeedItems}
              />
            ))}
          </AnimatePresence>
          {isEditing && (
            <AddNewPlaceButton onClick={() => setIsModalOpen(true)} />
          )}
        </div>
      </div>

      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPlace={handleAddPlace}
        onAddCollection={handleAddCollection}
        availablePlaces={availablePlaces}
      />
    </div>
  );
};

export default FeedEditor;

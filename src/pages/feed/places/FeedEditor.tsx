import React, { useState, useEffect } from 'react';
import { PenSquare, Plus, ArrowUp, ArrowDown, Check, X } from 'lucide-react';
import FeaturedCollection from './FeaturedCollection';
import PlaceCard from './PlaceCard'; // Add import for PlaceCard
import { fetchAllPlaces } from '../../../services/feedService';
import type { Place, Collection } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AddContentModal } from './AddContentModal';
import { api } from '../../../utils/api';

type FeedItemType = {
  id: string;
  order: number;
  type: 'place' | 'collection';
  data: any;
};

const FeedItemComponent = React.memo(({ item, index, isEditing, feedItems, setFeedItems }: {
  item: FeedItemType;
  index: number;
  isEditing: boolean;
  feedItems: FeedItemType[];
  setFeedItems: (items: FeedItemType[]) => void;
}) => {
  const moveItem = (toIndex: number) => {
    const newItems = feedItems.map(item => ({ ...item }));
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
            disabled={index === 0}
          >
            <ArrowUp className={`w-5 h-5 ${index > 0 ? '' : 'text-gray-300'}`} />
          </button>
          
          <button
            onClick={() => {
              const newItems = feedItems.map(item => ({ ...item }));
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
            disabled={index === feedItems.length - 1}
          >
            <ArrowDown className={`w-5 h-5 ${index < feedItems.length - 1 ? '' : 'text-gray-300'}`} />
          </button>
        </div>
      )}
      <div>
        {item.type === 'collection' ? (
          <FeaturedCollection collection={item.data} />
        ) : item.data ? (
          <PlaceCard 
            id={item.data.id}
            name={item.data.name}
            address={item.data.address}
            category_id={item.data.category_id}
            description={item.data.description}
            isPremium={item.data.isPremium}
            priceLevel={item.data.priceLevel}
            main_photo_url={item.data.main_photo_url}
            imageUrl={item.data.main_photo_url}
            rating={item.data.rating || 0}
            distance={item.data.distance || '0 км'}
            tagIds={item.data.PlaceTags?.map((tag: { tag_id: number }) => tag.tag_id) || []}
          />
        ) : null}
      </div>
    </motion.div>
  );
});

FeedItemComponent.displayName = 'FeedItemComponent';

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
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);

  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        const response = await api.getFeed();
        const items = await Promise.all(
          (response.items as FeedItemType[]).map(async (value) => {
            if (value.type === 'collection') {
              // Загружаем данные для коллекции
              const collectionData = value.data;
              if (collectionData.places?.length) {
                // Загружаем данные для каждого места в коллекции
                const placesWithData = await Promise.all(
                  collectionData.places.map(async (place: any) => {
                    try {
                      const placeData = await api.getPlace(place.id);
                      return {
                        ...placeData,
                        id: placeData.id.toString()
                      };
                    } catch (error) {
                      console.error(`Error loading place ${place.id} for collection:`, error);
                      return place;
                    }
                  })
                );
                return {
                  ...value,
                  data: {
                    ...collectionData,
                    places: placesWithData
                  }
                };
              }
              return value;
            }
            const placeId = value.id;
            const placeData = await api.getPlace(placeId);
            return {
              ...value,
              data: placeData
            } as FeedItemType;
          })
        );
        console.log('Loaded feed items:', items);
        setFeedItems(items);
      } catch (error) {
        console.error('Failed to load feed:', error);
        setError('Failed to load feed items');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  useEffect(() => {
    const loadAvailablePlaces = async () => {
      try {
        const allPlaces = await fetchAllPlaces();
        const existingPlaceIds = new Set(
          feedItems
            .filter(item => item.type === 'place')
            .map(item => item.data.id)
        );

        const filtered = allPlaces
          .filter(place => !existingPlaceIds.has(place.id))
          .map(place => ({ ...place }));
        
        setAvailablePlaces(filtered);
      } catch {
        setAvailablePlaces([]);
      }
    };

    if (isModalOpen) {
      loadAvailablePlaces();
    }
  }, [isModalOpen, feedItems]);

  const handleAddPlace = (place: any) => {
    const newItem: FeedItemType = {
      id: place.id,
      type: 'place',
      order: feedItems.length + 1,
      data: {
        ...place,
        id: place.id,
        PlaceTags: [],
        mainTag: place.mainTag
      }
    };
    setFeedItems(prevItems => [...prevItems, newItem]);
    setIsModalOpen(false);
  };

  const handleAddCollection = async (collection: Collection & { places_ids?: string[] }) => {
    try {
      console.log('Adding collection to feed:', collection);
      
      // Загружаем данные для каждого места из places_ids
      const places = await Promise.all(
        (collection.places_ids || []).map(async (placeId: string) => {
          const placeData = await api.getPlace(placeId);
          return {
            ...placeData,
            id: placeData.id.toString(),
            imageUrl: placeData.main_photo_url,
            mainTag: (placeData as any).Category?.name || '',
            rating: placeData.rating || 0,
            distance: placeData.distance || '0 km'
          };
        })
      );

      console.log('Loaded places:', places);

      // Создаем элемент ленты из коллекции
      const feedCollection: FeedItemType = {
        id: collection.id.toString(),
        type: 'collection',
        order: feedItems.length + 1,
        data: {
          ...collection,
          places // Добавляем загруженные места в коллекцию
        }
      };

      console.log('Created feed item:', feedCollection);
      
      // Добавляем в ленту
      setFeedItems(prevItems => {
        const newItems = [...prevItems, feedCollection];
        console.log('Updated feed items:', newItems);
        return newItems;
      });
    } catch (error) {
      console.error('Error adding collection:', error);
    }
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
                const items = feedItems.map(item => ({
                  id: item.data.id, // Используем ID из data
                  type: item.type,
                  data: item.data
                }));
                console.log('Saving feed items:', items); // Добавляем логирование
                await api.saveFeed(items);
              } catch (error) {
                console.error('Failed to save feed:', error);
                return;
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
              <FeedItemComponent
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

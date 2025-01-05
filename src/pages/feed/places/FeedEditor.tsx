import React, { useState, useEffect } from 'react';
import { PenSquare, Plus, ArrowUp, ArrowDown, Check } from 'lucide-react';
import PlaceCard from './PlaceCard';
import FeaturedCollection from './FeaturedCollection';
import { fetchFeedItems, fetchAllPlaces } from '../../../services/feedService';
import type { Place, FeedItem, Collection } from '../../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AddContentModal } from './AddContentModal';

const FeedItem: React.FC<{
  item: FeedItem;
  index: number;
  isEditing: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}> = React.memo(({ item, index, isEditing, isFirst, isLast, onMoveUp, onMoveDown }) => {
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ArrowUp className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ArrowDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}
      <div className={isEditing ? 'pr-20' : ''}>
        {item.type === 'place' ? (
          <PlaceCard {...item.data as Place} />
        ) : (
          <FeaturedCollection collection={item.data as Collection} />
        )}
      </div>
    </motion.div>
  );
});

const AddNewPlaceButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <button
        onClick={onClick}
        className="w-full p-4 flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>Добавить место</span>
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
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await fetchFeedItems();
        setFeedItems(items.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Failed to load feed:', error);
        setError('Failed to load feed items');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
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

  const handleAddCollection = () => {
    // TODO: Implement collection creation
    setIsModalOpen(false);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...feedItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    // Update order numbers
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setFeedItems(updatedItems);
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
          onClick={() => setIsEditing(!isEditing)}
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
        <div className="px-4 py-4">
          <AnimatePresence>
            {feedItems.map((item, index) => (
              <FeedItem
                key={`item-${item.id}`}
                item={item}
                index={index}
                isEditing={isEditing}
                isFirst={index === 0}
                isLast={index === feedItems.length - 1}
                onMoveUp={() => moveItem(index, index - 1)}
                onMoveDown={() => moveItem(index, index + 1)}
              />
            ))}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <AddNewPlaceButton
                  onClick={() => setIsModalOpen(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
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

import React from 'react';
import CollectionCard from './CollectionCard';
import { FeedCollection } from '../../../types/feed';
import { UIPlace } from '../../../types';

interface FeaturedCollectionProps {
  collection: FeedCollection;
  onPlaceClick?: (placeId: string) => void;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  collection,
}) => {
  console.log('FeaturedCollection received:', collection);

  // Преобразуем места в формат UIPlace
  const places: UIPlace[] = (collection.places?.map(place => ({
    ...place,
    imageUrl: place.main_photo_url,
    mainTag: (place as any).Category?.name || '',
    rating: place.rating || 0,
    distance: place.distance || '0 km'
  })) || []) as UIPlace[];

  return (
    <div className="mb-6 w-full">
      <div className="rounded-xl border border-[#1e47f7]/10 bg-[#1e47f7]/[0.02] w-full">
        <div className="px-4 pt-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{collection.title || collection.name}</h2>
          {collection.description && (
            <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
          )}
        </div>
        <div className="collection-cards flex overflow-x-auto pb-4 px-2 hide-scrollbar">
          {places.map((place) => (
            <div key={place.id} className="flex-none mr-4 last:mr-0">
              <CollectionCard place={place} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;
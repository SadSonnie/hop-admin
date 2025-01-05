import React from 'react';
import type { Collection } from '../../types';
import CollectionCard from './CollectionCard';

interface FeaturedCollectionProps {
  collection: Collection;
  onPlaceClick: (placeId: number) => void;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  collection,
  onPlaceClick,
}) => {
  return (
    <div className="mb-6 w-full">
      <div className="rounded-xl border border-[#1e47f7]/10 bg-[#1e47f7]/[0.02] w-full">
        <div className="px-4 pt-4 mb-4">
          <h2 className="text-lg font-bold text-gray-900">{collection.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
        </div>
        <div className="collection-cards flex overflow-x-auto pb-4 px-2 hide-scrollbar">
          {collection.places.map((place) => (
            <div key={`collection-${collection.id}-place-${place.id}`} className="flex-none">
              <CollectionCard
                place={place}
                onClick={() => onPlaceClick(place.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;
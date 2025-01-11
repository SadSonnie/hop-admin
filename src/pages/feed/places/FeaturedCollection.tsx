import React, { useEffect, useState } from 'react';
import type { Collection } from '../../../types';
import CollectionCard from './CollectionCard';
import api from '../../../utils/api';

interface PlaceData {
  [key: number]: any; // Assuming Place type is not defined in the provided code
}

interface FeaturedCollectionProps {
  collection: Collection;
  onPlaceClick?: (placeId: number) => void;
}

const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  collection,
  onPlaceClick,
}) => {
  const [placesData, setPlacesData] = useState<PlaceData>({});

  useEffect(() => {
    const fetchPlacesData = async () => {
      const data: PlaceData = {};
      for (const place of collection.places) {
        try {
          const placeData = await api.getPlace(place.id);
          data[place.id] = placeData;
        } catch (error) {
          console.error(`Error fetching place ${place.id}:`, error);
        }
      }
      setPlacesData(data);
    };

    fetchPlacesData();
  }, [collection.places]);

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
          {collection.places?.map((place) => (
            <div key={`collection-${collection.id}-place-${place.id}`} className="flex-none">
              <CollectionCard
                place={placesData[place.id] || place}
                onClick={onPlaceClick ? () => onPlaceClick(place.id) : undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;
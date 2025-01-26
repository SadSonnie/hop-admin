import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Place } from '../../types';

interface PendingPlace extends Place {
  status: 'pending' | 'approved' | 'rejected';
}

const mockPendingLocations: PendingPlace[] = [
  {
    id: '1',
    name: 'Sunset Cafe',
    description: 'A cozy cafe with a beautiful sunset view',
    status: 'pending',
    address: '123 Sunset Blvd',
    category_id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    Category: { id: 1, name: 'Cafe' },
    PlaceTags: [],
    main_photo_url: '',
    CollectionPlaces: [],
    PlacePhotos: [],
    photos: []
  },
  {
    id: '2',
    name: 'Mountain View Restaurant',
    description: 'Fine dining with panoramic mountain views',
    status: 'pending',
    address: '456 Mountain Road',
    category_id: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    Category: { id: 2, name: 'Restaurant' },
    PlaceTags: [],
    main_photo_url: '',
    CollectionPlaces: [],
    PlacePhotos: [],
    photos: []
  }
];

export const PendingLocations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 flex items-center gap-2"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-6">Pending Locations</h1>
      <div className="space-y-4">
        {mockPendingLocations.map((location) => (
          <div key={location.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{location.name}</h3>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <p className="text-gray-600 mb-4">{location.description}</p>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                Approve
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
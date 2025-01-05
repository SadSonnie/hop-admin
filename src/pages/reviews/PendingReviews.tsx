import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Review } from '../../types';

const mockPendingReviews: Review[] = [
  {
    id: '1',
    locationId: '1',
    userId: 'user1',
    rating: 4,
    content: 'Great place! The atmosphere is amazing and the staff is very friendly.',
    status: 'pending'
  },
  {
    id: '2',
    locationId: '2',
    userId: 'user2',
    rating: 5,
    content: 'Best restaurant in town. The food is absolutely delicious!',
    status: 'pending'
  }
];

export const PendingReviews: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 flex items-center gap-2"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-semibold mb-6">Review Moderation</h1>
      <div className="space-y-4">
        {mockPendingReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">★</span>
                <span className="font-medium">{review.rating}/5</span>
              </div>
              <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
            <p className="text-gray-600 mb-4">{review.content}</p>
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
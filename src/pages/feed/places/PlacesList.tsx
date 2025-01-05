import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedCollection from './FeaturedCollection';
import { fetchFeedItems } from '../feedService';
import type { Place, FeedItem, Collection } from '../../types';

const PlacesList: React.FC = () => {
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handlePlaceClick = (place: Place) => {
    navigate(`/places/${place.id}`);
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
    <div className="pb-16">
      <div className="bg-[#fafafa] pb-7">
        {feedItems.map((item) => (
          <div key={item.id}>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlacesList;
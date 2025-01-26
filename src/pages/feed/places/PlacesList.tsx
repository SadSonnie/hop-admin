import React, { useState } from 'react';
import type { Place } from '../../../types/index';

const PlacesList: React.FC = () => {
  const [feedItems,] = useState<Place[]>([]);
  const [loading,] = useState(true);
  const [error,] = useState<string | null>(null);

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
    <div className="flex flex-col min-h-screen pb-32">
      <div className="flex-grow bg-[#fafafa]">
        {feedItems.map((item, index) => (
          <div key={item.id} className={index === feedItems.length - 1 ? 'mb-20' : ''}>
            {/* содержимое карточки */}
          </div>
        ))}
      </div>
      {/* Этот div будет всегда оставаться внизу и не даст меню перекрыть контент */}
      <div className="h-24 shrink-0"></div>
    </div>
  );
};

export default PlacesList;
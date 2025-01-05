import React from 'react';
import { PlusCircle } from 'lucide-react';

interface FeedControlsProps {
  onAddPlace: () => void;
  onAddCollection: () => void;
  onAddToCollection: (collectionId: number) => void;
  collections: { id: number; title: string }[];
}

const FeedControls: React.FC<FeedControlsProps> = ({
  onAddPlace,
  onAddCollection,
  onAddToCollection,
  collections
}) => {
  return (
    <div className="fixed bottom-20 right-4 flex flex-col gap-2 z-50">
      <button
        onClick={onAddPlace}
        className="bg-[#1e47f7] text-white p-2 rounded-full shadow-lg hover:bg-[#1a3ed8] transition-colors"
        title="Add Random Place"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
      <button
        onClick={onAddCollection}
        className="bg-[#1e47f7] text-white p-2 rounded-full shadow-lg hover:bg-[#1a3ed8] transition-colors"
        title="Add Random Collection"
      >
        <PlusCircle className="w-6 h-6" />
      </button>
      {collections.map(collection => (
        <button
          key={collection.id}
          onClick={() => onAddToCollection(collection.id)}
          className="bg-white text-[#1e47f7] p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-[#1e47f7]"
          title={`Add to ${collection.title}`}
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
};

export default FeedControls;
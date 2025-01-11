import React, { useState, useEffect } from 'react';
import { MapPin, Layers, X } from 'lucide-react';
import type { Place, Collection } from '../../../types';
import { api } from '../../../utils/api';

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlace: (place: Place) => void;
  onAddCollection: (collection: Collection) => void;
  availablePlaces: Place[];
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onAddPlace,
  onAddCollection,
  availablePlaces
}) => {
  const [selectedType, setSelectedType] = useState<'place' | 'collection' | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  // Сбрасываем selectedType при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setSelectedType(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedType === 'collection') {
      loadCollections();
    }
  }, [selectedType]);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const response = await api.getCollections();
      setCollections(response);
    } catch (error) {
      console.error('Failed to load collections:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-hidden z-50">
      <div className="bg-white rounded-lg w-full max-w-sm flex flex-col max-h-[70vh]">
        <div className="flex justify-between items-center p-3 border-b shrink-0">
          <h2 className="text-lg font-semibold">
            {selectedType === null
              ? 'Добавить в ленту'
              : selectedType === 'place'
              ? 'Выберите место'
              : 'Выберите подборку'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3 overflow-y-auto">
          {selectedType === null ? (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedType('place')}
                className="w-full flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
              >
                <MapPin className="text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Добавить место</div>
                  <div className="text-sm text-gray-500">
                    Выберите место из списка
                  </div>
                </div>
              </button>
              <button
                onClick={() => setSelectedType('collection')}
                className="w-full flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
              >
                <Layers className="text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Добавить подборку</div>
                  <div className="text-sm text-gray-500">
                    Выберите подборку из списка
                  </div>
                </div>
              </button>
            </div>
          ) : selectedType === 'place' ? (
            <div className="space-y-4">
              {availablePlaces.length > 0 ? (
                availablePlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => {
                      onAddPlace(place);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="text-left">
                      <div className="font-medium">{place.name}</div>
                      <div className="text-sm text-gray-500">
                        {place.mainTag} • {place.rating} ★
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Все места уже добавлены в ленту
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Загрузка подборок...
                </div>
              ) : collections.length > 0 ? (
                collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => {
                      onAddCollection(collection);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50"
                  >
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Layers className="text-blue-500" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{collection.name}</div>
                      {collection.description && (
                        <div className="text-sm text-gray-500">
                          {collection.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  Нет доступных подборок
                </div>
              )}
            </div>
          )}
        </div>

        {selectedType !== null && (
          <div className="border-t p-3 shrink-0">
            <button
              onClick={() => setSelectedType(null)}
              className="w-full px-3 py-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"
            >
              Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

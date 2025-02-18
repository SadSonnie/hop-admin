import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import type { Place } from '../../types';
import api from '../../utils/api';
import { Modal, message } from 'antd';

interface PendingPlace extends Place {
  status: 'pending' | 'approved' | 'rejected';
}

export const PendingLocations: React.FC = () => {
  const navigate = useNavigate();
  const {  } = useCategories();
  const [pendingLocations, setPendingLocations] = useState<PendingPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingLocations = async () => {
      try {
        setIsLoading(true);
        const places = await api.getPlaces({ showAll: true });
        const pendingPlaces = (places as (Place & PendingPlace)[]).filter(place => place.status === 'pending');
        setPendingLocations(pendingPlaces);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pending locations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingLocations();
  }, []);

  const handleCardClick = (locationId: string) => {
    navigate(`/locations/edit/${locationId}`);
  };

  const handleDelete = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: 'Удаление места',
      icon: null,
      content: (
        <div className="py-4">
          <p className="text-gray-600">Вы уверены, что хотите удалить это место?</p>
        </div>
      ),
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
        danger: true,
      },
      onOk: async () => {
        try {
          await api.deletePlace(locationId);
          setPendingLocations(prev => prev.filter(location => location.id !== locationId));
          message.success('Место успешно удалено');
        } catch (err) {
          console.error('Failed to delete place:', err);
          message.error('Не удалось удалить место');
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <div className="text-red-500">
          Ошибка: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 flex items-center gap-2"
      >
        ← Назад
      </button>
      <h1 className="text-2xl font-semibold mb-6">Предложенные локации</h1>
      {pendingLocations.length === 0 ? (
        <p className="text-gray-500">Нет мест, ожидающих модерации</p>
      ) : (
        <div className="space-y-4">
          {pendingLocations.map((location) => (
            <div 
              key={location.id} 
              onClick={() => handleCardClick(location.id)}
              className="w-full overflow-hidden rounded-xl cursor-pointer bg-white"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium">
                    {location.Category ? `${location.Category.name} ${location.name}` : location.name}
                  </h3>
                  <button 
                    onClick={(e) => handleDelete(e, location.id)}
                    className="text-red-500 hover:text-red-600 px-2 py-1 rounded-lg text-sm"
                  >
                    Удалить
                  </button>
                </div>
                <p className="text-sm text-gray-600">{location.description}</p>
                <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Добавлено: {new Date(location.createdAt || '').toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
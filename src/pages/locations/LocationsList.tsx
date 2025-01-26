import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, message, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Place } from '../../types';
import LocationCard from './LocationCard';
import { api } from '../../utils/api';

const LocationsList: React.FC = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getPlaces();
      setPlaces(response);
    } catch {
      setError('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, []);

  const handleDelete = (place: Place) => {
    Modal.confirm({
      title: 'Удаление места',
      icon: null,
      content: (
        <div className="py-4">
          <p className="text-gray-600">Вы уверены, что хотите удалить место</p>
          <p className="font-medium mt-2 text-lg">"{place.name}"?</p>
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
          await api.deletePlace(place.id);
          message.success('Место успешно удалено');
          await loadPlaces();
        } catch (error) {
          console.error('Failed to delete place:', error);
          message.error('Не удалось удалить место');
        }
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Все места</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/locations/add')}
        >
          Добавить место
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Загрузка...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-600">{error}</div>
        </div>
      ) : places && places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <LocationCard
              key={place.id}
              {...place}
              onClick={() => navigate(`/locations/edit/${place.id}`)}
              onDelete={() => handleDelete(place)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Нет доступных мест</div>
        </div>
      )}
    </div>
  );
};

export default LocationsList;

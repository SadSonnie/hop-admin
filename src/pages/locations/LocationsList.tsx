import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Place } from '../../types';
import LocationCard from './LocationCard';

// Тестовые данные с реальными изображениями
export const mockPlaces: Place[] = [
  {
    id: 1,
    name: '"Центральное"',
    mainTag: 'Кафе',
    description: 'Уютное кафе в центре города с европейской кухней',
    rating: 4.5,
    distance: '2.5 км',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
    isPremium: true,
    priceLevel: 2
  },
  {
    id: 2,
    name: '"Панорама"',
    mainTag: 'Ресторан',
    description: 'Ресторан с видом на город и авторской кухней',
    rating: 4.8,
    distance: '3.1 км',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: true,
    priceLevel: 3
  },
  {
    id: 3,
    name: '"Сова"',
    mainTag: 'Бар',
    description: 'Атмосферный бар с крафтовым пивом и живой музыкой',
    rating: 4.3,
    distance: '1.8 км',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1347&q=80',
    isPremium: false,
    priceLevel: 2
  },
  {
    id: 4,
    name: '"Наполи"',
    mainTag: 'Пиццерия',
    description: 'Настоящая итальянская пицца в дровяной печи',
    rating: 4.6,
    distance: '0.7 км',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: true,
    priceLevel: 2
  },
  {
    id: 5,
    name: '"Сакура"',
    mainTag: 'Суши-бар',
    description: 'Японская кухня и свежие морепродукты',
    rating: 4.7,
    distance: '1.2 км',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: true,
    priceLevel: 3
  },
  {
    id: 6,
    name: '"Арома"',
    mainTag: 'Кофейня',
    description: 'Свежеобжаренный кофе и домашняя выпечка',
    rating: 4.4,
    distance: '0.3 км',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: false,
    priceLevel: 1
  },
  {
    id: 7,
    name: '"Прованс"',
    mainTag: 'Бистро',
    description: 'Французская кухня в casual формате',
    rating: 4.2,
    distance: '1.5 км',
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: false,
    priceLevel: 2
  },
  {
    id: 8,
    name: '"Стейк"',
    mainTag: 'Гриль-хаус',
    description: 'Лучшие стейки и мясные блюда',
    rating: 4.9,
    distance: '2.8 км',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: true,
    priceLevel: 3
  },
  {
    id: 9,
    name: '"У реки"',
    mainTag: 'Веранда',
    description: 'Летняя веранда с видом на реку',
    rating: 4.5,
    distance: '3.4 км',
    imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: true,
    priceLevel: 3
  },
  {
    id: 10,
    name: '"Старый город"',
    mainTag: 'Паб',
    description: 'Традиционный паб с большим выбором пива',
    rating: 4.3,
    distance: '1.9 км',
    imageUrl: 'https://images.unsplash.com/photo-1546726747-421c6d69c929?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isPremium: false,
    priceLevel: 2
  }
];

const LocationsList: React.FC = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>(mockPlaces);
  const [loading, setLoading] = useState(false);

  // В будущем здесь будет реальный API запрос
  useEffect(() => {
    // Здесь будет загрузка данных
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Все места</h1>
        <button 
          onClick={() => navigate('/locations/add')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Добавить место
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Загрузка...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <LocationCard key={place.id} {...place} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationsList;

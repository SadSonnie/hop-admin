import { Place } from '../types';
import { mockPlaces } from '../pages/locations/LocationsList';

export const fetchAllPlaces = async (): Promise<Place[]> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Service - mockPlaces:', mockPlaces);
  return mockPlaces || [];
};

export const fetchPlaceById = async (id: string | number): Promise<Place> => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const place = mockPlaces.find(p => p.id.toString() === id.toString());
  if (!place) {
    throw new Error('Place not found');
  }
  
  return place;
};

// Начальные элементы ленты (для тестирования)
export const fetchFeedItems = async () => {
  // Имитация задержки API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Возвращаем только два места для начального состояния ленты
  return [
    {
      id: '1',
      type: 'place',
      order: 1,
      data: mockPlaces[0]
    }
  ];
};

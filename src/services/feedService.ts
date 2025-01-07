import { Place } from '../types';
import { api } from '../utils/api';

export const fetchAllPlaces = async (): Promise<Place[]> => {
  return api.getPlaces();
};

export const fetchPlaceById = async (id: string | number): Promise<Place> => {
  try {
    const places = await api.getPlaces();
    const place = places.find(p => p.id.toString() === id.toString());
    if (!place) {
      throw new Error('Place not found');
    }
    return place;
  } catch (error) {
    throw new Error(`Failed to fetch place: ${error}`);
  }
};

// Начальные элементы ленты (для тестирования)
export const fetchFeedItems = async () => {
  try {
    const places = await api.getPlaces();
    if (places.length > 0) {
      return [{
        id: '1',
        type: 'place',
        order: 1,
        data: places[0]
      }];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch feed items:', error);
    return [];
  }
};

import type { Place } from '../../types/index';

export const fetchPlaceById = async (id: string): Promise<Place | null> => {
  // TODO: Implement actual API call to fetch place by ID
  try {
    const response = await fetch(`/api/places/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch place');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching place:', error);
    return null;
  }
};
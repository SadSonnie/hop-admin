import type { Place, Review, Collection, UserProfile, Article } from '../types';

// Интерфейсы для запросов
interface GetFeedParams {
  page?: number;
  limit?: number;
  sort?: 'newest' | 'popular' | 'nearest';
}

interface SearchParams {
  query: string;
  tags?: string[];
  priceLevel?: number;
  isPremium?: boolean;
}

// API endpoints
const API = {
  // Места
  places: {
    // Получить ленту мест
    getFeed: (params?: GetFeedParams): Promise<Place[]> => 
      GET('/api/feed', params),
    
    // Получить детали места
    getPlace: (id: number): Promise<Place> => 
      GET(`/api/places/${id}`),
    
    // Поиск мест
    search: (params: SearchParams): Promise<Place[]> => 
      GET('/api/places/search', params),
    
    // Добавить место в избранное
    addToFavorites: (placeId: number): Promise<void> => 
      POST('/api/places/favorites', { placeId }),
    
    // Удалить место из избранных
    removeFromFavorites: (placeId: number): Promise<void> => 
      DELETE(`/api/places/favorites/${placeId}`),
    
    // Добавить отзыв
    addReview: (placeId: number, review: Omit<Review, 'id' | 'date'>): Promise<Review> => 
      POST(`/api/places/${placeId}/reviews`, review)
  },

  // Подборки
  collections: {
    // Получить список подборок
    getCollections: (): Promise<Collection[]> => 
      GET('/api/collections'),
    
    // Получить подборку по ID
    getCollection: (id: number): Promise<Collection> => 
      GET(`/api/collections/${id}`),
    
    // Создать новую подборку
    createCollection: (data: Omit<Collection, 'id'>): Promise<Collection> => 
      POST('/api/collections', data),
    
    // Добавить место в подборку
    addPlace: (collectionId: number, placeId: number): Promise<void> => 
      POST(`/api/collections/${collectionId}/places`, { placeId }),
    
    // Удалить место из подборки
    removePlace: (collectionId: number, placeId: number): Promise<void> => 
      DELETE(`/api/collections/${collectionId}/places/${placeId}`)
  },

  // Профиль
  profile: {
    // Получить профиль пользователя
    getProfile: (): Promise<UserProfile> => 
      GET('/api/profile'),
    
    // Обновить профиль
    updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> => 
      PUT('/api/profile', data),
    
    // Получить избранные места
    getFavorites: (): Promise<Place[]> => 
      GET('/api/profile/favorites'),
    
    // Получить отзывы пользователя
    getReviews: (): Promise<Review[]> => 
      GET('/api/profile/reviews')
  },

  // Статьи
  articles: {
    // Получить список статей
    getArticles: (): Promise<Article[]> => 
      GET('/api/articles'),
    
    // Получить статью по ID
    getArticle: (id: number): Promise<Article> => 
      GET(`/api/articles/${id}`)
  }
};

// Вспомогательные функции для запросов
const GET = async <T>(url: string, params?: Record<string, any>): Promise<T> => {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
  const response = await fetch(url + queryString);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const POST = async <T>(url: string, data: Record<string, any>): Promise<T> => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const PUT = async <T>(url: string, data: Record<string, any>): Promise<T> => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const DELETE = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export default API;
import type { Place, Review, Category, Tag } from '../types';

const isDevelopment = import.meta.env.DEV;
const BASE_URL = import.meta.env.VITE_APP_URL;

// Тестовые данные для разработки
const mockInitData = 'tgWebAppData=query_id%3DAAHdxyz4BBBBBCCpqrst12345%26user%3D%257B%2522id%2522%253A987654321%252C%2522first_name%2522%253A%2522Alex%2522%252C%2522last_name%2522%253A%2522Smith%2522%252C%2522username%2522%253A%2522alexsmith%2522%252C%2522language_code%2522%253A%2522en%2522%252C%2522is_premium%2522%253Afalse%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FNewUserPhoto123.jpg%2522%257D%26auth_date%3D1734972300%26signature%3Dxyz123abc456def789ghi%26hash%3D987654321abcdef0123456789abcdef0123456789abcdef0123456789abcdef0';

// В режиме разработки используем мок данные, иначе пытаемся получить реальные данные из Telegram
const getInitData = () => {
  if (isDevelopment) {
    return mockInitData;
  }
  return window.Telegram?.WebApp?.initData || '';
};

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiRequest(endpoint: string, options: RequestOptions = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const headers = new Headers(options.headers);
  const initData = getInitData();
  
  // Всегда добавляем заголовок Authorization с данными из Telegram
  headers.set('Authorization', `Bearer ${initData}`);

  const response = await fetch(url.toString(), {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

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

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  places_ids: number[];
}

interface Category {
  id: string;
  // Add other category properties here
}

interface Tag {
  id: string;
  // Add other tag properties here
}

interface CreatePlaceData {
  name: string;
  address: string;
  category_id: number;
  collection_ids?: number[];
  tags_ids?: number[];
}

interface FeedItem {
  id: number;
  type: 'collection' | 'place';
  data: {
    title?: string;
    name?: string;
    address?: string;
    places?: Array<{
      id: number;
      name: string;
      address: string;
    }>;
  };
}

interface FeedResponse {
  items: FeedItem[];
  total: number;
}

export const api = {
  // Пользователь
  sendUserData: () => apiRequest('/users', {
    method: 'POST'
  }),
  
  // Профиль
  getProfile: (): Promise<UserProfile> => apiRequest('/profile'),
  
  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> => 
    apiRequest('/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getFavorites: (): Promise<Place[]> => apiRequest('/profile/favorites'),
  
  getReviews: (): Promise<Review[]> => apiRequest('/profile/reviews'),

  // Категории
  getCategories: () => apiRequest('/categories'),
  
  createCategory: (data: Omit<Category, 'id'>) => apiRequest('/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  updateCategory: (id: string, data: Partial<Category>) => apiRequest(`/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  deleteCategory: (id: number) => apiRequest('/categories', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }),

  // Теги
  getTags: () => apiRequest('/tags'),
  
  createTag: (data: Omit<Tag, 'id'>) => apiRequest('/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  
  deleteTag: (id: number) => apiRequest('/tags', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }),

  // Места
  createPlace: (data: CreatePlaceData) => apiRequest('/places', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),

  getPlaces: () => apiRequest('/places', {
    method: 'GET',
  }).then(response => {
    if (response && typeof response === 'object') {
      const places = response.data || response.items || response.results || response;
      return Array.isArray(places) ? places : [];
    }
    return [];
  }),

  getPlace: (id: number | string) => apiRequest(`/places/${id}`, {
    method: 'GET',
  }),

  updatePlace: (id: number | string, data: Partial<CreatePlaceData>) => apiRequest('/places', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  }),

  deletePlace: (id: number | string) => apiRequest('/places', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }),

  // Дополнительные методы для мест
  getFeed: (params?: GetFeedParams): Promise<FeedResponse> => 
    apiRequest('/feed', { params }),
  
  saveFeed: (items: FeedItem[]): Promise<void> => {
    return apiRequest('/feed', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items }),
    }).catch(error => {
      if (error.message.includes('404')) {
        // Если лента не найдена, создаем новую через POST
        return apiRequest('/feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items }),
        });
      }
      throw error;
    });
  },

  searchPlaces: (params: SearchParams): Promise<Place[]> => 
    apiRequest('/places/search', { params }),
  
  addToFavorites: (placeId: number): Promise<void> => 
    apiRequest('/places/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ placeId }),
    }),
  
  removeFromFavorites: (placeId: number): Promise<void> => 
    apiRequest(`/places/favorites/${placeId}`, {
      method: 'DELETE',
    }),
  
  addReview: (placeId: number, review: Omit<Review, 'id' | 'date'>): Promise<Review> => 
    apiRequest(`/places/${placeId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    }),

  // Подборки
  getCollections: (params?: { limit?: number; offset?: number }) => 
    apiRequest('/collections', {
      method: 'GET',
      params,
    }).then(response => response.items || []),

  getCollection: (id: string | number) => 
    apiRequest(`/collections/${id}`, {
      method: 'GET',
    }),

  createCollection: (data: { name: string; description: string; places_ids?: number[] }) => 
    apiRequest('/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }),

  updateCollection: (id: number, data: Partial<{ name: string; description: string; places_ids: number[] }>) => 
    apiRequest('/collections', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    }),

  deleteCollection: (id: number) => apiRequest('/collections', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }),

  addPlaceToCollection: (collectionId: number, placeId: number): Promise<void> =>
    apiRequest(`/collections/${collectionId}/places/${placeId}`, {
      method: 'POST',
    }),

  removePlaceFromCollection: (collectionId: number, placeId: number): Promise<void> =>
    apiRequest(`/collections/${collectionId}/places/${placeId}`, {
      method: 'DELETE',
    }),

  getAllPlaces: () => apiRequest('/places', {
    method: 'GET',
  }).then(response => {
    const places = response.data || response.items || response.results || response;
    return Array.isArray(places) ? places : [];
  }),
};

export default api;

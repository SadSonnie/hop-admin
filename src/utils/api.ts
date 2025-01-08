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
  id: string | number;
  type: 'collection' | 'place';
  data: {
    id?: string | number;
    title?: string;
    name?: string;
    address?: string;
    category_id?: number;
    places?: Array<{
      id: string | number;
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
  createPlace: (place: Place): Promise<Place> => {
    const placeData = {
      name: place.name,
      address: place.address,
      category_id: parseInt(place.category_id?.toString() || '0'),
      tags_ids: place.tags_ids || [],
      description: place.description || '',
      isPremium: place.isPremium || false,
      priceLevel: place.priceLevel || 1,
      coordinates: place.coordinates || { lat: 0, lng: 0 },
      phone: place.phone || ''
    };

    console.log('Creating place with data:', JSON.stringify(placeData, null, 2));
    
    return apiRequest('/places', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(placeData)
    });
  },

  getPlaces: (): Promise<Place[]> => {
    return apiRequest('/places')
      .then(response => {
        // Получаем массив мест из ответа
        let places = response;
        if (response && typeof response === 'object') {
          places = response.data || response.items || response.results || response;
        }
        
        // Убеждаемся, что у нас массив
        if (!Array.isArray(places)) {
          return [];
        }

        // Преобразуем category_id в число для каждого места
        return places.map(place => ({
          ...place,
          category_id: place.category_id != null ? Number(place.category_id) : undefined
        }));
      });
  },

  getPlace: (id: number | string) => apiRequest(`/places/${id}`, {
    method: 'GET',
  }).then(response => {
    const data = response.data || response;
    return {
      ...data,
      id: data.id || id,
      category_id: data.category_id
    };
  }),

  updatePlace: (id: number | string, data: Partial<CreatePlaceData>) => apiRequest('/places', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      id,
      ...data,
      category_id: data.category_id ? parseInt(data.category_id.toString()) : undefined
    }),
  }).then(response => {
    const responseData = response.data || response;
    return {
      ...responseData,
      category_id: responseData.category_id || responseData.mainTag // Поддержка обоих форматов
    };
  }),

  deletePlace: (id: number | string) => apiRequest('/places', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }),

  // Дополнительные методы для мест
  getFeed: () => {
    return apiRequest('/feed')
      .then(response => {
        const items = response.items || [];
        return {
          items: items.map((item: any) => {
            if (item.type === 'place' && item.data) {
              // Сохраняем все поля места и его category_id
              return {
                id: item.id,
                type: item.type,
                data: {
                  ...item.data,
                  id: item.data.id || item.id,
                  category_id: item.data.category_id
                }
              };
            }
            return item;
          })
        };
      })
      .catch(error => {
        if (error.message.includes('404')) {
          return { items: [] };
        }
        throw error;
      });
  },

  saveFeed: (items: FeedItem[]): Promise<void> => {
    // Преобразуем данные для сохранения
    const transformedItems = items.map(item => {
      if (item.type === 'place') {
        return {
          id: item.id,
          type: item.type,
          data: {
            ...item.data,
            id: item.data.id || item.id,
            category_id: item.data.category_id
          }
        };
      }
      return item;
    });

    return apiRequest('/feed', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: transformedItems }),
    }).catch(error => {
      if (error.message.includes('404')) {
        return apiRequest('/feed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ items: transformedItems }),
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
    return Array.isArray(places) ? places.map(place => ({
      ...place,
      category_id: place.category_id || place.mainTag // Поддержка обоих форматов
    })) : [];
  }),
};

export default api;

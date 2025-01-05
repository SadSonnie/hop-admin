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

interface Category {
  id: string;
  // Add other category properties here
}

interface Tag {
  id: string;
  // Add other tag properties here
}

export const api = {
  // Пользователь
  sendUserData: () => apiRequest('/users', {
    method: 'POST'
  }),
  
  // Категории
  getCategories: () => apiRequest('/categories'),
  createCategory: (data: Omit<Category, 'id'>) => apiRequest('/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }),
  updateCategory: (id: string, data: any) => apiRequest(`/categories/${id}`, {
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
};

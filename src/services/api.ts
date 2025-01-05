import axios from 'axios';
import { Category, Tag } from '../types';
import { getTelegramWebAppData } from '../utils/mockTelegramWebApp';

const BASE_URL = 'http://localhost:8080';

// Создаем инстанс axios с базовой конфигурацией
const api = axios.create({
  baseURL: BASE_URL,
});

// Добавляем интерцептор для всех запросов
api.interceptors.request.use((config) => {
  // Получаем данные из утилиты, которая вернет либо тестовые, либо реальные данные
  const webAppData = getTelegramWebAppData();
  
  if (webAppData) {
    config.headers.Authorization = `Bearer ${webAppData}`;
  }

  // Логируем URL запроса
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  
  return config;
});

// Categories API
export const categoriesApi = {
  getAll: () => api.get<{ items: Category[] }>('/categories'),
  create: (data: Omit<Category, 'id'>) => api.post<Category>('/categories', data),
  delete: (id: number) => api.delete('/categories', { data: { id } }),
};

// Tags API
export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags'),
  create: (data: FormData) => api.post<Tag>('/tags', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete('/tags', { data: { id } }),
};

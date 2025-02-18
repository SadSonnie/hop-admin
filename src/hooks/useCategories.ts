import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
        
        // Обработка различных форматов ответа
        let categoriesData: Category[] = [];
        if (response && typeof response === 'object') {
          if (Array.isArray(response)) {
            categoriesData = response;
          } else if (Array.isArray(response.items)) {
            categoriesData = response.items;
          } else if (Array.isArray(response.data)) {
            categoriesData = response.data;
          }
        }
        
        setCategories(categoriesData);
        setLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getCategoryName = (id?: number): string | undefined => {
    if (!id || loading || !categories.length) return undefined;
    const category = categories.find(cat => cat.id === id);
    return category?.name;
  };

  return { categories, loading, error, getCategoryName };
}

export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
  icon: string;
}

// Базовый интерфейс для места с обязательными полями
export interface BasePlace {
  id: string;
  name: string;
  address: string;
  mainTag: string; // id категории
}

// Полный интерфейс места со всеми возможными полями
export interface Place extends BasePlace {
  description?: string;
  imageUrl?: string;
  images?: string[];
  isPremium?: boolean;
  priceLevel?: number;
  coordinates?: { lat: number; lng: number };
  tags?: string[]; // id тегов
  phone?: string;
  rating?: number;
  distance?: number;
}
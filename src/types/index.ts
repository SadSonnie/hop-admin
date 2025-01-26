export interface Category {
  id: string;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  icon: string;
}

// Базовый интерфейс для места с обязательными полями
export interface BasePlace {
  id: string;
  name: string;
  address: string;
  mainTag?: string; // id категории
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
  category_id?: number;
  main_photo_url?: string;
  mainTag?: string;
}

export interface MetricCardType {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  to?: string;
  data?: any[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
  date?: string;
  authorName?: string;
  authorAvatar?: string;
  title?: string;
  photos?: string[];
}

export interface ExtendedReview extends Review {
  authorName: string;
  authorAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  title: string;
  photos: string[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  places?: string[]; // массив id мест
  places_ids?: string[]; // для совместимости с API
  userId?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeedItem {
  id: string;
  type: 'place' | 'collection';
  order: number;
  data: Place | (Collection & { places?: Place[] });
}

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}
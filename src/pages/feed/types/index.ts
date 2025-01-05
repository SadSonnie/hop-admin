export interface Place {
  id: number;
  name: string;
  description: string;
  rating: number;
  distance: string;
  imageUrl: string;
  isPremium?: boolean;
  images?: string[];
  tags?: string[];
  priceLevel?: number;
  address?: string;
  phone?: string;
  reviews?: Review[];
}

export interface Review {
  id: number;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  text: string;
  images?: string[];
}

export interface Collection {
  id: number;
  title: string;
  description: string;
  places: Place[];
}

export interface FeedItem {
  id: number;
  type: 'place' | 'collection';
  data: Place | Collection;
  order: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  favorites: Place[];
  reviews: Review[];
  collections: Collection[];
}

export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  tags?: string[];
}

export type TabType = 'главная' | 'поиск' | 'статьи' | 'профиль';
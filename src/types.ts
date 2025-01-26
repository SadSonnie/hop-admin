// Типы для фотографий места
interface PlacePhoto {
  id: number;
  photo_url: string;
  is_main: boolean;
}

interface PlacePhotoWithUrl {
  id: number;
  url: string;
  is_main: boolean;
}

// Тип для категории места
interface PlaceCategory {
  id: number;
  name: string;
}

// Тип для тега места
interface PlaceTag {
  id: number;
  place_id: string;
  tag_id: number;
  createdAt: string;
  updatedAt: string;
  placesItems: {
    id: number;
    name: string;
  };
}

// Тип для связи с коллекцией
interface CollectionPlace {
  id: number;
  collection_id: number;
  place_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  category_id: number;
  description?: string;
  isPremium?: boolean;
  priceLevel?: number;
  latitude?: string;
  longitude?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  Category: PlaceCategory;
  PlaceTags: PlaceTag[];
  CollectionPlaces: CollectionPlace[];
  PlacePhotos: PlacePhoto[];
  main_photo_url: string;
  photos: PlacePhotoWithUrl[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  icon: string;
}

export interface Review {
  id: string;
  content: string;
  rating: number;
  authorName: string;
  date: string;
  authorAvatar?: string;
  title?: string;
  status?: 'pending' | 'approved' | 'rejected';
  photos?: string[];
  locationId?: string;
  userId?: string;
}

export interface ExtendedReview extends Review {
  authorName: string;
  authorAvatar: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  photos: string[];
  locationId: string;
  userId: string;
}

export interface Collection {
  id: number;
  name: string;
  title?: string;
  description?: string;
  places: Place[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UIPlace extends Place {
  imageUrl?: string;
  mainTag?: string;
  rating?: number;
  distance?: string;
}

// Вспомогательный тип для создания новых объектов
export type CreatePlaceDto = Omit<Place, 'id'>;
export type CreateCategoryDto = Omit<Category, 'id'>;
export type CreateTagDto = Omit<Tag, 'id'>;
export type CreateCollectionDto = Omit<Collection, 'id'>;

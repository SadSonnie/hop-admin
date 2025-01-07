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
  id: number;
  text: string;
  rating: number;
  author: string;
  date: string;
}

export interface Place {
  id: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  rating?: number;
  images?: string[];
  categories?: Category[];
  tags?: Tag[];
  reviews?: Review[];
  // Дополнительные поля из PlaceDetailsView
  priceLevel?: string;
  mainTag?: Tag;
  distance?: string;
  isPremium?: boolean;
}

export interface Collection {
  id: number;
  name: string;
  title?: string;
  description?: string;
  places: Place[];
}

// Вспомогательный тип для создания новых объектов
export type CreatePlaceDto = Omit<Place, 'id'>;
export type CreateCategoryDto = Omit<Category, 'id'>;
export type CreateTagDto = Omit<Tag, 'id'>;
export type CreateCollectionDto = Omit<Collection, 'id'>;

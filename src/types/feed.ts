import { Place } from './index';

export interface PlaceWithTags extends Omit<Place, 'id'> {
  id: string;
  PlaceTags?: Array<{ tag_id: number }>;
  category_id?: number;
  main_photo_url?: string;
  mainTag: string;
}

export interface FeedCollection {
  id: string;
  name: string;
  title?: string;
  description?: string;
  places: Place[];
  createdAt: string;
  updatedAt: string;
}

export interface FeedItemBase {
  id: string;
  order: number;
}

export interface PlaceFeedItem extends FeedItemBase {
  type: 'place';
  data: PlaceWithTags;
}

export interface CollectionFeedItem extends FeedItemBase {
  type: 'collection';
  data: FeedCollection;
}

export type FeedItem = PlaceFeedItem | CollectionFeedItem;

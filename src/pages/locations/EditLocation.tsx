import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BasePlace } from '../../types/index';
import { mockTags } from '../../data/mockTags';
import { Plus, X, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { notification } from 'antd';
import L from 'leaflet';

interface Category {
  id: number;
  name: string;
}

interface PlacePhoto {
  id: number;
  url: string;
  is_main: boolean;
}

interface PlaceTag {
  tag_id: number;
  placesItems: {
    id: number;
    name: string;
  };
}

interface MapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultCenter?: { lat: number; lng: number };
}

// Расширяем базовый интерфейс необязательными полями для формы
interface LocationForm extends Omit<BasePlace, 'id'> {
  description?: string;
  imageUrl?: string;
  images?: string[];
  isPremium?: boolean;
  priceLevel?: number;
  coordinates: { 
    latitude: number;
    longitude: number;
  } | null;
  tags: number[];
  phone?: string;
  mainImage: File | null;
  additionalImages: File[];
  mainTag: string;
}

const initialForm: LocationForm = {
  name: '',
  address: '',
  mainTag: '',
  description: '',
  imageUrl: '',
  images: [],
  isPremium: false,
  priceLevel: 1,
  coordinates: null,
  tags: [],
  phone: '',
  mainImage: null,
  additionalImages: []
};

// Функция для геокодинга адреса через Nominatim
const searchAddress = async (query: string) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&limit=5`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
};

// Функция для получения адреса по координатам
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    return await response.json();
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    throw error;
  }
};

// Функция для форматирования адреса
const formatAddress = (fullAddress: string): string => {
  const parts = fullAddress.split(',');
  if (parts.length <= 3) return fullAddress;
  
  const cityAndStreet = parts.slice(0, 2);
  const country = parts[parts.length - 1];
  return [...cityAndStreet, country].join(',').trim();
};

const MapComponent: React.FC<MapProps> = ({ onLocationSelect, defaultCenter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [] = useState(true);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Добавляем функцию для центрирования карты
  const centerMapOnMarker = (lat: number, lng: number) => {
    if (mapInstanceRef.current && markerRef.current) {
      const currentZoom = mapInstanceRef.current.getZoom();
      mapInstanceRef.current.setView([lat, lng], currentZoom);
      markerRef.current.setLatLng([lat, lng]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initMap = () => {
      try {
        if (!mapRef.current) return false;
        if (mapInstanceRef.current) return true;

        const defaultPosition = defaultCenter || { lat: 59.9386, lng: 30.3141 };
        const container = mapRef.current;

        container.style.minHeight = '400px';
        container.style.width = '100%';

        const map = L.map(container, {
          center: [defaultPosition.lat, defaultPosition.lng],
          zoom: 12,
          zoomControl: true,
          doubleClickZoom: false,
          trackResize: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const icon = L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });

        const marker = L.marker([defaultPosition.lat, defaultPosition.lng], {
          draggable: true,
          autoPan: false,
          icon: icon,
          interactive: true,
          keyboard: false,
          zIndexOffset: 1000
        }).addTo(map);

        map.off('click');
        marker.off('dragend');

        map.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          }
          
          try {
            const result = await reverseGeocode(lat, lng);
            if (result.display_name) {
              onLocationSelect(lat, lng, formatAddress(result.display_name));
            }
          } catch (error) {
            console.error('Error getting address:', error);
            notification.error({
              message: 'Ошибка',
              description: 'Не удалось получить адрес'
            });
          }
        });

        marker.on('dragend', async () => {
          if (!markerRef.current) return;
          const position = markerRef.current.getLatLng();
          try {
            const result = await reverseGeocode(position.lat, position.lng);
            if (result.display_name) {
              onLocationSelect(position.lat, position.lng, formatAddress(result.display_name));
            }
          } catch (error) {
            console.error('Error getting address:', error);
            notification.error({
              message: 'Ошибка',
              description: 'Не удалось получить адрес'
            });
          }
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        requestAnimationFrame(() => {
          if (map && isMounted) {
            map.invalidateSize();
          }
        });

        return true;
      } catch (error) {
        console.error('Map initialization error:', error);
        if (isMounted) {
          setMapError('Не удалось инициализировать карту');
        }
        return false;
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (defaultCenter) {
      centerMapOnMarker(defaultCenter.lat, defaultCenter.lng);
    }
  }, [defaultCenter]);

  if (mapError) return <div>Ошибка: {mapError}</div>;

  return (
    <div className="space-y-2">
      <div 
        className="rounded-lg border border-gray-300 overflow-hidden"
        style={{ height: '350px' }}
      >
        <div 
          ref={mapRef} 
          className="w-full h-[400px]"
        />
      </div>
    </div>
  );
};

export const EditLocation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<LocationForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [categoriesData, placeData] = await Promise.all([
          api.getCategories(),
          api.getPlace(id)
        ]);
        
        console.log('Categories data:', categoriesData);
        console.log('Place data:', placeData);
        
        // Обрабатываем категории, учитывая возможные форматы данных
        const processedCategories = Array.isArray(categoriesData) 
          ? categoriesData 
          : categoriesData.items || categoriesData.data || [];
        
        console.log('Processed categories:', processedCategories);
        setCategories(processedCategories);
        
        // Преобразуем данные места в формат формы
        const formData = {
          name: placeData.name || '',
          address: placeData.address || '',
          mainTag: placeData.category_id?.toString() || '',
          description: placeData.description || '',
          imageUrl: placeData.main_photo_url || '',
          images: placeData.photos?.map((photo: PlacePhoto) => photo.url) || [],
          isPremium: placeData.isPremium || false,
          priceLevel: placeData.priceLevel || 1,
          coordinates: placeData.latitude && placeData.longitude ? { 
            latitude: parseFloat(placeData.latitude), 
            longitude: parseFloat(placeData.longitude) 
          } : null,
          tags: placeData.PlaceTags?.map((tag: PlaceTag) => tag.tag_id) || [],
          phone: placeData.phone || '',
          mainImage: null,
          additionalImages: []
        };
        
        console.log('Form data:', formData);
        setForm(formData);
      } catch (error) {
        console.error('Error fetching data:', error);
        notification.error({
          message: 'Ошибка',
          description: 'Не удалось загрузить данные места',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
  
    // Проверяем обязательные поля
    if (!form.name || !form.address || !form.mainTag) {
      notification.error({
        message: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
      });
      return;
    }
  
    try {
      // Преобразуем mainTag в числовой id
      const category_id = parseInt(form.mainTag, 10);
      if (isNaN(category_id)) {
        notification.error({
          message: 'Ошибка',
          description: 'Некорректный ID категории',
        });
        return;
      }
      //хелоопш
      const placeData = {
        id: Number(id),  // Добавляем id в данные
        name: form.name,
        address: form.address,
        category_id,
        tags_ids: form.tags,
        description: form.description,
        phone: form.phone,
        priceLevel: form.priceLevel,
        isPremium: form.isPremium,
        status: 'approved',
        ...(form.coordinates && {
          latitude: form.coordinates.latitude,
          longitude: form.coordinates.longitude
        })
      };
  
      // Collect photos
      const photos: File[] = [];
      if (form.mainImage) {
        photos.push(form.mainImage);
      }
      if (form.additionalImages.length > 0) {
        photos.push(...form.additionalImages);
      }
  
      console.log('EditLocation - данные для отправки:', {
        id,
        placeData,
        photos,
        formState: form // добавляем состояние формы для полноты картины
      });
      
      await api.updatePlace(id, placeData, photos);
      
      notification.success({
        message: 'Успешно',
        description: 'Место успешно обновлено',
      });
  
      navigate('/locations');
    } catch (error) {
      console.error('Error updating place:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Произошла ошибка при обновлении места',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const files = e.target.files;
    if (!files) return;

    if (isMain) {
      setForm(prev => ({
        ...prev,
        mainImage: files[0],
        imageUrl: URL.createObjectURL(files[0])
      }));
    } else {
      const newFiles = Array.from(files);
      setForm(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles],
        images: [...(prev.images || []), ...newFiles.map(file => URL.createObjectURL(file))]
      }));
    }
  };

  const removeImage = (index: number, isMain: boolean) => {
    if (isMain) {
      setForm(prev => ({
        ...prev,
        mainImage: null,
        imageUrl: ''
      }));
    } else {
      setForm(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((_, i) => i !== index),
        images: prev.images?.filter((_, i) => i !== index)
      }));
    }
  };

  const ImageUploadBox: React.FC<{ 
    isMain?: boolean; 
    image?: string; 
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove?: () => void;
  }> = ({ isMain, image, onUpload, onRemove }) => (
    <div className={`relative ${isMain ? 'w-full h-48' : 'w-32 h-32'}`}>
      <input
        type="file"
        accept="image/*"
        onChange={onUpload}
        className="hidden"
        id={isMain ? 'mainImage' : 'additionalImage'}
      />
      <label
        htmlFor={isMain ? 'mainImage' : 'additionalImage'}
        className={`
          flex flex-col items-center justify-center w-full h-full rounded-xl
          border-2 border-dashed transition-all cursor-pointer
          ${image ? 'border-transparent' : 'border-blue-500 hover:border-blue-600'}
          ${isMain ? 'bg-gray-50' : 'bg-gray-50'}
        `}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover rounded-xl"
            />
            {onRemove && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-blue-500">
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">
              {isMain ? 'Добавить основное фото' : 'Добавить фото'}
            </span>
          </div>
        )}
      </label>
    </div>
  );

  const handleLocationChange = (lat: number, lng: number, address: string) => {
    setForm(prev => ({
      ...prev,
      address,
      coordinates: { latitude: lat, longitude: lng }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Редактировать место</h1>
        <p className="text-gray-600">Измените информацию о месте</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Основная информация */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Например: Кафе 'Уютное'"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              placeholder="Опишите особенности и преимущества места"
            />
          </div>
        </div>

        {/* Теги */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, mainTag: category.id.toString() }))}
                  className={`px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    form.mainTag === category.id.toString()
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дополнительные теги
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {mockTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      tags: prev.tags.includes(tag.id)
                        ? prev.tags.filter(t => t !== tag.id)
                        : [...prev.tags, tag.id]
                    }));
                  }}
                  className={`px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    form.tags.includes(tag.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={tag.icon} alt="" className="w-5 h-5" />
                    <span>{tag.name}</span>
                  </div>
                </button>
              ))}
            </div>
            {form.tags?.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Выбранные теги:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.tags?.map(tagId => {
                    const tag = mockTags.find(t => t.id === tagId);
                    return tag ? (
                      <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <img src={tag.icon} alt="" className="w-4 h-4" />
                        {tag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Изображения */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Основное изображение
          </label>
          <ImageUploadBox
            isMain
            image={form.imageUrl}
            onUpload={(e) => handleImageChange(e, true)}
            onRemove={() => removeImage(0, true)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дополнительные изображения
            </label>
            <div className="grid grid-cols-4 gap-4">
              {form.images?.map((url, index) => (
                <ImageUploadBox
                  key={`${url}-${index}`}
                  image={url}
                  onRemove={() => removeImage(index, false)}
                  onUpload={(e) => handleImageChange(e, false)}
                />
              ))}
              {(!form.images || form.images.length < 8) && (
                <ImageUploadBox
                  onUpload={(e) => handleImageChange(e, false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Местоположение */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Местоположение
          </label>
          <div className="relative mb-2" style={{ zIndex: 1000 }}>
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={form.address}
              onChange={async (e) => {
                const value = e.target.value;
                setForm(prev => ({ ...prev, address: value }));
                
                if (value.length >= 3) {
                  try {
                    const results = await searchAddress(value);
                    if (results && results.length > 0) {
                      const firstResult = results[0];
                      setForm(prev => ({
                        ...prev,
                        address: formatAddress(firstResult.display_name),
                        coordinates: {
                          latitude: parseFloat(firstResult.lat),
                          longitude: parseFloat(firstResult.lon)
                        }
                      }));
                    }
                  } catch (error) {
                    console.error('Error searching address:', error);
                  }
                }
              }}
              placeholder="Введите адрес"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <MapComponent 
              onLocationSelect={handleLocationChange}
              defaultCenter={form.coordinates ? {
                lat: form.coordinates.latitude,
                lng: form.coordinates.longitude
              } : undefined}
            />
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          {/* Уровень цен */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Уровень цен
            </label>
            <div className="flex gap-4">
              {[1, 2, 3].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, priceLevel: level }))}
                  className={`px-6 py-2 rounded-lg transition-all ${
                    form.priceLevel === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {'₽'.repeat(level)}
                </button>
              ))}
            </div>
          </div>

          {/* Премиум статус */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPremium"
              checked={form.isPremium}
              onChange={e => setForm(prev => ({ ...prev, isPremium: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="text-sm text-gray-700">
              Премиум место
            </label>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/locations')}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLocation;

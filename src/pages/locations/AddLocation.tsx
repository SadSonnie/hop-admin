import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTags } from '../../data/mockTags';
import { Plus, X, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { notification } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Category {
  id: string;
  name: string;
}

// Форма для создания места
interface LocationForm {
  name: string;
  address: string;
  mainTag: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  isPremium?: boolean;
  priceLevel?: number;
  coordinates: { latitude: number; longitude: number } | null;
  tags: string[];
  phone?: string;
  mainImage: File | null;
  additionalImages: File[];
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

interface MapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  defaultCenter?: { lat: number; lng: number };
}

// Функция для геокодинга адреса через Nominatim
const searchAddress = async (query: string) => {
  const encodedQuery = encodeURIComponent(query);
  console.log('Searching with query:', encodedQuery);
  
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?` + 
    `format=json&` +
    `q=${encodedQuery}&` +
    `countrycodes=ru&` +
    `limit=5&` +
    `addressdetails=1&` +
    `accept-language=ru`,
    {
      headers: {
        'Accept-Language': 'ru'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const results = await response.json();
  console.log('Search results:', results);
  return results;
};

// Функция для получения адреса по координатам
const reverseGeocode = async (lat: number, lng: number) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`,
    {
      headers: {
        'Accept-Language': 'ru'
      }
    }
  );
  return response.json();
};

// Функция для форматирования адреса
const formatAddress = (fullAddress: string): string => {
  // Разбиваем полный адрес по запятым
  const parts = fullAddress.split(',');
  
  // Берем первые два элемента (обычно это улица и номер дома)
  const streetParts = parts.slice(0, 2);
  
  // Объединяем их обратно и убираем лишние пробелы
  return streetParts.join(',').trim();
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

const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LocationForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ display_name: string; lat: number; lng: number }[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData.items || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
  const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // 8MB

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200;

          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            },
            'image/jpeg',
            0.8 // compression quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const validateAndCompressImages = async (images: File[]): Promise<File[]> => {
    let totalSize = 0;
    const compressedImages: File[] = [];

    for (const image of images) {
      if (image.size > MAX_IMAGE_SIZE * 2) { // If image is more than 2MB
        notification.error({
          message: 'Ошибка',
          description: `Изображение ${image.name} слишком большое. Максимальный размер - 2MB`,
        });
        throw new Error('Image too large');
      }

      const compressedImage = await compressImage(image);
      totalSize += compressedImage.size;

      if (totalSize > MAX_TOTAL_SIZE) {
        notification.error({
          message: 'Ошибка',
          description: 'Общий размер изображений превышает 8MB',
        });
        throw new Error('Total size too large');
      }

      compressedImages.push(compressedImage);
    }

    return compressedImages;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!form.name || !form.address || !form.mainTag || !form.coordinates) {
      notification.error({
        message: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля и укажите местоположение на карте',
      });
      return;
    }

    try {
      setIsLoading(true);

      // Преобразуем теги в числовые id
      const tags_ids = form.tags.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

      const placeData = {
        name: form.name,
        address: form.address,
        category_id: parseInt(form.mainTag, 10),
        tags_ids: tags_ids.length > 0 ? tags_ids : undefined,
        description: form.description || '',
        isPremium: form.isPremium || false,
        priceLevel: form.priceLevel || 1,
        coordinates: form.coordinates || { latitude: 0, longitude: 0 },
        phone: form.phone || ''
      };


      // Собираем и обрабатываем изображения
      const photos: File[] = [];
      if (form.mainImage) {
        photos.push(form.mainImage);
      }
      if (form.additionalImages?.length) {
        photos.push(...form.additionalImages);
      }

      // Сжимаем и валидируем изображения перед отправкой
      const compressedPhotos = await validateAndCompressImages(photos);

      await api.createPlace(placeData, compressedPhotos);
      
      notification.success({
        message: 'Успешно',
        description: 'Место успешно добавлено',
      });

      navigate('/locations');
    } catch (error) {
      console.error('Error creating place:', error);
      notification.error({
        message: 'Ошибка',
        description: 'Не удалось создать место',
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Добавить новое место</h1>
        <p className="text-gray-600">Заполните информацию о новом месте</p>
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
              placeholder="Например: Уютное"
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
                  onClick={() => setForm(prev => ({ ...prev, mainTag: category.id }))}
                  className={`px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    form.mainTag === category.id
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
                      tags: prev.tags.includes(String(tag.id))
                        ? prev.tags.filter(t => t !== String(tag.id))
                        : [...prev.tags, String(tag.id)]
                    }));
                  }}
                  className={`px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    form.tags.includes(String(tag.id))
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
            {form.tags.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Выбранные теги:</span>
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.tags.map(tagId => {
                    const tag = mockTags.find(t => t.id === parseInt(tagId, 10));
                    if (!tag) return null;
                    return (
                      <span key={tag.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <img src={tag.icon} alt="" className="w-4 h-4" />
                        {tag.name}
                      </span>
                    );
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
                  key={url}
                  image={url}
                  onUpload={(e) => handleImageChange(e, false)}
                  onRemove={() => removeImage(index, false)}
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
                console.log('Input value:', value);
                
                // Очищаем предыдущий таймер
                if (searchTimeoutRef.current) {
                  clearTimeout(searchTimeoutRef.current);
                }
                
                if (value.length >= 3) {
                  // Устанавливаем новый таймер
                  searchTimeoutRef.current = setTimeout(async () => {
                    try {
                      console.log('Searching for:', value);
                      const results = await searchAddress(value);
                      console.log('Search results:', results);
                      if (results && results.length > 0) {
                        const mappedResults = results.map((item: { display_name: string; lat: string; lon: string }) => ({
                          display_name: item.display_name,
                          lat: parseFloat(item.lat),
                          lng: parseFloat(item.lon)
                        }));
                        console.log('Mapped results:', mappedResults);
                        setSearchResults(mappedResults);
                      } else {
                        console.log('No results found');
                        setSearchResults([]);
                      }
                    } catch (error) {
                      console.error('Error searching:', error);
                      setSearchResults([]);
                    }
                  }, 300); // Задержка в 300мс
                } else {
                  setSearchResults([]);
                }
              }}
              placeholder="Введите адрес"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div 
                className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                style={{ maxHeight: '200px', overflowY: 'auto', zIndex: 1001 }}
              >
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      console.log('Selected result:', result);
                      const newCoordinates = { latitude: result.lat, longitude: result.lng };
                      setForm(prev => ({
                        ...prev,
                        address: formatAddress(result.display_name),
                        coordinates: newCoordinates
                      }));
                      setSearchResults([]);
                    }}
                  >
                    {result.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <MapComponent
              onLocationSelect={(lat, lng, address) => {
                setForm(prev => ({
                  ...prev,
                  address,
                  coordinates: { latitude: lat, longitude: lng }
                }));
              }}
              defaultCenter={form.coordinates ? { lat: form.coordinates.latitude, lng: form.coordinates.longitude } : undefined}
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
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="isPremium"
              checked={form.isPremium}
              onChange={e => setForm(prev => ({ ...prev, isPremium: e.target.checked }))}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPremium" className="ml-2 flex flex-col">
              <span className="text-sm font-medium text-gray-700">Премиум место</span>
              <span className="text-xs text-gray-500">Отметьте, если это премиальное заведение</span>
            </label>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Сохранить
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

export default AddLocation;
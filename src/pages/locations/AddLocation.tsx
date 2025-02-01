import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTags } from '../../data/mockTags';
import { Plus, X, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { notification } from 'antd';

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
  coordinates?: { lat: number; lng: number };
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
  coordinates: { lat: 0, lng: 0 },
  tags: [],
  phone: '',
  mainImage: null,
  additionalImages: []
};

export const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LocationForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setIsLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Проверяем обязательные поля
    if (!form.name || !form.address || !form.mainTag) {
      notification.error({
        message: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
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
        coordinates: form.coordinates ? {
          lat: form.coordinates.lat,
          lng: form.coordinates.lng
        } : undefined,
        phone: form.phone || ''
      };

      // Собираем все фотографии в один массив
      const photos: File[] = [];
      if (form.mainImage) {
        photos.push(form.mainImage);
      }
      if (form.additionalImages?.length) {
        photos.push(...form.additionalImages);
      }

      await api.createPlace(placeData, photos);
      
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
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              required
              value={form.address}
              onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Введите адрес"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Здесь будет карта для выбора местоположения
            </p>
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
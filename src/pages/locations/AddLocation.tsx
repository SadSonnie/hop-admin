import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BasePlace } from '@/types/index';
import { Form, Input, Button, Select, message } from 'antd';
import { MapPin } from 'lucide-react';

// Расширяем базовый интерфейс необязательными полями для формы
interface LocationForm extends Omit<BasePlace, 'id'> {
  name: string;
  address: string;
  mainTag: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  isPremium?: boolean;
  priceLevel?: number;
  coordinates?: { lat: number; lng: number };
  lat: number;
  lng: number;
  tags?: (string | number)[];
  phone?: string;
  mainImage: File | null;
  additionalImages: File[];
}

interface Category {
  id: string | number;
  name: string;
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
  lat: 0,
  lng: 0,
  tags: [],
  phone: '',
  mainImage: null,
  additionalImages: []
};

export const AddLocation: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Replace this with your actual API call
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        message.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (values: LocationForm) => {
    // Проверяем обязательные поля
    if (!values.name || !values.address || !values.mainTag) {
      message.error('Пожалуйста, заполните все обязательные поля');
      return;
    }

    try {
      setIsLoading(true);

      // Собираем все фотографии в один массив
      const photos: File[] = [];
      if (values.mainImage) {
        photos.push(values.mainImage);
      }
      if (values.additionalImages?.length) {
        photos.push(...values.additionalImages);
      }

      // await api.createPlace(placeData, photos);
      
      message.success('Место успешно добавлено');

      navigate('/locations');
    } catch (error) {
      console.error('Error creating place:', error);
      message.error('Не удалось создать место');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Добавить новое место</h1>
        <p className="text-gray-600">Заполните информацию о новом месте</p>
      </div>
      
      <Form
        form={form}
        initialValues={initialForm}
        onFinish={handleSubmit}
        className="space-y-8"
      >
        {/* Основная информация */}
        <div className="space-y-4">
          <div>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input
                placeholder="Например: Уютное"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item name="description">
              <Input.TextArea
                placeholder="Опишите особенности и преимущества места"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </Form.Item>
          </div>
        </div>

        {/* Теги */}
        <div className="space-y-4">
          <div>
            <Form.Item name="mainTag" rules={[{ required: true }]}>
              <Select>
                {categories.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div>
            <Form.Item name="tags">
              <Select mode="multiple">
                {/* mockTags.map(tag => (
                  <Select.Option key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <img src={tag.icon} alt="" className="w-5 h-5" />
                      <span>{tag.name}</span>
                    </div>
                  </Select.Option>
                )) */}
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Изображения */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Основное изображение
          </label>
          {/* <ImageUploadBox
            isMain
            image={form.imageUrl}
            onUpload={(e) => handleImageChange(e, true)}
            onRemove={() => removeImage(0, true)}
          /> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дополнительные изображения
            </label>
            {/* <div className="grid grid-cols-4 gap-4">
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
            </div> */}
          </div>
        </div>

        {/* Местоположение */}
        <div>
          <Form.Item name="address" rules={[{ required: true }]}>
            <Input
              prefix={<MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />}
              placeholder="Введите адрес"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Form.Item>
          <div className="mt-2 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              Здесь будет карта для выбора местоположения
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-4">
          <div>
            <Form.Item name="phone">
              <Input
                placeholder="+7 (___) ___-__-__"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
          </div>

          {/* Уровень цен */}
          <div>
            <Form.Item name="priceLevel">
              <Select>
                {[1, 2, 3].map(level => (
                  <Select.Option key={level} value={level}>
                    {'₽'.repeat(level)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Премиум статус */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <Form.Item name="isPremium" valuePropName="checked">
              <Input type="checkbox" className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded" />
            </Form.Item>
            <span className="ml-2 flex flex-col">
              <span className="text-sm font-medium text-gray-700">Премиум место</span>
              <span className="text-xs text-gray-500">Отметьте, если это премиальное заведение</span>
            </span>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 pt-4">
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Сохранить
          </Button>
          <Button type="default" onClick={() => navigate('/locations')}>
            Отмена
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddLocation;

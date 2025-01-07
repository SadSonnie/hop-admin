import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, message, Card } from 'antd';
import { api } from '../../utils/api';

interface Place {
  id: number;
  name: string;
  address: string;
  category_id: number;
}

const { TextArea } = Input;

const AddCollection: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      setLoadingPlaces(true);
      const response = await api.getAllPlaces();
      console.log('Places loaded:', response);
      setPlaces(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Failed to load places:', error);
      message.error('Не удалось загрузить места');
    } finally {
      setLoadingPlaces(false);
    }
  };

  const handlePlaceSelect = (selectedIds: number[]) => {
    const selected = places.filter(place => selectedIds.includes(place.id));
    setSelectedPlaces(selected);
    form.setFieldsValue({ places: selectedIds });
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const data = {
        name: values.name,
        description: values.description,
        places_ids: values.places,
      };
      console.log('Creating collection with data:', data);
      await api.createCollection(data);
      message.success('Подборка успешно создана');
      navigate('/collections');
    } catch (error) {
      console.error('Failed to create collection:', error);
      message.error('Не удалось создать подборку');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Создать подборку</h1>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Название"
            rules={[{ required: true, message: 'Введите название подборки' }]}
          >
            <Input placeholder="Например: Лучшие кофейни города" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание"
            rules={[{ required: true, message: 'Введите описание подборки' }]}
          >
            <TextArea
              placeholder="Опишите подборку"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item
            name="places"
            label="Места"
            rules={[{ required: true, message: 'Выберите хотя бы одно место' }]}
          >
            <Select
              mode="multiple"
              placeholder="Выберите места"
              loading={loadingPlaces}
              optionFilterProp="children"
              showSearch
              className="w-full"
              optionLabelProp="label"
              onChange={handlePlaceSelect}
              filterOption={(input, option) => {
                const place = places.find(p => p.id === option?.value);
                if (!place) return false;
                
                return (
                  place.name.toLowerCase().includes(input.toLowerCase()) ||
                  place.address.toLowerCase().includes(input.toLowerCase())
                );
              }}
            >
              {places.map((place) => (
                <Select.Option
                  key={place.id}
                  value={place.id}
                  label={place.name}
                >
                  <div className="flex items-center py-1">
                    <div>
                      <div className="font-medium">{place.name}</div>
                      <div className="text-xs text-gray-500">
                        {place.address}
                      </div>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-4">
              <Button onClick={() => navigate('/collections')}>
                Отмена
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Создать подборку
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddCollection;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { api } from '../../utils/api';

interface Collection {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  places_ids: number[];
}

const CollectionsList: React.FC = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      const response = await api.getCollections();
      setCollections(response);
    } catch (error) {
      console.error('Failed to load collections:', error);
      message.error('Не удалось загрузить подборки');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (collection: Collection) => {
    Modal.confirm({
      title: 'Удаление подборки',
      icon: null,
      content: (
        <div className="py-4">
          <p className="text-gray-600">Вы уверены, что хотите удалить подборку</p>
          <p className="font-medium mt-2 text-lg">"{collection.name}"?</p>
        </div>
      ),
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
        danger: true,
      },
      onOk: async () => {
        try {
          await api.deleteCollection(collection.id);
          message.success('Подборка успешно удалена');
          loadCollections();
        } catch (error) {
          console.error('Failed to delete collection:', error);
          message.error('Не удалось удалить подборку');
        }
      },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Подборки</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/collections/add')}
        >
          Добавить подборку
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Загрузка...</div>
        </div>
      ) : collections.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Нет доступных подборок</div>
        </div>
      ) : (
        <div className="space-y-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="rounded-xl border border-[#1e47f7]/10 bg-[#1e47f7]/[0.02] w-full cursor-pointer relative"
              onClick={() => navigate(`/collections/${collection.id}`)}
            >
              <div className="px-4 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{collection.name}</h2>
                    {collection.description && (
                      <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                    )}
                    <div className="text-sm text-gray-500 mt-2">
                      Мест в подборке: {collection.places_ids.length}
                    </div>
                  </div>
                  <Button 
                    type="text" 
                    danger 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(collection);
                    }}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsList;

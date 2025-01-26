import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Tag } from '../../types';
import { mockTags } from '../../data/mockTags';

export const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Используем моковые данные вместо API
    setTags(mockTags);
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (tag: Tag) => {
    Modal.confirm({
      title: 'Удаление тега',
      icon: null,
      content: (
        <div className="py-4">
          <p className="text-gray-600">Вы уверены, что хотите удалить тег</p>
          <p className="font-medium mt-2 text-lg">"{tag.name}"?</p>
        </div>
      ),
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: {
        className: 'bg-red-500 hover:bg-red-600',
        danger: true,
      },
      onOk: () => {
        // Закомментированный код удаления через API
        /*
        try {
          await api.deleteTag(tag.id);
          message.success('Тег успешно удален');
          fetchTags();
        } catch (error) {
          console.error('Error deleting tag:', error);
          message.error('Не удалось удалить тег');
        }
        */
        // Временно просто показываем сообщение
        message.info('Функция удаления временно отключена');
      },
    });
  };

  const handleSubmit = async () => {
    // Временно просто показываем сообщение
    message.info('Функция создания временно отключена');
    setIsModalVisible(false);
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Tag) => (
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img 
                src={record.icon}
                alt={name} 
                className="w-full h-full object-contain"
                style={{ color: 'currentColor' }}
                onError={(e) => {
                  // Заглушка при ошибке загрузки изображения
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
                }}
              />
            </div>
            <span className="text-lg">{name}</span>
          </div>
          <Button 
            type="text" 
            danger 
            onClick={() => handleDelete(record)}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  const addButton = (
    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
      Добавить
    </Button>
  );

  return (
    <div className="h-full bg-white">
      <PageHeader 
        title="Теги" 
        rightIcon={addButton}
      />

      {/* Content */}
      <div className="px-6 py-4">
        <Table 
          columns={columns} 
          dataSource={tags} 
          rowKey="id"
          pagination={false}
          showHeader={false}
        />
      </div>

      {/* Modal для добавления */}
      <Modal
        title="Добавить тег"
        open={isModalVisible}
        onOk={form.submit}
        onCancel={() => setIsModalVisible(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название тега' }]}
          >
            <Input placeholder="Название тега" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

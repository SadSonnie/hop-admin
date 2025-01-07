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
import { api } from '../../utils/api';
import { Category } from '../../types';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCategories();
      setCategories(data.items || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('Не удалось загрузить категории');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleDelete = (category: Category) => {
    Modal.confirm({
      title: 'Удаление категории',
      icon: null,
      content: (
        <div className="py-4">
          <p className="text-gray-600">Вы уверены, что хотите удалить категорию</p>
          <p className="font-medium mt-2 text-lg">"{category.name}"?</p>
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
          await api.deleteCategory(category.id);
          message.success('Категория удалена');
          fetchCategories();
        } catch (error) {
          message.error('Не удалось удалить категорию');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await api.createCategory(values);
      setIsModalVisible(false);
      form.resetFields();
      message.success('Категория добавлена');
      fetchCategories();
    } catch (error) {
      if (error instanceof Error) {
        message.error('Не удалось добавить категорию');
      }
    }
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Category) => (
        <div className="flex justify-between items-center py-3">
          <span className="text-lg">{name}</span>
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
        title="Категории" 
        rightIcon={addButton}
      />

      {/* Content */}
      <div className="px-6 py-4">
        <Table 
          columns={columns} 
          dataSource={categories} 
          rowKey="id"
          pagination={false}
          showHeader={false}
          loading={isLoading}
        />
      </div>

      {/* Modal для добавления */}
      <Modal
        title="Добавить категорию"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название категории' }]}
          >
            <Input placeholder="Название категории" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

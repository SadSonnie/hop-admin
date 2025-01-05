import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  message,
  Upload,
} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { tagsApi } from '../../services/api';
import { Tag } from '../../types';

export const Tags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadedIcon, setUploadedIcon] = useState<File | null>(null);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const { data } = await tagsApi.getAll();
      setTags(data);
    } catch (error) {
      message.error('Не удалось загрузить теги');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setUploadedIcon(null);
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
        danger: true,
      },
      onOk: async () => {
        try {
          await tagsApi.delete(tag.id);
          message.success('Тег удален');
          fetchTags();
        } catch (error) {
          message.error('Не удалось удалить тег');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!uploadedIcon) {
        message.error('Пожалуйста, загрузите иконку');
        return;
      }

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('icon', uploadedIcon);

      await tagsApi.create(formData);
      setIsModalVisible(false);
      form.resetFields();
      setUploadedIcon(null);
      message.success('Тег добавлен');
      fetchTags();
    } catch (error) {
      if (error instanceof Error) {
        message.error('Не удалось добавить тег');
      }
    }
  };

  const handleUpload = (file: File) => {
    setUploadedIcon(file);
    // Создаем превью для отображения
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('icon-preview') as HTMLImageElement;
      if (preview && e.target?.result) {
        preview.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    return false; // Предотвращаем автоматическую загрузку Upload компонента
  };

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Tag) => (
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-3">
            <img 
              src={record.icon} 
              alt={name} 
              className="w-6 h-6 object-contain"
              onError={(e) => {
                // Заглушка при ошибке загрузки изображения
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNFNUU3RUIiLz48L3N2Zz4=';
              }}
            />
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
        action={addButton}
      />

      {/* Content */}
      <div className="px-6 py-4">
        <Table 
          columns={columns} 
          dataSource={tags} 
          rowKey="id"
          pagination={false}
          showHeader={false}
          loading={isLoading}
        />
      </div>

      {/* Modal для добавления */}
      <Modal
        title="Добавить тег"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Добавить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Введите название тега' }]}
          >
            <Input placeholder="Название тега" />
          </Form.Item>
          <Form.Item
            label="Иконка"
            required
            tooltip="Рекомендуемый размер: 24x24 пикселя"
          >
            <div className="flex items-center gap-4">
              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={handleUpload}
              >
                <Button icon={<UploadOutlined />}>Выбрать файл</Button>
              </Upload>
              {uploadedIcon && (
                <div className="flex items-center gap-2">
                  <img 
                    id="icon-preview"
                    alt="Preview" 
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-sm text-gray-500">Иконка выбрана</span>
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

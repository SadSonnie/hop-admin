import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Modal, message } from 'antd';
import api from '@/utils/api';
import { formatDate } from '@/utils/date';

export const EditReview: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const review = location.state?.review as any;
  const [editedTitle, setEditedTitle] = useState(review?.title || '');
  const [editedContent, setEditedContent] = useState(review?.content || '');
  const [loading, setLoading] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!review) {
      navigate('/reviews/pending');
    }
  }, [review, navigate]);

  const handleSave = async () => {
    if (!review) return;

    try {
      setLoading(true);
      await api.moderateReview(review.id, {
        status: 'approved',
        title: editedTitle.trim(),
        content: editedContent.trim()
      });
      message.success('Отзыв успешно опубликован');
      navigate('/reviews/pending');
    } catch (error) {
      console.error('Error updating review:', error);
      message.error('Не удалось опубликовать отзыв');
    } finally {
      setLoading(false);
      setShowPublishModal(false);
    }
  };

  const handleReject = async () => {
    if (!review) return;
    
    try {
      setLoading(true);
      await api.moderateReview(review.id, { status: 'rejected' });
      message.success('Отзыв отклонен');
      navigate('/reviews/pending');
    } catch (error) {
      console.error('Error rejecting review:', error);
      message.error('Не удалось отклонить отзыв');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (!review) {
    return (
      <div className="p-6">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 flex items-center gap-2 hover:text-blue-700 mb-6"
        >
          ← Назад
        </button>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Отзыв не найден</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="text-blue-600 flex items-center gap-2 hover:text-blue-700 mb-6"
        >
          ← Назад
        </button>
        
        <h1 className="text-2xl font-semibold mb-6">Редактирование отзыва</h1>
        
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {/* Place Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg mb-1">{(review as any).place?.name}</h3>
              <p className="text-sm text-gray-500">{(review as any).place?.address}</p>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              На модерации
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                size={18}
                className={index < review.rating ? 'fill-blue-500 text-blue-500' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Заголовок
            </label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Текст отзыва
            </label>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {review.photos.map((photo: any, index: number) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_APP_URL}/${(photo as any).photo_url.replace(/\\/g, '/')}`}
                    alt={`Фото ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Пользователь ID: {(review as any).author?.tg_id || 'Аноним'}</span>
            <span>•</span>
            <span>{(review as any).createdAt ? formatDate((review as any).createdAt) : 'Нет даты'}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowPublishModal(true)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              Сохранить и опубликовать
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Отклонить
            </button>
          </div>
        </div>
      </div>

      <Modal
        title="Подтверждение публикации"
        open={showPublishModal}
        onCancel={() => setShowPublishModal(false)}
        confirmLoading={loading}
        okText="Опубликовать"
        cancelText="Отмена"
        onOk={handleSave}
      >
        <p>Вы уверены, что хотите опубликовать этот отзыв?</p>
      </Modal>

      <Modal
        title="Подтверждение удаления"
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        confirmLoading={loading}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        onOk={handleReject}
      >
        <p>Вы уверены, что хотите отклонить этот отзыв?</p>
      </Modal>
    </>
  );
};

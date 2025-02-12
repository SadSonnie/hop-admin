import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Modal, message } from 'antd';
import api from '@/utils/api';
import type { Review } from '@/types';
import { formatDate } from '@/utils/date';

export const PendingReviews: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await api.getPendingReviews();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Не удалось загрузить отзывы');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (review: Review) => {
    setSelectedReview(review);
    setShowPublishModal(true);
  };

  const handleDelete = async (review: Review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const confirmPublish = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(true);
      await api.moderateReview(selectedReview.id, {
        status: 'approved',
        title: selectedReview.title,
        content: selectedReview.content
      });
      message.success('Отзыв успешно опубликован');
      setReviews(reviews.filter(r => r.id !== selectedReview.id));
    } catch (error) {
      console.error('Error publishing review:', error);
      message.error('Не удалось опубликовать отзыв');
    } finally {
      setActionLoading(false);
      setShowPublishModal(false);
      setSelectedReview(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(true);
      await api.moderateReview(selectedReview.id, { status: 'rejected' });
      message.success('Отзыв отклонен');
      setReviews(reviews.filter(r => r.id !== selectedReview.id));
    } catch (error) {
      console.error('Error deleting review:', error);
      message.error('Не удалось отклонить отзыв');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setSelectedReview(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="text-blue-600 flex items-center gap-2 hover:text-blue-700"
          >
            ← Назад
          </button>
          <h1 className="text-2xl font-semibold">Модерация отзывов</h1>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Нет отзывов на модерацию</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                onClick={() => navigate(`/reviews/edit/${review.id}`, { state: { review } })}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg mb-1">{(review as any).place?.name}</h3>
                    <p className="text-sm text-gray-500">{(review as any).place?.address}</p>
                  </div>
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    На модерации
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={index < review.rating ? 'fill-blue-500 text-blue-500' : 'text-gray-300'}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
                </div>

                <div className="mb-4">
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  <p className="text-gray-700 whitespace-pre-line break-words line-clamp-3 hover:line-clamp-none transition-all duration-200">
                    {review.content}
                  </p>
                </div>

                {review.photos && review.photos.length > 0 && (
                  <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                    {review.photos.map((photo: any, index: number) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_APP_URL}/${(photo as any).photo_url.replace(/\\/g, '/')}`}
                        alt={`Фото ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span>Пользователь ID: {(review as any).author?.tg_id || 'Аноним'}</span>
                    <span>•</span>
                    <span>{(review as any).createdAt ? formatDate((review as any).createdAt) : 'Нет даты'}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublish(review);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Опубликовать
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(review);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        title="Подтверждение публикации"
        open={showPublishModal}
        onCancel={() => {
          setShowPublishModal(false);
          setSelectedReview(null);
        }}
        confirmLoading={actionLoading}
        okText="Опубликовать"
        cancelText="Отмена"
        onOk={confirmPublish}
      >
        <p>Вы уверены, что хотите опубликовать этот отзыв?</p>
      </Modal>

      <Modal
        title="Подтверждение удаления"
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedReview(null);
        }}
        confirmLoading={actionLoading}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        onOk={confirmDelete}
      >
        <p>Вы уверены, что хотите отклонить этот отзыв?</p>
      </Modal>
    </>
  );
};
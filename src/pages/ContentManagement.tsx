import React from 'react';
import { ManagementGrid } from '../components/content/ManagementGrid';
import { ManagementOption } from '../components/content/types';

const managementOptions: ManagementOption[] = [
  { title: 'Настроить ленту', path: '/feed', count: 0, icon: 'MdSettings' },
  { title: 'Все места', path: '/locations', count: 0, icon: 'MdPlace' },
  { title: 'Категории', path: '/categories', count: 0, icon: 'MdCategory' },
  { title: 'Теги', path: '/tags', count: 0, icon: 'MdTag' },
  { title: 'Статьи', path: '/articles', count: 0, icon: 'MdArticle' },
  { title: 'Пользователи', path: '/users', count: 0, icon: 'MdPeople' },
  { title: 'Запросы локаций', path: '/locations/pending', count: 0, icon: 'MdLocationOn' },
  { title: 'Модерация отзывов', path: '/reviews/pending', count: 0, icon: 'MdRateReview' },
  { title: 'Поддержка', path: '/support', count: 0, icon: 'MdSupportAgent' },
  { title: 'Профиль', path: '/profile', count: 0, icon: 'MdPerson' },
];

export const ContentManagement: React.FC = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Контент</h1>
      <ManagementGrid options={managementOptions} />
    </div>
  );
};
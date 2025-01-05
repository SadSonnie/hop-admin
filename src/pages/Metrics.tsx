import React from 'react';
import { MetricGrid } from '../components/metrics/MetricGrid';
import { MetricCardType } from '../types';

// Sample data for the metrics
export const metrics: MetricCardType[] = [
  {
    title: 'Всего пользователей',
    value: '24,531',
    change: 12.5,
    period: 'vs прошлый месяц',
    to: '/metrics/users',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString(),
      value: 20000 + Math.floor(Math.random() * 5000)
    }))
  },
  {
    title: 'Всего компаний',
    value: '1,243',
    change: 8.3,
    period: 'vs прошлый месяц',
    to: '/metrics/businesses',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString(),
      value: 1000 + Math.floor(Math.random() * 300)
    }))
  },
  {
    title: 'Ср. кликов за сессию',
    value: '6.8',
    change: -2.1,
    period: 'vs прошлый месяц',
    to: '/metrics/clicks',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString(),
      value: 5 + Math.random() * 3
    }))
  },
  {
    title: 'Ср. время в приложении',
    value: '8м 12с',
    change: 5.4,
    period: 'vs прошлый месяц',
    to: '/metrics/time',
    data: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 0, i + 1).toISOString(),
      value: 400 + Math.random() * 200
    }))
  }
];

export const Metrics: React.FC = () => {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Метрики</h1>
      <MetricGrid metrics={metrics} />
    </div>
  );
};
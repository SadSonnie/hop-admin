import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MetricChart } from '../components/metrics/MetricChart';
import { metrics } from './Metrics';

export const MetricDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const metric = metrics.find(m => m.to === `/metrics/${id}`);

  if (!metric?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600 mb-4">Метрика не найдена</div>
        <button 
          onClick={() => navigate('/metrics')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Вернуться к метрикам
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 flex items-center gap-2"
      >
        ← Back to Metrics
      </button>
      <MetricChart data={metric.data} title={metric.title} />
    </div>
  );
};
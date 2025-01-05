import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MetricChart } from '../components/metrics/MetricChart';
import { metrics } from './Metrics';

export const MetricDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const metric = metrics.find(m => m.to === `/metrics/${id}`);

  if (!metric?.data) {
    return null;
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
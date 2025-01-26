import React from 'react';
import { MetricCard } from './MetricCard';
import { MetricCardType } from '../../types/index';

interface MetricGridProps {
  metrics: MetricCardType[];
}

export const MetricGrid: React.FC<MetricGridProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard 
          key={metric.title} 
          {...metric} 
          to={`/metrics/${metric.title}`}
        />
      ))}
    </div>
  );
};
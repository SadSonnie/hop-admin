import React from 'react';
import { Link } from 'react-router-dom';
import type { MetricCardType } from '../types/index';
import clsx from 'clsx';

interface Props extends MetricCardType {
  to: string;
}

export const MetricCard: React.FC<Props> = ({ title, value, change, period, to }) => {
  return (
    <Link 
      to={to}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <h3 className="text-sm text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold">{value}</span>
        {change !== undefined && (
          <span className={clsx(
            "text-sm font-medium",
            change >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      {period && (
        <span className="text-xs text-gray-500 mt-1 block">{period}</span>
      )}
    </Link>
  );
}
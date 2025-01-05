import React from 'react';
import { Link } from 'react-router-dom';
import { ManagementOption } from './types';
import * as Icons from 'react-icons/md';

interface Props {
  options: ManagementOption[];
}

export const ManagementGrid: React.FC<Props> = ({ options }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option) => {
        const Icon = (Icons as any)[option.icon];
        
        return (
          <Link
            key={option.path}
            to={option.path}
            className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-2">
              {Icon && <Icon className="text-2xl text-blue-600 mr-2" />}
              <h2 className="font-medium">{option.title}</h2>
            </div>
            {option.count > 0 && (
              <div className="text-sm text-gray-600">
                {option.count} {option.count === 1 ? 'элемент' : 'элементов'}
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
};
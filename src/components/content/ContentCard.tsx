import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'react-icons/md';

interface ContentCardProps {
  title: string;
  count: number;
  path: string;
  icon: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({ title, count, path, icon }) => {
  const IconComponent = Icons[icon as keyof typeof Icons];

  return (
    <Link
      to={path}
      className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600 text-2xl">
          <IconComponent />
        </div>
        <span className="text-lg">{title}</span>
      </div>
      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
        {count}
      </span>
    </Link>
  );
};
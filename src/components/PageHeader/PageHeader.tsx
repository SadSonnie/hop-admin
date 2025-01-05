import React from 'react';

interface PageHeaderProps {
  title: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {leftIcon && (
            <div 
              onClick={onLeftIconClick}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              {leftIcon}
            </div>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        {rightIcon && (
          <div 
            onClick={onRightIconClick}
            className="cursor-pointer"
          >
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

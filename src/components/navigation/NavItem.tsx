import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ to, label, isActive }) => {
  return (
    <Link 
      to={to} 
      className={clsx(
        "flex flex-col items-center py-3 px-6",
        isActive ? "text-blue-600" : "text-gray-600"
      )}
    >
      <span className="text-sm">{label}</span>
    </Link>
  );
};
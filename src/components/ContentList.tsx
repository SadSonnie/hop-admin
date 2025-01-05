import React from 'react';

interface ContentListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

export function ContentList<T>({ items, renderItem, emptyMessage = "No items found" }: ContentListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
}
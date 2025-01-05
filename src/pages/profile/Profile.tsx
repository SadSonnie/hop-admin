import React, { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader/PageHeader';
import { Card } from 'antd';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  // Добавим другие поля по мере необходимости
}

export const Profile: React.FC = () => {
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    // Получаем данные из Telegram WebApp
    if (window.Telegram?.WebApp) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      setUser(tgUser || null);
    }
  }, []);

  if (!user) {
    return (
      <div className="h-full bg-white">
        <PageHeader title="Профиль" />
        <div className="px-6 py-4">
          <p>Загрузка данных профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <PageHeader title="Профиль" />
      <div className="px-6 py-4">
        <Card title="Данные профиля Telegram">
          <div className="space-y-4">
            <div>
              <p className="text-gray-500">ID пользователя</p>
              <p className="font-medium">{user.id}</p>
            </div>
            {user.username && (
              <div>
                <p className="text-gray-500">Username</p>
                <p className="font-medium">@{user.username}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Имя</p>
              <p className="font-medium">
                {[user.first_name, user.last_name].filter(Boolean).join(' ')}
              </p>
            </div>
            {user.language_code && (
              <div>
                <p className="text-gray-500">Язык</p>
                <p className="font-medium">{user.language_code}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Premium статус</p>
              <p className="font-medium">{user.is_premium ? 'Да' : 'Нет'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

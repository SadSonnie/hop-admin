interface TelegramWebApp {
  initDataUnsafe: {
    user?: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      is_premium?: boolean;
    };
    // Добавим другие поля по мере необходимости
  };
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}

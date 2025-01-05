// Мок данных Telegram WebApp для разработки
export const mockTelegramWebAppData = {
  initData: 'tgWebAppData=query_id%3DAAHbabs3AAAAANtpuzexlOGA%26user%3D%257B%2522id%2522%253A524324421%252C%2522first_name%2522%253A%2522Egor%2522%252C%2522last_name%2522%253A%2522%2522%252C%2522username%2522%253A%2522Avecoders%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252FAprWT2DD-yNSMUbwN8UyNr0Jax_OgE0-_45_-BgLM-w.svg%2522%257D%26auth_date%3D1734972264%26signature%3DAcblqRsyNOWKbRmuIcWGi7dYh0SzWdc4ogEB58_QGwYFkeZdu6Jv6CWJ8gov549MUGku6MjAbXMX48kIz4sSCQ%26hash%3Dd80cfac834ac0a76217f710556def6b78c148fe0014cfe3f480a17d1bf6564d4'
};

// Функция для получения данных Telegram WebApp
export const getTelegramWebAppData = () => {
  // Проверяем, находимся ли мы в режиме разработки
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    // В режиме разработки возвращаем мок данные
    return mockTelegramWebAppData.initData;
  }
  
  // В продакшене возвращаем реальные данные из Telegram WebApp
  return window.Telegram?.WebApp?.initData;
};

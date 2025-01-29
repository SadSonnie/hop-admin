require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Базовый URL вашего API
const API_URL = process.env.API_URL || 'http://localhost:8080';

// Replace 'YOUR_BOT_TOKEN' with the token from BotFather
const bot = new TelegramBot('7692758384:AAFQ-3oNpPbI5vtPuoxVIl0cgCKhTjTfa9Q', { polling: true });

// Кэш пользователей
const userCache = new Map();

// Функция для генерации WebApp данных
function generateWebAppData(msg) {
    const user = {
        id: msg.from.id,
        first_name: msg.from.first_name || "",
        last_name: msg.from.last_name || "",
        username: msg.from.username || "",
        language_code: msg.from.language_code || "en",
        is_premium: msg.from.is_premium || false,
        allows_write_to_pm: true
    };

    const auth_date = Math.floor(Date.now() / 1000);
    const query_id = `AAH${Math.random().toString(36).substring(2)}`;

    const webAppData = {
        query_id: query_id,
        user: user,
        auth_date: auth_date
    };

    // Кодируем данные как в примере
    const encodedData = `tgWebAppData=query_id%3D${encodeURIComponent(query_id)}%26user%3D${encodeURIComponent(JSON.stringify(user))}%26auth_date%3D${auth_date}`;
    
    return encodedData;
}

// Функция для отправки статистики
async function sendStats(msg) {
    try {
        const webAppData = generateWebAppData(msg);
        await axios.post(`${API_URL}/api/users`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${webAppData}`
            }
        });
    } catch (error) {
        console.error('Error sending stats:', error.message);
    }
}

// Функция-обертка для команд с индикатором загрузки
async function withLoadingIndicator(msg, action) {
    const loadingMessage = await bot.sendMessage(msg.chat.id, '⌛ Пишу ответ...');
    try {
        await sendStats(msg);
        await action();
    } finally {
        await bot.deleteMessage(msg.chat.id, loadingMessage.message_id);
    }
}

// All users command
bot.onText(/\/all_users/, async (msg) => {
    await withLoadingIndicator(msg, async () => {
        const chatId = msg.chat.id;
        try {
            const webAppData = generateWebAppData(msg);
            const response = await axios.get(`${API_URL}/api/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${webAppData}`
                }
            });
            
            const users = response.data.items || response.data;
            
            // Получаем информацию о каждом пользователе из Telegram
            const userDetailsPromises = users.map(async user => {
                try {
                    const chatInfo = await bot.getChat(user.tg_id);
                    const userDetails = {
                        ...user,
                        username: chatInfo.username || chatInfo.first_name,
                        first_name: chatInfo.first_name,
                        last_name: chatInfo.last_name
                    };
                    userCache.set(user.id.toString(), userDetails);
                    return userDetails;
                } catch (error) {
                    console.error(`Error fetching user info for ${user.tg_id}:`, error);
                    const fallbackUser = {
                        ...user,
                        username: 'Неизвестный пользователь'
                    };
                    userCache.set(user.id.toString(), fallbackUser);
                    return fallbackUser;
                }
            });

            const usersWithDetails = await Promise.all(userDetailsPromises);
            
            // Создаем inline-клавиатуру, используя id из данных пользователя
            const keyboard = usersWithDetails.map(user => {
                // Получаем информацию о пользователе из кэша
                const cachedUser = userCache.get(user.id.toString());
                const username = cachedUser?.username || user.tg_id;
                const firstName = cachedUser?.first_name || '';
                
                // Формируем текст кнопки
                const displayName = username !== firstName && firstName 
                    ? `${username} (${firstName})` 
                    : username;
                
                return [{
                    text: `${user.role === 'ADMIN' ? '👑' : '👤'} ${displayName}`,
                    callback_data: `toggle_role:${user.id}`
                }];
            });

            const opts = {
                reply_markup: {
                    inline_keyboard: keyboard
                }
            };

            bot.sendMessage(chatId, 'Список пользователей (нажмите для изменения роли):', opts);
        } catch (error) {
            console.error('Error fetching users:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            bot.sendMessage(chatId, '❌ Ошибка при получении списка пользователей. Пожалуйста, попробуйте позже.');
        }
    });
});

// Обработчик нажатия на кнопки
bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;

    if (data.startsWith('toggle_role:')) {
        const userId = data.split(':')[1];
        console.log(`Toggling role for user ID: ${userId}`);
        
        try {
            // First check if we can access the user
            try {
                await bot.getChat(userId);
            } catch (chatError) {
                await bot.answerCallbackQuery(callbackQuery.id, {
                    text: '❌ Невозможно изменить роль: пользователь недоступен или заблокировал бота',
                    show_alert: true
                });
                return;
            }

            const webAppData = generateWebAppData({
                from: callbackQuery.from
            });
            const requestUrl = `${API_URL}/api/users/toggle_role`;
            const requestData = { 
                "user_id": userId.toString() // Явно преобразуем в строку
            };
            const requestHeaders = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${webAppData}`
            };

            console.log('=== REQUEST DETAILS ===');
            console.log('URL:', requestUrl);
            console.log('Method: POST');
            console.log('Headers:', requestHeaders);
            console.log('Body:', JSON.stringify(requestData, null, 2));
            console.log('=====================');

            const response = await axios.post(
                requestUrl, 
                requestData, 
                { headers: requestHeaders }
            );

            // Получаем обновленные данные пользователя из ответа API
            const updatedUser = response.data;

            // Обновляем кэш с новыми данными
            if (updatedUser) {
                userCache.set(userId.toString(), updatedUser);
            }

            // Отправляем подтверждение сразу
            await bot.answerCallbackQuery(callbackQuery.id, {
                text: `Роль пользователя изменена на ${updatedUser?.role || 'неизвестно'}!`
            });

            // Обновляем существующее сообщение со списком
            const responseUsers = await axios.get(`${API_URL}/api/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${webAppData}`
                }
            });
            
            const users = responseUsers.data.items || responseUsers.data;
            
            // Получаем актуальную информацию о пользователях
            const userDetailsPromises = users.map(async user => {
                try {
                    const chatInfo = await bot.getChat(user.tg_id);
                    const userDetails = {
                        ...user,
                        username: chatInfo.username || chatInfo.first_name,
                        first_name: chatInfo.first_name,
                        last_name: chatInfo.last_name
                    };
                    userCache.set(user.id.toString(), userDetails);
                    return userDetails;
                } catch (error) {
                    // Если не удалось получить информацию, используем данные из кэша
                    const cachedUser = userCache.get(user.id.toString());
                    if (cachedUser) {
                        return { ...user, ...cachedUser };
                    }
                    console.error(`Error fetching user info for ${user.tg_id}:`, error);
                    return {
                        ...user,
                        username: user.tg_id,
                        first_name: 'Неизвестный пользователь'
                    };
                }
            });

            const usersWithDetails = await Promise.all(userDetailsPromises);
            const keyboard = usersWithDetails.map(user => {
                const username = user.username || user.tg_id;
                const firstName = user.first_name || '';
                
                // Формируем текст кнопки
                const displayName = username !== firstName && firstName 
                    ? `${username} (${firstName})` 
                    : username;
                
                return [{
                    text: `${user.role === 'ADMIN' ? '👑' : '👤'} ${displayName}`,
                    callback_data: `toggle_role:${user.id}`
                }];
            });

            try {
                await bot.editMessageReplyMarkup(
                    { inline_keyboard: keyboard },
                    {
                        chat_id: message.chat.id,
                        message_id: message.message_id
                    }
                );
            } catch (editError) {
                // Игнорируем ошибку если сообщение не изменилось
                if (!editError.message.includes('message is not modified')) {
                    throw editError;
                }
            }
        } catch (error) {
            console.error('=== ERROR DETAILS ===');
            console.error('Message:', error.message);
            if (error.response) {
                console.error('Status:', error.response.status, error.response.statusText);
                console.error('Headers:', error.response.headers);
                console.error('Data:', error.response.data);
            } else if (error.request) {
                console.error('Request was made but no response received');
                console.error('Request:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            console.error('===================');

            bot.answerCallbackQuery(callbackQuery.id, {
                text: '❌ Не удалось изменить роль: ' + "Недостаточно прав пользователя"
            });
        }
    }
});

// Secret admin command
bot.onText(/\/secret_admin/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const webAppData = generateWebAppData(msg);
        const response = await axios.post(`${API_URL}/api/users/admin`, {
            telegram_id: msg.from.id,
            username: msg.from.username,
            first_name: msg.from.first_name,
            last_name: msg.from.last_name
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${webAppData}`
            }
        });
        
        bot.sendMessage(chatId, '✅ Вы успешно добавлены в группу администраторов');
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Произошла ошибка при добавлении в администраторы';
        bot.sendMessage(chatId, `❌ ${errorMessage}`);
    }
});

// Handle other messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    // Only respond to commands we don't recognize
    if (msg.text && msg.text.startsWith('/')) {
        if (!['/secret_admin', '/all_users'].includes(msg.text)) {
            bot.sendMessage(chatId, 'Команда не распознана');
        }
    }
});

console.log('Bot is running...');
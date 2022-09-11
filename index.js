const TelegramApi = require('node-telegram-bot-api');
const token = '5632707660:AAHhH_moj1SBBWumEqF-A_0QgMDYgAV0hAk';
const bot = new TelegramApi(token, { polling: true });

const themes = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Основы JS', callback_data: 'basis'}],
            [{text: 'Основы объектов', callback_data: 'object_basis'}],
            [{text: 'Типы данных', callback_data: 'data_types'}],
            [{text: 'Продвинутая работа с функциями', callback_data: 'advanced_functions'}],
            [{text: 'Промисы', callback_data: 'promises'}],
            [{text: 'Модули', callback_data: 'modules'}],
        ]
    })
}

bot.setMyCommands([
    {command: '/start', description: 'Запусти шпаргалку.'}
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/192/12.webp')
        return bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}! Ты попал в тестирующий бот по JS, выбери тему опроса!`, themes);
    }
    return bot.sendMessage(chatId, "Выбери что-то из меню. Я тебя не понимаю...(");
})

bot.on('callback_query', async msg => {
    const theme = msg.data;
    switch (theme) {
        case 'basis': 
            importJSON(theme);
            break;
        case 'object_basis': 
            importJSON(theme);
            break;
        case 'data_types': 
            importJSON(theme);
            break;
        case 'advanced_functions': 
            importJSON(theme);
            break;
        case 'promises': 
            importJSON(theme);
            break;    
        case 'modules':
            importJSON(theme); 
            break;
    }
})

function importJSON(name) {
    console.log(name);
}
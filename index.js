
const fs = require('fs');
const TelegramApi = require('node-telegram-bot-api');
const token = '5632707660:AAHhH_moj1SBBWumEqF-A_0QgMDYgAV0hAk';
const bot = new TelegramApi(token, { polling: true });
let counter = 0;
let points = 0;

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

const ready = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Да', callback_data: 'ready'}]
        ]
    })
}

const startApp = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Запусти шпаргалку.'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;            
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/192/12.webp');
            await bot.sendMessage(chatId, `Добро пожаловать, ${msg.chat.first_name}! Ты попал в тестирующий бот по JS, выбери тему опроса!`, themes);
        } else {
            return bot.sendMessage(chatId, "Выбери что-то из меню. Я тебя не понимаю...(");
        }
        
    })

    bot.on('callback_query', async msg => {
        const text = msg.data; // Данные сообщения
        const chatId = msg.message.chat.id; // айди чата
        const previousText = msg.message.text;
        if (previousText.includes('Добро')) {
            importJSON(text, chatId, questions);
        } else {
            // askQuestions(chatId);
        }
    })
}

function importJSON(name, chatId, questions) {
    const jsonData = fs.readFileSync(`${name}.json`);
    questions = JSON.parse(jsonData);
    return bot.sendMessage(chatId, `Нажмите, если вы готовы!`, ready);
}

const askQuestions = (chatId) => {
    let correctAnswer = questions[counter].answer;
    let variants = Object.values(questions[counter].variants);
    let buttonsText = [];
    variants.forEach(item => {
        buttonsText.push([{ text: item, callback_data: item }]);
    })
    let buttons = { 
        reply_markup: JSON.stringify({
            inline_keyboard: buttonsText
        })
    }
    if (counter === 0) {
        bot.sendMessage(chatId, `Итак, первый вопрос! ${questions[counter].question}`, buttons);
    }
    
    return checkAnswer(correctAnswer. questions);
}

function checkAnswer(correctly, questions) {
    counter++;
    bot.on('callback_query', async msg => {
        const answer = msg.data; // текст ответа
        const chatId = msg.message.chat.id; // айди чата
        if (answer === correctly) {
            points += 1;
        }
        askQuestions(chatId, questions);
    })
}

startApp();


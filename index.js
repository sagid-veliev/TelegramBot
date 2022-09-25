const TelegramApi = require('node-telegram-bot-api');
const fs = require('fs');
const TOKEN = '5632707660:AAHhH_moj1SBBWumEqF-A_0QgMDYgAV0hAk';
const bot = new TelegramApi(TOKEN, { polling: true });
let counter = 0;
let points = 0;
let questions = [];
let correctAnswer = '';

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

const appHandler = () => {
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
            importJSON(text, chatId);
        } else if (!(previousText.includes('?'))) {
            askQuestions(chatId);
        } else if (previousText.includes('?')) {
            checkAnswer(questions, text, chatId);
        }
    })
};

const importJSON = (name, chatId) => {
    const jsonData = fs.readFileSync(`${name}.json`);
    questions = JSON.parse(jsonData);
    return bot.sendMessage(chatId, `Нажмите, если вы готовы!`, ready);
};

const askQuestions = (chatId) => {
    correctAnswer = questions[counter].answer;
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
    } else {
        bot.sendMessage(chatId, questions[counter].question, buttons);
    }
    counter++;
};

function checkAnswer(questions, answer, chatId) {
    if (answer === correctAnswer) {
        points += 1;
    }
    if (counter === 10) {
        return bot.sendMessage(chatId, `Тест окончен! Правильных ответов - ${points}! Для выбора другой темы, воспользуйтесь командой в меню!`);
    }
    askQuestions(chatId, questions);
};

appHandler();


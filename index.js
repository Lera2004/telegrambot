require('dotenv').config();
const { Telegraf } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

const api = 'https://russianwarship.rip/api/v2/statistics/latest';

let increase = [];
let date;
let kindOfStatistic = 'increase';

async function getDataFromServer(forceFetch = false) {
    if (!forceFetch) {
        return;
    }

    return fetch(api)
        .then((response) => response.json())
        .then((data) => {
            increase = data.data;
            date = data.data.date;
        });
}

bot.start((ctx) => {
    ctx.replyWithHTML('Welcome!', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Ресурс', url: 'https://russianwarship.rip/' }],
                [{ text: 'Статистика за день', callback_data: 'getDataByDay' }],
                [{ text: 'Статистика вся', callback_data: 'getAllData' }],
            ],
        },
    });
});

bot.action('getDataByDay', (ctx) => {
    kindOfStatistic = 'increase';
    ctx.reply(`Статистика за день`);
});

bot.action('getAllData', (ctx) => {
    kindOfStatistic = 'stats';
    ctx.reply(`Статистика вся`);
});

bot.hears(/hi/i, (ctx) => {
    return ctx.reply('Hi yourself!');
});

bot.hears(/[A-Z]+/i, async (ctx) => {
    const key = ctx.message.text;
    await getDataFromServer(increase.length === 0);
    ctx.reply(`${increase[kindOfStatistic][key]} ${key} !`);
});

bot.launch();

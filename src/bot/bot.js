
const { Bot } = require('grammy');
const fetch = require('node-fetch'); // HTTP-запросы
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./botdata.db');
const adminIds = [5107144356]; // Список администраторов

db.run(`
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        identifier TEXT DEFAULT NULL,
        price REAL,
        UNIQUE(type, identifier)
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS drain_address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL
    )
`);

function setupBot(app) {
    const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

    // Настройка Webhook
    const WEBHOOK_PATH = `/webhook/${bot.token}`;
    app.post(WEBHOOK_PATH, express.json(), (req, res) => {
        bot.handleUpdate(req.body, res).catch(err => {
            console.error('Error handling update:', err);
            res.status(500).send('Internal Server Error');
        });
    });

    bot.api.setWebhook(`${process.env.RENDER_EXTERNAL_URL}${WEBHOOK_PATH}`)
        .then(() => console.log('Webhook установлен успешно'))
        .catch(err => console.error('Ошибка установки Webhook:', err));

    bot.command('start', (ctx) => {
        ctx.reply('Добро пожаловать! Бот работает через Webhook.');
    });

    bot.catch(err => console.error('Bot encountered an error:', err));
    console.log('Telegram bot is running with Webhook!');
}

module.exports = { setupBot };
